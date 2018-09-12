import React from "react"
import ReactDOM from "react-dom"
import { isEqual } from "lodash"

import WaveCanvas from "./WaveCanvas"

class Waveform extends React.Component {
  static defaultProps = {
    height: 30,
    onClick: () => {},
    pixelRatio:
      window.devicePixelRatio || screen.deviceXDPI / screen.logicalXDPI,
    progressColor: "#555555",
  }

  // static propTypes = {
  //   barWidth: PropTypes.number,
  //   color: PropTypes.string,
  //   duration: PropTypes.number.isRequired,
  //   gradientColors: PropTypes.arrayOf(
  //     PropTypes.arrayOf(
  //       PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
  //     ).isRequired
  //   ),
  //   height: PropTypes.number.isRequired,
  //   onClick: PropTypes.func,
  //   peaks: PropTypes.arrayOf(PropTypes.number.isRequired),
  //   pixelRatio: PropTypes.number.isRequired,
  //   pos: PropTypes.number.isRequired, // num of seconds
  //   progressColor: PropTypes.string,
  //   progressGradientColors: PropTypes.arrayOf(
  //     PropTypes.arrayOf(
  //       PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
  //     ).isRequired
  //   ),
  // }

  constructor(props) {
    super(props)
    this.state = {
      width: 0,
      waveWidth: 0,
      waveHeight: props.height,
    }
  }

  componentDidMount = () => {
    this.resize()
    window.addEventListener("resize", this.resize)
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const stateChanged = !isEqual(this.state, nextState)
    const peaksChanged = !isEqual(this.props.peaks, nextProps.peaks)
    const posChanged = this.props.pos !== nextProps.pos
    const durationChanged = this.props.duration !== nextProps.duration
    const colorChanged =
      this.props.color !== nextProps.color
    const gradientChanged =
      !isEqual(this.props.gradientColors, nextProps.gradientColors)
    const progressColorChanged =
      this.props.progressColor !== nextProps.progressColor
    const progressGradientChanged =
      !isEqual(this.props.progressGradientColors, nextProps.progressGradientColors)
    return (
      stateChanged ||
      peaksChanged ||
      posChanged ||
      durationChanged ||
      colorChanged ||
      gradientChanged ||
      progressColorChanged ||
      progressGradientChanged
    )
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.resize)
  }

  handleClick = (e) => {
    const percentageOffsetX = e.nativeEvent.offsetX / this.state.width
    this.props.onClick(Math.round(percentageOffsetX * this.props.duration))
  }

  max = (values) => {
    let max = -Infinity
    values.forEach((i) => {
      if (values[i] > max) {
        max = values[i]
      }
    })

    return max
  }

  min = (values) => {
    let min = +Infinity
    values.forEach((i) => {
      if (values[i] < min) {
        min = values[i]
      }
    })

    return min
  }

  resize = () => {
    const containerWidth = ReactDOM.findDOMNode(this.wrapper).clientWidth
    this.setState({
      width: containerWidth,
      waveWidth: containerWidth * this.props.pixelRatio,
      waveHeight: this.props.height * this.props.pixelRatio,
    })
  }
  
  progressWaveStyle = () => {
    return {
      position: "absolute",
      zIndex: 2,
      left: 0,
      top: 0,
      bottom: 0,
      overflow: "hidden",
      height: `${this.props.height}px`,
      width: `${this.progressWidth()}px`,
      display: "block",
      transition: "width 200ms ease-in-out",
      boxSizing: "border-box",
    }
  }

  progressWidth = () => {
    const percentageComplete = this.props.pos / this.props.duration
    return this.state.width * percentageComplete
  }

  render() {
    return (
      <div
        ref={(instance) => {
          this.wrapper = instance
        }}
        onClick={this.handleClick}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          cursor: "pointer",
        }}
      >
        <WaveCanvas
          color={this.props.color}
          barWidth={this.props.barWidth}
          gradientColors={this.props.gradientColors}
          peaks={this.props.peaks}
          width={this.state.waveWidth}
          height={this.state.waveHeight}
        />
        <div
          style={this.progressWaveStyle()}
        >
          <WaveCanvas
            ref={(instance) => {
              this.progress = instance
            }}
            className="progress"
            barWidth={this.props.barWidth}
            color={this.props.progressColor}
            gradientColors={this.props.progressGradientColors}
            peaks={this.props.peaks}
            width={this.state.waveWidth}
            height={this.state.waveHeight}
          />
        </div>
      </div>
    )
  }
}

export default Waveform