const fetch = require('node-fetch');
const spotiService = require('./spotifyService');
const mxmService = require('./musixMatchService');

exports.findTags = async (item) => {
  try {
    const newItem = await mxmService.findTags(item);
    const artUrl = await spotiService.findCoverArt(newItem);
    if (artUrl !== null) {
      newItem.imageTag = await getImageTag(artUrl);
    }
    return newItem;
  } catch (e) {
    console.log(e);
  }
}

const getImageTag = async (url) => {
  const response = await fetch(url);
  const mimeType = response.headers.get('content-type');
  const imgBuffer = await response.buffer();
  return {
    description: '', imageBuffer: imgBuffer, mime: mimeType, type: {id: 3, name: 'front cover'}
  };
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
