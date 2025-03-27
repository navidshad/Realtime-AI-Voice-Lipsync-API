import { ApikaEvent } from "./events.types";

export const registerEventListener = (event: ApikaEvent, callback: (data: any) => void) => {
  const eventHandler = (e: CustomEvent) => callback(e.detail);
  window.addEventListener(event, eventHandler as EventListener);
  return eventHandler; // Return handler for potential cleanup
};

export const unregisterEventListener = (event: ApikaEvent, eventHandler: EventListener) => {
  window.removeEventListener(event, eventHandler);
};
