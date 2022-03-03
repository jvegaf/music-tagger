import { readFileSync } from 'fs';
import NodeID3 from 'node-id3';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { sanitize as san } from '../util/helpers';
import { sendNewTracks } from './../../main/index';
import musicDuration from 'music-duration';

const getFilename = (filepath) => {
  return path.basename(filepath, '.mp3');
};

const sanitizeFilename = (filename) => {
  return filename.split('_').join(' ').trim();
};

const getDuration = async (buffer) => {
  return await musicDuration(buffer);
};

const createTrack = async (file) => {
  const track = {};
  const buffer = readFileSync(file);
  const tags = NodeID3.read(buffer);
  const duration = await getDuration(buffer);
  const trackTitle =
    tags.title && tags.title.length
      ? tags.title
      : sanitizeFilename(getFilename(file));

  console.log(duration);

  track._id = uuid();
  track.title = san(trackTitle);
  track.artist = san(tags.artist);
  track.album = san(tags.album);
  track.year = tags.year;
  track.genre = tags.genre;
  track.bpm = tags.bpm;
  track.path = file;
  track.key = tags.initialKey;
  track.art = tags.image;
  track.duration = duration;

  return track;
};

export const getTracksFrom = async (files) => {
  const tracks = [];
  for (let i = 0; i < files.length; i++) {
    const track = await createTrack(files[i]);
    tracks.push(track);
  }

  sendNewTracks(tracks);
};
