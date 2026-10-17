import React, {useState} from 'react'
import '../Navbar/navbar.css';
import { Link } from "react-router-dom";
import { TbGridDots } from 'react-icons/tb';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MdOutlineTravelExplore } from 'react-icons/md';

const Aboutapp = () => {
  const [active, setActive] = useState('navBar');

  // Function to toggle navBar
  const showNav = () => {
    setActive('navBar activeNavBar');
  };

  // Function to close navBar
  const closeNav = () => {
    setActive('navBar');
  };

  return (
    <section>
      <header className="header flex">
        <div className="logoDiv">
          <Link to='/frontpage' className="logo">
            <h1><MdOutlineTravelExplore className='icons'/>Travel Diary Calender</h1>
          </Link>
        </div>

        <div className={active}>
          <ul className="navLists flex">
            <li className="navItem">
              <a href="/navbar" className="navLink">Home</a>
            </li>
            <li className="navItem">
              <a href="/signup" className="navLink">Signup</a>
            </li>
            <li className="navItem">
              <a href="/login" className="navLink">Login</a>
            </li>
          </ul>

          <div onClick={closeNav} className="closeNavBar">
            <AiFillCloseCircle className='icon'/>
          </div>

        </div>

        <div onClick={showNav} className="toggleNavBar">
          <TbGridDots className='icon'/>
        </div>
      </header>
      <h2>
      The Travel Diary Calendar app is your personal companion for recording and remembering every moment of your travels. Whether you're exploring new cities, hiking remote trails, or embarking on a weekend getaway, our app makes it easy to document your adventures, track important dates, and relive your experiences.

      Key Features:
      Interactive Calendar: Easily plan and view your travel itinerary with a customizable calendar. Add dates, locations, and notes to each day of your trip.

      Photo and Memory Upload: Attach photos, videos, and written memories to each entry, creating a complete visual and emotional record of your travels.

      Location Tracking: Mark and remember the places you’ve visited with built-in location support. Perfect for keeping track of those hidden gems you discover on the go.

      Travel Milestones: Set travel goals and track important milestones to make the most of your adventures.

      Personalized Reminders: Never miss a moment. Set reminders for key dates and activities to ensure you get the most out of your travels.

      Offline Access: Access your travel diary anywhere, even without an internet connection. No matter where your journey takes you, your memories are safe.
      </h2>
      </section>
  )
}

export default Aboutapp