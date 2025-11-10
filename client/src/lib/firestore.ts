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
import { logger } from './logger';
import { handleFirestoreError } from './error-handler';
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
  try {
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

    logger.info('Feedback created successfully', { feedbackId: docRef.id });

    return {
      id: docRef.id,
      ...data,
      isRead: false,
      isArchived: false,
      createdAt: new Date(),
    };
  } catch (error) {
    const appError = handleFirestoreError(error);
    logger.error('Failed to create feedback', error as Error, { data });
    throw appError;
  }
}

export async function getFeedbacks(
  includeArchived: boolean = false
): Promise<Feedback[]> {
  try {
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
    const filtered = includeArchived
      ? allFeedbacks.filter((f) => f.isArchived)
      : allFeedbacks.filter((f) => !f.isArchived);

    logger.debug('Feedbacks fetched', {
      total: allFeedbacks.length,
      filtered: filtered.length,
      includeArchived
    });

    return filtered;
  } catch (error) {
    const appError = handleFirestoreError(error);
    logger.error('Failed to get feedbacks', error as Error, { includeArchived });
    throw appError;
  }
}

export async function markFeedbackAsRead(feedbackId: string): Promise<void> {
  try {
    const feedbackRef = doc(db, COLLECTIONS.FEEDBACKS, feedbackId);
    await updateDoc(feedbackRef, {
      isRead: true,
    });
    logger.debug('Feedback marked as read', { feedbackId });
  } catch (error) {
    const appError = handleFirestoreError(error);
    logger.error('Failed to mark feedback as read', error as Error, { feedbackId });
    throw appError;
  }
}

export async function archiveFeedback(feedbackId: string): Promise<void> {
  try {
    const feedbackRef = doc(db, COLLECTIONS.FEEDBACKS, feedbackId);
    await updateDoc(feedbackRef, {
      isArchived: true,
    });
    logger.debug('Feedback archived', { feedbackId });
  } catch (error) {
    const appError = handleFirestoreError(error);
    logger.error('Failed to archive feedback', error as Error, { feedbackId });
    throw appError;
  }
}

export async function unarchiveFeedback(feedbackId: string): Promise<void> {
  try {
    const feedbackRef = doc(db, COLLECTIONS.FEEDBACKS, feedbackId);
    await updateDoc(feedbackRef, {
      isArchived: false,
    });
    logger.debug('Feedback unarchived', { feedbackId });
  } catch (error) {
    const appError = handleFirestoreError(error);
    logger.error('Failed to unarchive feedback', error as Error, { feedbackId });
    throw appError;
  }
}

// Video operations

export async function getVideos(isAdmin: boolean = false): Promise<Video[]> {
  try {
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

    const videos = querySnapshot.docs.map((doc) => {
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

    logger.debug('Videos fetched', { count: videos.length, isAdmin });
    return videos;
  } catch (error) {
    const appError = handleFirestoreError(error);
    logger.error('Failed to get videos', error as Error, { isAdmin });
    throw appError;
  }
}

export async function createVideo(videoData: CreateVideoInput): Promise<Video> {
  try {
    const data = {
      ...videoData,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.VIDEOS), data);

    logger.info('Video created successfully', { videoId: docRef.id, title: videoData.title });

    return {
      id: docRef.id,
      ...videoData,
      createdAt: new Date(),
    };
  } catch (error) {
    const appError = handleFirestoreError(error);
    logger.error('Failed to create video', error as Error, { videoData });
    throw appError;
  }
}

export async function updateVideo(
  videoId: string,
  videoData: UpdateVideoInput
): Promise<void> {
  try {
    const videoRef = doc(db, COLLECTIONS.VIDEOS, videoId);
    await updateDoc(videoRef, videoData);
    logger.debug('Video updated', { videoId });
  } catch (error) {
    const appError = handleFirestoreError(error);
    logger.error('Failed to update video', error as Error, { videoId, videoData });
    throw appError;
  }
}

export async function toggleVideoVisibility(
  videoId: string,
  isPublic: boolean
): Promise<void> {
  try {
    const videoRef = doc(db, COLLECTIONS.VIDEOS, videoId);
    await updateDoc(videoRef, { isPublic });
    logger.debug('Video visibility toggled', { videoId, isPublic });
  } catch (error) {
    const appError = handleFirestoreError(error);
    logger.error('Failed to toggle video visibility', error as Error, { videoId, isPublic });
    throw appError;
  }
}
