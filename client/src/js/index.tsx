import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Admin from './admin';
import Client from './client';


window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'none';
  }

  let app: JSX.Element;
  if (document.location.pathname === '/admin') {
    app = <Admin />;
  } else {
    app = <Client />;
  }
  const root = document.getElementById('root');
  ReactDOM.render(app, root);
});
