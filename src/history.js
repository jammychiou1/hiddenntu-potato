import React from 'react';
export class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
    this.endRef = null;
  }
  getList() {
    fetch('../history.php', {
      credentials: 'same-origin'  
    })
    .then(response => response.json())
    .then(json => {
      if (json.user) {
        this.setState({list: json.content});
      }
      else {
        this.setState({list: []});
      }
    });
  }
  componentDidMount() {
    this.getList();
    this.endRef.scrollIntoView();
  }
  componentDidUpdate() {
    this.endRef.scrollIntoView();
  }
  render() {
    let sentenceList = [];
    for (let i = 0; i < this.state.list.length; i++) {
      sentenceList.push(
        <div
          key={i}
          style={{
            height: '35%'
          }}
        >
          {this.state.list[i].name != '' && this.state.list[i].name + '：'}{this.state.list[i].sentence}
        </div>
      );
    }
    return (
      <div 
        onClick={e => {e.stopPropagation(); console.log('prevented history');}}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: '2',
        }}
      > 
        <div style={{
          position: 'absolute',
          //margin: '0 auto',
          width: '90%',
          height: '90%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexFlow: 'column'
        }}>
          <div style={{flex: '0 1 auto'}}>
            <button onClick={e => {e.stopPropagation(); this.props.handleClose();}}>X</button>
          </div>
          <div style={{backgroundColor: '#cc9999', flex: '1 1 auto', overflowY: 'scroll'}}>
            {sentenceList}
            <div ref={ref => {this.endRef = ref}}/>
          </div>
        </div>
      </div>
    );
  }
}
