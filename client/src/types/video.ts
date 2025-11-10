// Video types shared across the application

export interface Location {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Video {
  id: string;
  youtubeUrl: string;
  title: string;
  mainTag: string;
  subTags: string[];
  rating: number;
  isSponsored: boolean;
  ribbonColor?: string;
  isPinned: boolean;
  isPublic: boolean;
  location?: Location;
  createdAt: Date;
}

// Type for creating a new video (without id and createdAt)
export type CreateVideoInput = Omit<Video, 'id' | 'createdAt'>;

// Type for updating a video (all fields optional except id)
export type UpdateVideoInput = Partial<Omit<Video, 'id' | 'createdAt'>>;

