const fetch = require('node-fetch');

const fetchSpotifyData = async (url, token) => {

    return fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(res => res.json());
};

module.exports = { fetchSpotifyData };