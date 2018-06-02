import React from 'react';
import PropTypes from 'prop-types';

class Counter extends React.Component {
  constructor(props) {
    super();
    this.state = { time: {}, seconds: props.to - parseInt(Date.now() / 1000) };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  secondsToTime = (secs) => {
    const days = Math.floor(secs / (60 * 60 * 24));

    const divisorforhours = secs % (60 * 60 * 24);
    const hours = Math.floor(divisorforhours / (60 * 60));

    const divisorforminutes = secs % (60 * 60);
    const minutes = Math.floor(divisorforminutes / 60);

    const divisorforseconds = divisorforminutes % 60;
    const seconds = Math.ceil(divisorforseconds);

    const obj = {
      d: days,
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  };

  componentDidMount() {
    const timeLeftVar = this.secondsToTime(this.state.seconds);
    this.state = { time: timeLeftVar };
    this.startTimer();
  }

  startTimer() {
    if (this.timer === 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    const seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds,
    });

    // Check if we're at zero.
    if (seconds === 0) {
      clearInterval(this.timer);
    }
  }

  render() {
    return (
      <div>
        {/* <button onClick={this.startTimer}>Start</button> */}
        d: {this.state.time.d} h: {this.state.time.h} m: {this.state.time.m} s: {this.state.time.s}
      </div>
    );
  }
}

Counter.propTypes = {
  to: PropTypes.number,
};

export default Counter;
