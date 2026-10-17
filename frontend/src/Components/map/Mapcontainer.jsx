import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { where, orderBy, limit, query } from "firebase/firestore";
// For Authentication
import { 
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";

// For Firestore (Database)
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDoc,        // For reading documents
  setDoc,        // For creating documents
  increment,     // For incrementing values
  serverTimestamp // For server timestamps
} from "firebase/firestore";
import { auth, provider, db } from '../../firebase';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import './Mapcontainer.css';

const CalendarView = ({ events, onClose, onDateClick, loading }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    if (events) {
      setAllEvents(events);
    }
  }, [events]);

  if (loading) {
    return (
      <div className="calendar-modal">
        <div className="calendar-content">
          <div className="loading-calendar">
            <i className="fas fa-spinner fa-spin"></i> Loading calendar...
          </div>
        </div>
      </div>
    );
  }

  // Get days in month
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  // Get first day of month
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const getEventsForDate = (date) => {
    if (!allEvents || allEvents.length === 0) return [];
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    return allEvents.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(23, 59, 59, 999);
      
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  };

  // Check if date is in the past
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Render calendar days
  const renderDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Actual days of month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const dateEvents = getEventsForDate(date);
      const hasEvent = dateEvents.length > 0;
      const isPast = isPastDate(date);

      days.push(
        <div
          key={i}
          className={`calendar-day ${hasEvent ? 'has-event' : ''} ${isPast ? 'past-date' : ''}`}
          onClick={() => onDateClick(date)}
          onMouseEnter={() => setHoveredDate(date)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          {i}
          {hasEvent && <div className="event-dot"></div>}
        </div>
      );
    }

    return days;
  };

  // Get tooltip content for hovered date
  const getTooltipContent = () => {
    if (!hoveredDate) return null;
    
    const dateEvents = getEventsForDate(hoveredDate);
    if (dateEvents.length === 0) return null;

    return (
      <div className="date-tooltip">
        {dateEvents.map((event, index) => (
          <div key={index} className="event-tooltip-item">
            {event.title}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar-modal">
      <div className="calendar-content">
        <div className="calendar-header">
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            className="month-nav"
          >
            &lt;
          </button>
          <h3>
            {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
          </h3>
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            className="month-nav"
          >
            &gt;
          </button>
        </div>
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {renderDays()}
          {getTooltipContent()}
        </div>
        <button onClick={onClose} className="close-calendar-btn">
          Close Calendar
        </button>
      </div>
    </div>
  );
};


const markers = [
  {
    id: 0,
    name: "Abbey Falls, Coorg",
    position: { lat: 12.3814, lng: 75.6851 }, // Using position from existing Abbey Falls marker
    url: "https://karnatakatourism.org/tour-item/abbey-falls/",
    color: "#33ccff",
  },
  {
    id: 1,
    name: "Amber Palace, Jaipur",
    position: { lat: 26.9855, lng: 75.8513 }, // Approximate position for Amber Palace
    url: "https://www.tourism.rajasthan.gov.in/amber-palace.html", // Example URL
    color: "#ff5733",
  },
  {
    id: 2,
    name: "Attukal Waterfalls, Munnar",
    position: { lat: 10.2292, lng: 77.0185 }, // Using position from existing Attukal Waterfalls marker
    url: "https://www.keralatourism.org/destination/attukad-waterfalls/122/",
    color: "#33ccff",
  },
  {
    id: 3,
    name: "Auli",
    position: { lat: 30.1014, lng: 79.6199 },
    url: "https://uttarakhandtourism.gov.in/destination/auli",
    color: "#ff5733",
  },
  {
    id: 4,
    name: "Bhushi Dam, Lonavala",
    position: { lat: 19.8857, lng: 73.3129 }, // Using position from existing Bhushi Dam marker
    url: "https://travelsetu.com/guide/bhushi-dam-tourism/nearby-places-in-bhushi-dam-within-25km",
    color: "#33ccff",
  },
  {
    id: 5,
    name: "Coorg",
    position: { lat: 12.2972, lng: 75.8405 }, // Using position from existing Coorg marker
    url: "https://coorgtourism.co.in/places-to-visit-in-coorg-sightseeing-madikeri",
    color: "#66ff66",
  },
  {
    id: 6,
    name: "Dalhousie",
    position: { lat: 32.5339, lng: 75.9181 }, // Approximate position for Dalhousie
    url: "https://himachaltourism.gov.in/destination/dalhousie/",
    color: "#ff5733",
  },
  {
    id: 7,
    name: "Darjeeling",
    position: { lat: 27.0379, lng: 88.2636 },
    url: "https://darjeeling.gov.in/tourist-places/",
    color: "#33ff57",
  },
  {
    id: 8,
    name: "Darjeeling, Kalimpong - West Bengal",
    position: { lat: 27.0379, lng: 88.2636 }, // Using Darjeeling position
    url: "https://darjeeling.gov.in/tourist-places/",
    color: "#33ff57",
  },
  {
    id: 9,
    name: "Darjeeling, West Bengal",
    position: { lat: 27.0379, lng: 88.2636 }, // Using Darjeeling position
    url: "https://darjeeling.gov.in/tourist-places/",
    color: "#33ff57",
  },
  {
    id: 10,
    name: "Wayanad, Kerala",
    position: { lat: 11.6827, lng: 76.0378 }, // Using position from existing Wayanad marker
    url: "https://www.keralatourism.org/destination/wayanad-district/373/",
    color: "#33ff57",
  },
  {
    id: 11,
    name: "Elephant Falls, Shillong",
    position: { lat: 25.5589, lng: 91.5771 }, // Using position from existing Elephant Falls marker
    url: "https://www.meghalayatourism.in/destinations/elephant-falls/",
    color: "#33ccff",
  },
  {
    id: 12,
    name: "Gangtok",
    position: { lat: 27.3389, lng: 88.6065 },
    url: "https://sikkimtourism.gov.in/Public/PlacesToGo/popularattractiondetails/PA20A002",
    color: "#ffb366",
  },
  {
    id: 13,
    name: "Goa",
    position: { lat: 15.2993, lng: 74.124 },
    url: "https://www.goa-tourism.com",
    color: "#ff5733",
  },
  {
    id: 14,
    name: "Gulmarg",
    position: { lat: 34.05, lng: 74.38 },
    url: "https://baramulla.nic.in/tourist-place/gulmarg/",
    color: "#ff5733",
  },
  {
    id: 15,
    name: "Hampi, Karnataka",
    position: { lat: 15.3350, lng: 76.4607 }, // Using position from existing Hampi marker
    url: "https://karnatakatourism.org/tour-item/hampi/",
    color: "#33ff57",
  },
  {
    id: 16,
    name: "Idukki",
    position: { lat: 9.8497, lng: 76.9686 }, // Approximate position for Idukki
    url: "https://www.keralatourism.org/destination/idukki-district/372/",
    color: "#ff5733",
  },
  {
    id: 17,
    name: "Jaisalmer",
    position: { lat: 26.9124, lng: 70.9229 },
    url: "https://www.tourism.rajasthan.gov.in/jaisalmer.html",
    color: "#ff5733",
  },
  {
    id: 18,
    name: "Jammu-Kashmir",
    position: { lat: 34.0836, lng: 74.7973 }, // Using position from existing Kashmir marker
    url: "https://www.thomascook.in/india-tourism/kashmir",
    color: "#33ff57",
  },
  {
    id: 19,
    name: "Kodaikanal",
    position: { lat: 10.2376, lng: 77.4927 }, // Using position from existing Kodaikanal marker
    url: "https://www.tamilnadutourism.tn.gov.in/destinations/kodaikanal",
    color: "#66ff66",
  },
  {
    id: 20,
    name: "Kullu",
    position: { lat: 32.2396, lng: 77.1887 }, // Using position from existing Kullu-Manali marker
    url: "https://himachaltourism.gov.in/destination/kullu/",
    color: "#33ff57",
  },
  {
    id: 21,
    name: "Kullu-Manali, Himachal Pradesh",
    position: { lat: 32.2396, lng: 77.1887 }, // Using position from existing Kullu-Manali marker
    url: "https://www.thrillophilia.com/places-to-visit-in-kullu-manali",
    color: "#33ff57",
  },
  {
    id: 22,
    name: "Kumili",
    position: { lat: 9.5947, lng: 77.1618 }, // Approximate position for Kumili
    url: "https://www.keralatourism.org/destination/thekkady/121/",
    color: "#ff5733",
  },
  {
    id: 23,
    name: "Leh & Ladakh",
    position: { lat: 34.1526, lng: 77.5779 }, // Using position from existing Leh-Ladakh marker
    url: "https://leh.nic.in/tourist-places/",
    color: "#33ff57",
  },
  {
    id: 24,
    name: "Leh-Ladakh, Jammu & Kashmir",
    position: { lat: 34.1526, lng: 77.5779 }, // Using position from existing Leh-Ladakh marker
    url: "https://leh.nic.in/tourist-places/",
    color: "#33ff57",
  },
  {
    id: 25,
    name: "Mahabaleshwar, Maharashtra",
    position: { lat: 17.9228, lng: 73.6679 }, // Using position from existing Venna Lake marker (in Mahabaleshwar)
    url: "https://mahabaleshwartourism.in/",
    color: "#ff5733",
  },
  {
    id: 26,
    name: "Manali",
    position: { lat: 32.2396, lng: 77.1887 }, // Using position from existing Manali and Kullu marker
    url: "https://himachaltourism.gov.in/destination/manali/",
    color: "#ff5733",
  },
  {
    id: 27,
    name: "Manali and Kullu, Himachal Pradesh",
    position: { lat: 32.2396, lng: 77.1890 },
    url: "https://himachaltourism.gov.in/destination/manali/",
    color: "#ff5733",
  },
  {
    id: 28,
    name: "Mount Abu",
    position: { lat: 24.5854, lng: 73.7125 },
    url: "https://www.tourism.rajasthan.gov.in/content/rajasthan-tourism/en/tourist-destinations/mount-abu.html",
    color: "#ffb366",
  },
  {
    id: 29,
    name: "Munnar",
    position: { lat: 10.0889, lng: 77.0585 },
    url: "https://www.keralatourism.org/topic/munnar",
    color: "#ff5733",
  },
  {
    id: 30,
    name: "Mussoorie",
    position: { lat: 30.3290, lng: 78.0669 },
    url: "https://uttarakhandtourism.gov.in/destination/mussoorie",
    color: "#ffb366",
  },
  {
    id: 31,
    name: "Nilgiris Tiger Reserves, Karnataka",
    position: { lat: 11.4064, lng: 76.6958 }, // Using position near Ooty
    url: "https://karnatakatourism.org/tour-item/nagarhole-national-park/",
    color: "#ff5733",
  },
  {
    id: 32,
    name: "Nohkalikai Falls, Cherrapunji",
    position: { lat: 25.2931, lng: 91.5822 }, // Using position from existing Nohkalikai Falls marker
    url: "https://travelmelodies.com/nohkalikai-falls-meghalaya-india/",
    color: "#33ccff",
  },
  {
    id: 33,
    name: "Ooty",
    position: { lat: 11.4064, lng: 76.6958 },
    url: "https://www.tamilnadutourism.tn.gov.in/destinations/ooty",
    color: "#33ff57",
  },
  {
    id: 34,
    name: "Ooty, Tamil Nadu",
    position: { lat: 11.4064, lng: 76.6958 }, // Using position from existing Ooty marker
    url: "https://www.tamilnadutourism.tn.gov.in/destinations/ooty",
    color: "#33ff57",
  },
  {
    id: 35,
    name: "Palolem Beach, Goa",
    position: { lat: 15.2993, lng: 74.124 }, // Using position from existing Goa marker
    url: "https://www.goa-tourism.com",
    color: "#ff5733",
  },
  {
    id: 36,
    name: "Pillar Rocks, Kodaikanal",
    position: { lat: 10.2327, lng: 77.4606 }, // Using position from existing Pillar Rocks marker
    url: "https://www.tamilnadutourism.tn.gov.in/destinations/pillar-rocks",
    color: "#33ccff",
  },
  {
    id: 37,
    name: "Pushkar, Rajasthan",
    position: { lat: 26.4892, lng: 74.5515 }, // Using position from existing Pushkar marker
    url: "https://www.tourism.rajasthan.gov.in/pushkar.html",
    color: "#33ff57",
  },
  {
    id: 38,
    name: "Rann of Kutch",
    position: { lat: 23.4585, lng: 68.9877 },
    url: "https://www.rannutsavgujarat.in/",
    color: "#ff5733",
  },
  {
    id: 39,
    name: "Rann of Kutch, Gujarat",
    position: { lat: 23.4585, lng: 68.9877 }, // Using position from existing Rann of Kutch marker
    url: "https://www.rannutsavgujarat.in/",
    color: "#ff5733",
  },
  {
    id: 40,
    name: "Rishikesh",
    position: { lat: 30.0869, lng: 78.2676 },
    url: "https://uttarakhandtourism.gov.in/destination/rishikesh",
    color: "#33ff57",
  },
  {
    id: 41,
    name: "Roopkund Glacial Lake, Nanda Devi National Park - Uttarakhand",
    position: { lat: 30.2588, lng: 79.7320 }, // Approximate position for Roopkund
    url: "https://uttarakhandtourism.gov.in/destination/nanda-devi-national-park",
    color: "#ff5733",
  },
  {
    id: 42,
    name: "Shillong",
    position: { lat: 25.5788, lng: 91.8933 },
    url: "https://www.meghalayatourism.in/destinations/shillong/",
    color: "#ffb366",
  },
  {
    id: 43,
    name: "Shimla",
    position: { lat: 31.1048, lng: 77.1734 },
    url: "https://himachaltourism.gov.in/destination/shimla/",
    color: "#ff5733",
  },
  {
    id: 44,
    name: "Sunset Viewpoint, Agumbe",
    position: { lat: 13.3596, lng: 74.8412 }, // Using position from existing Sunset Viewpoint marker
    url: "https://www.trawell.in/karnataka/agumbe/agumbe-sunset-viewpoint",
    color: "#33ccff",
  },
  {
    id: 45,
    name: "Tawang",
    position: { lat: 27.5589, lng: 91.8601 },
    url: "https://tawangtourism.in/",
    color: "#66ff66",
  },
  {
    id: 46,
    name: "Tsomgo Lake, Sikkim",
    position: { lat: 27.1301, lng: 88.6350 }, // Using position from existing Tsomgo Lake marker
    url: "https://sikkimtourism.gov.in/Public/ExperienceSikkim/GetLakesDetailsById/28",
    color: "#33ccff",
  },
  {
    id: 47,
    name: "Udaipur",
    position: { lat: 24.5854, lng: 73.7125 },
    url: "https://udaipurtourism.co.in/",
    color: "#ff5733",
  },
  {
    id: 48,
    name: "Valley of Flowers, Uttarakhand",
    position: { lat: 30.7333, lng: 79.8808 }, // Using position from existing Valley of Flowers marker
    url: "https://uttarakhandtourism.gov.in/destination/valley-of-flowers",
    color: "#33ccff",
  },
  {
    id: 49,
    name: "Wayanad",
    position: { lat: 11.6827, lng: 76.0378 },
    url: "https://www.keralatourism.org/destination/wayanad-district/373/",
    color: "#33ff57",
  },
  {
    id: 50,
    name: "Wayanad, Alleppey - Kerala",
    position: { lat: 11.6827, lng: 76.0378 }, // Using position from existing Wayanad marker
    url: "https://www.keralatourism.org/destination/wayanad-district/373/",
    color: "#33ff57",
  },
  {
    id: 51,
    name: "Kaziranga National Park",
    position: { lat: 26.6550, lng: 93.1585 },
    url: "https://www.kazirangatourism.com/index.html",
    color: "#ff5733",
  },
  {
    id: 52,
    name: "Qutub Minar",
    position: { lat: 28.5245, lng: 77.1855 },
    url: "https://www.incredibleindia.gov.in/en/delhi/delhi/qutub-minar",
    color: "#ffcc00",
  },
  {
    id: 53,
    name: "Venna Lake",
    position: { lat: 17.9228, lng: 73.6679 },
    url: "https://mahabaleshwartourism.in/venna-lake-mahabaleshwar",
    color: "#33ccff",
  },
  {
    id: 54,
    name: "Ajanta & Ellora Caves",
    position: { lat: 20.5519, lng: 75.6987 },
    url: "https://deliciouslydirectionless.com/ajanta-and-ellora-caves-the-essential-guide/",
    color: "#ffcc00",
  },
  {
    id: 55,
    name: "Jammu",
    position: { lat: 32.7266, lng: 74.8570 },
    url: "https://tourism.jk.gov.in/#/landing",
    color: "#ffb366",
  },
  {
    id: 56,
    name: "Khajuraho",
    position: { lat: 24.8494, lng: 79.9193 },
    url: "https://www.mptourism.com/destination-khajuraho.php",
    color: "#ffcc00",
  },
  {
    id: 57,
    name: "Alleppey",
    position: { lat: 9.4981, lng: 76.3388 },
    url: "https://www.keralatourism.org/destination/alappuzha-beach/60/",
    color: "#66ff66",
  },
  {
    id: 58,
    name: "Kochi",
    position: { lat: 9.9312, lng: 76.2673 },
    url: "https://www.keralatourism.org/topic/kochi",
    color: "#66ff66",
  },
  {
    id: 59,
    name: "Mysore",
    position: { lat: 12.2958, lng: 76.6394 },
    url: "https://karnatakatourism.org/tour-item/mysuru/",
    color: "#66ff66",
  },
  {
    id: 60,
    name: "Agra",
    position: { lat: 27.1767, lng: 78.0081 },
    url: "https://www.incredibleindia.gov.in/en/uttar-pradesh/agra",
    color: "#66ff66",
  },
  {
    id: 61,
    name: "Tiruvannamalai",
    position: { lat: 12.2271, lng: 79.0734 },
    url: "https://tiruvannamalai.nic.in/tourist-places/",
    color: "#66ff66",
  },
  {
    id: 62,
    name: "Konark",
    position: { lat: 19.8975, lng: 86.1141 },
    url: "https://odishatourism.gov.in/content/tourism/en/discover/attractions/temples-monuments/konark.html",
    color: "#66ff66",
  },
  {
    id: 63,
    name: "Valmiki Tiger Reserve",
    position: { lat: 27.3256, lng: 84.1960 },
    url: "https://tourism.bihar.gov.in/en/destinations/west-champaran/valmiki-tiger-reserve",
    color: "#66ff66",
  },
  {
    id: 64,
    name: "Amba Khori",
    position: { lat: 21.3382, lng: 79.2510 },
    url: "https://www.citybit.in/places-to-visit-in-nagpur/amba-khori-waterfall/",
    color: "#66ff66",
  },
  {
    id: 65,
    name: "Gandhi Ghat",
    position: { lat: 25.6208, lng: 85.1675 },
    url: "https://www.incredibleindia.gov.in/en/bihar/patna/gandhi-ghat",
    color: "#66ff66",
  },
  {
    id: 66,
    name: "Jubilee Park",
    position: { lat: 22.8028, lng: 86.2029 },
    url: "https://jamshedpur.nic.in/tourist-place/jubilee-park/",
    color: "#66ff66",
  },
  {
  id: 67,
  name: "Gandhi Mandapam, Chennai",
  position: { lat: 13.0213, lng: 80.2414 },  
  url: "https://en.wikipedia.org/wiki/Gandhi_Mandapam_(Chennai)",
  color: "#ff9933" 
},
{
  "id": 68,
  "name": "Macaw by Stories, OMR Chennai",
  "position": { "lat": 12.8998, "lng": 80.2277 },
  "url": "https://www.zomato.com/chennai/macaw-by-stories-sholinganallur",
  "color": "#0066cc"
}
].map(marker => ({
  ...marker,
  isRecommended: false
}));

const center = { lat: 20.5937, lng: 78.9629 }; 

const MAX_LIBRARIES = ['places'];

function App() {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [tripFilter, setTripFilter] = useState('upcoming'); // 'upcoming' or 'existing'
  const [creationStatus, setCreationStatus] = useState(null); // 'creating', 'success', 'error'
  const [isCreating, setIsCreating] = useState(false);
  // Add this state at the top of your component with other state declarations
  const [rating, setRating] = useState(5); // Default to 5 stars
  // Authentication and user state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(null); // Add this line
  // Map and location states
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [hoverDistance, setHoverDistance] = useState(null);
    // Add these states to your component
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newlyCreatedEvent, setNewlyCreatedEvent] = useState(null);

  // Trip planning states
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    locations: []
  });
  
  // UI states
  const [showDashboard, setShowDashboard] = useState(false);
  const [calendarView, setCalendarView] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  // In your App component
  const [showDashboardMenu, setShowDashboardMenu] = useState(false); // Controls just the menu
  const [showTripsList, setShowTripsList] = useState(false); // Controls trips list
  
  // Review system states
  const [currentPlaceReview, setCurrentPlaceReview] = useState('');
  const [reviewImage, setReviewImage] = useState(null);
  const [showReviewOptions, setShowReviewOptions] = useState(false);
  const [showViewReviews, setShowViewReviews] = useState(false);
  const [showGiveReview, setShowGiveReview] = useState(false);
  const [currentPlaceForReview, setCurrentPlaceForReview] = useState(null);
  const [reviews, setReviews] = useState({});
  const [userStreak, setUserStreak] = useState(0);
  const [showStreakModal, setShowStreakModal] = useState(false);

      const toggleDashboard = () => {
    if (!user) {
      alert("Please sign in first");
      return;
    }
    setShowDashboardMenu(!showDashboardMenu);
    if (showDashboardMenu) {
      setShowTripsList(false);
    }
  };


  // Custom hook for window size
  const useWindowSize = () => {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
    
    useEffect(() => {
      const handleResize = () => {
        setSize([window.innerWidth, window.innerHeight]);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
  };

  useEffect(() => {
  if (!user || events.length === 0) return;

  const checkForUpcomingTrips = () => {
    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const upcomingNotifications = events
      .filter(event => {
        const startDate = new Date(event.startDate);
        return (
          startDate > now && 
          startDate <= oneDayFromNow &&
          !notifications.some(n => n.eventId === event.id)
        );
      })
      .map(event => ({
        eventId: event.id,
        title: `Upcoming Trip: ${event.title}`,
        message: `Your trip to ${event.locations.join(', ')} starts in 24 hours!`,
        startDate: event.startDate
      }));

    if (upcomingNotifications.length > 0) {
      setNotifications(prev => [...prev, ...upcomingNotifications]);
      setCurrentNotification(upcomingNotifications[0]);
      setShowNotification(true);
    }
  };

  // Check immediately
  checkForUpcomingTrips();

  // Then check every hour
  const intervalId = setInterval(checkForUpcomingTrips, 60 * 60 * 1000);

  return () => clearInterval(intervalId);
}, [user, events, notifications]);

  const [width, height] = useWindowSize();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries: MAX_LIBRARIES,
    region: 'US', 
    language: 'en'
  });
  // Add this state near your other state declarations
const [hasFireBadge, setHasFireBadge] = useState(false);

useEffect(() => {
  if (user) { // ✅ Correct: Condition inside Hook
    fetchUserStreak(user.uid);
  } else {
    setUserStreak(0);
  }
}, [user]);

// Update your profile display
{user && (
  <div className="user-profile">
    <img 
      src={user.photoURL || 'https://i.imgur.com/6VBx3io.png'} 
      alt="User" 
      className="user-avatar"
      onClick={toggleDashboard}
    />
    <span className="user-email">
      {user.displayName || user.email}
      {hasFireBadge && (
        <span className="fire-badge" title="Active fire streak!">
          🔥
        </span>
      )}
    </span>
  </div>
)}

  const location = useLocation();
  const navigate = useNavigate();

  const saveEvent = useCallback(async (eventData) => {
    try {
      const docRef = await addDoc(collection(db, "travelEvents"), {
        ...eventData,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
      });
      console.log("Event saved with ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error saving event: ", error);
      throw error;
    }
  }, []);

  const saveReviewToFirestore = async (placeName, reviewData) => {
  try {
    const docRef = await addDoc(collection(db, "placeReviews"), {
      placeName: placeName,
      ...reviewData,
      userId: auth.currentUser.uid,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving review: ", error);
    throw error;
  }
};

const calculateAverageRating = (placeName) => {
  const placeReviews = reviews[placeName] || [];
  if (placeReviews.length === 0) return 0;
  
  const total = placeReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
  return total / placeReviews.length;
};

  const fetchUserStreak = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserStreak(data.streak || 0);
        return data.streak || 0;
      } else {
        // Initialize user data if it doesn't exist
        await setDoc(userRef, {
          streak: 0,
          totalStars: 0,
          lastReviewDate: null,
          createdAt: new Date()
        });
        setUserStreak(0);
        return 0;
      }
    } catch (error) {
      console.error("Error fetching user streak:", error);
      return 0;
    }
  };

  const NotificationBanner = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <div className="notification-banner">
      <div className="notification-content">
        <i className="fas fa-bell"></i>
        <div>
          <h4>{notification.title}</h4>
          <p>{notification.message}</p>
          <small>Your trip starts: {formatDate(notification.startDate)}</small>
        </div>
      </div>
      <button onClick={onClose} className="close-notification">
        ×
      </button>
    </div>
  );
};


