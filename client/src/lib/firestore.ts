// Firestore helper functions
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { InsertFeedback, Feedback } from '@/types/feedback';
import type {
  Video,
  Location,
  CreateVideoInput,
  UpdateVideoInput,
} from '@/types/video';

// Collections
export const COLLECTIONS = {
  FEEDBACKS: 'feedbacks',
  VIDEOS: 'videos',
  TAGS: 'tags',
} as const;

// Re-export types for backward compatibility
export type { Video, Location };

// Feedback operations
export async function createFeedback(data: InsertFeedback): Promise<Feedback> {
  const feedbackData = {
    ...data,
    isRead: false,
    isArchived: false,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(
    collection(db, COLLECTIONS.FEEDBACKS),
    feedbackData
  );

  return {
    id: docRef.id,
    ...data,
    isRead: false,
    isArchived: false,
    createdAt: new Date(),
  };
}

export async function getFeedbacks(
  includeArchived: boolean = false
): Promise<Feedback[]> {
  // Always fetch all feedbacks and filter in memory to avoid index requirement
  const q = query(
    collection(db, COLLECTIONS.FEEDBACKS),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);

  const allFeedbacks = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userEmail: data.userEmail,
      userName: data.userName,
      videoTitle: data.videoTitle,
      comment: data.comment,
      isRead: data.isRead || false,
      isArchived: data.isArchived || false,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Feedback;
  });

  // Filter archived feedbacks if needed
  if (includeArchived) {
    return allFeedbacks.filter((f) => f.isArchived);
  } else {
    return allFeedbacks.filter((f) => !f.isArchived);
  }
}

export async function markFeedbackAsRead(feedbackId: string): Promise<void> {
  const feedbackRef = doc(db, COLLECTIONS.FEEDBACKS, feedbackId);
  await updateDoc(feedbackRef, {
    isRead: true,
  });
}

export async function archiveFeedback(feedbackId: string): Promise<void> {
  const feedbackRef = doc(db, COLLECTIONS.FEEDBACKS, feedbackId);
  await updateDoc(feedbackRef, {
    isArchived: true,
  });
}

export async function unarchiveFeedback(feedbackId: string): Promise<void> {
  const feedbackRef = doc(db, COLLECTIONS.FEEDBACKS, feedbackId);
  await updateDoc(feedbackRef, {
    isArchived: false,
  });
}

// Video operations

export async function getVideos(isAdmin: boolean = false): Promise<Video[]> {
  // If not admin, only fetch public videos
  const baseQuery = collection(db, COLLECTIONS.VIDEOS);
  const q = isAdmin
    ? query(baseQuery, orderBy('createdAt', 'desc'))
    : query(
        baseQuery,
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc')
      );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
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

export async function createVideo(videoData: CreateVideoInput): Promise<Video> {
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

export async function updateVideo(
  videoId: string,
  videoData: UpdateVideoInput
): Promise<void> {
  const videoRef = doc(db, COLLECTIONS.VIDEOS, videoId);
  await updateDoc(videoRef, videoData);
}

export async function toggleVideoVisibility(
  videoId: string,
  isPublic: boolean
): Promise<void> {
  const videoRef = doc(db, COLLECTIONS.VIDEOS, videoId);
  await updateDoc(videoRef, { isPublic });
}
