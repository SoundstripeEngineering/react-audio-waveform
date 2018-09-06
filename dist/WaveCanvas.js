"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WaveCanvas = function (_React$Component) {
  _inherits(WaveCanvas, _React$Component);

  function WaveCanvas(props) {
    _classCallCheck(this, WaveCanvas);

    var _this = _possibleConstructorReturn(this, (WaveCanvas.__proto__ || Object.getPrototypeOf(WaveCanvas)).call(this, props));

    _this.componentDidUpdate = function (prevProps) {
      if (prevProps.width != _this.props.width || prevProps.height != _this.props.height || prevProps.color != _this.props.color || !(0, _lodash.isEqual)(prevProps.peaks, _this.props.peaks)) {
        _this.updateSize(_this.props.width, _this.props.height, _this.props.peaks);
      }
    };

    _this.shouldComponentUpdate = function (nextProps, nextState) {
      return nextProps.width != _this.props.width || nextProps.height != _this.props.height || nextProps.color != _this.props.color || !(0, _lodash.isEqual)(nextProps.peaks, _this.props.peaks);
    };

    _this.clearWave = function (waveCanvasCtx, width, height) {
      waveCanvasCtx.clearRect(0, 0, width, height);
    };

    _this.drawBars = function (waveCanvasCtx, width, peaks) {
      var params = {
        fillParent: true,
        height: _this.props.height,
        normalize: true,
        pixelRatio: _this.props.pixelRatio,
        barWidth: _this.props.barWidth,
        color: _this.props.color,
        gradientColors: _this.props.gradientColors

        // Bar wave draws the bottom only as a reflection of the top,
        // so we don't need negative values
      };var hasMinVals = [].some.call(peaks, function (val) {
        return val < 0;
      });
      if (hasMinVals) {
        // If the first value is negative, add 1 to the filtered indices
        var indexOffset = 0;
        if (peaks[0] < 0) {
          indexOffset = 1;
        }
        peaks = [].filter.call(peaks, function (_, index) {
          return (index + indexOffset) % 2 == 0;
        });
      }

      // A half-pixel offset makes lines crisp
      var $ = 0.5 / params.pixelRatio;
      var height = params.height * params.pixelRatio;
      var offsetY = 0;
      var halfH = params.height / 2; // Don't use height because this is after canvas height has been set
      var length = peaks.length;
      var bar = params.barWidth * params.pixelRatio;
      var gap = Math.max(params.pixelRatio, 2);
      var step = bar + gap;

      var absmax = 1;
      if (params.normalize) {
        absmax = _this.absMax(peaks);
      }

      var scale = length / width;

      if (params.gradientColors) {
        var gradient = waveCanvasCtx.createLinearGradient(0, 0, width, 0);
        params.gradientColors.forEach(function (color) {
          // The first position of each array is the stop position between 0 and 1
          // The second position is the color
          gradient.addColorStop(color[0], color[1]);
        });
        waveCanvasCtx.fillStyle = gradient;
      } else {
        waveCanvasCtx.fillStyle = params.color;
      }

      if (!waveCanvasCtx) {
        return;
      }

      for (var i = 0; i < width; i += step) {
        var h = Math.round(peaks[Math.floor(i * scale)] / absmax * halfH);
        if (h === 0) {
          h = 1;
        }
        waveCanvasCtx.fillRect(i + $, halfH - h + offsetY, bar + $, h * 2);
      }
    };

    _this.drawWaves = function (waveCanvasCtx, width, peaks) {
      var params = {
        fillParent: true,
        height: _this.props.height,
        normalize: true,
        pixelRatio: _this.props.pixelRatio,
        color: _this.props.color,
        gradientColors: _this.props.gradientColors

        // Support arrays without negative peaks
      };var hasMinValues = [].some.call(peaks, function (val) {
        return val < 0;
      });
      if (!hasMinValues) {
        var reflectedPeaks = [];
        for (var i = 0, len = peaks.length; i < len; i++) {
          reflectedPeaks[2 * i] = peaks[i];
          reflectedPeaks[2 * i + 1] = -peaks[i];
        }
        peaks = reflectedPeaks;
      }

      // A half-pixel offset makes lines crisp
      var $ = 0.5 / params.pixelRatio;
      var height = params.height * params.pixelRatio;
      var offsetY = 0;
      var halfH = params.height / 2;
      var length = ~~(peaks.length / 2);

      var scale = 1;
      if (params.fillParent && width != length) {
        scale = width / length;
      }

      var absmax = 1;
      if (params.normalize) {
        var max = _this.max(peaks);
        var min = _this.min(peaks);
        absmax = -min > max ? -min : max;
      }

      if (params.gradientColors) {
        var gradient = waveCanvasCtx.createLinearGradient(0, 0, width, 0);
        params.gradientColors.forEach(function (color) {
          // The first position of each array is the stop position between 0 and 1
          // The second position is the color
          gradient.addColorStop(color[0], color[1]);
        });
        waveCanvasCtx.fillStyle = gradient;
      } else {
        waveCanvasCtx.fillStyle = params.color;
      }

      if (!waveCanvasCtx) {
        return;
      }

      waveCanvasCtx.beginPath();
      waveCanvasCtx.moveTo($, halfH + offsetY);

      for (var i = 0; i < length; i++) {
        var h = Math.round(peaks[2 * i] / absmax * halfH);
        waveCanvasCtx.lineTo(i * scale + $, halfH - h + offsetY);
      }

      // Draw the bottom edge going backwards, to make a single
      // closed hull to fill.
      for (var i = length - 1; i >= 0; i--) {
        var h = Math.round(peaks[2 * i + 1] / absmax * halfH);
        waveCanvasCtx.lineTo(i * scale + $, halfH - h + offsetY);
      }

      // waveCanvasCtx.closePath()
      waveCanvasCtx.fill();

      // Always draw a median line
      waveCanvasCtx.fillRect(0, halfH + offsetY - $, width, $);
    };

    _this.absMax = function (values) {
      var max = -Infinity;
      for (var i in values) {
        var num = Math.abs(values[i]);
        if (num > max) {
          max = num;
        }
      }

      return max;
    };

    _this.max = function (values) {
      var max = -Infinity;
      for (var i in values) {
        if (values[i] > max) {
          max = values[i];
        }
      }

      return max;
    };

    _this.min = function (values) {
      var min = +Infinity;
      for (var i in values) {
        if (values[i] < min) {
          min = values[i];
        }
      }

      return min;
    };

    _this.updateSize = function (width, height, peaks) {
      if (peaks) {
        var waveCanvasCtx = _reactDom2.default.findDOMNode(_this.wave).getContext("2d");

        var displayWidth = Math.round(width / _this.props.pixelRatio);
        var displayHeight = Math.round(height / _this.props.pixelRatio);
        waveCanvasCtx.canvas.width = width;
        waveCanvasCtx.canvas.height = height;
        waveCanvasCtx.canvas.style.width = displayWidth + "px";
        waveCanvasCtx.canvas.style.height = displayHeight + "px";

        _this.clearWave(waveCanvasCtx, width, height);
        if (_this.props.barWidth) {
          _this.drawBars(waveCanvasCtx, width, peaks);
        } else {
          _this.drawWaves(waveCanvasCtx, width, peaks);
        }
      }
    };

    return _this;
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

  _createClass(WaveCanvas, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return this.props.peaks ? _react2.default.createElement("canvas", {
        ref: function ref(instance) {
          _this2.wave = instance;
        }
      }) : null;
    }
  }]);

  return WaveCanvas;
}(_react2.default.Component);

WaveCanvas.defaultProps = {
  color: "ccc",
  width: 0,
  pixelRatio: window.devicePixelRatio || screen.deviceXDPI / screen.logicalXDPI };
exports.default = WaveCanvas;