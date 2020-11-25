import { Tags } from './Tags';
export interface Track {
  id: number;
  tags: Tags;
  filename: string;
  filepath: string;
}
