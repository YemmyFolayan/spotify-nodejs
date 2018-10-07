const { fetchSpotifyData } = require('./fetch-spotify-data');
const { fetchSpotifyToken } = require('./fetch-spotify-token');
const { searchYoutube } = require('./fetch-youtube-search');
const { terminalExec } = require('./terminal-exec');

const fetchSpotifyPlaylist = async (user_id, playlist_id) => {

    let spotify_playlist_endpoint_url = `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`;
    let download_path = `./src/downloads/${user_id}/music/`;
    let download_archive = `./src/downloads/${user_id}/downloaded.txt`;
    let totalFetched = 0, times = 1, offset = 0;
    let tracksData = [];
    let fetchedData = null;
    let { body: tokendata } = await fetchSpotifyToken();
    let OAuthToken = tokendata.access_token;

    for (let i = 0; i <= parseInt(times); i++) {

        try {

            fetchedData = await fetchSpotifyData(`${spotify_playlist_endpoint_url}?offset=${offset}&limit=100`, OAuthToken);

        } catch (error) { console.log(error); }

        totalFetched += fetchedData.items.length;
        tracksData = tracksData.concat(fetchedData.items);

        if (totalFetched < fetchedData.total)
            times = fetchedData.total / fetchedData.items.length;

        offset += 100;
    }

    console.log('[*] Refreshing Downloads folder.\n');

    // try { await terminalExec(`rm -r ${download_path} && mkdir ${download_path}`); }
    // catch (error) { console.log('Building initial userdata') }

    console.log('[*] Fetched : ' + totalFetched + ' songs. \n');
    let dataArray = [];
    let dataArrayElement = {};

    for (let i = 0; i < tracksData.length; i++) {

        const element = tracksData[i];

        let { track, track: { preview_url, name } } = element;
        let { images: album_art, release_date, name: album_name  } = track.album;
        let trackName = track.artists[0].name + ' ' + track.name;
        let savedTrackName = track.artists[0].name + ' - ' + track.name;
        let username = element.added_by.id;
        let searchResult = null;

            preview_url === null ? preview_url = 'null' : preview_url = preview_url;

        try {

            console.log('-> ' + savedTrackName);
            
            console.log('[^] Searching youtube [Pending]');
            searchResult = await searchYoutube(trackName);
            console.log('[^] Searching youtube [Complete]');

            let { videoId: ytid } = searchResult.items[0].id;

            dataArrayElement = {

                name, artist: track.artists[0].name, album_art,
                release_date, preview_url, ytid, album_name,
                username
            };
            console.log('[^] Downloading [Pending]');

            await terminalExec(`youtube-dl --download-archive ${download_archive} -cix --audio-format "mp3" -o "${download_path}${savedTrackName}.%(ext)s" https://www.youtube.com/watch?v=${ytid}`);
            console.log('[^] Downloading [Complete]');
            dataArray.push(dataArrayElement);
            
        } catch (error) {

            console.log(error);
            
            // on error make ytid: null and make an empty text file.

            dataArrayElement = {

                name, artist: track.artists[0].name, album_art,
                release_date, preview_url, ytid: 'null',
                album_name, username
            };

            await terminalExec(`touch "${download_path}${trackName}.txt"`);

            dataArray.push(dataArrayElement);
        }
    }

    return new Promise((resolve, _ ) => resolve(dataArray))
};

module.exports = { fetchSpotifyPlaylist };