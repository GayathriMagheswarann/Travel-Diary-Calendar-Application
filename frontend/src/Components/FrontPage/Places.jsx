import React, { useEffect, useState } from 'react';
import video from '../../assets/flower.mp4'
import { Link } from "react-router-dom";

import { FiSend } from 'react-icons/fi'
import { MdOutlineTravelExplore } from 'react-icons/md'
import { AiFillCloseCircle } from 'react-icons/ai';
import { TbGridDots } from 'react-icons/tb';
import { HiOutlineClipboardCheck, HiOutlineLocationMarker } from 'react-icons/hi';

import Main from '../Main/main.css';
import '../Footer/footer.css';

import Aos from 'aos';
import 'aos/dist/aos.css';
import img1 from '../../assets/img1.jpeg';
import img2 from '../../assets/img2.jpeg';  
import img3 from '../../assets/img3.jpeg';
import img4 from '../../assets/img4.jpeg';

const Data = [
  [
    {
      id: 1,
      imgSrc: img2,
      destTitle: "Gulmarg",
      location: "Baramulla, Jammu and Kashmir",
      description: "Gulmarg, meaning 'meadow of flowers' in Kashmiri, is a picturesque town and hill station located in the Baramulla district of Jammu and Kashmir, India.",
    },
    {
      id: 2,
      imgSrc: img1,
      destTitle: "Manali",
      location: "Kullu, Himachal Pradesh",
      description: "Manali is a popular hill station and honeymoon destination, located in the Kullu Valley of Himachal Pradesh, India, known for its scenic beauty and adventure sports.",
    },
    {
      id: 3,
      imgSrc: img1,
      destTitle: "Auli",
      location: "Chamoli, Uttarakhand",
      description: "Auli, a popular ski destination, is located in the Chamoli district of Uttarakhand, India, surrounded by oak trees and coniferous forests.",
    },
    {
      id: 4,
      imgSrc: img4,
      destTitle: "Shimla",
      location: "Shimla, Himachal Pradesh",
      description: "Shimla, the capital of Himachal Pradesh, is a famous hill station known for its colonial architecture, scenic beauty, and pleasant weather.",
    },
    {
      id: 5,
      imgSrc: img3,
      destTitle: "Rann of Kutch",
      location: "Kutch, Gujarat",
      description: "The Rann of Kutch is a vast salt marsh in the Kutch district of Gujarat, India, known for its Rann Utsav and white desert landscape.",
    },
    {
      id: 6,
      imgSrc: img1,
      destTitle: "Jaisalmer",
      location: "Jaisalmer, Rajasthan",
      description: "Jaisalmer, known as the Golden City, is located in Rajasthan, India, and is famous for its magnificent forts, palaces, and desert landscape.",
    },
    {
      id: 7,
      imgSrc: img2,
      destTitle: "Udaipur",
      location: "Udaipur, Rajasthan",
      description: "Udaipur, also known as the City of Lakes, is famous for its palaces, lakes, and temples, located in the Rajasthan region of India.",
    },
    {
      id: 8,
      imgSrc: img4,
      destTitle: "Goa",
      location: "Goa, India",
      description: "Goa is known for its beautiful beaches, vibrant nightlife, and colonial architecture, making it a popular destination for tourists in India.",
    },
    {
      id: 9,
      imgSrc: img1,
      destTitle: "Munnar",
      location: "Idukki, Kerala",
      description: "Munnar is a hill station located in the Idukki district of Kerala, known for its sprawling tea plantations, mist-covered mountains, and scenic landscapes.",
    },
    {
      id: 10,
      imgSrc: img1,
      destTitle: "Kaziranga National Park",
      location: "Golaghat, Assam",
      description: "Kaziranga National Park, a UNESCO World Heritage Site, is located in Assam, India, and is famous for its one-horned rhinoceros.",
    },
    {
      id: 11,
      imgSrc: img1,
      destTitle: "Kashmir",
      location: "Kashmir, India",
      description: "Kashmir, known for its breathtaking landscapes, gardens, and lakes, is located in the northern part of India, and is often referred to as 'Paradise on Earth'.",
    },
    {
      id: 12,
      imgSrc: img1,
      destTitle: "Leh-Ladakh",
      location: "Leh, Ladakh",
      description: "Leh-Ladakh is a high-altitude desert region located in the northernmost part of India, known for its rugged terrain, monasteries, and pristine lakes.",
    },
    {
      id: 13,
      imgSrc: img1,
      destTitle: "Wayanad",
      location: "Wayanad, Kerala",
      description: "Wayanad is a serene district in Kerala, India, known for its rich wildlife, waterfalls, and ancient caves.",
    },
    {
      id: 14,
      imgSrc: img1,
      destTitle: "Darjeeling",
      location: "Darjeeling, West Bengal",
      description: "Darjeeling, known for its tea plantations and the iconic Darjeeling Himalayan Railway, is a hill station located in West Bengal, India.",
    },
    {
      id: 15,
      imgSrc: img1,
      destTitle: "Kullu-Manali",
      location: "Kullu, Himachal Pradesh",
      description: "Kullu-Manali is a popular destination in Himachal Pradesh, known for its scenic beauty, adventure activities, and temples.",
    },
    {
      id: 16,
      imgSrc: img1,
      destTitle: "Rishikesh",
      location: "Rishikesh, Uttarakhand",
      description: "Rishikesh is a spiritual destination located in Uttarakhand, India, famous for yoga, meditation, and adventure sports like white-water rafting.",
    },
    {
      id: 17,
      imgSrc: img1,
      destTitle: "Ooty",
      location: "Nilgiris, Tamil Nadu",
      description: "Ooty, also known as Udhagamandalam, is a popular hill station in Tamil Nadu, known for its pleasant climate, gardens, and tea plantations.",
    },
    {
      id: 18,
      imgSrc: img1,
      destTitle: "Pushkar",
      location: "Ajmer, Rajasthan",
      description: "Pushkar is a small town in Rajasthan, India, known for its sacred lake, temples, and the annual Pushkar Camel Fair.",
    },
    {
      id: 19,
      imgSrc: img1,
      destTitle: "Hampi",
      location: "Bellary, Karnataka",
      description: "Hampi, a UNESCO World Heritage Site, is an ancient village in Karnataka, India, known for its historical ruins and temples.",
    },
    {
      id: 20,
      imgSrc: img1,
      destTitle: "Qutub Minar",
      location: "Delhi, India",
      description: "The Qutub Minar is a historical monument located in Delhi, India, known for its impressive height and intricate Indo-Islamic architecture.",
    },
    {
      id: 21,
      imgSrc: img1,
      destTitle: "Nohkalikai Falls",
      location: "Meghalaya, India",
      description: "Nohkalikai Falls is the tallest plunge waterfall in India, located in the East Khasi Hills of Meghalaya.",
    },
    {
      id: 22,
      imgSrc: img1,
      destTitle: "Bhushi Dam",
      location: "Lonavala, Maharashtra",
      description: "Bhushi Dam is a popular picnic spot in Lonavala, Maharashtra, known for its waterfall and scenic surroundings.",
    },
    {
      id: 23,
      imgSrc: img1,
      destTitle: "Abbey Falls",
      location: "Coorg, Karnataka",
      description: "Abbey Falls is a beautiful waterfall located in Coorg, Karnataka, surrounded by coffee plantations and lush greenery.",
    },
    {
      id: 24,
      imgSrc: img1,
      destTitle: "Attukal Waterfalls",
      location: "Munnar, Kerala",
      description: "Attukal Waterfalls is a stunning waterfall located near Munnar, Kerala, famous for its scenic beauty and peaceful atmosphere.",
    },
    {
      id: 25,
      imgSrc: img1,
      destTitle: "Valley of Flowers",
      location: "Chamoli, Uttarakhand",
      description: "Valley of Flowers is a UNESCO World Heritage Site located in Uttarakhand, India, known for its diverse range of flora and picturesque landscapes.",
    },
    {
      id: 26,
      imgSrc: img1,
      destTitle: "Pillar Rocks",
      location: "Kodaikanal, Tamil Nadu",
      description: "Pillar Rocks is a famous tourist spot in Kodaikanal, known for its stunning views of the surrounding valleys and mountains.",
    },
    {
      id: 27,
      imgSrc: img1,
      destTitle: "Elephant Falls",
      location: "Meghalaya, India",
      description: "Elephant Falls is a popular waterfall located in Meghalaya, India, known for its scenic beauty and unique shape.",
    },
    {
      id: 28,
      imgSrc: img1,
      destTitle: "Sunset Viewpoint",
      location: "Agumbe, Karnataka",
      description: "Sunset Viewpoint is a popular spot in Agumbe, Karnataka, offering a breathtaking view of the sunset over the Western Ghats.",
    },
    {
      id: 29,
      imgSrc: img1,
      destTitle: "Venna Lake",
      location: "Mahabaleshwar, Maharashtra",
      description: "Venna Lake is a man-made lake located in Mahabaleshwar, Maharashtra, known for its boating and serene surroundings.",
    },
    {
      id: 30,
      imgSrc: img1,
      destTitle: "Tsomgo Lake",
      location: "Sikkim, India",
      description: "Tsomgo Lake, located in Sikkim, India, is a high-altitude glacial lake surrounded by snow-capped mountains.",
    },
    {
      id: 31,
      imgSrc: img1,
      destTitle: "Ajanta & Ellora Caves",
      location: "Aurangabad, Maharashtra",
      description: "Ajanta and Ellora Caves are UNESCO World Heritage Sites located in Maharashtra, India, known for their ancient rock-cut temples and exquisite murals.",
    },
    {
      id: 32,
      imgSrc: img1,
      destTitle: "Jammu",
      location: "Jammu and Kashmir, India",
      description: "Jammu is a city in the Jammu and Kashmir region, known for its temples, including the Vaishno Devi shrine and its vibrant culture.",
    },
    {
      id: 33,
      imgSrc: img1,
      destTitle: "Khajuraho",
      location: "Chhatarpur, Madhya Pradesh",
      description: "Khajuraho is famous for its temples, with intricate carvings and sculptures, and is a UNESCO World Heritage Site in Madhya Pradesh, India.",
    },
    {
      id: 34,
      imgSrc: img1,
      destTitle: "Shimla",
      location: "Shimla, Himachal Pradesh",
      description: "Shimla is a hill station and capital of Himachal Pradesh, known for its colonial architecture and pleasant climate.",
    },
    {
      id: 35,
      imgSrc: img1,
      destTitle: "Gangtok",
      location: "Gangtok, Sikkim",
      description: "Gangtok, the capital of Sikkim, is known for its monasteries, panoramic views, and vibrant culture.",
    },
    {
      id: 36,
      imgSrc: img1,
      destTitle: "Auli",
      location: "Chamoli, Uttarakhand",
      description: "Auli, famous for skiing, is a scenic hill station in Uttarakhand, India, offering beautiful views of the snow-covered peaks of the Himalayas.",
    },
    {
      id: 37,
      imgSrc: img1,
      destTitle: "Mount Abu",
      location: "Sirohi, Rajasthan",
      description: "Mount Abu is the only hill station in Rajasthan, known for its cool climate, serene lakes, and beautiful temples.",
    },
    {
      id: 38,
      imgSrc: img1,
      destTitle: "Shillong",
      location: "Meghalaya, India",
      description: "Shillong is a hill station in Meghalaya, India, known for its stunning landscapes, waterfalls, and vibrant cultural heritage.",
    },
    {
      id: 39,
      imgSrc: img1,
      destTitle: "Mussoorie",
      location: "Mussoorie, Uttarakhand",
      description: "Mussoorie, known as the Queen of Hills, is a popular hill station in Uttarakhand, India, known for its scenic beauty and pleasant weather.",
    },
    {
      id: 40,
      imgSrc: img1,
      destTitle: "Sikkim",
      location: "Sikkim, India",
      description: "Sikkim is a northeastern state known for its natural beauty, vibrant culture, and stunning views of the Kanchenjunga mountain range.",
    },
    {
      id: 41,
      imgSrc: img1,
      destTitle: "Alleppey",
      location: "Alleppey, Kerala",
      description: "Alleppey, known for its backwaters and houseboats, is a beautiful town in Kerala, India.",
    },
    {
      id: 42,
      imgSrc: img1,
      destTitle: "Coorg",
      location: "Kodagu, Karnataka",
      description: "Coorg, also known as Kodagu, is a hill station famous for its coffee plantations, scenic beauty, and rich cultural heritage.",
    },
    {
      id: 43,
      imgSrc: img1,
      destTitle: "Kochi",
      location: "Kochi, Kerala",
      description: "Kochi, also known as Cochin, is a historic port city in Kerala, India, known for its colonial architecture and vibrant cultural scene.",
    },
    {
      id: 44,
      imgSrc: img1,
      destTitle: "Tawang",
      location: "Tawang, Arunachal Pradesh",
      description: "Tawang is a beautiful town located in Arunachal Pradesh, India, known for its Buddhist monasteries and breathtaking landscapes.",
    },
    {
      id: 45,
      imgSrc: img1,
      destTitle: "Kodaikanal",
      location: "Dindigul, Tamil Nadu",
      description: "Kodaikanal is a hill station in Tamil Nadu, India, known for its cool climate, waterfalls, and stunning views of the Western Ghats.",
    },
    {
      id: 46,
      imgSrc: img1,
      destTitle: "Mysore",
      location: "Mysuru, Karnataka",
      description: "Mysore is a historic city in Karnataka, known for its royal heritage, Mysore Palace, and Dussehra celebrations.",
    },
    {
      id: 47,
      imgSrc: img1,
      destTitle: "Agra",
      location: "Agra, Uttar Pradesh",
      description: "Agra is home to the iconic Taj Mahal, one of the Seven Wonders of the World, located in Uttar Pradesh, India.",
    },
    {
      id: 48,
      imgSrc: img1,
      destTitle: "Tiruvannamalai",
      location: "Tiruvannamalai, Tamil Nadu",
      description: "Tiruvannamalai is known for the Arunachaleswarar Temple and is a significant pilgrimage site in Tamil Nadu, India.",
    },
  ],  
];

