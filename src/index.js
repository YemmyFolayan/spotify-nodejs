const readlineSync = require('readline-sync');
const figlet = require('figlet');
const chalk = require('chalk');
const { fonts } = require('../utils/fonts');
const { fetchSpotifyPlaylist } = require('./fetch-spotify-playlist');
const asciify = require('asciify-image');

let log = console.log;
let spotifyLog = chalk.rgb(30, 215, 97);


let random_font = fonts[Math.floor(Math.random() * (fonts.length - 1))];

figlet('Spotify X', {

          font: random_font,
          horizontalLayout: 'default',
          verticalLayout: 'default'
        }, (err, style) => {

            asciify('logo.png', {

                fit: 'box',
                width: 40,
                height: 40
            }, function (err, asciified_logo) {

                if (err) throw err;

                log(spotifyLog(asciified_logo) + '\n');
                startApp(err, style)
            });
        });

async function startApp(err, style) {

    if (err) {

        console.log(err);
        console.log('Something went wrong....');
        return;
    }

    log(spotifyLog(style) + '\n');

    let spotifyUsername = readlineSync.question(spotifyLog('> Enter the spotify username: '));
    let spotifyPlaylistID = readlineSync.question(spotifyLog('> Paste the playlist id: '));

    if ((spotifyUsername === null || spotifyPlaylistID === null) || (spotifyUsername === '' || spotifyPlaylistID === '')) { log('USERNAME CANNOT BE NULL.'); }
    if (spotifyPlaylistID === null || spotifyPlaylistID === '') { log('PLAYLIST ID CANNOT BE NULL.'); }

    try { 
        
        await fetchSpotifyPlaylist(spotifyUsername, spotifyPlaylistID);

    } catch(error) { log('Failed to fetch.') }

}

