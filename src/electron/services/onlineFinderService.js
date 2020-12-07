const id3Service = require('./id3Service');
const spotiService = require('./spotifyService');
const mxmService = require('./musixMatchService');


exports.findTagsOfItems = async (items) => {
  try {
    return await Promise.all(items.map(async item => {
      return await findTags(item);
    }));
  } catch (e) {
    throw new Error(e.message);
  }
}

const findTags = async (item) => {
  try {
    const newItem = await mxmService.findTags(item);
    const artUrl = await spotiService.findCoverArt(newItem);
    if (artUrl !== null) {
      newItem.imageTag = await id3Service.getImageTag(artUrl);
    }
    return newItem;
  } catch (e) {
    console.log(e);
  }
}