// Enhanced star rating display component
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="star-rating-display">
      {[1, 2, 3, 4, 5].map((star) => (
        <span 
          key={star}
          className={star <= rating ? "star-filled" : "star-empty"}
        >
          {star <= rating ? '★' : '☆'}
        </span>
      ))}
      <span className="rating-value">({rating.toFixed(1)})</span>
    </div>
  );
};

const fetchReviewsForPlace = async (placeName) => {
  try {
    console.log('Fetching reviews for:', placeName);
    const q = query(
      collection(db, "placeReviews"),
      where("placeName", "==", placeName),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    console.log('Found', querySnapshot.size, 'reviews');
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().createdAt?.toDate() || new Date()
    }));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

// Update the review item display to include user info and proper star ratings
const renderReviewItem = (review) => (
  <div key={review.id} className="review-item">
    <div className="review-user-info">
      <img 
        src={review.userPhoto || 'https://i.imgur.com/6VBx3io.png'} 
        alt="User" 
        className="review-user-avatar"
      />
      <div className="review-user-details">
        <span className="review-user-name">{review.userName}</span>
        <div className="review-rating">
          {renderStars(review.rating)}
        </div>
        <span className="review-date">
          {review.date?.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) || 'No date'}
        </span>
      </div>
    </div>
    <p className="review-text">{review.text}</p>
    {review.image && (
      <img 
        src={review.image} 
        alt="Review" 
        className="review-image"
      />
    )}
  </div>
);

