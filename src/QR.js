import React from 'react';
import QrReader from 'react-qr-reader';
export class QR extends React.Component {
  constructor(props) {
    super(props);
  }
  handleScan(data) {
    if (data) {
      //alert(data);
      this.props.handleScan(data);
    }
    else {
      //alert('nothing');
    }
  }
  render() {
    return (
      <div 
        onClick={e => {e.stopPropagation(); console.log('prevented QR');}}
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
          //backgroundColor: '#cc9999',
          width: '90%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          <button onClick={e => {e.stopPropagation(); this.props.handleClose();}}>X</button>
          <QrReader delay={100} onScan={data => this.handleScan(data)} resolution={500} style={{
            width: '100%', backgroundColor: '#cc9999'
          }}/>
        </div>
      </div>
    );
  }
}
