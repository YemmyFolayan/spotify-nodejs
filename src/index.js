const { fetchSpotifyPlaylist } = require('./fetch-spotify-playlist');

//FIXME: Review dependencies.
async function d() {

    let datat = await fetchSpotifyPlaylist("vertigo_101", "5PVsL8R9lMAP6dWBQLp8AQ");

    console.log(datat);
};