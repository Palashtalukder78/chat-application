import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Conversation from "./pages/Conversation";
import Inbox from "./pages/Inbox";
import useAuthChecked from "./hooks/useAuthChecked";
import PrivateRouter from "./components/customRouter/PrivateRouter";
import PublicRouter from "./components/customRouter/PublicRouter";


function App() {
    const auth = useAuthChecked();
    return !auth ? (
      <div>Authentication ......</div>
    ) : (
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRouter>
                <Login />
              </PublicRouter>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRouter>
                <Register />
              </PublicRouter>
            }
          />
          <Route
            path="/inbox"
            element={
              <PrivateRouter>
                <Conversation />
              </PrivateRouter>
            }
          />
          <Route
            path="/inbox/:id"
            element={
              <PrivateRouter>
                <Inbox />
              </PrivateRouter>
            }
          />
        </Routes>
      </Router>
    );
}

export default App;
