/* globals zoomSdk */
import { useLocation, useHistory } from "react-router-dom";
import { useRef, useCallback, useEffect, useState } from "react";
import { apis } from "./apis";
import { Authorization } from "./components/Authorization";
import ApiScrollview from "./components/ApiScrollview";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ParticipantList from "./components/ParticipantList";
import { io } from "socket.io-client";


let once = 0; // to prevent increasing number of event listeners being added

function App() {
  const history = useHistory();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [runningContext, setRunningContext] = useState(null);
  const [connected, setConnected] = useState(false);
  const [counter, setCounter] = useState(0);
  const [preMeeting, setPreMeeting] = useState(true); // start with pre-meeting code
  const [userContextStatus, setUserContextStatus] = useState("");
  const [participants, setParticipants] = useState([])

  const badgeHex = ['0x1F396', '0x1F4AF', '0x2B50', '0x1F4A1', '0x1F9E0'];
  const badgeOptions = badgeHex.map((badge) => String.fromCodePoint(badge));

  const socketRef = useRef();

  // place your base url here
  const address = 'YOUR_FRP_HERE';

  useEffect(() => {
    socketRef.current = io(address);
    socketRef.current.on('connection', (_) => {
      console.log('connected')
    })
  }, [])

  useEffect(() => {
    async function configureSdk() {
      // to account for the 2 hour timeout for config
      const configTimer = setTimeout(() => {
        setCounter(counter + 1);
      }, 120 * 60 * 1000);

      try {
        console.log("App Started");
        // Configure the JS SDK, required to call JS APIs in the Zoom App
        // These items must be selected in the Features -> Zoom App SDK -> Add APIs tool in Marketplace
        const configResponse = await zoomSdk.config({
          capabilities: [
            // apis demoed in the buttons
            ...apis.map((api) => api.name), // IMPORTANT

            // demo events
            "onSendAppInvitation",
            "onShareApp",
            "onActiveSpeakerChange",
            "onMeeting",
            "onParticipantChange",

            // connect api and event
            "connect",
            "onConnect",
            "postMessage",
            "onMessage",

            // in-client api and event
            "getMeetingParticipants",
            "getMeetingContext",
            "authorize",
            "onAuthorized",
            "promptAuthorize",
            "getUserContext",
            "onMyUserContextChange",
            "sendAppInvitationToAllParticipants",
            "sendAppInvitation",
            "authorize",
          ],
          version: "0.16.0",
        });
        console.log("App configured", configResponse);
        const userContextResponse = await zoomSdk.getUserContext();
        console.log("get user context", userContextResponse);
        // The config method returns the running context of the Zoom App
        setRunningContext(configResponse.runningContext);
        setUserContextStatus(configResponse.auth.status);
        const meetingResponse = await zoomSdk.getMeetingContext();
          console.log("get meeeting context", meetingResponse);
        if (userContextResponse.role !== "attendee") {
          const getMeetingParticipantsResponse = await zoomSdk.getMeetingParticipants();
          setParticipants(getMeetingParticipantsResponse)
          console.log("get participants", getMeetingParticipantsResponse);
          zoomSdk.onParticipantChange((data) => {
            console.log("on participant change", data);
            fetch("meeting/updateParticipants", {
              method: "POST",
              body: JSON.stringify({
                  meetingId: meetingResponse.meetingID,
                  screenName: data.participants[0].screenName,
                  participant: 
                      { role: data.participants[0].role, participantId: data.participants[0].participantId, screenName: data.participants[0].screenName }
  
                  
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            console.log("on participant done", data);
          });
          fetch("meeting/save", {
            method: "POST",
            body: JSON.stringify({
                meetingId: meetingResponse.meetingID,
                meetingTopic: meetingResponse.meetingTopic,
                hostUUID: userContextResponse.screenName,
                participants: [
                    { role: userContextResponse.role, participantId: userContextResponse.participantId, screenName: userContextResponse.screenName }

                ]
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          zoomSdk.onShareApp((data) => {
            console.log(data);
          });
      }

      } catch (error) {
        console.log(error);
        setError("There was an error configuring the JS SDK");
      }
      return () => {
        clearTimeout(configTimer);
      };
    }
    configureSdk();
  }, [counter]);



  // PRE-MEETING
  let on_message_handler_client = useCallback(
    (message) => {
      let content = message.payload.payload;
      if (content === "connected" && preMeeting === true) {
        console.log("Meeting instance exists.");
        zoomSdk.removeEventListener("onMessage", on_message_handler_client);
        console.log("Letting meeting instance know client's current state.");
        sendMessage(window.location.hash, "client");
        setPreMeeting(false); // client instance is finished with pre-meeting
      }
    },
    [preMeeting]
  );

  // PRE-MEETING
  useEffect(() => {
    if (runningContext === "inMainClient" && preMeeting === true) {
      zoomSdk.addEventListener("onMessage", on_message_handler_client);
    }
  }, [on_message_handler_client, preMeeting, runningContext]);

  async function sendMessage(msg, sender) {
    console.log(
      "Message sent from " + sender + " with data: " + JSON.stringify(msg)
    );
    console.log("Calling postmessage...", msg);
    await zoomSdk.postMessage({
      payload: msg,
    });
  }

  const receiveMessage = useCallback(
    (receiver, reason = "") => {
      let on_message_handler = (message) => {
        let content = message.payload.payload;
        console.log(
          "Message received " + receiver + " " + reason + ": " + content
        );
        history.push({ pathname: content });
      };
      if (once === 0) {
        zoomSdk.addEventListener("onMessage", on_message_handler);
        once = 1;
      }
    },
    [history]
  );

  useEffect(() => {
    async function connectInstances() {
      // only can call connect when in-meeting
      if (runningContext === "inMeeting") {
        zoomSdk.addEventListener("onConnect", (event) => {
          console.log("Connected");
          setConnected(true);

          // PRE-MEETING
          // first message to send after connecting instances is for the meeting
          // instance to catch up with the client instance
          if (preMeeting === true) {
            console.log("Letting client know meeting instance exists.");
            sendMessage("connected", "meeting");
            console.log("Adding message listener for client's current state.");
            let on_message_handler_mtg = (message) => {
              console.log(
                "Message from client received. Meeting instance updating its state:",
                message.payload.payload
              );
              window.location.replace(message.payload.payload);
              zoomSdk.removeEventListener("onMessage", on_message_handler_mtg);
              setPreMeeting(false); // meeting instance is finished with pre-meeting
            };
            zoomSdk.addEventListener("onMessage", on_message_handler_mtg);
          }
        });

        await zoomSdk.connect();
        console.log("Connecting...");
      }
    }

    if (connected === false) {
      console.log(runningContext, location.pathname);
      connectInstances();
    }
  }, [connected, location.pathname, preMeeting, runningContext]);

  // POST-MEETING
  useEffect(() => {
    async function communicateTabChange() {
      // only proceed with post-meeting after pre-meeting is done
      // just one-way communication from in-meeting to client
      if (runningContext === "inMeeting" && connected && preMeeting === false) {
        sendMessage(location.pathname, runningContext);
      } else if (runningContext === "inMainClient" && preMeeting === false) {
        receiveMessage(runningContext, "for tab change");
      }
    }
    communicateTabChange();
  }, [connected, location, preMeeting, receiveMessage, runningContext]);

  if (error) {
    console.log(error);
    return (
      <div className="App">
        <h1>{error.message}</h1>
      </div>
    );
  }

  //TODO:
  // Get all participants here, make a request to the db to store them all and then pass them to the participants list in the following format
  // {name: "", badges
  return (
    <div className="App">
      <ParticipantList isHost={true} badges={badgeOptions} participants={[{name: "selena", badges: [badgeOptions[0],badgeOptions[1],badgeOptions[2],badgeOptions[4]]}, {name: "jaimie", badges: [badgeOptions[3]]}, {name:"evelyn", badges: []}]}/>



      {/*<Participant name={"Selena Shaw"} emojis = {['0x1F9E0','0x1F9E0','0x1F9E0','0x1F9E0']} />*/}
      {/*<Participant name={"Selena Shaw2"} emojis = {[]} />*/}
      {/*<h1>Hello {user ? ` ${user.first_name} ${user.last_name}` : " Zoom Apps user"}!</h1>*/}
      {/*<p>{`User Context Status: ${userContextStatus}`}</p>*/}
      {/*<p>*/}
      {/*  {runningContext ?*/}
      {/*    `Running Context: ${runningContext}` :*/}
      {/*    "Configuring Zoom JavaScript SDK..."*/}
      {/*  }*/}
      {/*</p>*/}

      {/*<ApiScrollview />*/}
      {/*<Authorization*/}
      {/*  handleError={setError}*/}
      {/*  handleUserContextStatus={setUserContextStatus}*/}
      {/*  handleUser={setUser}*/}
      {/*  user={user}*/}
      {/*  userContextStatus={userContextStatus}*/}
      {/*/>*/}

    </div>
  );
}


export default App;