const openReviewOptions = (placeId) => {
  console.log('Opening review options for place ID:', placeId);
  const place = markers.find(m => m.id === placeId);
  if (place) {
    console.log('Found place:', place.name);
    setCurrentPlaceForReview(place);
    setShowReviewOptions(true);
    const distance = currentLocation 
      ? calculateDistance(currentLocation, place.position) 
      : Infinity;
    setHoverDistance(distance.toFixed(2) + ' km');
    
    // Pre-fetch reviews when opening options
    handleViewReviews(place.name);
  } else {
    console.error('Place not found for ID:', placeId);
  }
};

const handleViewReviews = async (placeName) => {
  console.log('Viewing reviews for:', placeName);
  try {
    setLoading(true);
    const placeReviews = await fetchReviewsForPlace(placeName);
    console.log('Fetched reviews:', placeReviews);
    setReviews(prev => ({
      ...prev,
      [placeName]: placeReviews
    }));
    setShowViewReviews(true);
    setShowReviewOptions(false);
  } catch (error) {
    console.error("Error loading reviews:", error);
    alert("Failed to load reviews");
  } finally {
    setLoading(false);
  }
};

  const handleSubmitReview = async (placeName) => {
    if (!currentPlaceReview.trim()) {
      alert("Please enter a review before submitting");
      return;
    }

    try {
      const newReview = {
        text: currentPlaceReview,
        image: reviewImage || null,
        rating: rating,
        userId: user.uid,
        userPhoto: user.photoURL,
        userName: user.displayName || user.email.split('@')[0],
        createdAt: new Date()
      };

      // First save the review
      await saveReviewToFirestore(placeName, newReview);
      
      // Then update the streak
      const success = await grantFireBadge(user.uid);
      
      if (success) {
        // Fetch updated reviews
        const updatedReviews = await fetchReviewsForPlace(placeName);
        setReviews(prev => ({
          ...prev,
          [placeName]: updatedReviews
        }));

        setCurrentPlaceReview('');
        setReviewImage(null);
        setRating(5);
        setShowGiveReview(false);
        
        // Show success message with streak info
        const currentStreak = await fetchUserStreak(user.uid);
        alert(`🔥 Review submitted! You've earned a star! Current streak: ${currentStreak}`);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };
 const fetchEvents = useCallback(async () => {
    try {
      if (!user) {
        setEvents([]);
        return;
      }
      
      setLoading(true);
      
      const q = query(
        collection(db, "travelEvents"),
        where("userId", "==", user.uid),
        orderBy("__name__", "desc")
      );

      const querySnapshot = await getDocs(q);
      
      const eventsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate?.toDate() || new Date(data.startDate),
          endDate: data.endDate?.toDate() || new Date(data.endDate)
        };
      });
      
      eventsData.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
      setErrorMessage("Failed to load events. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [user]);

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
      setEvents([]);
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, [fetchEvents]);

useEffect(() => {
  const checkFirestoreConnection = async () => {
    try {
      const colRef = collection(db, "travelEvents");
      const q = query(colRef, limit(1));
      await getDocs(q);
    } catch (error) {
      console.error("Firestore connection error:", error);
      setErrorMessage("Failed to connect to database. Please refresh the page.");
    }
  };

  // Moved check into function, but call the function regardless — it handles auth check inside
  checkFirestoreConnection();
}, [user]);

useEffect(() => {
  const fetchStreak = async () => {
    if (user) {
      const streak = await fetchUserStreak(user.uid);
      setUserStreak(streak);
    } else {
      setUserStreak(0);
    }
  };

  fetchStreak();
}, [user]);

useEffect(() => {
  const handleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result?.user) {
        setUser(result.user);
        await fetchEvents();
      }
    } catch (error) {
      console.error("Redirect error:", error);
    }
  };
  handleRedirectResult();
}, [fetchEvents]);

