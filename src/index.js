// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// src/index.js
import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
