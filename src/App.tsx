import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/auth-page";
import RewardsHub from "./pages/rewards-hub";
import "./index.css";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center">Loading...</p>;

  return user ? <RewardsHub /> : <AuthPage />;
}

export default App;
