import {APIKA_SERVICE_URL, isLocalhost} from "../constants";
import {registerEventListener} from "../events/register-event-listener";
import {ApikaEvent} from "../events/events.types";
import {sendEvent} from "../events/send-event";
import {Config, defaultConfig} from "../constants";

let isLoaded = false;
let isInitialized = false;

let config: Config = {} as Config

let shadowRoot: ShadowRoot | null = null;

// Parse URL parameters to override config
const parseUrlParams = (): Partial<Config> => {
  const urlParams = new URLSearchParams(window.location.search);
  const configOverrides: Record<string, any> = {};
  
  // Convert kebab-case URL params to camelCase config props
  Array.from(urlParams.entries()).forEach(([key, value]) => {
    if (key.startsWith('apika-')) {
      const configKey = key.replace('apika-', '').replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      
      // Convert string values to proper types
      if (value === 'true') configOverrides[configKey] = true;
      else if (value === 'false') configOverrides[configKey] = false;
      else if (!isNaN(Number(value))) configOverrides[configKey] = Number(value);
      else configOverrides[configKey] = value;
    }
  });
  
  return configOverrides as Partial<Config>;
};

// Create and mount the Shadow DOM structure
const createShadowDOM = function() {
  const apikaContainerId = 'apika-container';

  // Skip if already exists
  if (document.getElementById(apikaContainerId)) {
    return document.getElementById(apikaContainerId)?.shadowRoot || null;
  }

  // Create container
  const container = document.createElement('div');
  container.id = apikaContainerId;
  container.style.display = 'block';
  container.style.position = 'fixed';
  container.style.zIndex = '99999';
  container.style.top = '0';
  container.style.left = '0';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);

  // Create shadow root
  shadowRoot = container.attachShadow({ mode: 'open' });
  
  // Add reset styles for Shadow DOM
  const resetStyle = document.createElement('style');
  // resetStyle.textContent = `
  //   :host {
  //     all: initial;
  //     display: block;
  //   }
  //   #root {
  //     font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  //     line-height: 1.5;
  //     -webkit-font-smoothing: antialiased;
  //     -moz-osx-font-smoothing: grayscale;
  //   }
  // `;

  resetStyle.textContent = `
  :host, :root {
    --tw-shadow-color: rgba(0, 0, 0, 0.12);
    --tw-border-style: solid;

    --tw-shadow: 0 1px 3px 0 var(--tw-shadow-color),
                 0 1px 2px -1px var(--tw-shadow-color);
  
    --tw-ring-offset-shadow: 0 0 #0000;
    --tw-ring-shadow: 0 0 #0000;
    --tw-inset-shadow: 0 0 #0000;
    --tw-inset-ring-shadow: 0 0 #0000;
    }
`;

  shadowRoot.appendChild(resetStyle);
  
  // Create root element inside shadow DOM
  const root = document.createElement('div');
  root.id = 'root-apika';
  // root.style.width = '100%';
  // root.style.height = '100%';
  root.style.minHeight = '100vh';
  root.style.minWidth = '100vw';


  shadowRoot.appendChild(root);
  
  return shadowRoot;
};

const loadCustomStyles = function() {
  if (!shadowRoot) return Promise.reject('Shadow DOM not initialized');
  
  return fetch( `${isLocalhost ? "" : APIKA_SERVICE_URL}/apika.css?v=${Date.now()}`)
    .then(response => {
      if (!response.ok) throw new Error('Failed to load custom CSS');
      return response.text();
    })
    .then(css => {
      const styleElement = document.createElement('style');
      styleElement.textContent = css;
      if (shadowRoot) {
        shadowRoot.appendChild(styleElement);
      }
      return true;
    });
};

// Load the main app script
const loadScript = function() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${isLocalhost ? "" : APIKA_SERVICE_URL}/apika.js?v=${Date.now()}`;
    script.onload = () => resolve(true);
    script.onerror = () => reject('Failed to load app script');
    document.head.appendChild(script);
  });
};

const prepareConfig = function(userConfig = {}) {
  const urlParamOverrides = parseUrlParams();
  
  config = {
    ...defaultConfig,
    ...userConfig ?? {},
    ...urlParamOverrides // URL params take highest precedence
  } as Config;
  
  console.log('Config prepared with URL overrides:', config);
};

const apika = {
  open: () => {
    sendEvent(ApikaEvent.APIKA_OPEN, config);
  },
  close: () => {
    sendEvent(ApikaEvent.APIKA_CLOSE);
  },
  init: function(userConfig: Config) {
    if (isInitialized) {
      return;
    }
    isInitialized = true

    console.log('registering...')

    registerEventListener(ApikaEvent.APIKA_READY, () => {
      console.log('event listener callback')
      sendEvent(ApikaEvent.APIKA_INIT, config);
    });
    
    prepareConfig(userConfig);
    
    // Create shadow DOM first
    createShadowDOM();
    
    loadCustomStyles()
      .then(() => loadScript())
      .then(() => {
        console.log('is loaded yes')
        isLoaded = true;

      })
      .catch(error => {
        console.error('Failed to initialize Apika', error);
      });
  }
};
// @ts-ignore
window.apika = apika;