const Places = () => {

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
    <div>
  
   {/* Top Purple Bar */}
   <header className="header flex">
        <div className="logoDiv">
          <Link to="/frontpage" className="logo">
            <h1 data-aos="zoom-in"><MdOutlineTravelExplore className='icons' />Travel Diary Calendar</h1>
          </Link>
        </div>

        <div className={active}>
          <ul className="navLists flex">
            <li className={`navItem ${near ? 'zoomed' : ''}`}>
              <a href="#" className="navLink">Home</a>
            </li>
            <li className={`navItem ${near ? 'zoomed' : ''}`}>
              <a href="/signup" className="navLink">Signup</a>
            </li>
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
    <section className='main container section'>
      <div className="secTitle">
        <h3 data-aos="fade-up" className="title">
          Most Famous Tourist Spots
        </h3>
      </div>

      <div className="secContent grid">
        {Data[0].map(({ id, imgSrc, destTitle, location, description, url }) => (
          <div key={id} className="singleDesc">
            <div data-aos="fade-up" className="imageDiv">
              <img src={imgSrc} alt={destTitle} />
            </div>

            <div className="cardInfo">
              <h4 className="destTitle">{destTitle}</h4>
              <div className="locationContainer">
                <span className="continent flex">
                  <HiOutlineLocationMarker className='icon' />
                  <span className="name">{location}</span>
                </span>
              </div>
              
              <div className="desc">
                <p>{description}</p>
              </div>

              <a href={url} target="_blank" rel="noopener noreferrer">
                <button className="btn flex">
                  DETAILS <HiOutlineClipboardCheck className='icon' />
                </button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>

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
            <input  data-aos="fade-up" type="text" placeholder='Enter Email'/>
              <button  data-aos="fade-up" className='btn flex' type='submit'>
                SEND <FiSend className='icon'/>
              </button>
            </div>
          </div>
  
          <div className="footerCard flex">
            <div className="footerIntro flex">
              <div className="logoDiv">
                <a href="#" className='logo flex'><MdOutlineTravelExplore className='icon'/>
                  Travel.
                </a>
              </div>
  
              <div  data-aos="fade-up" className="footerPara">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Voluptatem pariatur quas ipsum, repellat inventore et maxime 
                voluptatum explicabo impedit doloribus ratione iusto accusantium 
                aliquam minima! Repellat quidem tempore ex eveniet?
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

export default Places;
