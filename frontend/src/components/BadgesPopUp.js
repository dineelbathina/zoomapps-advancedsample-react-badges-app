import React from 'react';
import './BadgesPopUp.css';
import Emoji from "./Emoji";

class BadgesPopUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      badgeOptions: props.badges,
    }
  };

  assignBadge(badge,idx) {
    console.log("before");
    console.log(this.state.badgeOptions);
    console.log(this.props.assignedBadge);
    // add selected badge to assignedBadges, remove selected badge from badge options
    this.props.assignedBadge.push(this.props.badges[idx]);
    this.state.badgeOptions.splice(idx, 1);

    console.log("after");
    console.log(this.state.badgeOptions);
    console.log(this.props.assignedBadge);
    //TODO: set assignedBadge/badgeOptions back to the particpant object
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


  render(){
    if(!this.props.show) {
      return null;
    };
    return (
      <div className="badges-container">
        {this.props.badges.map((badge,idx) =>
          <div className="badge-hover-container" onClick={()=>this.assignBadge(badge,idx)}>
            <Emoji symbol={badge} classname={"emoji"} label={"Emoji badge option"}/>
          </div>)}
      </div>
    );

  }
}

export default BadgesPopUp;
