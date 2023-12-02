export default class audio_player {
    constructor(id, src) {
        this.element_id = id;
        this.element_source = src;
    }

    create() {
        document.getElementById(this.element_id).innerHTML = "<audio src="+this.element_source+"></audio>";
        return true;
    }

    delete_element() {
        document.getElementById(this.element_id).innerHTML = "";
        return true;
    }

    mute() {
        return delete_element();
    }

    unmute() {
        return create();
    }
}