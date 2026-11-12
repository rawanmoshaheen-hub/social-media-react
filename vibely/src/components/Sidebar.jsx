
import {
  House,
  Search,
  Compass,
  Clapperboard,
  Send,
  Heart,
  PlusSquare,
  Menu,
} from "lucide-react";

const menuItems = [
  { label: "Home", icon: House },
  { label: "Search", icon: Search },
  { label: "Explore", icon: Compass },
  { label: "Reels", icon: Clapperboard },
  { label: "Messages", icon: Send },
  { label: "Notifications", icon: Heart },
  { label: "Create", icon: PlusSquare },
];

export default function Sidebar({
  activePage,
  onNavigate,
  onCreate,
  user,
}) {
  return (
    <aside className="sidebar">
      <button
        className="brand"
        onClick={() => onNavigate("Home")}
        aria-label="Vibely home"
      >
        <span className="brand-icon">v.</span>
        <span className="brand-name">Vibely</span>
      </button>

      <nav className="sidebar-nav">
        {menuItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`nav-item ${
              activePage === label ? "active" : ""
            }`}
            onClick={() => {
              if (label === "Create") {
                onCreate();
              } else {
                onNavigate(label);
              }
            }}
          >
            <Icon size={23} strokeWidth={1.8} />

            <span>{label}</span>

            {label === "Messages" && (
              <span className="message-badge">2</span>
            )}
          </button>
        ))}

        <button
          className={`nav-item ${
            activePage === "Profile" ? "active" : ""
          }`}
          onClick={() => onNavigate("Profile")}
        >
          <img
            className="nav-avatar"
            src={user.avatar}
            alt={user.name}
          />

          <span>Profile</span>
        </button>
      </nav>

      <button
        className="nav-item more-button"
        onClick={() => alert("More options coming soon!")}
      >
        <Menu size={23} />
        <span>More</span>
      </button>
    </aside>
  );
}
