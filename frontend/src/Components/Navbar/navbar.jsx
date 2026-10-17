import React, { useState, useEffect, useRef } from 'react'
import { FiSend } from 'react-icons/fi';
import {MdOutlineTravelExplore} from 'react-icons/md'
import {AiFillCloseCircle} from 'react-icons/ai'
import {TbGridDots} from 'react-icons/tb';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './navbar.css';
import '../Footer/footer.css';
import video from '../../assets/flower.mp4';
import Home from '../Home/Home';
import Main from '../Main/Main';
import Details from './Details';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [active,setActive] = useState('navBar');
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate(); 
  const [currentUser, setCurrentUser] = useState(null);

  // Function to toggle navBar
  const showNav = () => {
    setActive('navBar activeNavBar')
  }
  // Function to close navBar
  const closeNav = () => {
    setActive('navBar')
  }
  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setShowProfile(false);
    }
  };

  const handleDropdownClick = () => {
    navigate('/'); // Navigate to the "details" page
  };
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  });

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    unsubscribe();
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  return (
    <div>
    <section className='navBarsec'>
      <header className="header flex">
        <div className="logoDiv">
          <Link to='/frontpage' className="logo">
            <h1><MdOutlineTravelExplore className='icons'/>Travel Diary Calender</h1>
          </Link>
        </div>

        <div className={active}>
          <ul className="navLists flex">
            {/*<li className="navItem">
              <a href="#" className="navLink">Signup</a>
            </li>
            <li className="navItem">
              <a href="#" className="navLink">Login</a>
            </li>*/}
            <li className="navItem">
              <a href="#" className="navLink">About us</a>
            </li>

            <button className='btn'>
              <Link to="/places">PLACES</Link>
            </button>

            <button className='btn'>
              <Link to="/map">MAP</Link>
            </button>


            {/* User Icon with hover + click + outside close */}
            <div
              className="userProfile"
              ref={profileRef}
              onMouseEnter={() => setShowProfile(true)}
              onClick={() => setShowProfile(true)}
            >
              <FaUserCircle className='icon userIcon' />
              {showProfile && (
                <div className="profileDropdown" onClick={handleDropdownClick}>
                 <p><strong className='text-xl'>Name:</strong> {currentUser?.displayName || 'Anonymous'}</p>
                 <p><strong className='text-xl'>Email:</strong> {currentUser?.email}</p>


                  <div className="lineAboveLogout" />
                  <button className="logoutBtn">Logout</button>
                  
                </div>
              )}
            </div>
          </ul>

          <div onClick={closeNav} className="closeNavBar">
            <AiFillCloseCircle className='icon'/>
          </div>

        </div>

        <div onClick={showNav} className="toggleNavBar">
          <TbGridDots className='icon'/>
        </div>
      </header>
      <Home />
    </section>
    <Main />

    <section className="footer">
            <div className="videoDiv">
              <video src={video} loop autoPlay muted type="flower/mp4"></video>
            </div>
    
            <div className="secContent container">
              <div className="contactDiv">
                <div data-aos="fade-up" className="text">
                  <small>KEEP IN TOUCH</small>
                  <h2>Travel with us</h2>
                </div>
    
                <div className="inputDiv flex">
                  <input data-aos="fade-up" type="text" placeholder='Enter Email' />
                  <button data-aos="fade-up" className='btn flex' type='submit'>
                    SEND <FiSend className='icon' />
                  </button>
                </div>
              </div>
    
              <div className="footerCard flex">
                <div className="footerIntro flex">
                  <div className="logoDiv">
                    <a href="#" className='logo flex'>
                      <MdOutlineTravelExplore className='icon' />
                      Travel.
                    </a>
                  </div>
    
                  <div data-aos="fade-up" className="footerPara">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem pariatur quas ipsum, repellat inventore et maxime voluptatum explicabo impedit doloribus ratione iusto accusantium aliquam minima! Repellat quidem tempore ex eveniet?
                  </div>
                </div>
              </div>
    
              <div className="footerDiv flex">
                <small>COPYRIGHTS RESERVED - 2025</small>
              </div>
            </div>
          </section>
    </div>
    
  )
}

export default Navbar