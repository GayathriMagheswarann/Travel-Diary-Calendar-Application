import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import img1 from '../../assets/img1.jpeg';
import video from '../../assets/flower.mp4';
import { FiSend } from 'react-icons/fi';
import Aos from 'aos';
import 'aos/dist/aos.css'; 
import '../Navbar/navbar.css';
import '../Footer/footer.css';
import { MdOutlineTravelExplore } from 'react-icons/md';
import { AiFillCloseCircle } from 'react-icons/ai';
import { TbGridDots } from 'react-icons/tb';
import { FiArrowRight } from 'react-icons/fi';
import { FaRegCalendarAlt } from 'react-icons/fa';

const Frontpage = () => {
  const [active, setActive] = useState('navBar');
  const [near, setNear] = useState(false);

  // Function to toggle navBar
  const showNav = () => {
    setActive('navBar activeNavBar');
  };
  
  // Function to close navBar
  const closeNav = () => {
    setActive('navBar');
  };

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

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Top Purple Bar */}
      <header className="header flex">
        <div className="logoDiv">
          <a href="#" className="logo">
            <h1 data-aos="zoom-in"><MdOutlineTravelExplore className='icons' />Travel Diary Calendar</h1>
          </a>
        </div>

        <div className={active}>
          <ul className="navLists flex">
            <li className={`navItem ${near ? 'zoomed' : ''}`}>
              <a href="/signup" className="navLink">Signup</a>
            </li>
            <li className={`navItem ${near ? 'zoomed' : ''}`}>
              <Link to="/login" className="navLink">Login</Link>
            </li>
            <li className={`navItem ${near ? 'zoomed' : ''}`}>
              <Link to="/about" className="navLink">About the app</Link>
            </li>
            <li className={`navItem ${near ? 'zoomed' : ''}`}>
              <Link to="/map" className="navLink">Go to Map</Link>
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

      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl px-6 py-16 mt-16">
        {/* Left Side - Text & Button */}
        <div className="w-full md:w-1/2 text-center md:text-left ml-[-25px]">
          <h1 className="text-5xl mb-4 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent flex items-center">
            <FaRegCalendarAlt className="text-purple-500 mr-2" /> Miles and Memories
          </h1>
          <h2 className="text-lg text-gray-600 mt-2">Your Ultimate Planner for Unforgettable Journeys</h2>
          <Link to="/login" className="navLink">
          <button className="bg-purple-500 ml-40 text-white px-6 py-3 mt-5 rounded-full flex items-center gap-2 text-lg font-medium transition-all duration-300 transform hover:bg-purple-700 hover:scale-105">
            Start Planning<FiArrowRight />
          </button>
          </Link> 
        </div>

        {/* Right Side - Login Card */}
        <div data-aos="fade-down" className="w-full md:w-1/2 bg-white shadow-lg p-8 rounded-lg text-center mt-10 md:mt-10 mr-[-15px] min-h-[500px] relative">
          {/* Video at the Top */}
          <div data-aos="fade-left" className="w-full h-[140px] overflow-hidden rounded-lg mt-2 mb-1/3 relative">
            <video src={video} loop autoPlay muted className="w-full h-full object-cover"></video>
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold bg-black/40">
              <h2 className="text-xl font-semibold">Get Started for Free!!!</h2>
            </div>
          </div>

          <Link to="/login" className="navLink">
          <button className="bg-purple-500 text-white px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 mt-10 mb-10 transform hover:scale-110 hover:bg-purple-700">
            Log in
          </button>
          </Link>

          {/* Video at the Bottom */}
          <div data-aos="fade-right" className="w-full h-[140px] overflow-hidden rounded-lg mt-4 relative">
            <video src={video} loop autoPlay muted className="w-full h-full object-cover"></video>
            <div className="absolute inset-0 flex items-center justify-center text-white font-semibold bg-black/40">
              <p className="text-white">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-400 underline transition-all duration-300 transform hover:scale-130">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* New container for images and text */}
      <div className="flex flex-col md:flex-row-reverse justify-between items-center w-full max-w-6xl px-6">
        {/* Right Side - Text */}
        <div className="w-full md:w-1/3 text-center mt-10 md:mt-5 min-h-[150px]">
          <p className="italic text-gray-600">
            Every journey has a story. Capture your moments, plan your adventures, and relive memories—all in one place.
          </p>
          <Link to="/about" className="text-blue-500 mt-2 inline-block hover:underline hover:text-blue-700 hover:font-bold">
            Learn all about the app
          </Link>
        </div>

        {/* Left Side - Decorative Images */}
        <div className="flex w-full md:w-1/2 gap-3 items-end mb-10">
          <div className="w-[25%] h-72 bg-gray-300 rounded-xl overflow-hidden">
            <img data-aos="fade-left" src={img1} alt="Image 1" className="w-full h-full object-cover" />
          </div>
          <div className="w-[25%] h-80 bg-gray-300 rounded-xl overflow-hidden">
            <img data-aos="fade-left" src={img1} alt="Image 2" className="w-full h-full object-cover" />
          </div>
          <div className="w-[25%] h-96 bg-gray-300 rounded-xl overflow-hidden">
            <img data-aos="fade-left" src={img1} alt="Image 3" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

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
  );
};

export default Frontpage;
