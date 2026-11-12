
import { useState } from "react";
import { currentUser, suggestions } from "../data";

export default function Suggestions() {
  const [people, setPeople] = useState(suggestions);

  function toggleFollow(id) {
    setPeople((previous) =>
      previous.map((person) =>
        person.id === id
          ? { ...person, followed: !person.followed }
          : person
      )
    );
  }

  return (
    <aside className="right-sidebar">
      <div className="current-user">
        <img
          className="avatar"
          src={currentUser.avatar}
          alt={currentUser.name}
        />

        <div className="suggestion-info">
          <strong>{currentUser.username}</strong>
          <span>{currentUser.name}</span>
        </div>

        <span className="you-label">You</span>
      </div>

      <div className="suggestions-heading">
        <strong>Suggested for you</strong>
        <button onClick={() => alert("You're all caught up!")}>
          See All
        </button>
      </div>

      <div className="suggestions-list">
        {people.map((person) => (
          <div className="suggestion-person" key={person.id}>
            <img
              className="avatar"
              src={person.avatar}
              alt={person.name}
            />

            <div className="suggestion-info">
              <strong>{person.username}</strong>
              <span>{person.name}</span>
            </div>

            <button
              className={`follow-button ${
                person.followed ? "following" : ""
              }`}
              onClick={() => toggleFollow(person.id)}
            >
              {person.followed ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>

      <p className="sidebar-footer">
        About · Help · Privacy · Terms
      </p>

      <p className="copyright">© 2026 VIBELY</p>
    </aside>
  );
}
