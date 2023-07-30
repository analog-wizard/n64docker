/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MESSAGES": () => (/* binding */ MESSAGES)
/* harmony export */ });
const MESSAGES = {
  ON: 'Gamepad detected.',
  OFF: 'Gamepad disconnected.',
  INVALID_PROPERTY: 'Invalid property.',
  INVALID_VALUE_NUMBER: 'Invalid value. It must be a number between 0.00 and 1.00.',
  INVALID_BUTTON: 'Button does not exist.',
  UNKNOWN_EVENT: 'Unknown event name.',
  NO_SUPPORT: 'Your web browser does not support the Gamepad API.'
};




//# sourceURL=webpack://gamecontroller.js/./src/constants.js?");

/***/ }),

/***/ "./src/gamecontrol.js":
/*!****************************!*\
  !*** ./src/gamecontrol.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tools */ "./src/tools.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
/* harmony import */ var _gamepad__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gamepad */ "./src/gamepad.js");




const gameControl = {
  gamepads: {},
  axeThreshold: [1.0], // this is an array so it can be expanded without breaking in the future
  isReady: (0,_tools__WEBPACK_IMPORTED_MODULE_0__.isGamepadSupported)(),
  onConnect: function() {},
  onDisconnect: function() {},
  onBeforeCycle: function() {},
  onAfterCycle: function() {},
  getGamepads: function() {
    return this.gamepads;
  },
  getGamepad: function(id) {
    if (this.gamepads[id]) {
      return this.gamepads[id];
    }
    return null;
  },
  set: function(property, value) {
    const properties = ['axeThreshold'];
    if (properties.indexOf(property) >= 0) {
      if (property === 'axeThreshold' && (!parseFloat(value) || value < 0.0 || value > 1.0)) {
        (0,_tools__WEBPACK_IMPORTED_MODULE_0__.error)(_constants__WEBPACK_IMPORTED_MODULE_1__.MESSAGES.INVALID_VALUE_NUMBER);
        return;
      }

      this[property] = value;

      if (property === 'axeThreshold') {
        const gps = this.getGamepads();
        const ids = Object.keys(gps);
        for (let x = 0; x < ids.length; x++) {
          gps[ids[x]].set('axeThreshold', this.axeThreshold);
        }
      }
    } else {
      (0,_tools__WEBPACK_IMPORTED_MODULE_0__.error)(_constants__WEBPACK_IMPORTED_MODULE_1__.MESSAGES.INVALID_PROPERTY);
    }
  },
  checkStatus: function() {
    const requestAnimationFrame =
      window.requestAnimationFrame || window.webkitRequestAnimationFrame;
    const gamepadIds = Object.keys(gameControl.gamepads);

    gameControl.onBeforeCycle();

    for (let x = 0; x < gamepadIds.length; x++) {
      gameControl.gamepads[gamepadIds[x]].checkStatus();
    }

    gameControl.onAfterCycle();

    if (gamepadIds.length > 0) {
      requestAnimationFrame(gameControl.checkStatus);
    }
  },
  init: function() {
    window.addEventListener('gamepadconnected', e => {
      const egp = e.gamepad || e.detail.gamepad;
      (0,_tools__WEBPACK_IMPORTED_MODULE_0__.log)(_constants__WEBPACK_IMPORTED_MODULE_1__.MESSAGES.ON);
      if (!window.gamepads) window.gamepads = {};
      if (egp) {
        if (!window.gamepads[egp.index]) {
          window.gamepads[egp.index] = egp;
          const gp = _gamepad__WEBPACK_IMPORTED_MODULE_2__.default.init(egp);
          gp.set('axeThreshold', this.axeThreshold);
          this.gamepads[gp.id] = gp;
          this.onConnect(this.gamepads[gp.id]);
        }
        if (Object.keys(this.gamepads).length === 1) this.checkStatus();
      }
    });
    window.addEventListener('gamepaddisconnected', e => {
      const egp = e.gamepad || e.detail.gamepad;
      (0,_tools__WEBPACK_IMPORTED_MODULE_0__.log)(_constants__WEBPACK_IMPORTED_MODULE_1__.MESSAGES.OFF);
      if (egp) {
        delete window.gamepads[egp.index];
        delete this.gamepads[egp.index];
        this.onDisconnect(egp.index);
      }
    });
  },
  on: function(eventName, callback) {
    switch (eventName) {
      case 'connect':
        this.onConnect = callback;
        break;
      case 'disconnect':
        this.onDisconnect = callback;
        break;
      case 'beforeCycle':
      case 'beforecycle':
        this.onBeforeCycle = callback;
        break;
      case 'afterCycle':
      case 'aftercycle':
        this.onAfterCycle = callback;
        break;
      default:
        (0,_tools__WEBPACK_IMPORTED_MODULE_0__.error)(_constants__WEBPACK_IMPORTED_MODULE_1__.MESSAGES.UNKNOWN_EVENT);
        break;
    }
    return this;
  },
  off: function(eventName) {
    switch (eventName) {
      case 'connect':
        this.onConnect = function() {};
        break;
      case 'disconnect':
        this.onDisconnect = function() {};
        break;
      case 'beforeCycle':
      case 'beforecycle':
        this.onBeforeCycle = function() {};
        break;
      case 'afterCycle':
      case 'aftercycle':
        this.onAfterCycle = function() {};
        break;
      default:
        (0,_tools__WEBPACK_IMPORTED_MODULE_0__.error)(_constants__WEBPACK_IMPORTED_MODULE_1__.MESSAGES.UNKNOWN_EVENT);
        break;
    }
    return this;
  }
};

