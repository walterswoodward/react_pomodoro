import React, { Component } from "react";
import "./App.css";
import wav from "./audio/gong.wav";
import play_pause from "./images/pause_play.png";

class PomodoroClock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // initially both set to 1 minute
      workMinutes: 20,
      relaxMinutes: 5,
      timer: 20 * 60, // seconds
      workActive: true,
      paused: false
    };
  }

  // Used in the timerComponent only, but placed here to centralize method store
  updateSessionLength = (updateTime, token) => {
    if (token === "RELAX") {
      this.setState({
        relaxMinutes: updateTime
      });

      if (!this.state.workActive) {
        this.setState({
          // updateTime is in minutes
          timer: updateTime * 60
        });
      }
    }

    if (token === "WORK") {
      this.setState({
        workMinutes: updateTime
      });

      if (this.state.workActive) {
        this.setState({
          timer: updateTime * 60
        });
      }
    }
  };

  // STEP #1
  // runs every time there is a work/relax switch
  start = () => {
    var timer;
    var audio = new Audio(wav);
    // STEP #2 -- workActive default is true

    if (this.state.workActive) {
      // STEP #3 -- timer is the actual time value that decrements in seconds
      if (this.state.timer > 0) {
        timer = this.state.timer;
      } else {
        timer = this.state.workMinutes * 60;
      }
    } else {
      if (this.state.timer > 0) {
        timer = this.state.timer;
      } else {
        timer = this.state.relaxMinutes * 60;
      }
    }

    // PAUSED/NOT PAUSED conditional block:
    if (!this.state.paused) {
      // STEP #4 setInterval is used to decrement timer every 25 milliseconds.
      this.setState({
        interval: setInterval(
          function() {
            // timer not ended
            if (--timer >= 0) {
              // Update with new timer time and new end angle
              this.setState({
                timer: timer
              });
            }
            // STEP #5: When timer runs out
            else {
              // play triangle sound
              audio.play();
              // reset the state
              this.setState({
                workActive: !this.state.workActive,
                paused: false
              });
              // clear interval
              clearInterval(this.state.interval);
              // restart pomodoro
              this.start();
            }
          }.bind(this),
          10 // TO BE ACCURATE THIS NEEDS TO BE 1000ms, but for testing purposes it is set lower
        )
      });
      // STEP #3.5 -- if paused, then call clearInterval to stop setInterval
    } else if (this.state.paused) {
      clearInterval(this.state.interval);
    }
    this.setState({
      paused: !this.state.paused
    });
  };

  // display time in minutes and seconds
  displayTime = () => {
    // remember timer is in seconds
    var minutes = Math.floor(this.state.timer / 60);
    var seconds = Number(this.state.timer % 60);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
  };

  render() {
    return (
      <div id="container">
        <div id="title">Pomodoro Clock</div>

        <div id="settings_container">
          <div className="settings">
            <Timer
              updateSession={this.updateSessionLength}
              setTime={this.state.relaxMinutes}
              token="RELAX"
              paused={this.state.paused}
            />
            <br />
            <br />
            <br />
            <Timer
              updateSession={this.updateSessionLength}
              setTime={this.state.workMinutes}
              token="WORK"
              paused={this.state.paused}
            />
          </div>

          {/* THIS IS THE START - invocation of start() */}
          <div id="current_container">
            <div className="current">
              <h2 id="current_title">
                {this.state.workActive ? "Work" : "Relax"}
              </h2>
              <div id="current_time">{this.displayTime()}</div>
              <button id="start_button" onClick={this.start}>
                {" "}
                <img
                  src={play_pause}
                  alt="play_pause icon"
                  id="play_pause_icon"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setTime: this.props.setTime,
      token: this.props.token
    };
  }
  handleTimeInc = () => {
    this.updateState(this.state.setTime + 1);
  };

  handleTimeDec = () => {
    this.updateState(this.state.setTime - 1);
  };

  updateState = updateTime => {
    var updateTime = updateTime;
    // max time in minutes 60
    var max = 60;
    // min time in minutes 1
    var min = 1;
    // did update time

    if (updateTime > max) {
      updateTime = max;
    } else if (updateTime < min) {
      updateTime = min;
    }

    this.setState({
      setTime: updateTime
    });

    this.props.updateSession(updateTime, this.state.token);
  };

  render() {
    return (
      <div id={this.props.token} className="setting">
        <h5 className="settings_title">{this.props.token}</h5>

        {/* span used here for inline attribute */}
        <div className="settings_time">{this.state.setTime} minutes</div>
        <button
          onClick={this.handleTimeDec}
          disabled={this.props.paused}
          className="settings_btns"
        >-
        </button>
        <button
          onClick={this.handleTimeInc}
          disabled={this.props.paused}
          className="settings_btns"
        >
          +
        </button>
      </div>
    );
  }
}

export default PomodoroClock;
