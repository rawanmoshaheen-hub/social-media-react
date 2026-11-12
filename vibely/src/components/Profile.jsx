
import { useState } from "react";
import {
  Settings,
  Grid3X3,
  Heart,
  Camera,
  X,
  MessageCircle,
} from "lucide-react";

export default function Profile({ posts, user, onSaveProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(
    user.bio || "✨ Sharing little moments and big dreams."
  );
  const [avatar, setAvatar] = useState(user.avatar);

  const userPosts = posts.filter(
    (post) => post.user?.username === user.username
  );

  const likedPosts = posts.filter((post) => post.liked);

  const displayedPosts =
    activeTab === "posts" ? userPosts : likedPosts;

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function handleSave(event) {
    event.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    onSaveProfile({
      ...user,
      name: name.trim(),
      bio: bio.trim(),
      avatar,
    });

    setIsEditing(false);
  }

  function handleCancel() {
    setName(user.name);
    setBio(user.bio || "✨ Sharing little moments and big dreams.");
    setAvatar(user.avatar);
    setIsEditing(false);
  }

  return (
    <section className="profile-page">
      <div className="profile-header">
        <img
          className="profile-avatar"
          src={user.avatar}
          alt={user.name}
        />

        <div className="profile-info">
          <div className="profile-title">
            <h2>{user.username}</h2>

            <button
              className="profile-edit-button"
              onClick={() => setIsEditing(true)}
            >
              Edit profile
            </button>

            <button
              className="profile-settings-button"
              aria-label="Settings"
              onClick={() => alert("Settings coming soon!")}
            >
              <Settings size={20} />
            </button>
          </div>

          <div className="profile-stats">
            <span>
              <strong>{userPosts.length}</strong> posts
            </span>
            <span>
              <strong>120</strong> followers
            </span>
            <span>
              <strong>180</strong> following
            </span>
          </div>

          <div className="profile-bio">
            <strong>{user.name}</strong>
            <p>
              {user.bio || "✨ Sharing little moments and big dreams."}
            </p>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="edit-profile-card">
          <div className="edit-profile-heading">
            <h3>Edit profile</h3>
            <button onClick={handleCancel} aria-label="Close">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="edit-avatar-section">
              <img src={avatar} alt="Profile preview" />

              <label className="change-photo-button">
                <Camera size={17} />
                Change photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <label className="edit-field">
              Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={50}
                required
                placeholder="Your name"
              />
            </label>

            <label className="edit-field">
              Bio
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                maxLength={150}
                rows={3}
                placeholder="Write something about yourself..."
              />
              <small>{bio.length}/150</small>
            </label>

            <div className="edit-profile-actions">
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit">Save changes</button>
            </div>
          </form>
        </div>
      )}

      <div className="profile-tabs">
        <button
          type="button"
          className={`profile-tab ${
            activeTab === "posts" ? "active" : ""
          }`}
          onClick={() => setActiveTab("posts")}
        >
          <Grid3X3 size={17} />
          <span>POSTS</span>
        </button>

        <button
          type="button"
          className={`profile-tab ${
            activeTab === "liked" ? "active" : ""
          }`}
          onClick={() => setActiveTab("liked")}
        >
          <Heart size={17} />
          <span>LIKED</span>
        </button>
      </div>

      {displayedPosts.length > 0 ? (
        <div className="profile-posts-grid">
          {displayedPosts.map((post) => (
            <div className="profile-post" key={post.id}>
              {post.image ? (
                <img src={post.image} alt={post.caption || "Post"} />
              ) : (
                <div className="profile-text-post">
                  <p>{post.caption}</p>
                  {activeTab === "liked" && (
                    <small>@{post.user?.username}</small>
                  )}
                </div>
              )}

              {activeTab === "liked" && (
                <div className="profile-post-overlay">
                  <Heart size={18} fill="white" />
                  <span>{post.likes || 0}</span>
                  <MessageCircle size={18} />
                  <span>{(post.comments || []).length}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="profile-empty">
          <div className="profile-empty-icon">
            {activeTab === "posts" ? (
              <Grid3X3 size={32} />
            ) : (
              <Heart size={32} />
            )}
          </div>

          <h3>
            {activeTab === "posts"
              ? "No posts yet"
              : "No liked posts yet"}
          </h3>

          <p>
            {activeTab === "posts"
              ? "When you share posts, they'll appear here."
              : "Posts you like will appear here."}
          </p>
        </div>
      )}
    </section>
  );
}
