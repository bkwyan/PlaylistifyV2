import React, { useState, useEffect } from 'react';
import LoginScreen from './components/pages/LoginScreen.js';
import Landing from './components/pages/Landing.js';
import { GlobalStyle } from './components/styles/GlobalStyles.js';
import styled from 'styled-components/macro';

//import { token } from './spotify/index';

function App() {

  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(token);
  }, []);

  const AppContainer = styled.div`
  `;

  return(
    <AppContainer>
      <GlobalStyle />
      <LoginScreen />
    </AppContainer>
  );
}

export default App;
