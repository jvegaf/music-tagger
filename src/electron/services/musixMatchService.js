const Musixmatch = require('musixmatch');
const init = {
  apikey: 'f353de95d37930383ffcd70586f6403d',
  corsURL: '',
}

const msx = Musixmatch(init);

module.exports.findTags = (item) => {
  return msx.matcherTrack({q_artist: item.artistTag, q_track: item.titleTag})
    .then(function (data) {
      console.log(data);
      if (data.track === undefined) {
        return item;
      }
      item.artistTag = data.track.artist_name;
      item.titleTag = data.track.track_name;
      item.albumTag = data.track.album_name;
      if (data.track.primary_genres.music_genre_list[0]) {
        item.genreTag = data.track.primary_genres.music_genre_list[0].music_genre.music_genre_name;
      }
      return msx.album({album_id: data.track.album_id})
        .then(function (data) {
          if (data || data.album === undefined) { return item;}
          item.yearTag = data.album.album_release_date.split('-')[0];
          return item;
        }).catch(function (err) {
          throw err;
        })
    }).catch(function (err) {
      throw err;
    })
};