useEffect(() => {
  if (location.state?.recommendations) {
    setRecommendations(location.state.recommendations);
  }
}, [location.state]);

useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        setLocationError(error.message);
      }
    );
  } else {
    setLocationError("Geolocation is not supported by this browser.");
  }
}, []);

useEffect(() => {
  if (!showEventForm) {
    setEditingEvent(null);
    setErrorMessage('');
  }
}, [showEventForm]);

  useEffect(() => {
    if (!user) return;

    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        console.log("Notification permission:", permission);
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    };

    requestNotificationPermission();
  }, [user]);

  // Helper functions
  const calculateDistance = (loc1, loc2) => {
    if (!loc1 || !loc2) return 0;
    const R = 6371; // Earth's radius in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1.lat * Math.PI / 180) * 
      Math.cos(loc2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatDate = (date) => {
    try {
      const dateObj = date?.toDate?.() || new Date(date);
      return dateObj.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const hasEventsOnDate = (date) => {
    return events.some(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const checkDate = new Date(date);
      
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(23, 59, 59, 999);
      checkDate.setHours(0, 0, 0, 0);
      
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  };

  // Event handlers
  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) return;
    setActiveMarker(marker);
  };

  const handleMarkerMouseOver = (markerId) => {
    const marker = markers.find(m => m.id === markerId);
    if (marker && currentLocation) {
      setHoveredMarker(markerId);
      const distance = calculateDistance(currentLocation, marker.position);
      setHoverDistance(distance.toFixed(1) + ' km');
    }
  };

  const handleMarkerMouseOut = () => {
    setHoveredMarker(null);
    setHoverDistance(null);
  };

  const isUserAtPlace = (placePosition) => {
    if (!currentLocation || !placePosition) return false;
    const distance = calculateDistance(currentLocation, placePosition);
    return distance < 2; // 2km radius
  };

  const handleSelectLocation = (name) => {
    if (!user) {
      alert("Please sign in first to select a location");
      return;
    }
  
    if (selectedLocations.includes(name)) {
      alert("This location has already been selected.");
      return;
    }
  
    setSelectedLocations(prev => [...prev, name]);
    setActiveMarker(null);
  };

  const handleRemoveLocation = (location) => {
    setSelectedLocations((prevSelected) =>
      prevSelected.filter((loc) => loc !== location)
    );
  };

  const handleMakeTrip = useCallback(() => {
    try {
      if (!user) {
        setErrorMessage("Please sign in first to create a trip");
        return;
      }

      if (selectedLocations.length === 0) {
        setErrorMessage("Please select at least one location");
        return;
      }

       const tripTitle = selectedLocations.length > 1 
    ? `Trip to: ${selectedLocations.join(', ')}` // Show all locations
    : `Trip to ${selectedLocations[0]}`;

      setEventFormData({
        title: tripTitle,
        description: '',
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        locations: [...selectedLocations]
      });

      setShowEventForm(true);
      setErrorMessage('');
    } catch (error) {
      console.error("Error creating trip:", error);
      setErrorMessage("Failed to create trip");
    }
  }, [selectedLocations, user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowDashboard(false);
      setSelectedLocations([]);
      setEvents([]);
      setCalendarView(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      await fetchEvents();
    } catch (error) {
      console.error("Sign-in error:", error);
      if (error.code !== 'auth/popup-closed-by-user') {
        alert(`Sign-in failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!user || !window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "travelEvents", eventId));
      setEvents(events.filter(event => event.id !== eventId));
      alert("Event deleted successfully!");
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("An error occurred while deleting the event");
    }
  };

  const handleUpdateEvent = async () => {
    if (!user || !editingEvent) return;
    
    try {
      setLoading(true);
      const eventRef = doc(db, "travelEvents", editingEvent.id);
      
      await updateDoc(eventRef, {
        title: eventFormData.title,
        description: eventFormData.description,
        startDate: eventFormData.startDate,
        endDate: eventFormData.endDate,
        locations: eventFormData.locations,
        updatedAt: new Date()
      });

      await fetchEvents();
      setShowEventForm(false);
      setEditingEvent(null);
      alert("Event updated successfully!");
    } catch (err) {
      console.error("Error updating event:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

    const handleFetchEvents = async () => {
    await fetchEvents();
    setShowTripsList(true);
    setShowDashboardMenu(false);
    setCalendarView(false);
  };

const handleCreateEvent = async () => {
  try {
    // Validate inputs
    if (!eventFormData.title.trim()) {
      setErrorMessage('Please enter a trip title');
      return;
    }
    if (eventFormData.locations.length === 0) {
      setErrorMessage('Please select at least one location');
      return;
    }
    if (new Date(eventFormData.startDate) > new Date(eventFormData.endDate)) {
      setErrorMessage('End date must be after start date');
      return;
    }

    setIsCreating(true);
    setCreationStatus('creating');
    setErrorMessage('');

    const newEvent = {
      title: eventFormData.title,
      description: eventFormData.description,
      startDate: new Date(eventFormData.startDate),
      endDate: new Date(eventFormData.endDate),
      locations: [...eventFormData.locations],
      userId: user.uid,
      createdAt: new Date()
    };

    // Add timeout to prevent UI from freezing
    const savePromise = saveEvent(newEvent);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Operation timed out')), 10000)
    );

    await Promise.race([savePromise, timeoutPromise]);
    await fetchEvents();

    setCreationStatus('success');
    setShowConfetti(true);
    
    setTimeout(() => {
      setShowConfetti(false);
      setShowConfirmation(true);
    }, 3000);

  } catch (error) {
    console.error("Error creating event:", error);
    setCreationStatus('error');
    setErrorMessage(error.message || "Failed to create trip. Please try again.");
    
    // If it's a permission error, guide the user
    if (error.code === 'permission-denied') {
      setErrorMessage("You don't have permission to create trips. Please sign in again.");
    }
  } finally {
    setIsCreating(false);
  }
};

  const grantFireBadge = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        streak: increment(1),
        lastReviewDate: new Date(),
        totalStars: increment(1)
      });
      setUserStreak(prev => prev + 1);
      return true;
    } catch (error) {
      console.error("Error granting fire badge:", error);
      return false;
    }
  };

  const handleEditEvent = (event) => {
    try {
      setEditingEvent(event);
      setEventFormData({
        title: event.title || '',
        description: event.description || '',
        startDate: new Date(event.startDate?.seconds * 1000 || event.startDate),
        endDate: new Date(event.endDate?.seconds * 1000 || event.endDate),
        locations: event.locations || []
      });
      setShowEventForm(true);
    } catch (error) {
      console.error("Error setting up edit form:", error);
      alert("Failed to load event for editing");
    }
  };

  
  const handleDateClick = (date) => {
    try {
      const dayEvents = events.filter(event => {
        const eventStart = event.startDate?.toDate 
          ? event.startDate.toDate() 
          : new Date(event.startDate);
        const eventEnd = event.endDate?.toDate 
          ? event.endDate.toDate() 
          : new Date(event.endDate);
        const checkDate = new Date(date);
        
        eventStart.setHours(0, 0, 0, 0);
        eventEnd.setHours(23, 59, 59, 999);
        checkDate.setHours(0, 0, 0, 0);
        
        return checkDate >= eventStart && checkDate <= eventEnd;
      });

      if (dayEvents.length > 0) {
        setEvents(dayEvents);
      }
      setCalendarView(false);
    } catch (error) {
      console.error("Error handling date click:", error);
      setErrorMessage("Failed to load events for selected date");
    }
  };

  // Review system functions
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };




  if (loadError) {
    return (
      <div className="error-message">
        Error loading maps: {loadError.message}
      </div>
    );
  }

  if (!isLoaded) return <div className="loading-message">Loading Maps...</div>;

  return (
    <div className="map-container">
      {showConfetti && (
        <Confetti 
          width={width} 
          height={height}
          numberOfPieces={500}
          recycle={false}
          gravity={0.2}
          style={{ position: 'fixed', zIndex: 1000 }}
        />
      )}
      
      <div className="map-header">
        <h1 className="map-title">
          <i className="fas fa-map-marked-alt"></i> Miles and Memories
        </h1>

        <div className="user-controls">
          {user ? (
            <>
              <div className="user-profile">
                {userStreak > 0 && (
                  <div className="streak-badge" onClick={() => setShowStreakModal(true)}>
                    <span className="fire-icon">🔥</span>
                    <span className="streak-count">{userStreak}</span>
                  </div>
                )}
                <img 
                  src={user.photoURL || 'https://i.imgur.com/6VBx3io.png'} 
                  alt="User" 
                  className="user-avatar"
                  onClick={toggleDashboard} 
                />
                <span className="user-email">{user.displayName || user.email}</span>
              </div>

              {showDashboardMenu && (
                <div className="dashboard-menu">
                  <button onClick={handleFetchEvents} className="dashboard-option">
                    <i className="fas fa-suitcase"></i> My Trips
                  </button>
                  <button 
                    onClick={() => {
                      setCalendarView(!calendarView);
                      setShowDashboardMenu(false);
                    }}
                    className="dashboard-option"
                  >
                    <i className="far fa-calendar-alt"></i> Calendar View
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="dashboard-option signout-option"
                  >
                    <i className="fas fa-sign-out-alt"></i> Sign Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <button onClick={handleGoogleSignIn} className="auth-btn signin-btn" disabled={loading}>
              <i className="fab fa-google"></i> {loading ? 'Signing In...' : 'Sign In with Google'}
            </button>
          )}
        </div>
      </div>

     {calendarView && (
        <CalendarView 
          events={events}
          onClose={() => setCalendarView(false)}
          onDateClick={handleDateClick}
          loading={loading}
        />
      )}
      {locationError && (
        <div className="location-error">
          Location Service: {locationError}
        </div>
      )}

      {showNotification && currentNotification && (
  <NotificationBanner 
    notification={currentNotification}
    onClose={() => {
      setShowNotification(false);
      // Remove this notification from the queue
      setNotifications(prev => prev.filter(n => n.eventId !== currentNotification.eventId));
      // Show next notification if available
      if (notifications.length > 1) {
        setCurrentNotification(notifications[1]);
        setTimeout(() => setShowNotification(true), 500);
      }
    }}
  />
)}

      {successMessage && (
        <div className="alert alert-success">
          <i className="fas fa-check-circle"></i> {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-error">
          {errorMessage}
        </div>
      )}
              
      <div className="google-map-container">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={currentLocation || center}
          zoom={currentLocation ? 10 : 5}
          options={{
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              },
              {
                featureType: "administrative",
                elementType: "labels",
                stylers: [{ visibility: "simplified" }]
              }
            ]
          }}
          onClick={() => {
            setActiveMarker(null);
            setShowDashboard(false);
          }}
        >
          {currentLocation && (
            <MarkerF
              position={currentLocation}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              }}
              onClick={() => setActiveMarker("current")}
            />
          )}

          {activeMarker === "current" && currentLocation && (
            <InfoWindowF
              position={currentLocation}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div><strong>Your Current Location</strong></div>
            </InfoWindowF>
          )}

  {showStreakModal && (
    <div className="streak-modal">
      <div className="streak-modal-content">
        <h3>Your Review Streak</h3>
        <div className="streak-display">
          <span className="fire-icon-large">🔥</span>
          <span className="streak-count-large">{userStreak}</span>
        </div>
        <p>You've submitted {userStreak} review{userStreak !== 1 ? 's' : ''}</p>
        <button 
          onClick={() => setShowStreakModal(false)}
          className="close-streak-modal"
        >
          Close
        </button>
      </div>
    </div>
  )}

{showViewReviews && (
  <div className="reviews-modal">
    <div className="reviews-content">
      <div className="reviews-header">
        <h3>Reviews for {currentPlaceForReview?.name}</h3>
        <div className="average-rating">
          Average Rating: {calculateAverageRating(currentPlaceForReview?.name)} ★
        </div>
      </div>
      
      {loading ? (
        <div className="loading-reviews">
          <i className="fas fa-spinner fa-spin"></i> Loading reviews...
        </div>
      ) : (
        <div className="reviews-list">
          {reviews[currentPlaceForReview?.name]?.length > 0 ? (
            reviews[currentPlaceForReview?.name].map((review, index) => (
              <div key={review.id || index} className="review-item">
                <div className="review-user-info">
                  <img 
                    src={review.userPhoto || 'https://i.imgur.com/6VBx3io.png'} 
                    alt="User" 
                    className="review-user-avatar"
                  />
                  <div className="review-user-details">
                    <span className="review-user-name">{review.userName}</span>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                    <span className="review-date">
                      {review.date?.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) || 'No date'}
                    </span>
                  </div>
                </div>
                <p className="review-text">{review.text}</p>
                {review.image && (
                  <img 
                    src={review.image} 
                    alt="Review" 
                    className="review-image"
                  />
                )}
              </div>
            ))
          ) : (
            <p className="no-reviews">No reviews yet for this place.</p>
          )}
        </div>
      )}
      <button 
        onClick={() => {
          setShowViewReviews(false);
          setShowReviewOptions(true);
        }}
        className="back-to-options-btn"
      >
        Back to Options
      </button>
    </div>
  </div>
)}

          {showReviewOptions && (
            <div className="review-options-modal">
              <div className="review-options-content">
                <h3>{currentPlaceForReview?.name}</h3>
                
                <button 
                  onClick={() => {
                    setShowViewReviews(true);
                    setShowReviewOptions(false);
                  }}
                  className="review-option-btn"
                >
                  View Reviews
                </button>
                
                {isUserAtPlace(currentPlaceForReview?.position) ? (
                  <button 
                    onClick={() => {
                      setShowGiveReview(true);
                      setShowReviewOptions(false);
                    }}
                    className="review-option-btn"
                    disabled={!user}
                  >
                    {user ? "Give Review" : "Sign in to review"}
                  </button>
                ) : (
                  <div className="review-not-available">
                    <p>✋ You need to be within 2km of this location to submit a review</p>
                    <p>Current distance: {hoverDistance || '0.00 km'}</p>
                  </div>
                )}
                
                <button 
                  onClick={() => setShowReviewOptions(false)}
                  className="review-option-btn cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {showViewReviews && currentPlaceForReview && (
            <InfoWindowF
              position={currentPlaceForReview.position}
              onCloseClick={() => {
                setShowViewReviews(false);
                setShowReviewOptions(true);
              }}
            >
              <div className="reviews-content">
                <h3>Reviews for {currentPlaceForReview.name}</h3>
                <div className="average-rating">
                  Average Rating: {calculateAverageRating(currentPlaceForReview.name)} ★
                </div>
                
                {loading ? (
                  <div className="loading-reviews">
                    <i className="fas fa-spinner fa-spin"></i> Loading reviews...
                  </div>
                ) : (
                  <div className="reviews-list">
                    {reviews[currentPlaceForReview.name]?.length > 0 ? (
                      reviews[currentPlaceForReview.name].map((review, index) => (
                        <div key={review.id || index} className="review-item">
                          <div className="review-user-info">
                            <img 
                              src={review.userPhoto || 'https://i.imgur.com/6VBx3io.png'} 
                              alt="User" 
                              className="review-user-avatar"
                            />
                            <div className="review-user-details">
                              <span className="review-user-name">{review.userName}</span>
                              <div className="review-rating">
                                {renderStars(review.rating)}
                              </div>
                              <span className="review-date">
                                {review.date?.toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                }) || 'No date'}
                              </span>
                            </div>
                          </div>
                          <p className="review-text">{review.text}</p>
                          {review.image && (
                            <img 
                              src={review.image} 
                              alt="Review" 
                              className="review-image"
                            />
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="no-reviews">No reviews yet for this place.</p>
                    )}
                  </div>
                )}
                <button 
                  onClick={() => {
                    setShowViewReviews(false);
                    setShowReviewOptions(true);
                  }}
                  className="back-to-options-btn"
                >
                  Back to Options
                </button>
              </div>
            </InfoWindowF>
          )}
          {showViewReviews && (
            <div className="reviews-modal">
              <div className="reviews-content">
                <div className="reviews-header">
                  <h3>Reviews for {currentPlaceForReview?.name}</h3>
                  <div className="average-rating">
                    Average Rating: {renderStars(calculateAverageRating(currentPlaceForReview?.name))}
                  </div>
                </div>
                
                {loading ? (
                  <div className="loading-reviews">
                    <i className="fas fa-spinner fa-spin"></i> Loading reviews...
                  </div>
                ) : (
                  <div className="reviews-list">
                    {reviews[currentPlaceForReview?.name]?.length > 0 ? (
                      reviews[currentPlaceForReview?.name].map(renderReviewItem)
                    ) : (
                      <p className="no-reviews">No reviews yet for this place.</p>
                    )}
                  </div>
                )}
                <button 
                  onClick={() => {
                    setShowViewReviews(false);
                    setShowReviewOptions(true);
                  }}
                  className="back-to-options-btn"
                >
                  Back to Options
                </button>
              </div>
            </div>
          )}

{showGiveReview && (
  <div className="review-form-modal">
    <div className="review-form-content">
      <h3>Write a Review for {currentPlaceForReview?.name}</h3>
      
      <div className="star-rating-container">
        <label>Your Rating:</label>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span 
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className={
                star <= (hoverRating || rating) ? "star-filled" : "star-empty"
              }
            >
              ★
            </span>
          ))}
          <span className="rating-value">{rating} out of 5</span>
        </div>
      </div>
      
      <div className="form-group">
        <label>Your Review:</label>
        <textarea
          value={currentPlaceReview}
          onChange={(e) => setCurrentPlaceReview(e.target.value)}
          placeholder="Share your experience about this place..."
          rows={5}
        />
      </div>
      
      <div className="image-upload-section">
        <label htmlFor="review-image-upload" className="image-upload-label">
          {reviewImage ? 'Change Image' : 'Add Image (Optional)'}
        </label>
        <input
          id="review-image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        {reviewImage && (
          <div className="image-preview">
            <img src={reviewImage} alt="Preview" className="preview-image" />
            <button 
              onClick={() => setReviewImage(null)}
              className="remove-image-btn"
            >
              ×
            </button>
          </div>
        )}
      </div>
      
      <div className="review-form-actions">
       <button 
          onClick={() => handleSubmitReview(currentPlaceForReview.name)}
          className="submit-review-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>

        <button 
          onClick={() => {
            setShowGiveReview(false);
            setShowReviewOptions(true);
            setCurrentPlaceReview('');
            setReviewImage(null);
            setRating(5);
          }}
          className="cancel-review-btn"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

          {/* Tourist Location Markers */}
          {markers.map(({ id, name, position, url }) => {
            const isSelected = selectedLocations.includes(name);
            const isRecommended = recommendations.some(rec => 
              name.toLowerCase().includes(rec.toLowerCase()) || 
              rec.toLowerCase().includes(name.toLowerCase())
            );

            return (
              <MarkerF
                key={id}
                position={position}
                onClick={() => handleActiveMarker(id)}
                onMouseOver={() => handleMarkerMouseOver(id)}
                onMouseOut={handleMarkerMouseOut}
                icon={{
                  url: isRecommended 
                    ? "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                    : isSelected
                      ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png"
                      : user
                        ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: new window.google.maps.Size(32, 32)
                }}
              >
          {activeMarker === id && (
            <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
              <div className="info-window-content">
                <h3 className="info-window-title">{name}</h3>
                {currentLocation && (
                  <p className="distance-info">
                    Distance: {calculateDistance(currentLocation, position).toFixed(1)} km
                  </p>
                )}
                <div className="info-window-buttons">
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="info-window-btn info-btn"
                  >
                    <i className="fas fa-info-circle"></i> More Info
                  </a>
                  <button
                    onClick={() => handleSelectLocation(name)}
                    className={`info-window-btn ${
                      user ? "select-btn" : "disabled-btn"
                    }`}
                    disabled={!user}
                  >
                    {user ? (
                      <><i className="fas fa-map-marker-alt"></i> Select Place</>
                    ) : (
                      "Sign in to select"
                    )}
                  </button>
                  <button
                    onClick={() => openReviewOptions(id)}  // Changed from handleViewReviews
                    className="info-window-btn review-btn"
                  >
                    <i className="fas fa-star"></i> Reviews
                  </button>
                </div>
              </div>
            </InfoWindowF>
          )}
              </MarkerF>
            );
          })}
        </GoogleMap>
      </div>

      {selectedLocations.length > 0 && (
        <div className="selected-locations-panel">
          <h3>
            <i className="fas fa-location-arrow"></i> Selected Places:
          </h3>
          <ul>
            {selectedLocations.map((location, index) => (
              <li key={index}>
                {location}
                <button 
                  onClick={() => handleRemoveLocation(location)}
                  className="remove-location-btn"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <button 
            onClick={handleMakeTrip}
            className="make-trip-btn"
            disabled={!user || loading || selectedLocations.length === 0}
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <><i className="fas fa-plane"></i> Plan Trip ({selectedLocations.length})</>
            )}
          </button>
        </div>
      )}

      {showTripsList && !calendarView && (
        <div className="events-panel">
          <h3>
            <i className="fas fa-suitcase"></i> My Travel Plans
          </h3>
          
          {/* Trip Filter */}
          <div className="trip-filter">
            <button 
              onClick={() => setTripFilter('upcoming')}
              className={`filter-btn ${tripFilter === 'upcoming' ? 'active' : ''}`}
            >
              Upcoming Trips
            </button>
            <button 
              onClick={() => setTripFilter('existing')}
              className={`filter-btn ${tripFilter === 'existing' ? 'active' : ''}`}
            >
              Past Trips
            </button>
          </div>
          
          <div className="events-scroll-container">
            {events
              .filter(event => {
                const now = new Date();
                const endDate = new Date(event.endDate);
                return tripFilter === 'upcoming' 
                  ? endDate >= now 
                  : endDate < now;
              })
              .map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-header">
                    <h4>{event.title || 'Untitled Trip'}</h4>
                    <div className="event-dates">
                      <i className="far fa-calendar-alt"></i> {formatDate(event.startDate)} - 
                      {formatDate(event.endDate)}
                    </div>
                  </div>
                  
                  {event.description && (
                    <p className="event-description">
                      <i className="fas fa-align-left"></i> {event.description}
                    </p>
                  )}

                  {event.locations?.length > 0 && (
                    <div className="event-locations">
                      <strong><i className="fas fa-map-marker-alt"></i> Locations:</strong>
                      <ul>
                        {event.locations.map((loc, idx) => (
                          <li key={idx}>{loc}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="event-actions">
                    <button 
                      onClick={() => handleEditEvent(event)}
                      className="edit-event-btn"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="delete-event-btn"
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
          <button 
            onClick={() => setShowTripsList(false)}
            className="close-events-btn"
          >
            <i className="fas fa-times"></i> Close Trips
          </button>
        </div>
      )}

        {showEventForm && (
          <div className="event-form-modal">
            <div className="event-form-content">
              <h3>
                <i className="fas fa-plane"></i> {editingEvent ? 'Edit Trip' : 'Create New Trip'}
              </h3>
              
              <div className="form-group">
                <label>
                  <i className="fas fa-heading"></i> Trip Name:
                </label>
                <input
                  type="text"
                  name="title"
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({...eventFormData, title: e.target.value})}
                  placeholder="My Awesome Trip"
                />
              </div>
              
              <div className="form-group">
                <label>
                  <i className="fas fa-align-left"></i> Description:
                </label>
                <textarea
                  name="description"
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({...eventFormData, description: e.target.value})}
                  placeholder="Describe your trip..."
                  rows={4}
                />
              </div>

              {/* Selected Locations Section */}
              <div className="form-group">
                <label>
                  <i className="fas fa-map-marker-alt"></i> Locations:
                </label>
                <div className="selected-locations-list">
                  {eventFormData.locations.length > 0 ? (
                    eventFormData.locations.map((location, index) => (
                      <div key={index} className="location-tag">
                        {location}
                        {!editingEvent && (
                          <button 
                            onClick={() => {
                              const updatedLocations = [...eventFormData.locations];
                              updatedLocations.splice(index, 1);
                              setEventFormData({...eventFormData, locations: updatedLocations});
                            }}
                            className="remove-location-btn"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="no-locations-message">No locations selected</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>
                  <i className="far fa-calendar-check"></i> Start Date & Time:
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={new Date(eventFormData.startDate).toISOString().slice(0, 16)}
                  onChange={(e) => setEventFormData({
                    ...eventFormData,
                    startDate: new Date(e.target.value)
                  })}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              
              <div className="form-group">
                <label>
                  <i className="far fa-calendar-times"></i> End Date & Time:
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={new Date(eventFormData.endDate).toISOString().slice(0, 16)}
                  onChange={(e) => setEventFormData({
                    ...eventFormData,
                    endDate: new Date(e.target.value)
                  })}
                  min={new Date(eventFormData.startDate).toISOString().slice(0, 16)}
                />
              </div>
              
              <div className="form-actions">
                <button 
                  onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                  className={`save-event-btn ${isCreating ? 'loading' : ''}`}
                  disabled={isCreating || eventFormData.locations.length === 0}
                >
                  {isCreating ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> 
                      {creationStatus === 'creating' ? 'Saving...' : 'Processing...'}
                    </>
                  ) : editingEvent ? (
                    <><i className="fas fa-save"></i> Update Trip</>
                  ) : (
                    <><i className="fas fa-plus-circle"></i> Create Trip</>
                  )}
                </button>
                
                <button 
                  onClick={() => {
                    setShowEventForm(false);
                    if (!editingEvent) {
                      setSelectedLocations([]);
                    }
                  }}
                  className="cancel-event-btn"
                  disabled={isCreating}
                >
                  <i className="fas fa-times"></i> Cancel
                </button>
              </div>

              {creationStatus === 'success' && (
                <div className="creation-status success">
                  <i className="fas fa-check-circle"></i> Trip created successfully!
                </div>
              )}

              {creationStatus === 'error' && errorMessage && (
                <div className="creation-status error">
                  <i className="fas fa-exclamation-circle"></i> {errorMessage}
                </div>
              )}
            </div>
          </div>
        )}



      {/* Events Panel with Filter */}
      {showDashboard && events.length > 0 && !calendarView && (
        <div className="events-panel">
          <h3>
            <i className="fas fa-suitcase"></i> My Travel Plans
          </h3>
          
          {/* Trip Filter Section */}
          <div className="trip-filter">
            <button 
              onClick={() => setTripFilter('upcoming')}
              className={`filter-btn ${tripFilter === 'upcoming' ? 'active' : ''}`}
            >
              Upcoming Trips
            </button>
            <button 
              onClick={() => setTripFilter('existing')}
              className={`filter-btn ${tripFilter === 'existing' ? 'active' : ''}`}
            >
              Past Trips
            </button>
          </div>
          
          <div className="events-scroll-container">
            {events
              .filter(event => {
                const now = new Date();
                const endDate = new Date(event.endDate);
                return tripFilter === 'upcoming' 
                  ? endDate >= now 
                  : endDate < now;
              })
              .map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-header">
                    <h4>{event.title || 'Untitled Trip'}</h4>
                    <div className="event-dates">
                      <i className="far fa-calendar-alt"></i> {formatDate(event.startDate)} - 
                      {formatDate(event.endDate)}
                    </div>
                  </div>
                  
                  {event.description && (
                    <p className="event-description">
                      <i className="fas fa-align-left"></i> {event.description}
                    </p>
                  )}

                  {event.locations?.length > 0 && (
                    <div className="event-locations">
                      <strong><i className="fas fa-map-marker-alt"></i> Locations:</strong>
                      <ul>
                        {event.locations.map((loc, idx) => (
                          <li key={idx}>{loc}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="event-actions">
                    <button 
                      onClick={() => handleEditEvent(event)}
                      className="edit-event-btn"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="delete-event-btn"
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
          <button 
            onClick={() => setEvents([])}
            className="close-events-btn"
          >
            <i className="fas fa-times"></i> Close Trips
          </button>
        </div>
      )}
    </div>
  );
}

export default App;