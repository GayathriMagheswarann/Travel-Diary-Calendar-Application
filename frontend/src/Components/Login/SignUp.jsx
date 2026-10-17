import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import video from "../../assets/video2.mp4";
import '../Navbar/navbar.css';
import { MdOutlineTravelExplore } from 'react-icons/md';
import { AiFillCloseCircle } from 'react-icons/ai';
import { TbGridDots } from 'react-icons/tb';

import { auth } from '../../firebase'; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [near, setNear] = useState(false);
  const [active, setActive] = useState('navBar');

  const navigate = useNavigate(); 

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name || !email || !password) {
    alert("Please fill in all fields");
    return;
  }

  if (!email.endsWith("@gmail.com")) {
    alert("Only Gmail accounts are allowed for sign up.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    alert("Signup successful!");
    navigate("/otp");
  } catch (error) {
    console.error("Firebase signup error:", error.message);
    alert(`Signup error: ${error.message}`);
  }
};

const handleGoogleSignup = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    alert("Google Sign-up successful!");
    navigate("/navbar");
  } catch (error) {
    console.error("Google signup error:", error.message);
    alert(`Google signup failed: ${error.message}`);
  }
};


  const showNav = () => setActive('navBar activeNavBar');
  const closeNav = () => setActive('navBar');

  useEffect(() => {
    const handleMouseMove = (e) => {
      const navbar = document.querySelector('.navLists');
      const navbarRect = navbar.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const isNear =
        mouseX >= navbarRect.left - 50 &&
        mouseX <= navbarRect.right + 50 &&
        mouseY >= navbarRect.top - 50 &&
        mouseY <= navbarRect.bottom + 50;

      setNear(isNear);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className='flex'>
      <header className="header flex">
        <div className="logoDiv">
          <Link to='/frontpage' className="logo">
            <h1><MdOutlineTravelExplore className='icons' />Travel Diary Calendar</h1>
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
          <TbGridDots className='icon' />
        </div>
      </header>

      <div className='hidden md:block w-1/2 bg-gray-800 relative mt-5 overflow-hidden'>
        <div className='h-full flex flex-col justify-center items-center'>
          <video src={video} autoPlay loop muted className='h-[729px] w-full object-cover' />
          <div className="absolute inset-0 bg-purple-300 mix-blend-multiply"></div>
        </div>
      </div>

      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 sm:mt-20 mt-28'>
        <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
          <div className='flex justify-center mb-6'>
            <h2 className='text-xl font-medium'>Miles and Memories</h2>
          </div>

          <h2 className='text-2xl font-bold text-center mb-6'>Hey there! 👋🏻</h2>
          <p className='text-center mb-6'>Enter your name and password to sign up</p>

          <div className='mb-4'>
            <label className='block text-sm font-semibold mb-2'>Name</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full p-2 border rounded'
              placeholder='Enter your Name'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-semibold mb-2'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-2 border rounded'
              placeholder='Enter your email address'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-semibold mb-2'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border rounded'
              placeholder='Enter your password'
            />
          </div>
          
          <button type='submit' className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition'>
            Sign Up
          </button>
          <div className='my-4 flex items-center justify-center'>
            <span className='text-gray-400 text-sm'>or</span>
          </div>

          <button
            type='button'
            onClick={handleGoogleSignup}
            className='w-full bg-red-500 text-white p-2 rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2'
          >
            <i className="fab fa-google"></i> Continue with Google
          </button>

          <p className='mt-6 text-center text-sm'>
            Already have an account?
            <Link to="/login" className='text-blue-500 ml-2 hover:text-blue-700 hover:font-bold'>
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
