export enum ApikaEvent {
  // Event dispatched when the Apika script is loaded and ready
  APIKA_READY = 'APIKA_READY',

  // Event dispatched when the Apika assistant is initialized from parent
  APIKA_INIT = 'APIKA_INIT',

  APIKA_OPEN = 'APIKA_OPEN',
  APIKA_CLOSE = 'APIKA_CLOSE',
}