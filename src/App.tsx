import AuthPage from "./pages/AuthPage/AuthPage";
import HomePage from "./pages/HomePage/HomePage";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;

  return user ? (
    <HomePage email={user.email} />
  ) : (
    <AuthPage />
  );
}