gameControl.init();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gameControl);


//# sourceURL=webpack://gamecontroller.js/./src/gamecontrol.js?");

/***/ }),

/***/ "./src/gamepad.js":
/*!************************!*\
  !*** ./src/gamepad.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tools */ "./src/tools.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./src/constants.js");



const gamepad = {
  init: function(gpad) {
    let gamepadPrototype = {
      id: gpad.index,
      buttons: gpad.buttons.length,
      axes: Math.floor(gpad.axes.length / 2),
      axeValues: [],
      axeThreshold: [1.0],
      hapticActuator: null,
      vibrationMode: -1,
      vibration: false,
      mapping: gpad.mapping,
      buttonActions: {},
      axesActions: {},
      pressed: {},
      set: function(property, value) {
        const properties = ['axeThreshold'];
        if (properties.indexOf(property) >= 0) {
          if (property === 'axeThreshold' && (!parseFloat(value) || value < 0.0 || value > 1.0)) {
            (0,_tools__WEBPACK_IMPORTED_MODULE_0__.error)(_constants__WEBPACK_IMPORTED_MODULE_1__.MESSAGES.INVALID_VALUE_NUMBER);
            return;
          }
          this[property] = value;
        } else {
          (0,_tools__WEBPACK_IMPORTED_MODULE_0__.error)(_constants__WEBPACK_IMPORTED_MODULE_1__.MESSAGES.INVALID_PROPERTY);
        }
      },
      vibrate: function(value = 0.75, duration = 500) {
        if (this.hapticActuator) {
          switch (this.vibrationMode) {
            case 0:
              return this.hapticActuator.pulse(value, duration);
            case 1:
              return this.hapticActuator.playEffect('dual-rumble', {
                duration: duration,
                strongMagnitude: value,
                weakMagnitude: value
              });
          }
        }
      },
      triggerDirectionalAction: function(id, axe, condition, x, index) {
        if (condition && x % 2 === index) {
          if (!this.pressed[`${id}${axe}`]) {
            this.pressed[`${id}${axe}`] = true;
            this.axesActions[axe][id].before();
          }
          this.axesActions[axe][id].action();
        } else if (this.pressed[`${id}${axe}`] && x % 2 === index) {
          delete this.pressed[`${id}${axe}`];
          this.axesActions[axe][id].after();
        }
      },
      checkStatus: function() {
        let gp = {};
        const gps = navigator.getGamepads
          ? navigator.getGamepads()
          : navigator.webkitGetGamepads
          ? navigator.webkitGetGamepads()
          : [];

        if (gps.length) {
          gp = gps[this.id];
          if (gp.buttons) {
            for (let x = 0; x < this.buttons; x++) {
              if (gp.buttons[x].pressed === true) {
                if (!this.pressed[`button${x}`]) {
                  this.pressed[`button${x}`] = true;
                  this.buttonActions[x].before();
                }
                this.buttonActions[x].action();
              } else if (this.pressed[`button${x}`]) {
                delete this.pressed[`button${x}`];
                this.buttonActions[x].after();
              }
            }
          }
          if (gp.axes) {
            const modifier = gp.axes.length % 2; // Firefox hack: detects one additional axe
            for (let x = 0; x < this.axes * 2; x++) {
              const val = gp.axes[x + modifier].toFixed(4);
              const axe = Math.floor(x / 2);
              this.axeValues[axe][x % 2] = val;

              this.triggerDirectionalAction('right', axe, val >= this.axeThreshold[0], x, 0);
              this.triggerDirectionalAction('left', axe, val <= -this.axeThreshold[0], x, 0);
              this.triggerDirectionalAction('down', axe, val >= this.axeThreshold[0], x, 1);
              this.triggerDirectionalAction('up', axe, val <= -this.axeThreshold[0], x, 1);
            }
          }
        }
      },
      associateEvent: function(eventName, callback, type) {
        if (eventName.match(/^button\\d+$/)) {
          const buttonId = parseInt(eventName.match(/^button(\\d+)$/)[1]);
          if (buttonId >= 0 && buttonId < this.buttons) {
            this.buttonActions[buttonId][type] = callback;
          } else {
            (0,_tools__WEBPACK_IMPORTED_MODULE_0__.error)(_constants__WEBPACK_IMPORTED_MODULE_1__.MESSAGES.INVALID_BUTTON);
          }
        } else if (eventName === 'start') {
          this.buttonActions[9][type] = callback;
        } else if (eventName === 'select') {
          this.buttonActions[8][type] = callback;
        } else if (eventName === 'r1') {
          this.buttonActions[5][type] = callback;
        } else if (eventName === 'r2') {
          this.buttonActions[7][type] = callback;
        } else if (eventName === 'l1') {
          this.buttonActions[4][type] = callback;
        } else if (eventName === 'l2') {
          this.buttonActions[6][type] = callback;
        } else if (eventName === 'power') {
          if (this.buttons >= 17) {
            this.buttonActions[16][type] = callback;
          } else {
            (0,_tools__WEBPACK_IMPORTED_MODULE_0__.error)(_constants__WEBPACK_IMPORTED_MODULE_1__.MESSAGES.INVALID_BUTTON);
          }
        } else if (eventName.match(/^(up|down|left|right)(\\d+)$/)) {
          const matches = eventName.match(/^(up|down|left|right)(\\d+)$/);
          const direction = matches[1];
          const axe = parseInt(matches[2]);
          if (axe >= 0 && axe < this.axes) {
            this.axesActions[axe][direction][type] = callback;
          } else {
            (0,_tools__WEBPACK_IMPORTED_MODULE_0__.error)(_constants__WEBPACK_IMPORTED_MODULE_1__.MESSAGES.INVALID_BUTTON);
          }
        } else if (eventName.match(/^(up|down|left|right)$/)) {
          const direction = eventName.match(/^(up|down|left|right)$/)[1];
          this.axesActions[0][direction][type] = callback;
        }
        return this;
      },
      on: function(eventName, callback) {
        return this.associateEvent(eventName, callback, 'action');
      },
      off: function(eventName) {
        return this.associateEvent(eventName, function() {}, 'action');
      },
      after: function(eventName, callback) {
        return this.associateEvent(eventName, callback, 'after');
      },
      before: function(eventName, callback) {
        return this.associateEvent(eventName, callback, 'before');
      }
    };

    for (let x = 0; x < gamepadPrototype.buttons; x++) {
      gamepadPrototype.buttonActions[x] = (0,_tools__WEBPACK_IMPORTED_MODULE_0__.emptyEvents)();
    }
    for (let x = 0; x < gamepadPrototype.axes; x++) {
      gamepadPrototype.axesActions[x] = {
        down: (0,_tools__WEBPACK_IMPORTED_MODULE_0__.emptyEvents)(),
        left: (0,_tools__WEBPACK_IMPORTED_MODULE_0__.emptyEvents)(),
        right: (0,_tools__WEBPACK_IMPORTED_MODULE_0__.emptyEvents)(),
        up: (0,_tools__WEBPACK_IMPORTED_MODULE_0__.emptyEvents)()
      };
      gamepadPrototype.axeValues[x] = [0, 0];
    }

    // check if vibration actuator exists
    if (gpad.hapticActuators) {
      // newer standard
      if (typeof gpad.hapticActuators.pulse === 'function') {
        gamepadPrototype.hapticActuator = gpad.hapticActuators;
        gamepadPrototype.vibrationMode = 0;
        gamepadPrototype.vibration = true;
      } else if (gpad.hapticActuators[0] && typeof gpad.hapticActuators[0].pulse === 'function') {
        gamepadPrototype.hapticActuator = gpad.hapticActuators[0];
        gamepadPrototype.vibrationMode = 0;
        gamepadPrototype.vibration = true;
      }
    } else if (gpad.vibrationActuator) {
      // old chrome stuff
      if (typeof gpad.vibrationActuator.playEffect === 'function') {
        gamepadPrototype.hapticActuator = gpad.vibrationActuator;
        gamepadPrototype.vibrationMode = 1;
        gamepadPrototype.vibration = true;
      }
    }

    return gamepadPrototype;
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gamepad);


//# sourceURL=webpack://gamecontroller.js/./src/gamepad.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tools */ "./src/tools.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
/* harmony import */ var _gamecontrol__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gamecontrol */ "./src/gamecontrol.js");
// This file is the entry point




