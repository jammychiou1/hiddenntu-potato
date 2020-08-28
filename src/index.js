import React from 'react';
import ReactDOM from 'react-dom';
import {Game} from './game';
import {constants} from './constants';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    }
    this.props.getSessionStatus();
  }

  handleChange(event) {
    //console.log('trying to change to ' + event.target.value);
    const state = Object.assign({}, this.state);
    state.username = event.target.value;
    this.setState(state);
  }

  go() {
    //alert('handling');
    //console.log(this);
    this.props.testLogin(this.state.username);
    const state = Object.assign({}, this.state);
    state.username = '';
    this.setState(state);
  }

  render() {
    if (this.props.loggedIn) {
      return (
        <div>
        welcome, {this.props.loggedUser}
        <button onClick={() => this.props.updatePlaying(true)}>Start Game</button>
        <button onClick={() => this.props.logout()}>Log Out</button>
        </div>
      );
    }
    else {
      return (
        <div>
          {this.props.fail && 'login failed\n'}
          <input type='text' value={this.state.username} onChange={event => this.handleChange(event)} />
          <button onClick={() => this.go()}>Login</button>
          {/* this.state.loggedIn && <img src='../get/logo.png' /> */}
        </div>
      );
    }
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      loggedUser: null,
      fail: false,
      playing: false,
      width: 0,
      height: 0
    };
  }

  getSessionStatus() {
    const sessionID = localStorage.getItem(constants.sessionIDKey);
    fetch(API_HOST + '/' + constants.sessionPath, {
      headers: new Headers({
        [constants.sessionIDHeaderName]: sessionID
      }),
      mode: 'cors'
    })
    .then(async response => {
      if (response.ok) {
        const json = await response.json();
        this.setState({loggedIn: true, loggedUser: json.username, fail: false});
      }
      else {
        localStorage.removeItem(constants.sessionIDKey);
      }
    });
  }

  testLogin(username) {
    //console.log(JSON.stringify({username: username}));
    fetch(API_HOST + '/' + constants.sessionPath, {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'POST',
      body: JSON.stringify({username: username}),
      mode: 'cors'
    })
    .then(async response => {
      console.log(response.headers);
      if (response.ok) {
        localStorage.setItem(constants.sessionIDKey, response.headers.get(constants.sessionIDHeaderName));
        const json = await response.json();
        this.setState({loggedIn: true, loggedUser: json.username, fail: false});
      }
      else {
        localStorage.removeItem(constants.sessionIDKey);
        this.setState({loggedIn: false, loggedUser: null, fail: true});
      }
    });
  }

  logout() {
    const sessionID = localStorage.getItem(constants.sessionIDKey);
    fetch(API_HOST + '/' + constants.sessionPath, {
      headers: new Headers({
        'Content-Type': 'application/json',
        [constants.sessionIDHeaderName]: sessionID
      }),
      method: 'DELETE',
      mode: 'cors'
    })
    .then(async response => {
      localStorage.removeItem(constants.sessionIDKey);
      this.setState({loggedIn: false, loggedUser: null, fail: false});
    });
  }

  updatePlaying(flag) {
    this.setState({playing: flag});
  }
  
  componentDidMount() {
    this.setState({width: window.innerWidth, height: window.innerHeight});
  }

  render() {
    let content;
    if (this.state.playing) {
      content = (<Game/>);
    }
    else {
      content = (<Login
        getSessionStatus={() => this.getSessionStatus()}
        testLogin={username => this.testLogin(username)} 
        logout={() => this.logout()} 
        loggedIn={this.state.loggedIn} 
        loggedUser={this.state.loggedUser}
        fail={this.state.fail}
        updatePlaying={flag => this.updatePlaying(flag)}
      />);
    }
    return (<div style={{
      width: this.state.width + 'px',
      height: this.state.height + 'px',
      position: 'fixed',
      top: '0px',
      left: '0px',
    }}>
      {content}
    </div>);
  }
}
ReactDOM.render(
  <Main/>,
  document.body.appendChild(document.createElement("DIV"))  
);
