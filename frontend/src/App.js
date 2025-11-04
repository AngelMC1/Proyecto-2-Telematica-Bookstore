import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/Navbar";
import BookList from "./components/bookList";
import Register from "./components/Register";
import Login from "./components/Login";
import BookDetail from "./components/BookDetail";
import Cart from "./components/Cart";

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;


