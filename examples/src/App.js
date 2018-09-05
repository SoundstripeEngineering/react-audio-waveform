import React, { Component } from 'react';
import './App.css';
import Waveform from "../../src";

const TEST_PEAKS = [0.04, 0.99, 0.54, 0.74, 0.76, 0.52, 0.79, 0.72, 0.83, 0.67, 0.88, 0.99, 0.95, 0.9399999999999999, 0.91, 0.82, 0.96, 0.91, 0.93, 0.93, 0.98, 0.99, 0.98, 0.99, 0.98, 0.98, 0.98, 0.98, 0.98, 0.98, 0.98, 0.85, 0.82, 0.96, 0.99, 0.99, 0.99, 0.97, 0.97, 0.98, 1, 0.98, 0.98, 0.98, 0.98, 0.99, 0.99, 0.98, 0.98, 0.98, 0.99, 0.98, 0.99, 0.99, 0.98, 0.99, 0.9, 0.8, 0.91, 0.9, 0.88, 0.97, 0.98, 0.92, 0.98, 0.98, 0.99, 0.99, 0.98, 0.99, 0.99, 0.98, 0.98, 0.97, 0.98, 0.98, 0.98, 0.99, 0.99, 0.98, 0.99, 0.98, 0.99, 0.99, 0.98, 0.99, 0.98, 0.98, 0.99, 0.99, 0.98, 0.99, 0.99, 1, 0.99, 0.93, 0.96, 0.83, 0.9399999999999999, 0.98, 0]

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pos: 0
    }
  }

  handleClick = (secs) => {
    this.setState({
      pos: secs
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Click around below to see progress animation</h1>
        </header>
        <Waveform
          barWidth={4}
          peaks={TEST_PEAKS}
          height={200}
          pos={this.state.pos}
          duration={210}
          onClick={this.handleClick}
          color="#676767"
          progressGradientColors={[[0, "#888"], [1, "#aaa"]]}
        />
      </div>
    );
  }
}

export default App;
