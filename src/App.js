import React from "react";
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      
    }
  }
  render() {
    return (
      <div className="App">
        <h1>Pomodoro Clock</h1>
        <div>Break Length:</div>
        <input />
        <div>Session Length</div>
        <input />
      </div>
    );
  }
}

export default App;
