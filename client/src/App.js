import React, { useState, useEffect } from 'react';
import LoginScreen from './components/pages/LoginScreen.js';
import Landing from './components/pages/Landing.js';
import { GlobalStyle } from './components/styles/GlobalStyles.js';
import styled from 'styled-components/macro';
import { access_token } from './spotify/index';

const App = () => {

  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(access_token);
  }, []);

  const AppContainer = styled.div`
  `;

  return(
    <AppContainer>
      <GlobalStyle />
      {token ? <Landing /> : <LoginScreen />}
    </AppContainer>
  );
}

export default App;
