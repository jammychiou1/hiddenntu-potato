import React from 'react';
import ReactDOM from 'react-dom';
import {Game} from './game';

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
        };
    }

    getSessionStatus() {
        fetch(API_HOST + '/session', {
            credentials: 'include',
            //mode: 'cors'
        })
        .then(async response => {
            if (response.ok) {
                const json = await response.json();
                this.setState({loggedIn: true, loggedUser: json.username, fail: false});
            }
        });
    }

    testLogin(username = null) {
        console.log(JSON.stringify({username: username}));
        fetch(API_HOST + '/session', {
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify({username: username}),
            mode: 'cors'
        })
        .then(async response => {
            if (response.ok) {
                const json = await response.json();
                this.setState({loggedIn: true, loggedUser: json.username, fail: false});
            }
            else {
                this.setState({loggedIn: false, loggedUser: null, fail: true});
            }
        });
    }

    logout() {
        fetch(API_HOST + '/session', {
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            method: 'DELETE',
            credentials: 'include',
            mode: 'cors'
        })
        .then(async response => {
            this.setState({loggedIn: false, loggedUser: null, fail: false});
        });
    }

    updatePlaying(flag) {
        this.setState({playing: flag});
    }
    render() {
        if (this.state.playing) {
            return (<Game/>);
        }
        else {
            return (<Login
                getSessionStatus={() => this.getSessionStatus()}
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
    document.body.appendChild(document.createElement("DIV"))  
);
