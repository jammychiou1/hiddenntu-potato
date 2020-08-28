import React from 'react';
import {ItemView} from './itemView'
import {constants} from './constants';
export class ItemMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemList: null 
    }
  }
  getList() {
    console.log('get list');
    const sessionID = localStorage.getItem(constants.sessionIDKey);
    fetch(API_HOST + '/' + constants.gamePath + '/' + constants.itemPath, {
      headers: new Headers({
        [constants.sessionIDHeaderName]: sessionID,
      }),
      mode: 'cors'
    })
    .then(async response => {
      if (response.ok) {
        const json = await response.json();
        console.log(json);
        this.setState({itemList: json});
      }
    });
  }
  componentDidMount() {
    this.getList();
  }
  render() {
    let selectList = [];
    if (this.state.itemList !== null) {
      for (let i = 0; i < this.state.itemList.length; i++) {
        const item = this.state.itemList[i];
        selectList.push(
          <div
            key={item.ID}
            onClick={e =>{
              e.stopPropagation();
              this.props.handleOpenItem(item.ID);
            }}
            style={{height: '30%'}}
          >
            {item.title}
          </div>
        );
      }
    }
    return (
     <div 
        onClick={e => {e.stopPropagation(); console.log('prevented item menu');}}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: '2'
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
            <button onClick={e => {e.stopPropagation(); this.props.handleCloseMenu();}}>X</button>
          </div>
          <div style={{flex: '1 1 auto', height: '100%', overflowY: 'scroll', backgroundColor: '#cc9999'}}>
            {selectList}
          </div>
        </div>
        {this.props.itemView && (
          <ItemView currentItem={this.props.currentItem} handleCloseView={() => this.props.handleCloseView()}/>
        )}
      </div>
    );
  }
}
