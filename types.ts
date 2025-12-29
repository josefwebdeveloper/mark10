export enum MediaType {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO'
}

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  thumbnail?: string; // For videos
  title: string;
  date: string;
  width?: number;
  height?: number;
  description?: string; // Optional pre-existing description
}

export interface StoryResponse {
  story: string;
}