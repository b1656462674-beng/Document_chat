import { Contact, FavoriteItem, NotepadNote, AdminConfig } from './types';

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'lila',
    name: 'lila',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    isVIP: true,
    vipLevel: 'VIP+',
    unreadCount: 0,
    lastSeen: '18:33',
    flag: '🇺🇸',
    messages: [
      {
        id: 'msg-time-1',
        sender: 'other',
        type: 'text',
        content: 'Monday 11:41',
        timestamp: '11:41'
      },
      {
        id: 'msg-1',
        sender: 'other',
        type: 'text',
        content: '噢',
        timestamp: '11:41'
      },
      {
        id: 'msg-2',
        sender: 'other',
        type: 'text',
        content: '测测测试',
        timestamp: '11:42'
      },
      {
        id: 'msg-time-2',
        sender: 'other',
        type: 'text',
        content: '14:39',
        timestamp: '14:39'
      },
      {
        id: 'msg-3',
        sender: 'other',
        type: 'text',
        content: 'Post Embed: Benguuuuuuuuuu... ☀️💙',
        timestamp: '14:39'
      },
      {
        id: 'msg-4',
        sender: 'me',
        type: 'text',
        content: 'Thanks for liking my post!',
        timestamp: '14:40'
      },
      {
        id: 'msg-5',
        sender: 'me',
        type: 'sticker',
        stickerUrl: 'rose_sticker',
        timestamp: '14:41'
      },
      {
        id: 'msg-6',
        sender: 'other',
        type: 'gift',
        giftTitle: 'Gift sent! Gift Sent to lila',
        timestamp: '14:42'
      },
      {
        id: 'msg-7',
        sender: 'me',
        type: 'text',
        content: 'Thanks for gifting my post!',
        timestamp: '14:45',
        isRead: true
      }
    ]
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80',
    isVIP: false,
    unreadCount: 0,
    lastSeen: '05/11',
    messages: [
      {
        id: 'ai-msg-1',
        sender: 'other',
        type: 'text',
        content: '我回 “haha” 会不会显得太冷淡？',
        timestamp: '05/11'
      }
    ]
  },
  {
    id: 'lin-fan',
    name: '林凡啊啊啊啊啊啊啊...',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    isVIP: true,
    vipLevel: 'VIP+',
    unreadCount: 0,
    lastSeen: 'Friday',
    flag: '🇯🇵',
    messages: [
      {
        id: 'lf-msg-1',
        sender: 'other',
        type: 'text',
        content: "Let's start a Friend Streak together!",
        timestamp: 'Friday'
      }
    ]
  },
  {
    id: 'group-chat',
    name: '蹦蹦, 林凡啊啊啊啊...',
    avatar: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=150&h=150&q=80',
    isVIP: false,
    unreadCount: 0,
    lastSeen: '05/25',
    messages: [
      {
        id: 'group-msg-1',
        sender: 'other',
        type: 'text',
        content: '😟 😜',
        timestamp: '05/25'
      }
    ]
  },
  {
    id: 'live-voiceroom',
    name: 'Live & Voiceroom',
    avatar: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=150&h=150&q=80',
    isVIP: false,
    unreadCount: 99,
    lastSeen: '16:58',
    messages: [
      {
        id: 'live-msg-1',
        sender: 'other',
        type: 'text',
        content: '🎙️熊与肉松 started a Voiceroom!',
        timestamp: '16:58'
      }
    ]
  },
  {
    id: 'rose',
    name: 'rose.',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&h=150&q=80',
    isVIP: false,
    unreadCount: 1,
    lastSeen: '15:42',
    flag: '🇨🇳',
    messages: [
      {
        id: 'rose-msg-1',
        sender: 'other',
        type: 'text',
        content: '😊 Stickers',
        timestamp: '15:42'
      }
    ]
  }
];

export const INITIAL_NOTEPAD: NotepadNote[] = [
  {
    id: 'np-1',
    sender: 'me',
    type: 'text',
    content: '一年七千多',
    timestamp: '06/01 15:20'
  },
  {
    id: 'np-2',
    sender: 'me',
    type: 'text',
    content: '所以又给我加了七千',
    timestamp: '06/01 15:22'
  },
  {
    id: 'np-3',
    sender: 'me',
    type: 'text',
    content: '然后总包42.7万',
    timestamp: '06/01 15:24'
  },
  {
    id: 'np-4',
    sender: 'me',
    type: 'text',
    content: '然后给我补充了一下 说入职会发个售价几百的电动牙刷',
    timestamp: '06/01 15:26'
  },
  {
    id: 'np-5',
    sender: 'me',
    type: 'text',
    content: '然后说总包都快43w了',
    timestamp: '06/01 15:28'
  },
  {
    id: 'np-6',
    sender: 'me',
    type: 'text',
    content: 'Post Embed: Ayesha khan的动态 / A pretty girl with a pretty heart 💗...',
    timestamp: '06/01 15:30'
  },
  {
    id: 'np-7',
    sender: 'me',
    type: 'text',
    content: '就好',
    timestamp: '12:01'
  },
  {
    id: 'np-8',
    sender: 'me',
    type: 'text',
    content: '感谢你打赏我的帖文',
    timestamp: '12:37'
  }
];

export const INITIAL_FAVORITES: FavoriteItem[] = [
  {
    id: 'fav-1',
    type: 'text',
    title: "I don't know",
    sourceName: 'lila',
    content: "I don't know",
    timestamp: '2026-07-02 10:30'
  },
  {
    id: 'fav-2',
    type: 'text',
    title: 'When two hearts come together, the world becomes just a background. 💫...',
    sourceName: 'lin-fan',
    content: 'When two hearts come together, the world becomes just a background. 💫...',
    timestamp: '2026-07-02 11:15'
  },
  {
    id: 'fav-3',
    type: 'text',
    title: '我所知道的是冒险并不是什么大事，坚持决定才是大事。我一直在努力确保每一天都像...',
    sourceName: 'rose',
    content: '我所知道的是冒险并不是什么大事，坚持决定才是大事。我一直在努力确保每一天都像...',
    timestamp: '2026-07-03 09:20'
  },
  {
    id: 'fav-4',
    type: 'text',
    title: '哟！🤨\n嗯... 我是 Saam的...',
    sourceName: 'lila',
    content: '哟！🤨\n嗯... 我是 Saam的...',
    timestamp: '2026-07-04 15:40'
  }
];

export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  ht_file_message_enable: true,
  ht_file_upload_policy: {
    allowedTypes: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'pptx', 'ppt', 'zip', 'rar', '7z', 'mp3', 'm4a', 'wav', 'aac'],
    allowedZipTypes: ['zip', 'rar', '7z'],
    maxSizeMB: 50,
    maxUploadsCount: 9
  },
  ht_file_preview_policy: {
    allowedPreviewTypes: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'pptx', 'ppt', 'mp3', 'm4a', 'wav', 'aac'],
    allowedDownloadTypes: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'pptx', 'ppt', 'zip', 'rar', '7z', 'mp3', 'm4a', 'wav', 'aac'],
    downloadEnabled: true
  },
  ht_external_share_targets: {
    chat: true,
    group: true,
    notepad: true,
    favorites: true
  },
  ht_collection_file_entry_enable: true
};
