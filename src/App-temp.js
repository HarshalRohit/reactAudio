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

    this.state = {isMediaSupported: false, audioStream: null, chunks: []};

    this.getMicrophone = this.getMicrophone.bind(this);
    this.handleRecordBtnClick = this.handleRecordBtnClick.bind(this);
    this.handleStopBtnClick = this.handleStopBtnClick.bind(this);
    this.mediaRecOnDataAvail = this.mediaRecOnDataAvail.bind(this);
    this.mediaRecOnStop = this.mediaRecOnStop.bind(this);
    
  };


  componentDidMount(){

    this.setState({
      isMediaSupported: navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? true : false
    });

    /*console.log(navigator.mediaDevices);
    const someVar = navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? true : false;
    console.log(someVar);
    console.log(navigator.mediaDevices.getUserMedia)*/
    
  }


  async getMicrophone() {
    if(this.state.isMediaSupported){
      let stream = null;
      try{
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });

        this.setState({ audioStream: new MediaRecorder(stream), chunks: [] });
        // this.state.audioStream = new MediaRecorder(stream);
        // this.chunks = [];
        // console.log(this.mediaRecorder);
        console.log(this.state.chunks);
        this.state.audioStream.ondataavailable = this.mediaRecOnDataAvail
        this.state.audioStream.onstop = this.mediaRecOnStop

      } catch(err){
        console.log(err);
      }  
    } else {
      console.log("Media Not Supported");
    }
    
  };

  mediaRecOnDataAvail(e){
    const {chunks} = this.state;
    
    this.setState({chunks: chunks.concat([e.data])});
    console.log(this.state.chunks);
  }

  // this.mediaRecorder.ondataavailable = 

  mediaRecOnStop(e){
    const downloadLink = document.getElementById('download');
   
    downloadLink.href = URL.createObjectURL(new Blob(this.state.chunks));
    downloadLink.download = 'acetest.wav';
  }

  handleRecordBtnClick(){
    // this.state.audioStream.start();
    console.log("record button clicked");
    this.state.audioStream.start();
  }

  handleStopBtnClick(){
    console.log("stop button clicked");
    this.state.audioStream.stop();
  }






  render() {
    
    return (
      <div className="App">
        <h1>Hello, React!</h1>
        <a id="download">Download</a>
        <Button btnText="Request Microphone" onClick={this.getMicrophone} />
        <Button btnText="Record" onClick={this.handleRecordBtnClick} />
        <Button btnText="Stop" onClick={this.handleStopBtnClick} />
        <MicrophoneError audioStream={this.state.audioStream} />    
      </div>
    )
  }
}

export default App