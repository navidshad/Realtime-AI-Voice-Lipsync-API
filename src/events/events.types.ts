export enum ApikaEvent {
  // Event dispatched when the Apika script is loaded and ready
  APIKA_READY = 'APIKA_READY',

  // Event dispatched when the Apika assistant is initialized from parent
  APIKA_INIT = 'APIKA_INIT',

  //This is client-facing first event that they can use to subscribe for apika initialization
  APIKA_INIT_LOADED = 'APIKA',

  APIKA_OPEN = 'APIKA_OPEN',
  APIKA_CLOSE = 'APIKA_CLOSE',
}