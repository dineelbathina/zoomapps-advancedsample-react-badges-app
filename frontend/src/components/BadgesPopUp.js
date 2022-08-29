import React from 'react';
import './BadgesPopUp.css';
import Emoji from "./Emoji";

class BadgesPopUp extends React.Component {
  constructor(props) {
    super(props);
  }
  // TODO:
  // This needs to be turned into a modal component!!!

  // Need function for onclick of the emojis here that will:
  // 1. add that emoji to the participant object (currently passing the props from the participant, I cant remember if there is a better way :)
  // 2. Make a post request to the db to add that badge to the participant
  // 3. ?Websocket notification?

  render(){
    return (
      <div className="badges-container">
        {this.props.badges.map((badge) =>
          <div className="badge-hover-container">
            <Emoji symbol={badge} classname={"emoji"} label={"Emoji badge option"}/>
          </div>)}
      </div>
    );

  }
}

export default BadgesPopUp;
