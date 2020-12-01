const Musixmatch = require("musixmatch");
const init = {
  apikey: process.env.MUSIXMATCH_KEY,
  corsURL: '',
}

const msx = Musixmatch(init);

// module.exports.findTags = async (item) => {
//   const filename = item.artistTag + ' - ' + item.titleTag;
//   msx.trackSearch({q: filename, page: 1, page_size: 3})
//     .then(function (data) {
//       console.log('desde musixmatchService');
//       console.log(data.track_list[0]);
//       return data;
//     }).catch(function (err) {
//     console.log(err);
//   })
// };

module.exports.findTags = async (item) => {
  return msx.matcherTrack({q_artist:item.artistTag, q_track:item.titleTag})
    .then(function(data){
      return data.track
    }).catch(function(err){
      console.log(err);
    })
};
