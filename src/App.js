import React, { Component } from 'react'


class Button extends Component {
  render() {
    return (
      <button type="button" onClick={this.props.onClick}>
        {this.props.btnText}
      </button>
    );
  };
}

class MicrophoneError extends Component {
  
  render(){
    if(this.props.audioStream)
      return null;  

    return (
      <div>
        <span> Ohh!! Please allow microphone access. </span>
        <br />
        <span> Displays onLoad, will fix it later </span>
      </div>
    )
  };
}


class App extends Component {

  constructor(props) {
    super(props)

    
    this.state = {isMediaSupported: false, 
                  microphoneAccess: null, 
                  audioStream: null, 
                  chunks: []};

    // this.getMicrophone = this.getMicrophone.bind(this);
    // this.handleRecordBtnClick = this.handleRecordBtnClick.bind(this);
    // this.handleStopBtnClick = this.handleStopBtnClick.bind(this);
    // this.mediaRecOnDataAvail = this.mediaRecOnDataAvail.bind(this);
    // this.mediaRecOnStop = this.mediaRecOnStop.bind(this);
    
  };


  componentDidMount(){

    const isMediaSupported = navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? true : false;

    this.setState({
      isMediaSupported: isMediaSupported
    });

    if(isMediaSupported){

      navigator.permissions.query({name:'microphone'})
        .then((result) => this.setState({microphoneAccess: result.state}));
        /*.then(function(result) {



          if (result.state === 'granted') {
            // showMap();
          } else if (result.state === 'prompt') {
            // showButtonToEnableMap();
          }
        // Don't do anything if the permission was denied.
        });*/
    }
    
  }



  render() {
    
    return (
      <div className="App">
        <h1>Welcome!!</h1>
      </div>
    )
  }
}

export default App