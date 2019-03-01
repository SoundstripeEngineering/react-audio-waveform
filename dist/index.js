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

var _WaveCanvas = require("./WaveCanvas");

var _WaveCanvas2 = _interopRequireDefault(_WaveCanvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Waveform = function (_React$Component) {
  _inherits(Waveform, _React$Component);

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

  function Waveform(props) {
    _classCallCheck(this, Waveform);

    var _this = _possibleConstructorReturn(this, (Waveform.__proto__ || Object.getPrototypeOf(Waveform)).call(this, props));

    _this.componentDidMount = function () {
      _this.resize();
      window.addEventListener("resize", _this.resize);
    };

    _this.shouldComponentUpdate = function (nextProps, nextState) {
      var stateChanged = !(0, _lodash.isEqual)(_this.state, nextState);
      var peaksChanged = !(0, _lodash.isEqual)(_this.props.peaks, nextProps.peaks);
      var posChanged = _this.props.pos !== nextProps.pos;
      var durationChanged = _this.props.duration !== nextProps.duration;
      var colorChanged = _this.props.color !== nextProps.color;
      var gradientChanged = !(0, _lodash.isEqual)(_this.props.gradientColors, nextProps.gradientColors);
      var progressColorChanged = _this.props.progressColor !== nextProps.progressColor;
      var progressGradientChanged = !(0, _lodash.isEqual)(_this.props.progressGradientColors, nextProps.progressGradientColors);
      return stateChanged || peaksChanged || posChanged || durationChanged || colorChanged || gradientChanged || progressColorChanged || progressGradientChanged;
    };

    _this.componentWillUnmount = function () {
      window.removeEventListener("resize", _this.resize);
    };

    _this.handleClick = function (e) {
      var percentageOffsetX = e.nativeEvent.offsetX / _this.state.width;
      _this.props.onClick(Math.round(percentageOffsetX * _this.props.duration));
    };

    _this.max = function (values) {
      var max = -Infinity;
      values.forEach(function (i) {
        if (values[i] > max) {
          max = values[i];
        }
      });

      return max;
    };

    _this.min = function (values) {
      var min = +Infinity;
      values.forEach(function (i) {
        if (values[i] < min) {
          min = values[i];
        }
      });

      return min;
    };

    _this.resize = function () {
      var containerWidth = _reactDom2.default.findDOMNode(_this.wrapper).clientWidth;
      _this.setState({
        width: containerWidth,
        waveWidth: containerWidth * _this.props.pixelRatio,
        waveHeight: _this.props.height * _this.props.pixelRatio
      });
    };

    _this.progressWaveStyle = function () {
      return {
        position: "absolute",
        zIndex: 2,
        left: 0,
        top: 0,
        bottom: 0,
        overflow: "hidden",
        height: _this.props.height + "px",
        width: _this.progressWidth() + "px",
        display: "block",
        transition: "width " + _this.props.transitionDuration + "ms ease-in-out",
        boxSizing: "border-box"
      };
    };

    _this.progressWidth = function () {
      var percentageComplete = _this.props.pos / _this.props.duration;
      return _this.state.width * percentageComplete;
    };

    _this.state = {
      width: 0,
      waveWidth: 0,
      waveHeight: props.height
    };
    return _this;
  }

  _createClass(Waveform, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        "div",
        {
          ref: function ref(instance) {
            _this2.wrapper = instance;
          },
          onClick: this.handleClick,
          style: {
            position: "relative",
            width: "100%",
            height: "100%",
            cursor: "pointer"
          }
        },
        _react2.default.createElement(_WaveCanvas2.default, {
          color: this.props.color,
          barWidth: this.props.barWidth,
          gradientColors: this.props.gradientColors,
          peaks: this.props.peaks,
          width: this.state.waveWidth,
          height: this.state.waveHeight
        }),
        _react2.default.createElement(
          "div",
          {
            style: this.progressWaveStyle()
          },
          _react2.default.createElement(_WaveCanvas2.default, {
            ref: function ref(instance) {
              _this2.progress = instance;
            },
            className: "progress",
            barWidth: this.props.barWidth,
            color: this.props.progressColor,
            gradientColors: this.props.progressGradientColors,
            peaks: this.props.peaks,
            width: this.state.waveWidth,
            height: this.state.waveHeight
          })
        )
      );
    }
  }]);

  return Waveform;
}(_react2.default.Component);

Waveform.defaultProps = {
  height: 30,
  onClick: function onClick() {},
  pixelRatio: window.devicePixelRatio || screen.deviceXDPI / screen.logicalXDPI,
  progressColor: "#555555",
  transitionDuration: 200 };
exports.default = Waveform;