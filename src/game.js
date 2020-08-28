import React from 'react';
import BG from './bg.jpeg';
import {QR} from './QR';
import {ItemMenu} from './itemMenu';
import {History} from './history';
import {FancyButton} from './fancybutton';
import {Decision} from './decision';
import {constants} from './constants';

export class Game extends React.Component {
  constructor(props) {
    super(props);
    console.log('constructing');
    this.state = {
      name: '',
      text: '',
      mode: '',
      UI: {
        QR: false,
        itemMenu: false,
        itemView: false,
        history: false,
        currentItem: '',
      },
      answer: '',
    };
    this.audio = null;
  }
  playAudio(audioFile) {
    if (this.audio) {
      //alert('pausing');
      this.audio.pause();
    }
    //this.audio = new Audio('../response.php?text=' + audioFile);
    //this.audio.play();
  }
  processResponse(request) {
    request.then(async response => {
      if (response.ok) {
        const json = await response.json();
        this.setState({
          name: json.name,
          text: json.text,
          mode: json.mode,
          UI: json.UI,
          answer: ''
        });
      }
      else if (response.status === 400) {
        this.load();
      }
      else if (response.status === 401) {
        localStorage.removeItem(constants.sessionIDKey);
        alert('已登出，請重新整理');
      }
    });
  }
  load() {
    console.log('loading');
    const sessionID = localStorage.getItem(constants.sessionIDKey);
    this.processResponse(fetch(API_HOST + '/' + constants.gamePath, {
      headers: new Headers({
        [constants.sessionIDHeaderName]: sessionID,
      }),
      mode: 'cors'
    }));
  }
  updateNext() {
    console.log('next');
    const sessionID = localStorage.getItem(constants.sessionIDKey);
    this.processResponse(fetch(API_HOST + '/' + constants.gamePath + '/' + constants.nextPath, {
      headers: new Headers({
        [constants.sessionIDHeaderName]: sessionID,
      }),
      method: 'POST',
      mode: 'cors'
    }));
  }
  updateQR(key) {
    console.log('QR');
    const sessionID = localStorage.getItem(constants.sessionIDKey);
    this.processResponse(fetch(API_HOST + '/' + constants.gamePath + '/' + constants.QRPath, {
      headers: new Headers({
        [constants.sessionIDHeaderName]: sessionID,
        'Content-Type': 'application/json',
      }),
      method: 'POST',
      body: JSON.stringify({key: key}),
      mode: 'cors'
    }));
  }
  updateAnswer() {
    console.log('answer');
    const sessionID = localStorage.getItem(constants.sessionIDKey);
    this.processResponse(fetch(API_HOST + '/' + constants.gamePath + '/' + constants.answerPath, {
      headers: new Headers({
        [constants.sessionIDHeaderName]: sessionID,
        'Content-Type': 'application/json',
      }),
      method: 'POST',
      body: JSON.stringify({answer: this.state.answer}),
      mode: 'cors'
    }));
  }
  updateDecision(id) {
    console.log('decision');
    const sessionID = localStorage.getItem(constants.sessionIDKey);
    this.processResponse(fetch(API_HOST + '/' + constants.gamePath + '/' + constants.decisionPath, {
      headers: new Headers({
        [constants.sessionIDHeaderName]: sessionID,
        'Content-Type': 'application/json',
      }),
      method: 'POST',
      body: JSON.stringify({id: id}),
      mode: 'cors'
    }));
  }
  changeUI(obj) {
    console.log('change UI', obj);
    const sessionID = localStorage.getItem(constants.sessionIDKey);
    this.processResponse(fetch(API_HOST + '/' + constants.gamePath + '/' + constants.UIPath, {
      headers: new Headers({
        [constants.sessionIDHeaderName]: sessionID,
        'Content-Type': 'application/json',
      }),
      method: 'POST',
      body: JSON.stringify(obj),
      mode: 'cors'
    }));
  }
  componentDidMount() {
    this.load();
  }
  trigger() {
    console.log('triggered');
    if (this.state.mode === 'next' || this.state.mode === 'cutscene') {
      this.updateNext();
    }
  }
  handleScan(data) {
    if (this.state.mode === 'QR') {
      //alert(data);
      this.updateQR(data);
    }
    else {
      //alert('nothing');
    }
  }
  openItem(target) {
    console.log('open item ', target);
    const sessionID = localStorage.getItem(constants.sessionIDKey);
    fetch(API_HOST + '/' + constants.gamePath + '/' + constants.UIPath, {
      headers: new Headers({
        [constants.sessionIDHeaderName]: sessionID,
        'Content-Type': 'application/json',
      }),
      method: 'POST',
      body: JSON.stringify({target: 'currentItem', item: target}),
      mode: 'cors'
    })
    .then(async response => {
      if (response.ok) {
        const json = await response.json();
        this.setState({
          name: json.name,
          text: json.text,
          mode: json.mode,
          UI: json.UI,
          answer: ''
        });
        this.processResponse(fetch(API_HOST + '/' + constants.gamePath + '/' + constants.UIPath, {
          headers: new Headers({
            [constants.sessionIDHeaderName]: sessionID,
            'Content-Type': 'application/json',
          }),
          method: 'POST',
          body: JSON.stringify({target: 'itemView', flag: true}),
          mode: 'cors'
        }));
      }
      else if (response.status === 400) {
        this.load();
      }
      else if (response.status === 401) {
        localStorage.removeItem(constants.sessionIDKey);
        alert('已登出，請重新整理');
      }
    });
  }
  render() {
    //console.log('rendering game');
    const QRBlock = this.state.UI.QR && (
      <QR handleClose={() => this.changeUI({target: 'QR', flag: false})} handleScan={key => this.updateQR(key)}/>
    );
    const ItemMenuBlock = this.state.UI.itemMenu && (
      <ItemMenu 
        handleCloseMenu={() => this.changeUI({target: 'itemMenu', flag: false})} 
        handleCloseView={() => this.changeUI({target: 'itemView', flag: false})} 
        handleOpenItem={target => this.openItem(target)} 
        itemView={this.state.UI.itemView}
        currentItem={this.state.UI.currentItem}
      />
    );
    const HistoryBlock = this.state.UI.history && (
      <History handleClose={() => this.changeUI({target: 'history', flag: false})}/>
    );
    const Decisions = this.state.mode === 'decision' && (
      <Decision chooseDecision={id => this.updateDecision(id)}/>
    );
    const MainArea = (
      <div style={{position: 'absolute', height: '55%', width: '100%'}}>
        {Decisions}
      </div>
    );
    return (
      <div 
        style={{
          height: '100%',
          width: '100%',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url(${BG})`
        }}
      >
        {QRBlock}
        {ItemMenuBlock}
        {HistoryBlock}
        <div 
          onClick={e => {e.stopPropagation(); this.trigger()}}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: this.state.mode === 'cutscene' ? '10': '1'
          }}
        > 
          {MainArea}
          <div style={{
            position: 'absolute',
            top: '55%',
            height: '45%',
            width: '100%'  
          }}>
            <div style={{
              position: 'absolute',
              backgroundColor: this.state.mode === 'cutscene' ? '#92a8d1' : '#aaaa99',
              margin: '2.5%',
              top: '0px',
              bottom: '0px',
              left: '0px',
              right: '0px',
            }}>
              <div>{this.state.name !== '' && this.state.name + '：'}{this.state.text}{this.state.mode === 'QR' && <FancyButton handleClick={() => this.changeUI({target: 'QR', flag: true})} text={'QR'}/>}</div>
              {this.state.mode === 'answer' && <div>
                <input 
                  type='text' 
                  value={this.state.answer} 
                  onChange={event => {
                    this.setState({answer: event.target.value});
                  }} 
                />
                <FancyButton handleClick={() => this.updateAnswer()} text={'確認'}/>
                {/*<button onClick={() => this.submitAnswer()}>Submit</button>*/}
              </div>}
              {this.state.mode !== 'cutscene' && (
                <div style={{
                  position: 'absolute',
                  margin: '2.5%',
                  bottom: '0px',
                  right: '0px'
                }}>
                  <FancyButton handleClick={() => this.changeUI({target: 'itemMenu', flag: true})} text={'道具'}/>
                  <FancyButton handleClick={() => this.changeUI({target: 'history', flag: true})} text={'記錄'}/>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

