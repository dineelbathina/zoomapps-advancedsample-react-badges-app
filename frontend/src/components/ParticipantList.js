import React from 'react';
import './ParticipantList.css';
import Participant from "./Participant.js";
import Searchbar from "./Searchbar";


class ParticipantList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: this.props.participants
    }
  }

  setParticipants = (participants) => {
    this.setState({
      participants: participants
    })
  }

  // TODO:
  // Need to add scrolling functionality for when teh list of participants gets long
  //    pin search bar to the top, only the participant-list stuff should scroll

  // Figure out if participant sdk and backend calls are going here or in App.js

  // What is the best way to update a user changing their name? or a user joining the call?
  //    is it better to append to the list of divs instead of rebuilding teh list of divs?

  render(){
    return (
      <div className="participant-list-container">
        <Searchbar participants={ this.state.participants } setParticipants={ this.setParticipants }/>
        <div className="participant-list">
          {this.state.participants.map((participant) => <Participant name={participant.name} badges={participant.badges} badgeOptions={this.props.badges}/>)}
        </div>
      </div>
    )
  }

}

export default ParticipantList

