
import { useEffect, useRef, useState } from "react";
import { Search, Bell, PlusSquare, Heart } from "lucide-react";

import Sidebar from "./components/Sidebar";
import Stories from "./components/Stories";
import CreatePost from "./components/CreatePost";
import PostCard from "./components/PostCard";
import Suggestions from "./components/Suggestions";
import Profile from "./components/Profile";
import Auth from "./components/Auth";

import { currentUser } from "./data";
import { apiRequest, getToken, clearToken } from "./api";

function normalizePost(post) {
  const author =
    post.user ||
    post.owner ||
    post.createdBy ||
    post.postCreator ||
    {};

  const rawImage = post.image || post.photo || post.postImage;

  const image =
    typeof rawImage === "string"
      ? rawImage
      : rawImage?.url || rawImage?.secure_url || "";

  const rawLikes = post.likes;

  const likes = Array.isArray(rawLikes)
    ? rawLikes.length
    : Number(post.likesCount ?? rawLikes ?? 0) || 0;

  const rawComments = post.comments;

  const comments = Array.isArray(rawComments)
    ? rawComments.map((comment, index) => ({
        id: comment._id || comment.id || index,
        user:
          comment.commentCreator?.username ||
          comment.user?.username ||
          comment.user?.name ||
          comment.commentCreator?.name ||
          (typeof comment.user === "string" ? comment.user : "") ||
          "User",
        text:
          comment.content ||
          comment.text ||
          comment.body ||
          "",
      }))
    : [];

  return {
    id: post._id || post.id,
    user: {
      name:
        author.name ||
        [author.firstName, author.lastName]
          .filter(Boolean)
          .join(" ") ||
        author.username ||
        "User",
      username: author.username || "user",
      avatar:
        author.photo ||
        author.avatar ||
        author.profilePhoto ||
        "https://placehold.co/120x120?text=User",
    },
    location: post.location || "",
    image,
    caption: post.body || post.caption || "",
    likes,
    comments,
    time: post.createdAt
      ? new Date(post.createdAt).toLocaleString()
      : "Recently",
    liked: Boolean(post.isLiked ?? post.liked),
    saved: Boolean(post.isBookmarked ?? post.saved),
  };
}

