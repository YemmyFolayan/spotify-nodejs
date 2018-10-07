const request = require('request');
const { spotify_credentials } = require('../config/config');

const fetchSpotifyToken = async () => {

    let { client_secret, client_id } = spotify_credentials;

    let authOptions = {

        url: 'https://accounts.spotify.com/api/token',
        form: { grant_type: 'client_credentials' },
        headers: {

            'Authorization': 'Basic ' + (new Buffer.from(
                client_id + ':' + client_secret
            ).toString('base64'))
        },
        json: true
    };

    return new Promise((resolve, reject) => {

        request.post(authOptions, function (error, response, body) {

            if (error) reject(error);
            else resolve(response);
        });
    });
};

module.exports = {

    fetchSpotifyToken
};