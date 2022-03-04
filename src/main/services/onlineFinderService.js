const id3Service = require('./id3Service');
const spotiService = require('./spotifyService');
const mxmService = require('./musixMatchService');

exports.findTags = async (item) => {
  try {
    const newItem = await mxmService.findTags(item);
    const artUrl = await spotiService.findCoverArt(newItem);
    if (artUrl !== null) {
      newItem.imageTag = await id3Service.getImageTag(artUrl);
      newItem.hasCover = true;
    }
    return newItem;
  } catch (e) {
    console.log(e);
  }
}