function getPostList(result) {
  const data = result?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.posts)) return data.posts;
  if (Array.isArray(data?.feed)) return data.feed;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.docs)) return data.docs;

  return [];
}

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("vibely-profile");

      return savedUser
        ? { ...currentUser, ...JSON.parse(savedUser) }
        : currentUser;
    } catch {
      return currentUser;
    }
  });

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState("");
  const [postsRefreshKey, setPostsRefreshKey] = useState(0);

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(getToken())
  );

  const [authChecking, setAuthChecking] = useState(
    () => Boolean(getToken())
  );

  const [postText, setPostText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [activePage, setActivePage] = useState("Home");

  const createPostRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("vibely-profile", JSON.stringify(user));
    } catch (error) {
      console.error("Could not save profile:", error);
    }
  }, [user]);

  // Load the signed-in user's profile
  useEffect(() => {
    if (!getToken()) {
      setAuthChecking(false);
      setIsAuthenticated(false);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      try {
        const result = await apiRequest("/users/profile-data");
        const profile = result?.data?.user ?? result?.data;

        if (!cancelled && profile) {
          setUser((previousUser) => ({
            ...previousUser,
            ...profile,
            name:
              profile.name ||
              [profile.firstName, profile.lastName]
                .filter(Boolean)
                .join(" ") ||
              previousUser.name,
            username: profile.username || previousUser.username,

            // Keep the locally saved profile image after refresh
            avatar: previousUser.avatar?.startsWith("data:image/")
              ? previousUser.avatar
              : profile.avatar ||
                profile.photo ||
                profile.profilePhoto ||
                previousUser.avatar,
          }));

          setIsAuthenticated(true);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Could not load profile:", error);
          clearToken();
          setIsAuthenticated(false);
        }
      } finally {
        if (!cancelled) {
          setAuthChecking(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load posts from the API
  useEffect(() => {
    if (!isAuthenticated || !getToken()) {
      setPosts([]);
      setPostsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadPosts() {
      setPostsLoading(true);
      setPostsError("");

      try {
        const result = await apiRequest("/posts");
        const items = getPostList(result);

        if (!cancelled) {
          setPosts(items.map(normalizePost));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Could not load posts:", error);
          setPostsError(
            error.message || "Could not load posts from the server."
          );
        }
      } finally {
        if (!cancelled) {
          setPostsLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, postsRefreshKey]);

  function handleAuthSuccess(data) {
    const profile = data?.user ?? data?.profile ?? data ?? {};

    setUser((previousUser) => ({
      ...previousUser,
      ...profile,
      name:
        profile.name ||
        [profile.firstName, profile.lastName]
          .filter(Boolean)
          .join(" ") ||
        previousUser.name,
      username: profile.username || previousUser.username,
      avatar: previousUser.avatar?.startsWith("data:image/")
        ? previousUser.avatar
        : profile.avatar ||
          profile.photo ||
          profile.profilePhoto ||
          previousUser.avatar,
    }));

    setActivePage("Home");
    setIsAuthenticated(true);
  }

  function handleSaveProfile(updatedUser) {
    setUser((previousUser) => ({
      ...previousUser,
      ...updatedUser,
    }));
  }

  async function handleToggleLike(postId) {
    const post = posts.find((item) => item.id === postId);

    if (!post) return;

    try {
      await apiRequest(
        `/posts/${encodeURIComponent(postId)}/like`,
        { method: "PUT" }
      );

      setPosts((previousPosts) =>
        previousPosts.map((item) => {
          if (item.id !== postId) return item;

          const liked = !item.liked;

          return {
            ...item,
            liked,
            likes: Math.max(0, item.likes + (liked ? 1 : -1)),
          };
        })
      );
    } catch (error) {
      console.error("Could not update like:", error);
      alert(error.message || "Could not update the like.");
    }
  }

  function handleToggleSave(postId) {
    setPosts((previousPosts) =>
      previousPosts.map((post) =>
        post.id === postId
          ? { ...post, saved: !post.saved }
          : post
      )
    );
  }

  function handleAddComment(postId, text) {
    const newComment = {
      id: Date.now(),
      user: user.username || user.name,
      text,
    };

    setPosts((previousPosts) =>
      previousPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...(post.comments || []), newComment],
            }
          : post
      )
    );
  }

  async function handleCreatePost(event) {
    event.preventDefault();

    const caption = postText.trim();

    if (!caption || !isAuthenticated) return;

    try {
      const result = await apiRequest("/posts", {
        method: "POST",
        body: JSON.stringify({
          body: caption,
        }),
      });

      const createdPost =
        result?.data?.post ||
        result?.data?.newPost ||
        result?.data;

      if (createdPost && (createdPost._id || createdPost.id)) {
        setPosts((previousPosts) => [
          normalizePost(createdPost),
          ...previousPosts,
        ]);
      } else {
        setPostsRefreshKey((previous) => previous + 1);
      }

      setPostText("");
      setPostsError("");
    } catch (error) {
      console.error("Could not create post:", error);
      alert(error.message || "Could not create the post.");
    }
  }

  function handleCreateClick() {
    setActivePage("Home");

    setTimeout(() => {
      createPostRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 0);
  }

  function handleLogout() {
    clearToken();
    setIsAuthenticated(false);
    setActivePage("Home");
    setSearchText("");
    setPostText("");
    setPosts([]);
  }

  const filteredPosts = posts.filter((post) => {
    const search = searchText.toLowerCase();

    return (
      (post.user?.username || "").toLowerCase().includes(search) ||
      (post.user?.name || "").toLowerCase().includes(search) ||
      (post.caption || "").toLowerCase().includes(search)
    );
  });

  if (authChecking) {
    return (
      <div className="auth-page">
        <p>Loading your Vibely account...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onCreate={handleCreateClick}
        user={user}
      />

      <main className="main-content">
        <header className="mobile-header">
          <span className="brand-name">Vibely</span>

          <div>
            <button
              className="icon-button"
              aria-label="Notifications"
              onClick={() => setActivePage("Notifications")}
            >
              <Bell size={22} />
            </button>
          </div>
        </header>

        <header className="topbar">
          <div className="welcome-text">
            <h1>
              Good afternoon, {user.name}
              <span> </span>
            </h1>

            <p>Here's what's happening in your circle today.</p>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={19} />

              <input
                value={searchText}
                onChange={(event) => {
                  setSearchText(event.target.value);
                  setActivePage("Home");
                }}
                placeholder="Search posts..."
                aria-label="Search posts"
              />
            </label>

            <button
              className="notification-button"
              aria-label="Notifications"
              onClick={() => setActivePage("Notifications")}
            >
              <Bell size={21} />
              <span />
            </button>

            <button
              className="profile-avatar-button"
              onClick={() => setActivePage("Profile")}
              aria-label="Open profile"
            >
              <img
                className="avatar topbar-avatar"
                src={user.avatar}
                alt={user.name}
              />
            </button>

            <button
              className="icon-button"
              onClick={handleLogout}
              title="Sign out"
              aria-label="Sign out"
            >
              Sign out
            </button>
          </div>
        </header>

        {activePage === "Profile" ? (
          <Profile
            posts={posts}
            user={user}
            onSaveProfile={handleSaveProfile}
          />
        ) : activePage === "Home" || activePage === "Search" ? (
          <div className="feed-layout">
            <section className="feed-column">
              {activePage === "Home" && (
                <>
                  <div className="section-heading">
                    <div>
                      <h2>Your Circle</h2>
                      <p>See what your friends are sharing</p>
                    </div>

                    <button
                      className="text-button"
                      onClick={() =>
                        alert("All stories are up to date!")
                      }
                    >
                      See all
                    </button>
                  </div>

                  <Stories />
                </>
              )}

              <div
                className="section-heading feed-heading"
                ref={createPostRef}
              >
                <div>
                  <h2>
                    {activePage === "Search"
                      ? "Search Posts"
                      : "Your Feed"}
                  </h2>

                  <p>
                    {activePage === "Search"
                      ? "Find posts by username or caption"
                      : "Fresh updates from your community"}
                  </p>
                </div>

                <button
                  className="new-post-button"
                  onClick={handleCreateClick}
                >
                  <PlusSquare size={17} />
                  Create
                </button>
              </div>

              {activePage === "Home" && (
                <CreatePost
                  value={postText}
                  onChange={setPostText}
                  onSubmit={handleCreatePost}
                />
              )}

              <div className="posts-list">
                {postsLoading && <p>Loading posts...</p>}

                {!postsLoading && postsError && (
                  <div className="empty-state">
                    <h3>Could not load posts</h3>
                    <p>{postsError}</p>

                    <button
                      className="new-post-button"
                      onClick={() =>
                        setPostsRefreshKey((previous) => previous + 1)
                      }
                    >
                      Try again
                    </button>
                  </div>
                )}

                {!postsLoading &&
                  !postsError &&
                  filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onToggleLike={handleToggleLike}
                      onToggleSave={handleToggleSave}
                      onAddComment={handleAddComment}
                    />
                  ))}

                {!postsLoading &&
                  !postsError &&
                  filteredPosts.length === 0 && (
                    <div className="empty-state">
                      <Search size={30} />
                      <h3>No posts found</h3>
                      <p>
                        {searchText
                          ? "Try searching for another name or keyword."
                          : "There are no posts to show yet."}
                      </p>
                    </div>
                  )}
              </div>
            </section>

            {activePage === "Home" && <Suggestions />}
          </div>
        ) : (
          <section className="empty-state page-placeholder">
            <div className="profile-empty-icon">
              {activePage === "Explore" ? (
                <Search size={30} />
              ) : activePage === "Reels" ? (
                <Heart size={30} />
              ) : activePage === "Messages" ? (
                <Bell size={30} />
              ) : (
                <Heart size={30} />
              )}
            </div>

            <h3>{activePage}</h3>
            <p>This page is coming soon to Vibely.</p>

            <button
              className="new-post-button"
              onClick={() => setActivePage("Home")}
            >
              Back to Home
            </button>
          </section>
        )}
      </main>

      <nav className="mobile-nav">
        <button
          className={activePage === "Home" ? "active" : ""}
          onClick={() => setActivePage("Home")}
          aria-label="Home"
        >
          <span>⌂</span>
        </button>

        <button
          className={activePage === "Search" ? "active" : ""}
          onClick={() => setActivePage("Search")}
          aria-label="Search"
        >
          <Search size={23} />
        </button>

        <button
          onClick={handleCreateClick}
          aria-label="Create post"
        >
          <PlusSquare size={23} />
        </button>

        <button
          className={activePage === "Notifications" ? "active" : ""}
          onClick={() => setActivePage("Notifications")}
          aria-label="Notifications"
        >
          <Heart size={23} />
        </button>

        <button
          className={activePage === "Profile" ? "active" : ""}
          onClick={() => setActivePage("Profile")}
          aria-label="Profile"
        >
          <img src={user.avatar} alt="" />
        </button>
      </nav>
    </div>
  );
}
