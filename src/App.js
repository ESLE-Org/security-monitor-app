/* eslint-disable prettier/prettier */
// routes
// import { useAuthContext } from '@asgardeo/auth-react';
// import React, { useEffect, useState } from 'react';
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
// login page
// import Login from './pages/Login';
// import { setAccessToken } from './utils/oauth';

// const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
// const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
// const AUDIENCE_URL = process.env.REACT_APP_AUDIENCE;

export default function App() {
  // const { state, signIn, getIDToken } = useAuthContext();

  // const [isLoaded, setIsLoaded] = useState(false);

  // const getUserData = async () => {
  //   const idToken = await getIDToken();
  //   tokenExchange(idToken);
  // };

  const tokenExchange = (idToken) => {
    // const myHeaders = new Headers();
    // myHeaders.append('Authorization', `Basic ${window.btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`);
    // myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    // const urlencoded = new URLSearchParams();
    // urlencoded.append('grant_type', 'urn:ietf:params:oauth:grant-type:token-exchange');
    // urlencoded.append('subject_token', idToken);
    // urlencoded.append('subject_token_type', 'urn:ietf:params:oauth:token-type:jwt');
    // urlencoded.append('requested_token_type', 'urn:ietf:params:oauth:token-type:jwt');

    // const requestOptions = {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: urlencoded,
    //   redirect: 'follow'
    // };

    // fetch(AUDIENCE_URL, requestOptions)
    //   .then((response) => response.json())
    //   .then((result) => {
    //     if (result?.access_token) {
    //       setAccessToken(result.access_token);
    //       setIsLoaded(true);
    //     }
    //   })
    //   .catch((error) => console.log('error', error));
  };

  // useEffect(() => {
  //   if (state.isAuthenticated) {
  //     getUserData();
  //   }
  // }, [state.isAuthenticated]);

  // // -----------------------------------------------------
  // const _signIn = () => {
  //   signIn();
  // };

  return (
    <div className="App">
      {/* {state.isAuthenticated && isLoaded ? ( */}
      <ThemeConfig>
        <ScrollToTop />
        <GlobalStyles />
        <BaseOptionChartStyle />
        <Router />
      </ThemeConfig>
      {/* ) : (
        <Login _signIn={_signIn} />
      )} */}
    </div>
  );
}
