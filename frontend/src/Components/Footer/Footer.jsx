import React,{useEffect} from 'react'
import './footer.css'
import video from '../../assets/flower.mp4'
import { FiSend } from 'react-icons/fi'
import { MdOutlineTravelExplore } from 'react-icons/md'
import Aos from 'aos'
import 'aos/dist/aos.css' 

const Footer = () => {
  // Hook to create Animation
      useEffect(() => {
        Aos.init({duration: 2000})
      }, []);

  return (
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
  )
}

export default Footer