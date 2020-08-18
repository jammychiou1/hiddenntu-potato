import React from 'react';
import ReactDOM from 'react-dom';
import {Game} from './game';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    }
    this.props.testLogin();
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
      loggedUser: '',
      fail: false,
      playing: false,
    };
  }
  testLogin(username = null) {
    let flag = false;
    console.log(username);
    if (username === null) {
      flag = true;
      username = '';
    }
    fetch('../login.php?username=' + username, {
      credentials: 'same-origin'  
    })
    .then(response => response.json())
    .then(json => {
      console.log(json);
      const state = Object.assign({}, this.state);
      state.loggedIn = Boolean(json.user);
      if (state.loggedIn) {
        state.fail = false;
        state.loggedUser = json.user.username;
      }
      else {
        state.fail = !flag;
        state.loggedUser = '';
      }
      this.setState(state);
    });
  }
  
  logout() {
    fetch('../logout.php', {
      credentials: 'same-origin'  
    })
    .then(response => response.text())
    .then(text => {
      this.testLogin();
    });
  }

  updatePlaying(flag) {
    this.setState({playing: flag});
  }
  render() {
    if (this.state.playing) {
      return (<Game/>)
    }
    else {
      return (<Login
        testLogin={(username = null) => this.testLogin(username)} 
        logout={() => this.logout()} 
        loggedIn={this.state.loggedIn} 
        loggedUser={this.state.loggedUser}
        fail={this.state.fail}
        updatePlaying={flag => this.updatePlaying(flag)}
      />);
    }
  }
}
ReactDOM.render(
  <Main/>,
  document.getElementById('root')
);
