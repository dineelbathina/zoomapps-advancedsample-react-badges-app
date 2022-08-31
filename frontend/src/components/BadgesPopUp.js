import React from 'react';
import './BadgesPopUp.css';
import Emoji from "./Emoji";

const badgeHex = ['0x1F396', '0x1F4AF', '0x2B50', '0x1F4A1', '0x1F9E0'];
const badgeOptions = badgeHex.map((badge) => String.fromCodePoint(badge));

class BadgesPopUp extends React.Component {
  constructor(props) {
    super(props);
  };

  removeAssignedBadge(assignedBadge) {
    const list = badgeOptions.filter(val => !assignedBadge.includes(val));
    console.log("removedOptions");
    console.log(list);
    return list;
  }

  assignBadge(badge,idx) {

    let socket = this.props.socketRef;
// participantName, meetingId, badge
    socket.emit('newBadge', this.props.name, this.props.meetingId, badge)

    console.log("before assign");
    console.log(this.props.assignedBadge);
    const optionList = this.removeAssignedBadge(this.props.assignedBadge);
    this.props.assignedBadge.push(optionList[idx]);
    console.log("after assign");
    console.log(this.props.assignedBadge);

    //TODO: set assignedBadge back to the particpant object
    // this.props.participant.badges = this.props.assignedBadge;
    // this.props.participant.badgeOptions = this.state.badgeOptions;

   // send badge to backend
    //TODO test sending to backend when participants are set up

   //  fetch("meeting/badge", {
   //    method: "POST",
   //    body: JSON.stringify({
   //      pid: participant.pid,
   //      meetingId: meetingId,
   //      badge: badge
   //    }),
   //    headers: {
   //      "Content-Type": "application/json",
   //    },
   //  });

    //close the modal
    this.props.onSelect();
  }


  // only display option to add, if the current user is the host 
  render(){
    console.log(this.props)

    if(!this.props.show) {
      return null;
    };
    return (
      <div className="badges-container">
        {this.removeAssignedBadge(this.props.assignedBadge).map((badge,idx) =>
          <div className="badge-hover-container" onClick={()=>this.assignBadge(badge,idx)}>
            <Emoji symbol={badge} classname={"emoji"} label={"Emoji badge option"}/>
          </div>)}
      </div>
    );

  }
}

export default BadgesPopUp;
