import React from 'react';
import './BadgesPopUp.css';
import Emoji from "./Emoji";

class BadgesPopUp extends React.Component {
  constructor(props) {
    super(props);
  }

  assignBadge(badge) {
     console.log("here")
    // add the badge to teh participant
    //close the modal
    // send to backend
  }
  // TODO:
  // This needs to be turned into a modal component!!!

  // Need function for onclick of the emojis here that will:
  // 1. add that emoji to the participant object (currently passing the props from the participant, I cant remember if there is a better way :)
  // 2. Make a post request to the db to add that badge to the participant
  // 3. ?Websocket notification?

  render(){
    if(!this.props.show) {
      return null;
    };
    return (
      <div className="badges-container">
        {this.props.badges.map((badge) =>
          <div className="badge-hover-container" onClick={(badge)=>this.assignBadge(badge)}>
            <Emoji symbol={badge} classname={"emoji"} label={"Emoji badge option"}/>
          </div>)}
      </div>
    );

  }
}

export default BadgesPopUp;
