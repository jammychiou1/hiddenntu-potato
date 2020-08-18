import React from 'react';
import ReactDOM from 'react-dom';
import BG from './bg.jpeg';
import {QR} from './QR';
import {ItemMenu} from './itemMenu';
import {History} from './history';
import {FancyButton} from './fancybutton';
//import QrReader from 'react-qr-reader';
export class Game extends React.Component {
  constructor(props) {
    super(props);
    //this.dialogue = ['Apple', 'Banana'];
    this.state = {
      width: 0,
      height: 0,
      name: '',
      text: '',
      answer: '',
      decisions: [],
      UI: {
        QR: false,
        itemMenu: false,
        history: false,
        itemList: [],
        currentItem: null 
      }
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
  request(action = 'load', query = '') {
    let str = '?action=' + action;
    if (action == 'QR') {
      str += '&key=' + query;
    }
    if (action == 'answer') {
      str += '&key=' + query;
    }
    if (action == 'decision') {
      str += '&id=' + query;
    }
    if (action == 'UIOpen') {
      str += '&target=' + query;
    }
    if (action == 'UIClose') {
      str += '&target=' + query;
    }
    if (action == 'itemChange') {
      str += '&target=' + query;
    }
    //alert(str);
    fetch('../dialogue.php' + str, {
      credentials: 'same-origin'  
    })
    .then(response => response.json())
    .then(json => {
      console.log(json);
      if (!json.user) {
        alert('已登出，請重新整理');
      }
      else if (json.content == 'invalid') {
        //this.setState({text: 'invalid QQ'});
        //alert('invalid QQ');
      }
      else {
        //this.mode = json.content.mode;
        if (action == 'next') this.playAudio(json.content.audio);
        this.setState({
          name: json.content.name,
          text: json.content.sentence,
          UI: json.content.UI,
          decisions: json.content.decisions
        });
      }
    });
  }
  componentDidMount() {
    this.setState({width: window.innerWidth, height: window.innerHeight});
    this.load();
  }
  load() {
    this.request();
  }
  trigger() {
    console.log('triggered');
    if (this.state.UI.mode == 'next' || this.state.UI.mode == 'cutscene') {
      this.request('next');
    }
    //this.setState({count: (this.state.count + 1) % this.dialogue.length});
  }
  openMap(e) {
    e.stopPropagation();
    alert('map');
  }
  openHistory(e) {
    e.stopPropagation();
    alert('history');
  }
  changeUI(target, open) {
    console.log('changing');
    if (open) {
      this.request('UIOpen', target);
    }
    else {
      this.request('UIClose', target);
    }
  }
  itemChange(target) {
    console.log('item changing');
    this.request('itemChange', target);
  }
  handleScan(data) {
    if (this.state.UI.mode == 'QR') {
      //alert(data);
      this.request('QR', data);
    }
    else {
      //alert('nothing');
    }
  }
  submitAnswer() {
    this.setState({answer: ''})
    this.request('answer', this.state.answer);
  }
  render() {
    console.log('rendering game');
    const QRBlock = this.state.UI.QR && (
      <QR handleClose={() => this.changeUI('QR', false)} handleScan={data => this.handleScan(data)}/>
    );
    const ItemMenuBlock = this.state.UI.itemMenu && (
      <ItemMenu 
        handleClose={() => this.changeUI('itemMenu', false)} 
        itemList={this.state.UI.itemList}
        currentItem={this.state.UI.currentItem}
        itemChange={target => this.itemChange(target)}
      />
    );
    const HistoryBlock = this.state.UI.history && (
      <History
        handleClose={() => this.changeUI('history', false)} 
      />
    );
    let Decisions = null;
    if (this.state.UI.mode == 'decision') {
      let declist = [];
      for (let i = 0; i < this.state.decisions.length; i++) {
        declist.push(
          <div 
            key={i}
            onClick={e => {
              e.stopPropagation();
              console.log('hit' + i);
              this.request('decision', i);
            }}
            style={{
              backgroundColor: '#123456',
              margin: '5%'
            }}
          >
            {this.state.decisions[i]}
          </div>
        );
      }
      Decisions = (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '60%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {declist}
        </div>
      );
    }
    const MainArea = (
      <div style={{position: 'absolute', height: '55%', width: '100%'}}>
        {Decisions}
      </div>
    );
    return (
      <div 
        //onClick={() => this.trigger()} 
        style={{
          position: 'relative',
          height: this.state.height,
          width: this.state.width,
          //margin: '0px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url(${BG})`
        }}
      >
        {QRBlock}
        {ItemMenuBlock}
        {HistoryBlock}
        <div 
          //onClick={e => {e.stopPropagation(); console.log('prevented');}}
          onClick={e => {e.stopPropagation(); this.trigger()}}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: this.state.UI.mode == 'cutscene' ? '10': '1'
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
              //backgroundColor: '#92a8d1',
              backgroundColor: this.state.UI.mode == 'cutscene' ? '#92a8d1' : '#aaaa99',
              margin: '2.5%',
              top: '0px',
              bottom: '0px',
              left: '0px',
              right: '0px',
            }}>
              <div>{this.state.name != '' && this.state.name + '：'}{this.state.text}{this.state.UI.mode == 'QR' && <FancyButton handleClick={() => this.changeUI('QR', true)} text={'QR'}/>}</div>
              {this.state.UI.mode == 'answer' && <div>
                <input 
                  type='text' 
                  value={this.state.answer} 
                  onChange={event => {
                    this.setState({answer: event.target.value});
                  }} 
                />
                <FancyButton handleClick={() => this.submitAnswer()} text={'確認'}/>
                {/*<button onClick={() => this.submitAnswer()}>Submit</button>*/}
              </div>}
              {this.state.UI.mode != 'cutscene' && (
                <div style={{
                  position: 'absolute',
                  margin: '2.5%',
                  bottom: '0px',
                  right: '0px'
                }}>
                  {/*
                  <button onClick={e => {e.stopPropagation(); this.changeUI('QR', true);}} disabled={this.state.UI.mode != 'QR'}>QR</button>
                  <button onClick={e => {e.stopPropagation(); this.changeUI('itemMenu', true);}}>道具</button>
                  <button onClick={e => {e.stopPropagation(); this.changeUI('history', true);}}>紀錄</button>
                  */}
                  <FancyButton handleClick={() => this.changeUI('itemMenu', true)} text={'道具'}/>
                  <FancyButton handleClick={() => this.changeUI('history', true)} text={'記錄'}/>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

//export default {
//  Message
//}
