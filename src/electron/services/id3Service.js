const NodeId3 = require('node-id3');
const fetch = require('node-fetch');
const fs = require('fs');
const readSync = require('recursive-readdir-sync');
const path = require('path');


exports.saveTags = (item) => {
  updateTagsOfItem(item);
}

exports.cleanFilename = (item, value) => {
  if (item.filepath.indexOf(value) !== -1) {
    const newName = item.filepath.replace(value, '');
    fs.renameSync(item.filepath, newName);
    item.filepath = newName;
    item.filename = getFilename(newName);
  }
  return item;
}

const getFilename = (file) => {
  return file.replace(/^.*[\\\/]/, '').split('.')[0];
}

exports.getTagsOfFile = (file) => {
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
    title: item.title,
    artist: item.artist,
    album: item.album,
    year: item.year,
    genre: item.genre,
    bpm: item.bpm,
    initialKey: item.key,
    image: item.image
  }

  const result = NodeId3.update(tags, fileBuffer);
  fs.writeFileSync(item.filepath, result);
  console.log(`saved ${item.title}`);
};

exports.getImageTag = async (url) => {
  const response = await fetch(url);
  const mimeType = response.headers.get('content-type');
  const imgBuffer = await response.buffer();
  return {
    description: '', imageBuffer: imgBuffer, mime: mimeType, type: {id: 3, name: 'front cover'}
  };
}
