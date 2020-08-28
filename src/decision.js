import React from 'react';
import {constants} from './constants';
export class Decision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      decisionsList: []
    }
  }
  componentDidMount() {
    const sessionID = localStorage.getItem(constants.sessionIDKey);
    fetch(API_HOST + '/' + constants.gamePath + '/' + constants.decisionPath, {
      headers: new Headers({
        [constants.sessionIDHeaderName]: sessionID
      }),
      mode: 'cors'
    })
    .then(async response => {
      if (response.ok) {
        const json = await response.json();
        this.setState({
          decisionsList: json
        });
      }
    });
  }
  render() {
    let result = [];
    for (let i = 0; i < this.state.decisionsList.length; i++) {
      result.push(
        <div 
          key={i}
          onClick={e => {
            e.stopPropagation();
            console.log('choosed ' + i);
            this.props.chooseDecision(i);
          }}
          style={{
            backgroundColor: '#456789',
            margin: '5%'
          }}
        >
          {this.state.decisionsList[i]}
        </div>
      );
    }
    return (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '60%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {result}
      </div>
    );
  }
}
