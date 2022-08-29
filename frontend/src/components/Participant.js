import React from 'react';
import './Participant.css';
import Emoji from "./Emoji.js";
import BadgesPopUp from "./BadgesPopUp";

class Participant extends React.Component {
  constructor(props) {
    super(props);
  }

  //TODO:
  // Figure out if participant sdk and backend calls are going here or in App.js


  render(){
    return (
      <div>
        <div className="participant-container">
          <div className="participant-img-div"></div>
          <div className="participant-name">{this.props.name}</div>
          <div className="emoji-container"><div className="emoji-flexbox">
            {this.props.badges.map((badge) => <Emoji classname={"emoji"} symbol={badge} label={"emoji badge"}/>)}
          </div></div>
          {/* TODO: */}
          {/* add conditional for if host v if student for the 3 dot option */}
          {/* Currently is an emoji instead of Jaimie's design as a quick fix*/}
          <div className="open-badges"><Emoji classname="emoji" symbol={'0x2795'} label={'add badge'}/></div>
        </div>
        {/* TODO: */}
        {/* Badges needs to be a modal, hidden when the person has not yet clicked on the open-badges option*/}
        {/* Also will need to be placed on top of the open-badges rather than after the participant :)*/}
        {/* and where do we want teh badges prop to originate from? here seems fine for the moment*/}
        <BadgesPopUp badges={['0x1F396', '0x1F4AF', '0x2B50', '0x1F4A1', '0x1F9E0']} participant={this.props}/>
      </div>
    )
  }
}

export default Participant;
