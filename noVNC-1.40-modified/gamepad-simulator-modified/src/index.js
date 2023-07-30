export const gamepadSimulator = {
    getGamepads: null,
    fakeController: {
      connected: false,
      id: "Standard gamepad by Alvaro Montoro",
      index: 0,
      mapping: "standard",
    },
    create: function () {
      document.querySelector("body").insertAdjacentHTML(
        "beforeend",
        `<svg viewBox="0 0 600 300" id="amdfc-controller" width="350px" style="position: absolute; z-index: 999999;" class="connected">
          <style>
            .amdfc-int:hover {
              fill: #bbb;
            }
            .amdfc-int.amdfc-active {
              fill: fuchsia;
            }
          </style>
          <g fill="#ddd" stroke="#222" stroke-width="3">
            <g id="control-group-bumper">
              <rect x="150" y="10" width="100" height="100" rx="5" ry="5" class="amdfc-int" id="control-l"></rect>
              <rect x="350" y="10" width="100" height="100" rx="5" ry="5" class="amdfc-int" id="control-r"></rect>
            </g>
  
            <path d="M135,50 C 45,50 20,180 20,240 20,300 80,330 175,220 175,220 
            425,220 425,220 520,330 580,300 580,240 580,180 555,50 465,50 Z"></path>
  
            <g id="control-group-c">
              <circle cx="480" cy="160" r="15" class="amdfc-int" id="control-c-down"></circle>
              <circle cx="510" cy="130" r="15" class="amdfc-int" id="control-c-right"></circle>
              <circle cx="450" cy="130" r="15" class="amdfc-int" id="control-c-left"></circle>
              <circle cx="480" cy="100" r="15" class="amdfc-int" id="control-c-up"></circle>
            </g>
  
            <circle cx="420" cy="160" r="15" class="amdfc-int" id="control-b"></circle>
            <circle cx="450" cy="190" r="15" class="amdfc-int" id="control-a"></circle>
  
            <rect x="105" y="85" width="30" height="90" fill="#aaa" stroke="#aaa"></rect>
            <rect x="75" y="115" width="90" height="30" fill="#aaa" stroke="#aaa"></rect>
            
            <rect x="275" y="10" width="50" height="18" rx="9" ry="9" class="amdfc-int" id="control-start"></rect>
            
            <g id="control-group-d-pad">
              <circle cx="120" cy="160" r="15" class="amdfc-int" id="control-d-d"></circle>
              <circle cx="90" cy="130" r="15" class="amdfc-int" id="control-d-left"></circle>
              <circle cx="150" cy="130" r="15" class="amdfc-int" id="control-d-r"></circle>
              <circle cx="120" cy="100" r="15" class="amdfc-int" id="control-d-u"></circle>
            </g>
  
            <circle cx="300" cy="90" r="20" class="amdfc-int" id="control-z"></circle>
          </g>
          <g dominant-baseline="middle" text-anchor="middle" fill="#222" font-size="16" font-family="Arial,sans-serif" style="user-select: none; pointer-events: none;">
            
            <text x="480" y="130">C</text>
  
            <text x="450" y="191">A</text>
            <text x="420" y="161">B</text>
            
            <text x="225" y="30">L</text>
            <text x="375" y="30">R</text>
  
            <text x="120" y="100">U</text>
            <text x="120" y="160">D</text>
            <text x="90" y="130">L</text>
            <text x="150" y="130">R</text>
  
            <text x="300" y="91">Z</text>
            <text x="300" y="40" font-size="10">START</text>
          </g>
        </svg>`
      );
  
      Array.from(document.querySelectorAll(".amdfc-int")).forEach(function (element) {
        element.addEventListener("pointerenter", function (e) {
          if (element.id.indexOf("control-") === 0) {
            dispatchEvent(new Event("control-event"));
            dispatchEvent(new Event("control-enter"));
            dispatchEvent(new Event(element.id.replace("control-", "") + "-enter"));
            if(element.parentNode.id.indexOf("control-group-") === 0) {
              dispatchEvent(new Event(element.parentNode.id.replace("control-", "") + "-enter"));
            }
          }
        });
  
        //Converted from mouse input to pointer input to allow for touch events on mobile
        element.addEventListener("pointerleave", function (e) {
          element.setAttribute("class", "amdfc-int");
          if (element.id.indexOf("control-") === 0) {
            dispatchEvent(new Event("control-event"));
            dispatchEvent(new Event("control-leave"));
            dispatchEvent(new Event(element.id.replace("control-", "") + "-leave"));
            if(element.parentNode.id.indexOf("control-group-") === 0) {
              dispatchEvent(new Event(element.parentNode.id.replace("control-", "") + "-leave"));
            }
          }
        });
  
        element.addEventListener("pointerdown", function (e) {
          element.setAttribute("class", "amdfc-int amdfc-active");
          if (element.id.indexOf("control-") === 0) {
            dispatchEvent(new Event("control-event"));
            dispatchEvent(new Event("control-down"));
            dispatchEvent(new Event(element.id.replace("control-", "") + "-down"));
            if(element.parentNode.id.indexOf("control-group-") === 0) {
              dispatchEvent(new Event(element.parentNode.id.replace("control-", "") + "-down"));
            }
          }
        });
  
        element.addEventListener("pointerup", function (e) {
          element.setAttribute("class", "amdfc-int");
          if (element.id.indexOf("control-") === 0) {
            dispatchEvent(new Event("control-event"));
            dispatchEvent(new Event("control-up"));
            dispatchEvent(new Event(element.id.replace("control-", "") + "-up"));
            if(element.parentNode.id.indexOf("control-group-") === 0) {
              dispatchEvent(new Event(element.parentNode.id.replace("control-", "") + "-up"));
            }
          }
        });
      });
      gamepadSimulator.getGamepads = navigator.getGamepads;
      navigator.getGamepads = function () {
          return {
            0: gamepadSimulator.fakeController,
        };
      };
    },
    destroy: function () {
        if (gamepadSimulator.fakeController.connected) {
          gamepadSimulator.disconnect();
      }
      navigator.getGamepads = gamepadSimulator.getGamepads;
      document.querySelector("#amdfc-controller").remove();
    },
    connect: function () {
      const event = new Event("gamepadconnected");
      gamepadSimulator.fakeController.connected = true;
      event.gamepad = gamepadSimulator.fakeController;
      window.dispatchEvent(event);
      document.querySelector("#amdfc-controller").classList.add("connected");
    },
    disconnect: function () {
      const event = new Event("gamepaddisconnected");
      gamepadSimulator.fakeController.connected = false;
      event.gamepad = gamepadSimulator.fakeController;
      window.dispatchEvent(event);
      document.querySelector("#amdfc-controller").classList.remove("connected");
    },
  };
  window.gamepadSimulator = gamepadSimulator;

export default gamepadSimulator;
