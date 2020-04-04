import React, { Component } from 'react'


class Button extends Component {
  render() {

    const disabled = this.props.disabled ? this.props.disabled: false;
    return (
      <button 
        type="button" 
        onClick={this.props.onClick}
        disabled={disabled} >
        {this.props.btnText}
      </button>
    );
  };
}


class MainUI extends Component {

  constructor(props){
    super(props);

    this.state = {audioStream: null, 
                  chunks: [],
                  recBtnDisable: false,
                  stopBtnDisable: true
                 };

    this.setupAudioRecord = this.setupAudioRecord.bind(this);                  
    this.mediaRecOnDataAvail = this.mediaRecOnDataAvail.bind(this);
    this.mediaRecOnStop = this.mediaRecOnStop.bind(this);

    this.handleRecordBtnClick = this.handleRecordBtnClick.bind(this);
    this.handleStopBtnClick = this.handleStopBtnClick.bind(this);
  }

  componentDidMount(){

    navigator.mediaDevices.getUserMedia({
        audio: true
    })
    .then(this.setupAudioRecord)
    .catch(() => {console.log("should not reach here!!")});
    
  }


  setupAudioRecord(stream){

    let audioStream = new MediaRecorder(stream);
    audioStream.ondataavailable = this.mediaRecOnDataAvail
    audioStream.onstop = this.mediaRecOnStop

    this.setState({ audioStream: audioStream, 
                      chunks: []
                    });

    // this.state.audioStream.ondataavailable = this.mediaRecOnDataAvail
    // this.state.audioStream.onstop = this.mediaRecOnStop
  }

  mediaRecOnDataAvail(e){
    const {chunks} = this.state;
    // [...chunks, e.data]
    this.setState({chunks:  chunks.concat([e.data])});
    // console.log(this.state.chunks);
  }

  mediaRecOnStop(e){
    const downloadLink = document.getElementById('download');
   
    downloadLink.href = URL.createObjectURL(new Blob(this.state.chunks));
    downloadLink.download = 'acetest.wav';
  }

  handleRecordBtnClick(){
    // this.state.audioStream.start();
    // console.log("record button clicked");
    this.state.audioStream.start();
    this.setState({recBtnDisable: true,
                   stopBtnDisable: false
                 });
  }

  handleStopBtnClick(){
    // console.log("stop button clicked");
    this.state.audioStream.stop();
    this.setState({recBtnDisable: false,
                   stopBtnDisable: true
                 });
  }

  render(){
    
    if(this.props.microphoneAccess !== "granted")
      return null;

    return (
      <div>
        <a id="download">Download</a>
        <Button btnText="Record" 
                onClick={this.handleRecordBtnClick} 
                disabled={this.state.recBtnDisable} />
        <Button btnText="Stop" 
                onClick={this.handleStopBtnClick}
                disabled={this.state.stopBtnDisable} />
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
                  microphoneAccess: null
                 };

    this.requestMicrophoneAccess = this.requestMicrophoneAccess.bind(this);
    
  };


  componentDidMount(){

    const isMediaSupported = navigator.mediaDevices && 
                navigator.mediaDevices.getUserMedia ? true : false;

    this.setState({
      isMediaSupported: isMediaSupported
    });

    if(isMediaSupported){

      navigator.permissions.query({name:'microphone'})
        .then((result) => this.setState({microphoneAccess: result.state}))
        // .then(() => this.requestMicrophoneAccess());
    }
    
  }


  async requestMicrophoneAccess() {

    navigator.mediaDevices.getUserMedia({audio: true})
      .then(() => {this.setState({microphoneAccess: "granted"})})
      .catch(() => {this.setState({microphoneAccess: "denied"})}
    
  };


  render() {
    const { microphoneAccess } = this.state;
    return (
      <div className="App">
        <h1>Welcome!!</h1>
        <MainUI microphoneAccess={microphoneAccess} />
        <MicrophoneRequest 
          microphoneAccess={microphoneAccess} 
          onClick={this.requestMicrophoneAccess} />
        <MicrophoneError microphoneAccess={microphoneAccess} />
      </div>
    )
  }
}

export default App