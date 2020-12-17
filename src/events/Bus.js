import EventEmitter from 'events';

const Bus = new EventEmitter ();
Bus.setMaxListeners(0);
export default Bus;
