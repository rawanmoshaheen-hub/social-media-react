
import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  MapPin,
} from "lucide-react";

export default function PostCard({
  post,
  onToggleLike,
  onToggleSave,
  onAddComment,
}) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const liked = Boolean(post.liked);
  const saved = Boolean(post.saved);
  const likes = post.likes || 0;
  const comments = post.comments || [];

  function addComment(event) {
    event.preventDefault();

    if (!commentText.trim()) return;

    onAddComment(post.id, commentText.trim());

    setCommentText("");
    setShowComments(true);
  }

  return (
    <article className="post-card">
      <div className="post-header">
        <div className="post-user">
          <img
            className="avatar"
            src={post.user.avatar}
            alt={post.user.name}
          />

          <div className="post-user-info">
            <strong>{post.user.username}</strong>
            <span>
              <MapPin size={12} />
              {post.location}
            </span>
          </div>
        </div>

        <button
          className="icon-button"
          aria-label="More post options"
          onClick={() => alert("More options coming soon!")}
        >
          <MoreHorizontal size={23} />
        </button>
      </div>

      {post.image && (
        <img
          className="post-image"
          src={post.image}
          alt={post.caption}
          loading="lazy"
        />
      )}

      <div className="post-content">
        <div className="post-actions">
          <div className="post-actions-left">
            <button
              className={`icon-button like-button ${
                liked ? "liked" : ""
              }`}
              onClick={() => onToggleLike(post.id)}
              aria-label={liked ? "Unlike post" : "Like post"}
            >
              <Heart
                size={24}
                fill={liked ? "currentColor" : "none"}
              />
            </button>

            <button
              className="icon-button"
              onClick={() => setShowComments(!showComments)}
              aria-label="Toggle comments"
            >
              <MessageCircle size={24} />
            </button>

            <button
              className="icon-button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "Vibely post",
                    text: post.caption,
                  }).catch(() => {});
                } else if (navigator.clipboard) {
                  navigator.clipboard
                    .writeText(post.caption)
                    .then(() => alert("Post text copied!"))
                    .catch(() => alert(post.caption));
                } else {
                  alert(post.caption);
                }
              }}
              aria-label="Share post"
            >
              <Send size={23} />
            </button>
          </div>

          <button
            className={`icon-button ${
              saved ? "saved-button" : ""
            }`}
            onClick={() => onToggleSave(post.id)}
            aria-label={saved ? "Unsave post" : "Save post"}
          >
            <Bookmark
              size={23}
              fill={saved ? "currentColor" : "none"}
            />
          </button>
        </div>

        <p className="likes-count">
          {likes.toLocaleString()} likes
        </p>

        <p className="post-caption">
          <strong>{post.user.username}</strong>{" "}
          {post.caption}
        </p>

        <button
          className="view-comments"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments
            ? "Hide comments"
            : `View all ${comments.length} comments`}
        </button>

        {showComments && (
          <div className="comments-list">
            {comments.map((comment) => (
              <p key={comment.id} className="comment-item">
                <strong>{comment.user}</strong> {comment.text}
              </p>
            ))}
          </div>
        )}

        <form className="comment-form" onSubmit={addComment}>
          <input
            value={commentText}
            onChange={(event) =>
              setCommentText(event.target.value)
            }
            placeholder="Add a comment..."
            aria-label="Write a comment"
          />

          <button type="submit" disabled={!commentText.trim()}>
            Post
          </button>
        </form>

        <span className="post-time">{post.time}</span>
      </div>
    </article>
  );
}
