import React from 'react';
import './Searchbar.css';

class Searchbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ""
    }
  }

  handleChange(e) {
    // TODO:
    // e isnt working, fix debug tools then find out why
    // https://reactjs.org/docs/handling-events.html
    e.preventDefault();
    this.setState({input: e.target.value});
    console.log("E: " + e.target.value);
    // this.state.input += e.target.value;
    console.log(this.state.input);
    if (this.state.input.length > 3) {
      let newlist=[];
      this.props.participants.filter((participant) => {
        // return may not be the right option, we need to make it so this set of participants are the only ones seen
        // make sure original list isnt lost when this is displayed
        newlist.append(participant.name.match(this.state.input));
      })
    }
  }


  render() {
    return (
      <input className="searchbar" type="text" placeholder="Search participants" value={this.state.input} onChange={(e) => this.handleChange(e)}  />
    );
  }

}

export default Searchbar
