import type { PropsWithChildren } from "react";
import type { User } from "../types";

interface LayoutProps extends PropsWithChildren {
  user: User | null;
  onLogout: () => void;
}

export default function Layout({ children, user, onLogout }: LayoutProps) {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-copy">
          <p className="eyebrow">Career Command Center</p>
          <h1>JobTracker</h1>
          <p className="subtle">
            Track applications, interviews, and offers without losing the
            thread.
          </p>
        </div>

        <div className="topbar-actions">
          <div className="user-chip">
            <span>{user?.name ?? "Candidate"}</span>
            <small>{user?.email ?? "Signed in"}</small>
          </div>
          <button className="button button-ghost" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
