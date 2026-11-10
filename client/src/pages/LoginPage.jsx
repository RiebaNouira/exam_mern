import { Link, Navigate, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Send an already signed-in member back to the event list.
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Save the login session, then return to the event list.
  async function handleLogin(email, password) {
    await login(email, password);
    navigate("/");
  }

  return (
    <main className="auth-page">
      <LoginForm onLogin={handleLogin} />
      <p>
        New to the club? <Link to="/register">Create an account</Link>
      </p>
    </main>
  );
}
