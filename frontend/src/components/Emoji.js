import React from 'react';

// emoji reference https://stackoverflow.com/questions/42398660/how-to-display-emoji-in-react-app
// pull emoji unicode encodings from here, switch to hex format https://unicode.org/emoji/charts/full-emoji-list.html
class Emoji extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
      <span className={this.props.classname} role="img" aria-label={this.props.label}>
                {this.props.symbol}
            </span>)
  }
}

export default Emoji;
