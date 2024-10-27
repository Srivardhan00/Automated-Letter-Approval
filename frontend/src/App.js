import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mainpage from "./pages/Mainpage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Outpass from "./forms/Outpass";
import Attendance from "./forms/Attendance";
import Bonafide from "./forms/Bonafide";
import Internship from "./forms/Internship";
import Homepass from "./forms/Homepass";
import ConductEvent from "./forms/ConductEvent";
import History from "./pages/History";
import Error from "./pages/Error";
import Status from "./pages/Status";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <div>
      <BrowserRouter>
      <ToastContainer />
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/outpass" element={<Outpass />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/bonafide" element={<Bonafide />} />
          <Route path="/internship" element={<Internship />} />
          <Route path="/homepass" element={<Homepass />} />
          <Route path="/to-conduct-event" element={<ConductEvent />} />
          <Route path="/history" element={<History />} />
          <Route path="/status" element={<Status />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
