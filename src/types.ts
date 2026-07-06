export interface FileMessage {
  name: string;
  extension: string; // e.g., 'docx', 'pdf', 'zip', 'mp3', 'xlsx', 'pptx'
  size: string; // e.g., '2.4 MB'
  status: 'uploading' | 'success' | 'failed' | 'risk_blocked';
  progress?: number; // 0-100 for uploading state
}

export interface Message {
  id: string;
  sender: 'me' | 'other';
  type: 'text' | 'sticker' | 'gift' | 'file';
  content?: string;
  stickerUrl?: string; // or an emoji / descriptive name for mockup
  giftTitle?: string;
  file?: FileMessage;
  timestamp: string;
  isRead?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  isVIP: boolean;
  vipLevel?: string; // e.g., 'VIP+'
  unreadCount?: number;
  lastSeen?: string;
  flag?: string; // emoji flag e.g., '🇯🇵', '🇺🇸'
  messages: Message[];
}

export interface NotepadNote {
  id: string;
  sender: 'me';
  type: 'text' | 'file';
  content?: string;
  file?: FileMessage;
  timestamp: string;
}

export interface FavoriteItem {
  id: string;
  type: 'text' | 'translation' | 'word' | 'file';
  title: string; // File name or text content
  fileSize?: string;
  fileExt?: string;
  sourceName: string; // Who sent it or where it's from
  content?: string; // Text content if text type
  originalText?: string;
  translatedText?: string;
  timestamp: string;
}

export interface AdminConfig {
  ht_file_message_enable: boolean;
  ht_file_upload_policy: {
    allowedTypes: string[];
    allowedZipTypes: string[];
    maxSizeMB: number;
    maxUploadsCount: number;
  };
  ht_file_preview_policy: {
    allowedPreviewTypes: string[];
    allowedDownloadTypes: string[];
    downloadEnabled: boolean;
  };
  ht_external_share_targets: {
    chat: boolean;
    group: boolean;
    notepad: boolean;
    favorites: boolean;
  };
  ht_collection_file_entry_enable: boolean;
}
