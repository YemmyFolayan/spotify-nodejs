const fetch = require('node-fetch');
const { youtube_credentials } = require('../config/config');
const { api_key: key } = youtube_credentials;
const url = 'https://www.googleapis.com/youtube/v3/search';

let options = {

    part: 'snippet',
    key,
    maxResults: 4,
    query: null
};

const searchYoutube = (query) => {

    let request = `${url}/?q=${query || options.query}&part=${options.part}&key=${options.key}&maxResults=${options.maxResults}`;
    return fetch(request).then(res => res.json())
};

module.exports = {
    searchYoutube
};
