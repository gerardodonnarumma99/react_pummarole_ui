export default class EventBus  {
    constructor () {
      this.bus = document.createElement('fakeelement');
    }
  
    addEventListener (event, callback) {
      this.bus.addEventListener(event, callback);
    }
  
    removeEventListener (event, callback) {
      this.bus.removeEventListener(event, callback);
    }
  
    dispatchEvent (event, detail = {}) {
      this.bus.dispatchEvent(new CustomEvent(event, { detail }));
    }
}