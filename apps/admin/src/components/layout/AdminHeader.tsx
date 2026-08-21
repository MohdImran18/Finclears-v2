"use client";

import { Bell, Search, ChevronDown } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="adminHeader">
      <div className="headerSearch">
        <Search size={17} />
        <input
          type="search"
          placeholder="Search leads, customers, services..."
        />
        <kbd>⌘ K</kbd>
      </div>

      <div className="headerRight">
        <button
          type="button"
          className="headerIconButton"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="notificationDot" />
        </button>

        <div className="profile">
          <div className="profileAvatar">MI</div>

          <div className="profileInfo">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>

          <ChevronDown size={15} />
        </div>
      </div>
    </header>
  );
}
