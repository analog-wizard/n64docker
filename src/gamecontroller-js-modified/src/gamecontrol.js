import { log, error, isGamepadSupported } from './tools.js';
import { MESSAGES } from './constants.js';
import gamepad from './gamepad.js';

export class gameControl {
  gamepads = {}
  axeThreshold = [1.0] // this is an array so it can be expanded without breaking in the future
  isReady = isGamepadSupported()
  onConnect() {}
  onDisconnect() {}
  onBeforeCycle() {}
  onAfterCycle() {}

  constructor() {
    window.addEventListener('gamepadconnected', e => {
      const egp = e.gamepad || e.detail.gamepad;
      log(MESSAGES.ON);
      if (!window.gamepads) window.gamepads = {};
      if (egp) {
        if (!window.gamepads[egp.index]) {
          window.gamepads[egp.index] = egp;
          const gp = new gamepad(egp);
          gp.set('axeThreshold', this.axeThreshold);
          this.gamepads[gp.id] = gp;
          this.onConnect(this.gamepads[gp.id]);
        }
      }
    });
    window.addEventListener('gamepaddisconnected', e => {
      const egp = e.gamepad || e.detail.gamepad;
      log(MESSAGES.OFF);
      if (egp) {
        delete window.gamepads[egp.index];
        delete this.gamepads[egp.index];
        this.onDisconnect(egp.index);
      }
    });
  }

  getGamepads() {
    return this.gamepads;
  }
  getGamepads(id) {
    if (this.gamepads[id]) {
      return this.gamepads[id];
    }
    return null;
  }

  set(property, value) {
    const properties = ['axeThreshold'];
    if (properties.indexOf(property) >= 0) {
      if (property === 'axeThreshold' && (!parseFloat(value) || value < 0.0 || value > 1.0)) {
        error(MESSAGES.INVALID_VALUE_NUMBER);
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
      error(MESSAGES.INVALID_PROPERTY);
    }
  }

  on(eventName, callback) {
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
        error(MESSAGES.UNKNOWN_EVENT);
        break;
    }
    return this;
  }

  off(eventName) {
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
        error(MESSAGES.UNKNOWN_EVENT);
        break;
    }
    return this;
  }
};

export default gameControl;
