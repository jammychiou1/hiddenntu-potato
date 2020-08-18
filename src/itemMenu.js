import React from 'react';
import ReactHtmlParser from 'react-html-parser';
export class ItemMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: null 
    }
  }
  getText() {
    console.log('getting text' + this.props.currentItem);
    if (this.props.currentItem) {
      fetch('../get/' + this.props.currentItem + '.htm', {
        credentials: 'same-origin'
      })
      .then(response => response.text())
      .then(text => {
        console.log({text: text});
        this.setState({text: text});
      });
    }
    else {
      this.setState({text: null});
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (props.currentItem) {
      return null;
    }
    else {
      return {text: null};
    }
  }
  componentDidMount() {
    this.getText();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.currentItem != prevProps.currentItem) {
      this.getText();
    }
  }
  render() {
    let selectList = [];
    for (let i = 0; i < this.props.itemList.length; i++) {
      const item = this.props.itemList[i];
      selectList.push(
        <div
          key={i}
          onClick={e =>{e.stopPropagation(); this.props.itemChange(item.key);}}
          style={{height: '35%'}}
        >
          {item.title}
        </div>
      );
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
            <button onClick={e => {e.stopPropagation(); this.props.handleClose();}}>X</button>
          </div>
          <div style={{flex: '1 1 auto', overflowY: 'scroll', backgroundColor: '#cc9999'}}>
            {selectList}
          </div>
        </div>
        {this.props.currentItem && (
          <div 
            onClick={e => {e.stopPropagation(); console.log('prevented item');}}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
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
                <button onClick={e => {e.stopPropagation(); this.props.itemChange('');}}>X</button>
              </div>
              <div style={{flex: '1 1 auto', overflowY: 'scroll', backgroundColor: '#cc9999'}}>
                {ReactHtmlParser(this.state.text)}
              </div>            
            </div>
          </div>
        )}
      </div>
    );
  }
}
