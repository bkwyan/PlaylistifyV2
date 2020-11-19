import React from 'react';
import styled from 'styled-components/macro'
import SpotifyLogo from '../images/SpotifyLogo.png';
import theme from '../styles/theme.js';
const { fontSizes, colors } = theme;

// API call for server side login
const LOGIN_URL = "http://localhost:8888/login";

const LoginScreenContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const SpotifyLogoWrapper = styled.div`
`;

const SpotifyLogoImage = styled.img`
    width: 75vmin;
`;

const LoginScreenMessageWrapper = styled.span`
`;

const LoginScreenMessage = styled.p`
    color: ${colors.silverPink};
    font-size: ${fontSizes.xxl};
`;

const LoginScreen = () => {
    return(
        <LoginScreenContainer>
            <SpotifyLogoWrapper>
                <a href = {LOGIN_URL}>
                    <SpotifyLogoImage src = {SpotifyLogo}/>
                </a>
            </SpotifyLogoWrapper>
            <LoginScreenMessageWrapper>
                <LoginScreenMessage>Welcome to Playlistify, press the Spotify logo to Login!</LoginScreenMessage>
            </LoginScreenMessageWrapper>
        </LoginScreenContainer>
    );
}

export default LoginScreen;