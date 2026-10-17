import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import login from "../../assets/login.webp"
import Navbar from '../Navbar/navbar';
import video from '../../assets/video2.mp4'

import '../Navbar/navbar.css';
import {MdOutlineTravelExplore} from 'react-icons/md'
import {AiFillCloseCircle} from 'react-icons/ai'
import {TbGridDots} from 'react-icons/tb'

const Details = () => {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const [near, setNear] = useState(false);

  const handleSubmit= (e) => {
    e.preventDefault();
    console.log("User Login:",{email,password});
  };

  const [active,setActive] = useState('navBar')
    // Function to toggle navBar
    const showNav = () => {
      setActive('navBar activeNavBar')
    }
    // Function to close navBar
    const closeNav = () => {
      setActive('navBar')
    }

    // Track mouse proximity
      useEffect(() => {
        const handleMouseMove = (e) => {
          const navbar = document.querySelector('.navLists');
          const navbarRect = navbar.getBoundingClientRect();
          const mouseX = e.clientX;
          const mouseY = e.clientY;
    
          // Check if the mouse is near the navbar
          const isNear = mouseX >= navbarRect.left - 50 && mouseX <= navbarRect.right + 50 &&
                         mouseY >= navbarRect.top - 50 && mouseY <= navbarRect.bottom + 50;
    
          setNear(isNear);
        };
    
        // Add the mousemove listener
        window.addEventListener('mousemove', handleMouseMove);
    
        // Cleanup on component unmount
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
        };
      }, []);

      const [otp, setOtp] = useState(["", "", "", "", "", ""]);
      const [secondsLeft, setSecondsLeft] = useState(15 * 60); // 15 minutes = 900 seconds
      const inputsRef = useRef([]);

      useEffect(() => {
        const interval = setInterval(() => {
          setSecondsLeft((prev) => {
            if (prev <= 0) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(interval);
      }, []);

      const handleChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return; // allow only digits
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
          inputsRef.current[index + 1].focus();
        }
      };

      const handleKeyDown = (index, event) => {
        if (event.key === "Backspace" && !otp[index] && index > 0) {
          inputsRef.current[index - 1].focus();
        }
      };

      const formatTime = (seconds) => {
        const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
        const ss = String(seconds % 60).padStart(2, "0");
        return `${mm}:${ss}`;
      };

  return (
    <div className='flex'>
      <header className="header flex">
        <div className="logoDiv">
          <Link to='/frontpage' className="logo">
            <h1><MdOutlineTravelExplore className='icons'/>Travel Diary Calender</h1>
          </Link>
        </div>
      
              <div className={active}>
                <ul className="navLists flex">
                  <li className={`navItem ${near ? 'zoomed' : ''}`}>
                    <Link to="/login" className="navLink">Login</Link>
                  </li>
                  <li className={`navItem ${near ? 'zoomed' : ''}`}>
                    <Link to="/about" className="navLink">About the app</Link>
                  </li>
                </ul>
              
              <div onClick={closeNav} className="closeNavBar">
                <AiFillCloseCircle className='icon' />
              </div>
              
              </div>
      
              <div onClick={showNav} className="toggleNavBar">
                <TbGridDots className='icon'/>
              </div>
            </header>

      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 sm:mt-10 mt-20'>
        <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
          <div className='flex justify-center mb-6'>
            <h2 className='text-xl font-medium'>
              Miles and Memories
            </h2>
          </div>
          <h2 className='text-2xl font-bold text-center mb-6'>Hey there! 👋🏻</h2>
          <p className='text-center mb-6'>One time Password</p>
          
          <div style={styles.container} className='mb-6'>
          <div style={styles.otpBox}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                ref={(el) => (inputsRef.current[idx] = el)}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                style={styles.input}
              />
            ))}
          </div>
          <p>Resend OTP: {formatTime(secondsLeft)}</p>
        </div>
           

          <Link to="/navbar">
          <button type='submit' className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition'>
            Submit
          </button>
          </Link>

          {/*} <p className='mt-6 text-center text-sm'>
            Don't have an account? 
            <Link to="/signup" className='text-blue-500 ml-2 hover:text-blue-700 hover:font-bold'>
              Sign Up
            </Link>
          </p> */}

        </form>
      </div>

      <div className='hidden md:block w-1/2 bg-gray-800 relative mt-5 overflow-hidden'>
        <div className='h-full flex flex-col justify-center items-center'>
          
          <video src={video} alt='video' autoPlay loop muted className='h-[729px] w-full object-cover' />
          <div className="absolute inset-0 bg-purple-300 mix-blend-multiply"></div>
        </div>
      </div>
    </div>
  )
};

const styles = {
  container: {
    padding: "20px",
    width: "100%",
    borderRadius: "10px",
    fontFamily: "sans-serif",
    boxShadow: "0px 0px 8px rgba(0,0,0,0.2)",
  },
  otpBox: {
    display: "flex",
    gap: "10px",
    margin: "10px 0",
    background: "rgb(208, 172, 242)",
    padding: "10px",
    borderRadius: "10px",
    justifyContent: "center",
  },
  input: {
    width: "40px",
    height: "40px",
    fontSize: "18px",
    textAlign: "center",
    border: "1px solid #333",
    borderRadius: "6px",
  },
};

export default Details