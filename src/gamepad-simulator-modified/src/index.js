export default class virtualController {
  constructor(cont_type) {
    this.cont_type = cont_type;
    this.fakeController = {
      connected: false,
      id: "Standard gamepad by Alvaro Montoro",
      index: 0,
      mapping: "standard",
    };
    this.connected = false;
  }

  controllerTypes() {
    return ["n64"];
  }

  getGamepads() {
    return this.gamepad_list;
  }

  async create() {
    let response = await fetch('gamepad-simulator-modified/'+ this.cont_type +'controller.svg', {method: "GET"})

    document.querySelector("body").insertAdjacentHTML(
      "beforeend",
      await response.text()
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
  }

  destroy() {
    if (this.connected) {
      this.disconnect();
    }
    document.querySelector("#amdfc-controller").remove();
  }

  connect() {
    const event = new Event("gamepadconnected");
    this.connected = true;
    event.gamepad = this.fakeController;
    console.log(this.fakeController);
    window.dispatchEvent(event);
    //document.querySelector("#amdfc-controller").classList.add("connected");
    //++fakeController.index;
  }

  disconnect() {
    const event = new Event("gamepaddisconnected");
    this.connected = false;
    event.gamepad = this.fakeController;
    window.dispatchEvent(event);
    //document.querySelector("#amdfc-controller").classList.remove("connected");
    //--fakeController.index;
  }
}