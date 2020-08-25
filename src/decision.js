import React from 'react';
export class Decision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      decisionsList: []
    }
  }
  componentDidMount() {
    fetch(API_HOST + '/' + constants.gamePath + '/' + constants.decisionPath, {
      headers: new Headers({
        [constants.sessionIDHeaderName]: sessionID
      }),
      mode: 'cors'
    })
    .then(async response => {
      const json = await response.json();
      this.setState({
        decisionList: json.decisionList
      });
    });
  }
  render() {
    var result = [];
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
            backgroundColor: '#123456',
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
