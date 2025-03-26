import {APIKA_SERVICE_URL, isLocalhost} from "../constants";

export type Config = {
  autoShow: boolean;
}

let isLoaded = false;
let config: Config = {
  autoShow: true,
};

let shadowRoot: ShadowRoot | null = null;
let appLoaded = false;

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
  config = {
    ...config,
    ...userConfig ?? {}
  } as Config;
};

const apika = {
  open: (config: Config) => {},
  init: function(userConfig: Config) {
    if (isLoaded) {
      return;
    }
    
    prepareConfig(userConfig);
    
    // Create shadow DOM first
    createShadowDOM();
    
    loadCustomStyles()
      .then(() => loadScript())
      .then(() => {
        isLoaded = true;
        if (config.autoShow) {
          this.show();
        }
      })
      .catch(error => {
        console.error('Failed to initialize Apika', error);
      });
  },
  
  show: function() {
    if (shadowRoot?.host instanceof HTMLElement) {
      console.log('showing');
      apika.open(config)
      shadowRoot.host.style.display = 'block';
    }
  },
  
  hide: function() {
    if (shadowRoot?.host instanceof HTMLElement) {
      shadowRoot.host.style.display = 'none';
    }
  }
};
// @ts-ignore
window.apika = apika;