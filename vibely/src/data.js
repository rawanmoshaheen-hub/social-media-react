
export const currentUser = {
  id: 1,
  name: "Rawan Mohammed",
  username: "rawan.dev",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces",
};

export const stories = [
  {
    id: 1,
    name: "Your story",
    avatar: currentUser.avatar,
    isOwn: true,
  },
  {
    id: 2,
    name: "Mariam",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop&crop=faces",
  },
  {
    id: 3,
    name: "Ahmed",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces",
  },
  {
    id: 4,
    name: "Salma",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop&crop=faces",
  },
  {
    id: 5,
    name: "Omar",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=faces",
  },
  {
    id: 6,
    name: "Nour",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=faces",
  },
];

export const initialPosts = [
  {
    id: 1,
    user: {
      name: "Mariam Hassan",
      username: "mariam.h",
      avatar: stories[1].avatar,
    },
    location: "Cairo, Egypt",
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900&auto=format&fit=crop",
    caption:
      "Little moments, big memories. Taking a break and enjoying the beauty around me 💜",
    likes: 124,
    comments: [
      { id: 1, user: "Salma", text: "Such a beautiful view! 💜" },
      { id: 2, user: "Nour", text: "Love this!" },
    ],
    time: "2 hours ago",
    liked: false,
    saved: false,
  },
  {
    id: 2,
    user: {
      name: "Ahmed Ali",
      username: "ahmed.creates",
      avatar: stories[2].avatar,
    },
    location: "New Cairo",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop",
    caption:
      "A new day, a new idea. Working on something exciting! ✨",
    likes: 86,
    comments: [
      { id: 3, user: "Mariam", text: "Can't wait to see it!" },
    ],
    time: "4 hours ago",
    liked: false,
    saved: false,
  },
];

export const suggestions = [
  {
    id: 1,
    name: "Salma Adel",
    username: "salma.adel",
    avatar: stories[3].avatar,
    followed: false,
  },
  {
    id: 2,
    name: "Omar Khaled",
    username: "omar.k",
    avatar: stories[4].avatar,
    followed: false,
  },
  {
    id: 3,
    name: "Nour Samy",
    username: "nour.samy",
    avatar: stories[5].avatar,
    followed: false,
  },
];
