export interface Feedback {
  id: string;
  userEmail: string;
  userName: string;
  videoTitle: string;
  comment: string;
  isRead: boolean;
  createdAt: Date;
}

export interface InsertFeedback {
  userEmail: string;
  userName: string;
  videoTitle: string;
  comment: string;
}
