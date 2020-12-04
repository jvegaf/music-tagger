import { ArtImageType } from './ArtImageType';
export class ArtImage {
  mime: string;
  type: ArtImageType;
  description: string;
  imageBuffer: Buffer;
}
