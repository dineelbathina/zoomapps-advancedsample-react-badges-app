import React from 'react';
import './BadgesPopUp.css';
import Emoji from "./Emoji";

class BadgesPopUp extends React.Component {
  constructor(props) {
    super(props);
  }

  assignBadge(badge) {
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


  render(){
    if(!this.props.show) {
      return null;
    };
    return (
      <div className="badges-container">
        {this.props.badges.map((badge) =>
          <div className="badge-hover-container" onClick={()=>this.assignBadge(badge)}>
            <Emoji symbol={badge} classname={"emoji"} label={"Emoji badge option"}/>
          </div>)}
      </div>
    );

  }
}

export default BadgesPopUp;
