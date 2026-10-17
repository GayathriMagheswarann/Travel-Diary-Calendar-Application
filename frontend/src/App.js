import './app.css';
import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/navbar';
import HomePage from './Components/Home/Home';
import Login from './Components/Login/Login';
import SignUp from './Components/Login/SignUp';
import Frontpage from './Components/FrontPage/Frontpage';
import Aboutapp from './Components/FrontPage/Aboutapp';
import Places from './Components/Places/Places';
import ResetPassword from './Components/Login/Resetpassword';
import Details from './Components/Navbar/Details';
import MapContainer from './Components/map/Mapcontainer';
import Schedule from './Components/map/schedule';
import ForgetPassword from './Components/Login/ForgetPassword';


const App = () => {
  return (
    <div>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
         <Routes>
          <Route index element={<Frontpage />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path='/frontpage' element={<Frontpage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/navbar' element={<Navbar />} />
          <Route path='/about' element={<Aboutapp />} />
          <Route path='/places' element={<Places />} />
          <Route path='/details' element={<Details />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path='/otp' element={<Details />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/map" element={<MapContainer />} />
          <Route path="/schedule" element={<Schedule />} />
         </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;