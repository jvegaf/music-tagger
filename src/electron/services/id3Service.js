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
    item.id = index;
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
  if (tags.title === undefined) tags.title = "";
  if (tags.artist === undefined) tags.artist = "";
  if (tags.album === undefined) tags.album = "";
  if (tags.year === undefined) tags.year = "";
  if (tags.genre === undefined) tags.genre = "";
  if (tags.bpm === undefined) tags.bpm = "";
  if (tags.initialKey === undefined) tags.initialKey = "";
  item.tags = tags;

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
    let fileBuffer = fs.readFileSync(item.filepath);
    let tags = item.tags;
    let result = NodeId3.update(tags, fileBuffer);
    fs.writeFileSync(item.filepath, result);
};
