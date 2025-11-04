import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavigationBar from "./components/Navbar";
import BookList from "./components/bookList";
import Register from "./components/Register";
import Login from "./components/Login";
import BookDetail from "./components/BookDetail";
import NotificationPanel from "./components/NotificationPanel";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;


