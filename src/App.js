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

    this.download = this.download.bind(this);
  }

  componentDidMount(){
    navigator.mediaDevices.getUserMedia({audio: true}) 
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
  }

  mediaRecOnDataAvail(e){
    this.setState({chunks:  [...this.state.chunks, e.data]});
  }

  mediaRecOnStop(e){

    const fileName = prompt('Enter a name for your sound clip?', 
      'My unnamed clip') + '.wav';
    // this can be moved to download function
    const downloadObj = URL.createObjectURL(new Blob(this.state.chunks));
    this.download(fileName, downloadObj)

    this.setState({chunks: []});
  }

  download(filename, obj) {
      var element = document.createElement('a');
      element.setAttribute('href', obj);
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
  }

  handleRecordBtnClick(){
    
    this.state.audioStream.start();
    this.setState({recBtnDisable: true,
                   stopBtnDisable: false
                 });
  }

  handleStopBtnClick(){
    
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
                  microphoneAccess: null };

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
      .catch(() => {this.setState({microphoneAccess: "denied"})});
    
  };


  render() {
    const { microphoneAccess } = this.state;

    let componentToDisplay;

    switch(microphoneAccess){
      case "granted":
        componentToDisplay = <MainUI microphoneAccess={microphoneAccess} />;
        break;
      case "prompt":
        componentToDisplay = <MicrophoneRequest 
                                microphoneAccess={microphoneAccess} 
                                onClick={this.requestMicrophoneAccess} />;
        break;
      case "denied":
        componentToDisplay = <MicrophoneError microphoneAccess={microphoneAccess} />;
        break;
      default:
        
    }

    return (
      <div className="App">
        <h1>Welcome!!</h1>
        {componentToDisplay}
      </div>
    )
  }
}


export default App