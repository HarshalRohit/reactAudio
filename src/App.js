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


class MainUI extends Component {
  render(){
    
    if(this.props.microphoneAccess !== "granted")
      return null;

    return (
      <div>
        EVerything related to recording will appear here!!
      </div>
    );
  };
};

class MicrophoneRequest extends Component {
  render(){
    
    if(this.props.microphoneAccess !== "prompt")
      return null;

    return (
      <div>
        Access to microphone required.
        Click to request access!!
        <Button 
          onClick={() => this.props.onClick()}
          btnText="Request Permission" />

      </div>
    );
  };
}


class MicrophoneError extends Component {
  
  render(){
    if(this.props.microphoneAccess !== "denied")
      return null;

    return (
      <div>
        <span> You have denied access to microphone!!</span>
        <br />
        <span> Please change it in site settings. </span>
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

    this.getMicrophone = this.getMicrophone.bind(this);
    // this.handleRecordBtnClick = this.handleRecordBtnClick.bind(this);
    // this.handleStopBtnClick = this.handleStopBtnClick.bind(this);
    // this.mediaRecOnDataAvail = this.mediaRecOnDataAvail.bind(this);
    // this.mediaRecOnStop = this.mediaRecOnStop.bind(this);
    
  };


  componentDidMount(){

    const isMediaSupported = navigator.mediaDevices && 
                navigator.mediaDevices.getUserMedia ? true : false;

    this.setState({
      isMediaSupported: isMediaSupported
    });

    if(isMediaSupported){

      navigator.permissions.query({name:'microphone'})
        .then((result) => this.setState({microphoneAccess: result.state}));
    }
    
  }


  async getMicrophone() {
    // will only be called when mediaSupported is true
    // will accomodate that later
    let stream = null;
    try{
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      /*let someVar = navigator.permissions.query({name:'microphone'})
              .then((result) => this.setState({microphoneAccess: result.state}));

      console.log(someVar);*/

      this.setState({ audioStream: new MediaRecorder(stream), 
                      chunks: [],
                      microphoneAccess: "granted"
                    });

      /*navigator.permissions.query({name:'microphone'})
        .then((result) => this.setState({microphoneAccess: result.state}));*/

      // this.state.audioStream = new MediaRecorder(stream);
      // this.chunks = [];
      // console.log(this.mediaRecorder);
      // console.log(this.state.chunks);
      // this.state.audioStream.ondataavailable = this.mediaRecOnDataAvail
      // this.state.audioStream.onstop = this.mediaRecOnStop

    } catch(err){
      console.log(err);
      this.setState({microphoneAccess: "denied"});
    }  
    
  };



  render() {
    const { microphoneAccess } = this.state;
    return (
      <div className="App">
        <h1>Welcome!!</h1>
        <MainUI microphoneAccess={microphoneAccess} />
        <MicrophoneRequest 
          microphoneAccess={microphoneAccess} 
          onClick={this.getMicrophone} />
        <MicrophoneError microphoneAccess={microphoneAccess} />
      </div>
    )
  }
}

export default App