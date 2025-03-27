import { ApikaEvent } from "./events.types";

export const sendEvent = (event: ApikaEvent, data: any = {}) => {
  const customEvent = new CustomEvent(event, {
    detail: data,
  });
  window.dispatchEvent(customEvent);
};
