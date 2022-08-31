import React from 'react';
import './Participant.css';
import Emoji from "./Emoji.js";
import BadgesPopUp from "./BadgesPopUp";

class Participant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    }
  }

  setPopup() {
    console.log(this.state)
    this.setState({modal: !this.state.modal});
  };


  render(){
    return (
      <div >
        {/*TODO: get badges, assignedBadge of the participant*/}
        {/*replace badges={this.props.badgeOptions} with badges={this.props.participant.badgeOptions}*/}
        {/*replace assignedBadge  with assignedBadge={this.props.participant.badges}*/}

        <BadgesPopUp meetingId={this.props.meetingId} name={this.props.name} socketRef={this.props.socketRef} badges={this.props.badgeOptions} participant={this.props} show={this.state.modal} onSelect={()=>this.setPopup()} assignedBadge={this.props.badges}/>
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

          {this.props.isHost ? 
          <div className="open-badges" onClick={()=>this.setPopup()}><Emoji classname="emoji" symbol={String.fromCodePoint('0x2795')} label={'add badge'}/></div>
            :
            null
          }
        </div>
      </div>
    )
  }
}

export default Participant;
