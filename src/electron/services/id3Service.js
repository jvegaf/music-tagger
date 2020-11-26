const NodeId3 = require('node-id3');
const fs = require('fs');
const path = require('path');


exports.getTagsFromPath = (folderPath) => {
  const filenames = fs.readdirSync(folderPath);
  return getTagsOfFiles(folderPath, filenames);
}

exports.cleanFilenames = (items, value) => {
  return items.map(item => {
    if (item.filename.indexOf(value) !== -1) {
      const newName = item.filename.replace(value, '');
      const oldFile = path.join(item.filepath, item.filename);
      let newfile = path.join(item.filepath, newName);
      fs.renameSync(oldFile, newfile);
      item.filename = newName;
      return item;
    }
  });
}

const getTagsOfFiles = (folderPath, files) => {
  return files.map((file, index) => {
    let item = getTagsOfFile(folderPath, file);
    item.fileIndex = index;
    return item;
  });
};

const getTagsOfFile = (folderPath, filename) => {
  let item = {};
  const filepath = path.join(folderPath, filename);
  const buffer = fs.readFileSync(filepath);

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


  item.filepath = folderPath;
  item.filename = filename;
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
exports.updateTagsOfItem = (item) => {
  const fullPath = path.join(item.filepath, item.filename);
  let fileBuffer = fs.readFileSync(fullPath);
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

  let result = NodeId3.update(tags, fileBuffer);
  fs.writeFileSync(fullPath, result);
};
