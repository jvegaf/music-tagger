const Musixmatch = require('musixmatch');
const init = {
  apikey: process.env.MUSIXMATCH_KEY,
  corsURL: '',
}

const msx = Musixmatch(init);

module.exports.findTags = async (item) => {
  return msx.matcherTrack({q_artist: item.artistTag, q_track: item.titleTag})
    .then(function (data) {
      item.artistTag = data.track.artist_name;
      item.titleTag = data.track.track_name;
      item.albumTag = data.track.album_name;
      if (data.track.primary_genres.music_genre_list[0].music_genre.music_genre_name){
        item.genreTag =  data.track.primary_genres.music_genre_list[0].music_genre.music_genre_name;
      }
      return msx.album({album_id: data.track.album_id})
        .then(function (data) {
          item.yearTag = data.album.album_release_date.split('-')[0];
          console.log(item);
          return item;
        }).catch(function (err) {
          console.log(err);
        })
    }).catch(function (err) {
      console.log(err);
    })
};

