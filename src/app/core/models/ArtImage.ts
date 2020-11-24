import { ArtImageType } from './ArtImageType';
export interface ArtImage {
  mime: string;
  type: ArtImageType;
  description: string;
  imageBuffer: Buffer;
}