if ((0,_tools__WEBPACK_IMPORTED_MODULE_0__.isGamepadSupported)()) {
  window.gameControl = _gamecontrol__WEBPACK_IMPORTED_MODULE_2__.default;
} else {
  (0,_tools__WEBPACK_IMPORTED_MODULE_0__.error)(_constants__WEBPACK_IMPORTED_MODULE_1__.MESSAGES.NO_SUPPORT);
}


//# sourceURL=webpack://gamecontroller.js/./src/index.js?");

/***/ }),

/***/ "./src/tools.js":
/*!**********************!*\
  !*** ./src/tools.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isGamepadSupported": () => (/* binding */ isGamepadSupported),
/* harmony export */   "log": () => (/* binding */ log),
/* harmony export */   "error": () => (/* binding */ error),
/* harmony export */   "emptyEvents": () => (/* binding */ emptyEvents)
/* harmony export */ });
const log = (message, type = 'log') => {
  if (type === 'error') {
    if (console && typeof console.error === 'function') console.error(message);
  } else {
    if (console && typeof console.info === 'function') console.info(message);
  }
};

const error = message => log(message, 'error');

const isGamepadSupported = () =>
  (navigator.getGamepads && typeof navigator.getGamepads === 'function') ||
  (navigator.getGamepads && typeof navigator.webkitGetGamepads === 'function') ||
  false;

const emptyEvents = () => ({ action: () => {}, after: () => {}, before: () => {} });




//# sourceURL=webpack://gamecontroller.js/./src/tools.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;