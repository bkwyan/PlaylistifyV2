require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const querystring = require('querystring');
const request = require('request');
const cookieParser = require('cookie-parser');
const path = require('path');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
let REDIRECT_URI = 'http://localhost:8888/callback';
let FRONTEND_URI = 'http://localhost:3000';
const PORT = process.env.PORT || 8888;

const app = express();

// Key for the authorization state
const stateKey = 'spotify_auth_state';

// Function to generate a random string for the state
const generateRandomString = (length) => {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

app
    .use(cors())
    .use(bodyParser.json())
    .use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/login', (req, res) => {
    // Generate the state
    const state = generateRandomString(16);

    // Store the state in cookies
    res.cookie(stateKey, state);

    const scope = 'user-read-private user-read-email';

    // Use querystring to help us create the query nicely
    res.redirect(`https://accounts.spotify.com/authorize?${querystring.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        state: generateRandomString(16),
        scope: scope
    })}`);
});

app.get('/callback', (req, res) => {
    // If the user accepts the request, in the callback response query string it will have a code and state parameter
    // If the user doesn't accept, in the callback response query string it will have an error and state parameter
})

app.listen(PORT, () => {
    console.log('Server is up and running on port number ' + PORT);
});
