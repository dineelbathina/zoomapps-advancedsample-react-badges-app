import React from 'react';
import './Participant.css';
import Emoji from "./Emoji.js";
import BadgesPopUp from "./BadgesPopUp";

class Participant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    }
  }

  openPopup() {
    this.setState({modal: !this.state.modal});
  };


  render(){
    return (
      <div >
        {/* TODO: */}
        {/* Badges needs to be a modal, hidden when the person has not yet clicked on the open-badges option*/}
        {/* Also will need to be placed on top of the open-badges rather than after the participant :)*/}
        {/* and where do we want teh badges prop to originate from? here seems fine for the moment*/}
        <BadgesPopUp badges={this.props.badgeOptions} participant={this.props} show={this.state.modal}/>
        <div className="participant-container">
          {/* find where to get the image from*/}
          <div className="participant-img-div"></div>
          {/* can we limit name length and use ... for longer ones*/}
          <div className="participant-name">{this.props.name}</div>
          <div className="emoji-container"><div className="emoji-flexbox">
            {this.props.badges.map((badge) => <Emoji classname={"emoji"} symbol={badge} label={"emoji badge"}/>)}
          </div></div>
          {/* TODO: */}
          {/* add conditional for if host v if student for the 3 dot option */}
          {/* Currently is an emoji instead of Jaimie's design as a quick fix*/}
          <div className="open-badges" onClick={()=>this.openPopup()}><Emoji classname="emoji" symbol={String.fromCodePoint('0x2795')} label={'add badge'}/></div>
        </div>
      </div>
    )
  }
}

export default Participant;
