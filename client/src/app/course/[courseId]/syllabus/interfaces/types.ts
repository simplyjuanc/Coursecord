export type ContentType = 'text' | 'link' | 'video';

export interface IContentItem {
  type: ContentType;
  value: string; // For text and link, this is the text or URL. For videos, this is the video ID or URL.
}

export interface ISubunit {
  id: string;
  name: string;
  content: IContentItem[];
}

export interface IUnit {
  id: string;
  name: string;
  subunits: ISubunit[];
}
