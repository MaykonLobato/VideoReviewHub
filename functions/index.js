/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { setGlobalOptions } = require('firebase-functions');
const { onRequest } = require('firebase-functions/https');
const logger = require('firebase-functions/logger');
const {
  onDocumentCreated,
  onDocumentUpdated,
} = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Validates YouTube URL format
 */
function isValidYouTubeUrl(url) {
  const youtubeRegex =
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/;
  return youtubeRegex.test(url);
}

/**
 * Cloud Function: Validates video before it's created
 * Deletes the document if YouTube URL is invalid
 */
exports.validateVideoOnCreate = onDocumentCreated(
  {
    document: 'videos/{videoId}',
    maxInstances: 10,
  },
  async (event) => {
    const videoData = event.data.data();
    const videoId = event.params.videoId;

    logger.info(`Validating video ${videoId}`, { videoData });

    // Validate YouTube URL
    if (!videoData.youtubeUrl || !isValidYouTubeUrl(videoData.youtubeUrl)) {
      logger.warn(
        `Invalid YouTube URL for video ${videoId}: ${videoData.youtubeUrl}`
      );

      // Delete the invalid video
      try {
        await db.collection('videos').doc(videoId).delete();
        logger.info(`Deleted invalid video ${videoId}`);
      } catch (error) {
        logger.error(`Error deleting invalid video ${videoId}:`, error);
      }

      return null;
    }

    logger.info(`Video ${videoId} validated successfully`);
    return null;
  }
);

/**
 * Cloud Function: Validates video when it's updated
 * Reverts the update if YouTube URL becomes invalid
 */
exports.validateVideoOnUpdate = onDocumentUpdated(
  {
    document: 'videos/{videoId}',
    maxInstances: 10,
  },
  async (event) => {
    const newData = event.data.after.data();
    const previousData = event.data.before.data();
    const videoId = event.params.videoId;

    // Only validate if youtubeUrl changed
    if (newData.youtubeUrl === previousData.youtubeUrl) {
      return null;
    }

    logger.info(`Validating updated video ${videoId}`);

    // Validate YouTube URL
    if (!newData.youtubeUrl || !isValidYouTubeUrl(newData.youtubeUrl)) {
      logger.warn(
        `Invalid YouTube URL for updated video ${videoId}: ${newData.youtubeUrl}`
      );

      // Revert to previous data
      try {
        await db
          .collection('videos')
          .doc(videoId)
          .set(previousData, { merge: true });
        logger.info(`Reverted invalid update for video ${videoId}`);
      } catch (error) {
        logger.error(`Error reverting invalid video ${videoId}:`, error);
      }

      return null;
    }

    logger.info(`Updated video ${videoId} validated successfully`);
    return null;
  }
);
