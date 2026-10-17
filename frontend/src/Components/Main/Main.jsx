import React, { useEffect } from 'react';
import './main.css';
import { HiOutlineClipboardCheck, HiOutlineLocationMarker } from 'react-icons/hi';
import Aos from 'aos';
import 'aos/dist/aos.css';

const Data = [
  {
    id: 1,
    imgSrc: require('../../assets/img1.jpeg'),
    destTitle: "Gulmarg",
    location: "Baramulla, Jammu and Kashmir",
    description: "Gulmarg, meaning 'meadow of flowers' in Kashmiri, is a picturesque town and hill station located in the Baramulla district of Jammu and Kashmir, India.",
  },
  {
    id: 2,
    imgSrc: require('../../assets/img2.jpeg'),
    destTitle: "Manali",
    location: "Kullu, Himachal Pradesh",
    description: "Manali, nestled in the Kullu Valley of Himachal Pradesh, is a popular hill station known for its scenic beauty and adventure activities.",
    url: "https://himachaltourism.gov.in/destination/manali/",
  },
  {
    id: 3,
    imgSrc: require('../../assets/img3.jpeg'),
    destTitle: "Auli",
    location: "Chamoli, Uttarakhand",
    description: "Auli, located in the Chamoli district of Uttarakhand, is a renowned ski destination offering panoramic views of the Himalayan peaks.",
    url: "https://uttarakhandtourism.gov.in/destination/auli",
  },
];

const Main = () => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <section className='main container section'>
      <div className="secTitle">
        <h3 data-aos="fade-up" className="title">
          Most Famous Tourist Spots
        </h3>
      </div>

      <div className="secContent grid">
        {Data.map(({ id, imgSrc, destTitle, location, description, url }) => (
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
  );
};

export default Main;
