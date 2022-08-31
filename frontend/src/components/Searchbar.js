import React from 'react';
import './Searchbar.css';

class Searchbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      // participants: this.props.participants
    }
  }

  handleChange(e) {
    const input = e.target.value;
    console.log(input);
    const { setParticipants } = this.props;
    this.setState({input: input}, () => {
      // const list = this.state.participants.filter(p => {
      const list = this.props.suggestions.filter(p => {
        const name = p.screenName.toLowerCase();
        const input = this.state.input.toLowerCase();
        return input === "" || (name[0].includes(input[0]) && name.includes(input))
      });
      setParticipants(list)
    });
  }

  render() {
    return (
      <input className="searchbar" type="text" placeholder="Search participants" value={this.state.input} onChange={(e) => this.handleChange(e)}  />
    );
  }

}

export default Searchbar

