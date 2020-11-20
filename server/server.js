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

// Requires format to be "Basic: *<base64 encoded client_id:clientsecret>*"
const headers = {
    'Authorization': 'Basic ' + new Buffer(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
}

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
        state: state,
        scope: scope
    })}`);
});

app.get('/callback', (req, res) => {
    // If the user accepts the request, in the callback response query string it will have a code and state parameter
    // If the user doesn't accept, in the callback response query string it will have an error and state parameter

    // Authorization code that is used to exchange for an access token
    let code = req.query.code || null;
    let state = req.query.state || null;

    // Access the stored state that was generated when logging in so we can compare it to the state that was returned
    let storedState = req.cookies ? req.cookies[stateKey] : null;

    // If the state doesn't match then theres a problem!
    if(state === null || state !== storedState){

        // '#' Is included so we are able to utilize 'location.hash' to retrieve the access token and refresh token
        res.redirect('/?' + querystring.stringify({
            error: 'state_mismatch'
        }));
    } else{
        res.clearCookie(stateKey);
        let postParams = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI
            },
            headers: headers,
            json: true
        };

        request.post(postParams, (error, response, body) => {
            // Response will have a status code of 200 if success
            if(!error && response.statusCode === 200){
                
                let access_token = body.access_token,
                    refresh_token = body.refresh_token;

                let spotifyAPIOptions = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    },
                    json: true
                }

                // Store token in browser to make requests in the front end
                res.redirect(`${FRONTEND_URI}/?${querystring.stringify({
                    access_token,
                    refresh_token
                })}`);
            } else{
                res.redirect('/?' + 
                    querystring.stringify({
                        error: 'code'
                    })
                );
            }
        });
    }
});

// API call to get a new token
app.get('/refresh_token', (req, res) => {
    // We stored the refresh token in the query
    let refresh_token = req.query.refresh_token;
    let postParams = {
        url: 'https://accounts.spotify.com/api/token',
        form:{
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        headers: headers,
        json: true
    }

    request.post(postParams, (error, response, body) => {
        if(!error && response.statusCode === 200){
            let access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});

app.listen(PORT, () => {
    console.log('Server is up and running on port number ' + PORT);
});
