import React from 'react';
import ReactDOM from 'react-dom';

export class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          sender: 'test',
          text: 'hahaha'
        },
        {
          sender: 'me',
          text: 'hello'
        }
      ]
    }
  }

  render() {
    const list = this.state.messages.map(msg => <div>{msg.sender + ' says: ' + msg.text}</div>);
//    return (<div>test</div>);
    return (
      <>
        {list}
      </>
    )
  }
}

//export default {
//  Message
//}
