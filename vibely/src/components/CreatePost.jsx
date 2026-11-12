
import { ImagePlus, Smile } from "lucide-react";
import { currentUser } from "../data";

export default function CreatePost({ value, onChange, onSubmit }) {
  return (
    <section className="create-post">
      <div className="create-post-top">
        <img
          className="avatar"
          src={currentUser.avatar}
          alt={currentUser.name}
        />

        <form className="create-post-form" onSubmit={onSubmit}>
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="What's on your mind?"
            aria-label="Write a post"
          />
          <button
            type="submit"
            className="post-submit"
            disabled={!value.trim()}
          >
            Post
          </button>
        </form>
      </div>

      <div className="create-post-actions">
        <button
          type="button"
          onClick={() => alert("Photo upload coming soon!")}
        >
          <ImagePlus size={19} color="#E879A9" />
          <span>Photo</span>
        </button>

        <button
          type="button"
          onClick={() => onChange(value + " 💜")}
        >
          <Smile size={19} color="#8B5CF6" />
          <span>Feeling</span>
        </button>
      </div>
    </section>
  );
}
