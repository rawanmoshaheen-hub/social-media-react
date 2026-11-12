
import { stories } from "../data";
import { Plus } from "lucide-react";

export default function Stories() {
  return (
    <section className="stories-card">
      <div className="stories-list">
        {stories.map((story) => (
          <button
            className="story-item"
            key={story.id}
            onClick={() =>
              alert(
                story.isOwn
                  ? "Story creation coming soon!"
                  : `${story.name}'s story`
              )
            }
          >
            <span
              className={`story-ring ${
                story.isOwn ? "own-story" : ""
              }`}
            >
              <img src={story.avatar} alt={story.name} />
              {story.isOwn && (
                <span className="story-add">
                  <Plus size={13} />
                </span>
              )}
            </span>
            <span className="story-name">{story.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
