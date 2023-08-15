import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';


console.log('estramos en el index')
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <App />
 
); 




serviceWorker.unregister();
/* reportWebVitals(); */
