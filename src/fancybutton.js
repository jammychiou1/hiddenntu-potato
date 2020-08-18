import React from 'react';
export class FancyButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div 
        onClick={e => {e.stopPropagation(); this.props.handleClick();}}
        style={{
          display: 'inline-block',
          borderStyle: 'outset',
          borderWidth: '2px',
          borderColor: '#654321',
          borderRadius: '5px',
          backgroundColor: '#ffffcc'
        }}
      >
        {this.props.text}
      </div>
    );
  }
}
