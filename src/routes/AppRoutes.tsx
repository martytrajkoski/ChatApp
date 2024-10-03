import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../Pages/Login-Register/Login"
import Register from "../Pages/Login-Register/Register";
import Home from "../Pages/Home/Home"
import ActiveChat from "../Components/ActiveChat/ActiveChat";
import Profile from "../Pages/Profile/Profile";
import Loader from "../Components/Loader/Loader";

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/chat" replace />} />
                <Route path="/chat" element={<Home />}>
                    <Route path=":id" element={<ActiveChat />} />
                </Route>
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/loader" element={<Loader />}></Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;