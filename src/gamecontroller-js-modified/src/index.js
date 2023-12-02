// This file is the entry point
import { error, isGamepadSupported } from './tools.js';
import { MESSAGES } from './constants.js';
import gameControl from './gamecontrol.js';

if (isGamepadSupported()) {
  window.gameControl = new gameControl();
} else {
  error(MESSAGES.NO_SUPPORT);
}
