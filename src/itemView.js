import React from 'react';
import {Parser} from 'htmlparser2';
import {constants} from './constants';
class SecretImg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null
    };
  }
  componentDidMount() {
    const sessionID = localStorage.getItem(constants.sessionIDKey);
    fetch(API_HOST + '/' + constants.gamePath + '/' + constants.itemPath + '/' + this.props.src, {
      headers: new Headers({
        [constants.sessionIDHeaderName]: sessionID,
      }),
      mode: 'cors'
    })
    .then(async response => {
      const blob = await response.blob();
      if (response.ok) {
        const url = URL.createObjectURL(blob);
        this.setState({url: url});  
        console.log(url);
      }
    });
  }
  componentWillUnmount() {
    URL.revokeObjectURL(this.state.url);
  }
  render() {
    return this.state.url !== null && <img css={this.props.style} src={this.state.url}/>;
  }
}
function ItemContent(props) {
  const stack = [{childrens: []}];
  const parser = new Parser({
    onopentag: function(name, attribs) {
      const element = {childrens: [], style: '', src: ''};
      if ('style' in attribs) {
        element.style = attribs.style;
      }
      if ('src' in attribs) {
        element.src = attribs.src;
      }
      stack.push(element);
    },
    ontext: function(text) {
      stack[stack.length - 1].childrens.push(text);
    },
    onclosetag: function(name) {
      const element = stack.pop();
      let transformed;
      if (name == 'div') {
        transformed = <div css={element.style}>{element.childrens}</div>;
      }
      if (name == 'span') {
        transformed = <span css={element.style}>{element.childrens}</span>;
      }
      if (name == 'img') {
        transformed = <SecretImg style={element.style} src={props.currentItem + '/' + element.src}/>;
      }
      if (name == 'strong') {
        transformed = <strong>{element.childrens}</strong>;
      }
      stack[stack.length - 1].childrens.push(transformed);
    }
  });
  parser.write(props.src);
  parser.end();
  return <div>{stack[0].childrens}</div>;
}
export class ItemView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null
    };
  }
  getSrc() {
    if (this.props.currentItem !== '') {
      const sessionID = localStorage.getItem(constants.sessionIDKey);
      console.log(API_HOST + '/' + constants.gamePath + '/' + constants.itemPath + '/' + this.props.currentItem);
      fetch(API_HOST + '/' + constants.gamePath + '/' + constants.itemPath + '/' + this.props.currentItem, {
        headers: new Headers({
          [constants.sessionIDHeaderName]: sessionID,
        }),
        mode: 'cors'
      })
      .then(async response => {
        if (response.ok) {
          const src = await response.text();
          this.setState({
            src: src
          });
        }
      });
    }
  }
  componentDidMount() {
    this.getSrc();
  }
//  componentDidUpdate(prevProps, prevState) {
//    if (this.props.currentItem !== prevProps.currentItem) {
//      this.getSrc();
//    }
//  }
  render() {
    return (
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
            <button onClick={e => {e.stopPropagation(); this.props.handleCloseView();}}>X</button>
          </div>
          <div style={{flex: '1 1 auto', overflowY: 'scroll', backgroundColor: '#cc9999'}}>
            {this.state.src !== null && <ItemContent currentItem={this.props.currentItem} src={this.state.src}/>}
          </div>            
        </div>
      </div>
    );
  }
}
