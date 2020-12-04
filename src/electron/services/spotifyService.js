const SpotifyWebApi = require('spotify-web-api-node');

var api = new SpotifyWebApi({
  clientId: process.env.S_C,
  clientSecret: process.env.S_S
});

api.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token is ' + data.body['access_token']);
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

module.exports.findTagsByTitleArtist = async (item) => {
  api.searchTracks(`track:${item.titleTag} artist:${item.artistTag}`)
    .then(function(data) {
      console.log(`Search tracks by ${item.titleTag} in the track name and ${item.artistTag} in the artist name`, data.body);
      return data.body;
    }, function(err) {
      console.log('Something went wrong!', err);
      return err;
    });
};
