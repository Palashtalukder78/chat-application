import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Conversation from "./pages/Conversation";
import Inbox from "./pages/Inbox";
import useAuthChecked from "./hooks/useAuthChecked";


function App() {
    const auth = useAuthChecked();
    return !auth ? (
      <div>Authentication ......</div>
    ) : (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/inbox" element={<Conversation />} />
          <Route path="/inbox/:id" element={<Inbox />} />
        </Routes>
      </Router>
    );
}

export default App;
