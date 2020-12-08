const NodeId3 = require('node-id3');
const fetch = require('node-fetch');
const fs = require('fs');
const readSync = require('recursive-readdir-sync');
const path = require('path');


exports.saveTags = (item) => {
  updateTagsOfItem(item);
}

exports.getTagsFromPath = (folderPath) => {
  const files = readSync(folderPath).filter((file) => path.extname(file).toLowerCase() === '.mp3');
  return getTagsOfFiles(files);
}

exports.cleanFilenames = (items, value) => {
  return items.map(item => {
    if (item.filepath.indexOf(value) !== -1) {
      const newName = item.filepath.replace(value, '');
      fs.renameSync(item.filepath, newName);
      item.filename = getFilename(newName);
      return item;
    }
  });
}

const getTagsOfFiles = (files) => {
  return files.map((file, index) => {
    let item = getTagsOfFile(file);
    item.fileIndex = index;
    return item;
  });
};

const getFilename = (file) => {
  return file.replace(/^.*[\\\/]/, '');
}

const getTagsOfFile = (file) => {
  let item = {};
  const buffer = fs.readFileSync(file);

  let tags = NodeId3.read(buffer);
  if (tags === false){
    tags = {};
  }
  item.titleTag = tags.title || '';
  item.artistTag = tags.artist || '';
  item.albumTag = tags.album || '';
  item.yearTag = tags.year || '';
  item.genreTag = tags.genre || '';
  item.bpmTag = tags.bpm || '';
  item.keyTag = tags.initialKey || '';
  item.imageTag = tags.image;


  item.filepath = file;
  item.filename = getFilename(file);
  return item;
}

/**
 * returns true/false
 */

// tags = {
//     title: 'Tomorrow',
//     artist: 'Kevin Penkin',
//     album: 'TVアニメ「メイドインアビス」オリジナルサウンドトラック',
//     APIC: './example/mia_cover.jpg',
//     TRCK: '27'
//   }

/**
 * cambiar en lugar de que devuelva booleano,
 * que devuelva el item actualizado
 */
const updateTagsOfItem = (item) => {
  const fileBuffer = fs.readFileSync(item.filepath);
  let tags = {
    title: item.titleTag,
    artist: item.artistTag,
    album: item.albumTag,
    year: item.yearTag,
    genre: item.genreTag,
    bpm: item.bpmTag,
    initialKey: item.keyTag,
    image: item.imageTag
  }

  const result = NodeId3.update(tags, fileBuffer);
  fs.writeFileSync(item.filepath, result);
  console.log(`saved ${item.titleTag}`);
};

exports.getImageTag = async (url) => {
  const response = await fetch(url);
  const mimeType = response.headers.get('content-type');
  const imgBuffer = await response.buffer();
  return {
    description: '', imageBuffer: imgBuffer, mime: mimeType, type: {id: 3, name: 'front cover'}
  };
}
