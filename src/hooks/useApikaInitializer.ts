import {useEffect, useRef} from "react";
import {Config} from "../constants";
import {registerEventListener} from "../events/register-event-listener";
import {ApikaEvent} from "../events/events.types";
import {sendEvent} from "../events/send-event";
import {useAtom} from "jotai"
import {configurationAtom} from "../store/atoms";

export const useApikaInitializer = (setIsAssistantOpen: (isOpen: boolean) => void) => {
  const apikaInitialized = useRef(false);
  const [atomConfig,setConfig] =  useAtom(configurationAtom);
  const {autoShow, devMode} = atomConfig;

  //Expose the open function to the global apika object
  const open = (config: Config) => {
    console.log("Opening APIKA with config:", config);
    setIsAssistantOpen(true);
  };

  const close = () => {
    setIsAssistantOpen(false);
  };

  const onInit = (config: Config) => {
    console.log("APIKA initialized with config:", config);
    //config.autoShow && open(config);
    setConfig(config)
  }

  // Connect to the global apika object
  useEffect(() => {
    if (!apikaInitialized.current) {
      // Dispatch event with the setter function
      registerEventListener(ApikaEvent.APIKA_OPEN, open)
      registerEventListener(ApikaEvent.APIKA_CLOSE, close)
      registerEventListener(ApikaEvent.APIKA_INIT, onInit)
      console.log('Sending event apika ready')
      sendEvent(ApikaEvent.APIKA_READY);
      apikaInitialized.current = true;
    }
  }, []);

  useEffect(() => {

    autoShow ? open(atomConfig) : close();

  }, [autoShow]);
}