import React from 'react';
import { render } from 'react-dom';
import { AuthProvider } from '@asgardeo/auth-react';

// scroll bar
import 'simplebar/src/simplebar.css';

// import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './App';

// ----------------------------------------------------------------------

const Index = () => (
  // <AuthProvider
  //   config={{
  //     signInRedirectURL: 'http://localhost:5000',
  //     signOutRedirectURL: 'http://localhost:5000',
  //     clientID: '',
  //     serverOrigin: '',
  //     scope: ['openid', 'profile']
  //   }}
  // >
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
  // </AuthProvider>
);

render(<Index />, document.getElementById('root'));
