import { Link, Navigate, useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  // Send an already signed-in member back to the event list.
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Create the account, save the login session, and return to events.
  async function handleRegister(name, email, password) {
    await register(name, email, password);
    navigate("/");
  }

  return (
    <main className="auth-page">
      <RegisterForm onRegister={handleRegister} />
      <p>
        Already a member? <Link to="/login">Log in</Link>
      </p>
    </main>
  );
}
