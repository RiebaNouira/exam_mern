import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link className="navbar-brand" to="/">
        RunClub Hub
      </Link>

      <div className="navbar-links">
        <Link to="/">Events</Link>
        {user ? (
          <>
            <span>Hi, {user.name}</span>
            <button type="button" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
