import axios from 'axios';

const EXPIRATION_TIME = 3600 * 1000;

// Timestamp Helper Functions
const setTokenTimestamp = () => {
    window.localStorage.setItem('spotify_token_timestamp', Date.now());
}

const getTokenTimestamp = () => {
    window.localStorage.getItem('spotify_token_timestamp');
}

// Local Acess Token Helper Functions
const setLocalAccessToken = (token) => {
    setTokenTimestamp();
    window.localStorage.setItem('spotify_access_token', token);
}

const getLocalAccessToken = () => {
    window.localStorage.getItem('spotify_access_token');
}

// Local Refresh Token Helper Functions
const setLocalRefreshToken = (token) => {
    window.localStorage.setItem('spotify_refresh_token', token);
}

const getLocalRefreshToken = () => {
    window.localStorage.getItem('spotify_refresh_token');
}

const refreshAccessToken = async () => {
    try{
        // Refresh token is passed in through query params
        const {data} = await axios.get(`/refresh_token?refresh_token=${getLocalRefreshToken()}`);
        const {access_token} = data;
        setLocalAccessToken(access_token);
        // Reload the page so useEffect is able to update the token
        window.location.reload();
    } catch (error){
        console.log(error);
    }
}

export const getAccessToken = () => {
    const params = new URLSearchParams(window.location.search);
    const returned_error = params.get('error');
    const returned_access_token = params.get('access_token');
    const returned_refresh_token = params.get('refresh_token');

    if(returned_error){
        console.error(returned_error);
        refreshAccessToken();
    }

    // If token has expired
    if(Date.now() - getTokenTimestamp() - EXPIRATION_TIME){
        console.warn('Access token has expired, refreshing ...');
        refreshAccessToken();
    }

    const localAccessToken = getLocalAccessToken();
    const localRefreshToken = getLocalRefreshToken();

    // If there is no local refresh token then set it from the params
    if(!localRefreshToken || localRefreshToken === 'undefined'){
        setLocalRefreshToken(returned_refresh_token);
    }
    
    // If there is no local access token then set it from the params
    if(!localAccessToken || localAccessToken === 'undefined'){
        setLocalAccessToken(returned_access_token);
        return returned_access_token;
    }

    return localAccessToken;
}

export const access_token = getAccessToken();

// API Calls

export const headers = {
    Authorization: `Bearer ${access_token}`,
    'Content-Type': 'application/json',
}

export const getUser = () => {
    return fetch('https://api.spotify.com/v1/me', { headers })
}