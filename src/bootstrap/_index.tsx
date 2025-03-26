import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../App';
import '../styles.css';

// Wait for DOM to be ready
const initApp = () => {
  // Find our container element
  const containerElement = document.getElementById('apika-container');
  if (!containerElement) {
    console.error('Failed to find apika-container element');
    return;
  }

  // Get the shadow root
  const shadowRoot = containerElement.shadowRoot;
  if (!shadowRoot) {
    console.error('No shadow root found');
    return;
  }

  // Find the root element within shadow DOM
  const root = shadowRoot.getElementById('root-apika');
  if (!root) {
    console.error('Failed to find root element in shadow DOM');
    return;
  }

  try {
    // Create React root
    const reactRoot = createRoot(root);
    
    // Render the app - wrap in Tailwind wrapper div
    reactRoot.render(
      <React.StrictMode>
        <div className="text-base font-sans antialiased h-full w-full">
          <App />
        </div>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render app:', error);
  }
};

// Initialize immediately
initApp(); 