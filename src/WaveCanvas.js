import React from "react"
import ReactDOM from "react-dom"
import isEqual from "lodash/isEqual"

class WaveCanvas extends React.Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    color: "ccc",
    width: 0,
    pixelRatio:
      window.devicePixelRatio || screen.deviceXDPI / screen.logicalXDPI,
  }

  // static propTypes = {
  //   barWidth: PropTypes.number,
  //   width: PropTypes.number.isRequired,
  //   height: PropTypes.number.isRequired,
  //   peaks: PropTypes.arrayOf(PropTypes.number.isRequired),
  //   pixelRatio: PropTypes.number.isRequired,
  //   color: PropTypes.string,
  //   gradientColors: PropTypes.arrayOf(
  //     PropTypes.arrayOf(
  //       PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
  //     ).isRequired
  //   ),
  // }

  componentDidUpdate = (prevProps) => {
    if (
      prevProps.width != this.props.width ||
      prevProps.height != this.props.height ||
      prevProps.color != this.props.color ||
      !isEqual(prevProps.peaks, this.props.peaks)
    ) {
      this.updateSize(this.props.width, this.props.height, this.props.peaks)
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      nextProps.width != this.props.width ||
      nextProps.height != this.props.height ||
      nextProps.color != this.props.color ||
      !isEqual(nextProps.peaks, this.props.peaks)
    )
  }

  clearWave = (waveCanvasCtx, width, height) => {
    waveCanvasCtx.clearRect(0, 0, width, height)
  }

  drawBars = (waveCanvasCtx, width, peaks) => {
    const params = {
      fillParent: true,
      height: this.props.height,
      normalize: true,
      pixelRatio: this.props.pixelRatio,
      barWidth: this.props.barWidth,
      color: this.props.color,
      gradientColors: this.props.gradientColors,
    }

    // Bar wave draws the bottom only as a reflection of the top,
    // so we don't need negative values
    const hasMinVals = [].some.call(peaks, (val) => val < 0)
    if (hasMinVals) {
      // If the first value is negative, add 1 to the filtered indices
      let indexOffset = 0
      if (peaks[0] < 0) {
        indexOffset = 1
      }
      peaks = [].filter.call(
        peaks,
        (_, index) => (index + indexOffset) % 2 == 0
      )
    }

    // A half-pixel offset makes lines crisp
    const $ = 0.5 / params.pixelRatio
    const height = params.height * params.pixelRatio
    const offsetY = 0
    const halfH = params.height / 2 // Don't use height because this is after canvas height has been set
    const length = peaks.length
    const bar = params.barWidth * params.pixelRatio
    const gap = Math.max(params.pixelRatio, 2)
    const step = bar + gap

    let absmax = 1
    if (params.normalize) {
      absmax = this.absMax(peaks)
    }

    const scale = length / width

    if (params.gradientColors) {
      const gradient = waveCanvasCtx.createLinearGradient(0, 0, width, 0)
      params.gradientColors.forEach((color) => {
        // The first position of each array is the stop position between 0 and 1
        // The second position is the color
        gradient.addColorStop(color[0], color[1])
      })
      waveCanvasCtx.fillStyle = gradient
    } else {
      waveCanvasCtx.fillStyle = params.color
    }

    if (!waveCanvasCtx) {
      return
    }

    for (let i = 0; i < width; i += step) {
      let h = Math.round(peaks[Math.floor(i * scale)] / absmax * halfH)
      if (h === 0) {
        h = 1
      }
      waveCanvasCtx.fillRect(i + $, halfH - h + offsetY, bar + $, h * 2)
    }
  }

  drawWaves = (waveCanvasCtx, width, peaks) => {
    const params = {
      fillParent: true,
      height: this.props.height,
      normalize: true,
      pixelRatio: this.props.pixelRatio,
      color: this.props.color,
      gradientColors: this.props.gradientColors,
    }

    // Support arrays without negative peaks
    const hasMinValues = [].some.call(peaks, (val) => val < 0)
    if (!hasMinValues) {
      const reflectedPeaks = []
      for (var i = 0, len = peaks.length; i < len; i++) {
        reflectedPeaks[2 * i] = peaks[i]
        reflectedPeaks[2 * i + 1] = -peaks[i]
      }
      peaks = reflectedPeaks
    }

    // A half-pixel offset makes lines crisp
    const $ = 0.5 / params.pixelRatio
    const height = params.height * params.pixelRatio
    const offsetY = 0
    const halfH = params.height / 2
    const length = ~~(peaks.length / 2)

    let scale = 1
    if (params.fillParent && width != length) {
      scale = width / length
    }

    let absmax = 1
    if (params.normalize) {
      const max = this.max(peaks)
      const min = this.min(peaks)
      absmax = -min > max ? -min : max
    }

    if (params.gradientColors) {
      const gradient = waveCanvasCtx.createLinearGradient(0, 0, width, 0)
      params.gradientColors.forEach((color) => {
        // The first position of each array is the stop position between 0 and 1
        // The second position is the color
        gradient.addColorStop(color[0], color[1])
      })
      waveCanvasCtx.fillStyle = gradient
    } else {
      waveCanvasCtx.fillStyle = params.color
    }

    if (!waveCanvasCtx) {
      return
    }

    waveCanvasCtx.beginPath()
    waveCanvasCtx.moveTo($, halfH + offsetY)

    for (var i = 0; i < length; i++) {
      var h = Math.round(peaks[2 * i] / absmax * halfH)
      waveCanvasCtx.lineTo(i * scale + $, halfH - h + offsetY)
    }

    // Draw the bottom edge going backwards, to make a single
    // closed hull to fill.
    for (var i = length - 1; i >= 0; i--) {
      var h = Math.round(peaks[2 * i + 1] / absmax * halfH)
      waveCanvasCtx.lineTo(i * scale + $, halfH - h + offsetY)
    }

    // waveCanvasCtx.closePath()
    waveCanvasCtx.fill()

    // Always draw a median line
    waveCanvasCtx.fillRect(0, halfH + offsetY - $, width, $)
  }

  absMax = (values) => {
    let max = -Infinity
    for (const i in values) {
      const num = Math.abs(values[i])
      if (num > max) {
        max = num
      }
    }

    return max
  }

  max = (values) => {
    let max = -Infinity
    for (const i in values) {
      if (values[i] > max) {
        max = values[i]
      }
    }

    return max
  }

  min = (values) => {
    let min = +Infinity
    for (const i in values) {
      if (values[i] < min) {
        min = values[i]
      }
    }

    return min
  }

  updateSize = (width, height, peaks) => {
    if (peaks) {
      const waveCanvasCtx = ReactDOM.findDOMNode(this.wave).getContext("2d")

      const displayWidth = Math.round(width / this.props.pixelRatio)
      const displayHeight = Math.round(height / this.props.pixelRatio)
      waveCanvasCtx.canvas.width = width
      waveCanvasCtx.canvas.height = height
      waveCanvasCtx.canvas.style.width = `${displayWidth}px`
      waveCanvasCtx.canvas.style.height = `${displayHeight}px`

      this.clearWave(waveCanvasCtx, width, height)
      if (this.props.barWidth) {
        this.drawBars(waveCanvasCtx, width, peaks)
      } else {
        this.drawWaves(waveCanvasCtx, width, peaks)
      }
    }
  }

  render() {
    return this.props.peaks ? (
      <canvas
        ref={(instance) => {
          this.wave = instance
        }}
      />
    ) : null
  }
}

export default WaveCanvas