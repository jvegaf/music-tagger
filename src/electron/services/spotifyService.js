const SpotifyWebApi = require('spotify-web-api-node');

var api = new SpotifyWebApi({
  clientId: '0a8007ba1df549b783cfe7265678ead8',
  clientSecret: '9387993d8a724a389328cb698ed30ec3'
});

api.clientCredentialsGrant().then(
  function(data) {
    api.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong!', err);
  }
);

module.exports.findTags = async (item) => {
  const filename = item.artistTag + ' - ' + item.titleTag;
  api.searchTracks(filename)
    .then(function(data) {
      console.log(`Search tracks by ${item.titleTag} in the track name and ${item.artistTag} in the artist name`, data.body);
      return data.body;
    }, function(err) {
      console.log('Something went wrong!', err);
      return err;
    });
};

module.exports.findCoverArt = (item) => {
  return api.searchTracks(`track:${item.titleTag} artist:${item.artistTag}`)
    .then(function(data) {
      if (data === undefined) { return null; }
      if (data.body.tracks.items.length < 1) { return null; }
      return data.body.tracks.items[0].album.images[0].url;
    }, function(err) {
      console.log('Something went wrong!', err);
      return err;
    });
};
