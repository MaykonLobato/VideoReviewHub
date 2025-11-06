// Firestore helper functions
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { InsertFeedback, Feedback } from '@/types/feedback';

// Collections
export const COLLECTIONS = {
  FEEDBACKS: 'feedbacks',
  VIDEOS: 'videos',
  TAGS: 'tags',
} as const;

// Feedback operations
export async function createFeedback(data: InsertFeedback): Promise<Feedback> {
  const feedbackData = {
    ...data,
    isRead: false,
    createdAt: Timestamp.now(),
  };
  
  const docRef = await addDoc(collection(db, COLLECTIONS.FEEDBACKS), feedbackData);
  
  return {
    id: docRef.id,
    ...data,
    isRead: false,
    createdAt: new Date(),
  };
}

export async function getFeedbacks(): Promise<Feedback[]> {
  const q = query(
    collection(db, COLLECTIONS.FEEDBACKS),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      userEmail: data.userEmail,
      userName: data.userName,
      videoTitle: data.videoTitle,
      comment: data.comment,
      isRead: data.isRead || false,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Feedback;
  });
}

export async function markFeedbackAsRead(feedbackId: string): Promise<void> {
  const feedbackRef = doc(db, COLLECTIONS.FEEDBACKS, feedbackId);
  await updateDoc(feedbackRef, {
    isRead: true,
  });
}

// Video operations
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

export async function getVideos(): Promise<Video[]> {
  const q = query(
    collection(db, COLLECTIONS.VIDEOS),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      youtubeUrl: data.youtubeUrl,
      title: data.title,
      mainTag: data.mainTag,
      subTags: data.subTags || [],
      rating: data.rating,
      isSponsored: data.isSponsored || false,
      ribbonColor: data.ribbonColor || '',
      isPinned: data.isPinned || false,
      isPublic: data.isPublic !== undefined ? data.isPublic : true,
      location: data.location || null,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Video;
  });
}

export async function createVideo(videoData: Omit<Video, 'id' | 'createdAt'>): Promise<Video> {
  const data = {
    ...videoData,
    createdAt: Timestamp.now(),
  };
  
  const docRef = await addDoc(collection(db, COLLECTIONS.VIDEOS), data);
  
  return {
    id: docRef.id,
    ...videoData,
    createdAt: new Date(),
  };
}

export async function updateVideo(videoId: string, videoData: Partial<Omit<Video, 'id' | 'createdAt'>>): Promise<void> {
  const videoRef = doc(db, COLLECTIONS.VIDEOS, videoId);
  await updateDoc(videoRef, videoData);
}

export async function toggleVideoVisibility(videoId: string, isPublic: boolean): Promise<void> {
  const videoRef = doc(db, COLLECTIONS.VIDEOS, videoId);
  await updateDoc(videoRef, { isPublic });
}
