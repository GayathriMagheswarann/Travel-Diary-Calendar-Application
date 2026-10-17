import React, { useEffect, useRef, useState } from 'react';
import './home.css';
import video from '../../assets/flower.mp4';
import { HiFilter } from 'react-icons/hi';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';

const seasonMonthMap = {
  Summer: ['January', 'February', 'March', 'April'],
  Winter: ['October', 'November', 'December'],
  Monsoon: ['May', 'June', 'July'],
  Autumn: ['August', 'September'],
  Spring: ['August', 'September', 'October'],
};

const pricingTable = {
  '1': {
    'Low': '₹2,000 – ₹3,000',
    'Medium': '₹4,500 – ₹7,000',
    'High': '₹7,500 – ₹13,500'
  },
  '2': {
    'Low': '₹3,500 – ₹5,000',
    'Medium': '₹8,000 – ₹12,000',
    'High': '₹14,000 – ₹24,000'
  },
  '3': {
    'Low': '₹5,000 – ₹7,000',
    'Medium': '₹11,000 – ₹17,000',
    'High': '₹20,000 – ₹33,000'
  },
  '4': {
    'Low': '₹6,500 – ₹9,000',
    'Medium': '₹14,000 – ₹22,000',
    'High': '₹25,000 – ₹42,000'
  },
  '5': {
    'Low': '₹8,000 – ₹11,000',
    'Medium': '₹17,000 – ₹27,000',
    'High': '₹30,000 – ₹51,000'
  },
  'More than 5': {
    'Low': '₹1,500/person',
    'Medium': '₹3,500/person',
    'High': '₹6,000+/person'
  }
};

const Home = () => {
  const navigate = useNavigate();
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState('Select Your Budget');
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('Select Group Size');
  const [isActivity, setIsActivity] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState('Select your Preference');
  const [isSeason, setIsSeason] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('Select Season');
  const [isMonth, setIsMonth] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Select Month');
  const [budgetOptions, setBudgetOptions] = useState([]);

  // Error states
  const [budgetError, setBudgetError] = useState(false);
  const [groupError, setGroupError] = useState(false);
  const [activityError, setActivityError] = useState(false);
  const [seasonError, setSeasonError] = useState(false);
  const [monthError, setMonthError] = useState(false);

  // API result states
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  // Dropdown refs
  const budgetRef = useRef(null);
  const groupRef = useRef(null);
  const ActivityRef = useRef(null);
  const SeasonRef = useRef(null);
  const MonthRef = useRef(null);

  // Options
  const groupOptions = ['1', '2', '3', '4', '5', 'More than 5'];
  const ActivityOptions = ['Adventure', 'Cultural', 'Eco Tourism', 'Family Trip'];
  const SeasonOptions = ['Summer', 'Winter', 'Monsoon', 'Autumn', 'Spring'];

  const updateBudgetOptions = (groupSize) => {
    if (!groupSize || groupSize === 'Select Group Size') return;
    
    const groupKey = groupSize === 'More than 5' ? 'More than 5' : groupSize;
    const budgets = pricingTable[groupKey];
    
    const formattedOptions = Object.keys(budgets).map(budgetLevel => ({
      level: budgetLevel,
      range: budgets[budgetLevel]
    }));
    
    setBudgetOptions(formattedOptions);
    setSelectedBudget('Select Your Budget');
  };

  const handleStart = async () => {
    // Validate form
    setBudgetError(selectedBudget === 'Select Your Budget' || typeof selectedBudget === 'string');
    setGroupError(selectedGroup === 'Select Group Size');
    setActivityError(selectedActivity === 'Select your Preference');
    setSeasonError(selectedSeason === 'Select Season');
    setMonthError(selectedMonth === 'Select Month');

    if (
      selectedBudget === 'Select Your Budget' || typeof selectedBudget === 'string' ||
      selectedGroup === 'Select Group Size' ||
      selectedActivity === 'Select your Preference' ||
      selectedSeason === 'Select Season' ||
      selectedMonth === 'Select Month'
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const userData = {
        Month: selectedMonth,
        Season: selectedSeason,
        Budget: selectedBudget.level,
        Activity_Preference: selectedActivity,
        Group_Size: selectedGroup === 'More than 5' ? 6 : parseInt(selectedGroup)
      };

      const response = await fetch('http://localhost:5000/addUserData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (data.suggested_places && data.suggested_places.length > 0) {
        console.log("Suggested Places:", data.suggested_places);
        navigate('/map', { 
          state: { recommendations: data.suggested_places } 
        });
      } else {
        setError('No predictions found.');
      }
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dropdown close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (budgetRef.current && !budgetRef.current.contains(event.target)) setIsBudgetOpen(false);
      if (groupRef.current && !groupRef.current.contains(event.target)) setIsGroupOpen(false);
      if (ActivityRef.current && !ActivityRef.current.contains(event.target)) setIsActivity(false);
      if (SeasonRef.current && !SeasonRef.current.contains(event.target)) setIsSeason(false);
      if (MonthRef.current && !MonthRef.current.contains(event.target)) setIsMonth(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <section className='home'>
      <div className="overlay"></div>
      <video src={video} muted autoPlay loop type="video/mp4" />

      <div className="homeContent container">
        <div className="textDiv">
          <span data-aos="fade-up" className="smallText">Start Planning</span>
          <h1 data-aos="fade-up" className="homeTitle">Search</h1>
        </div>

        <div data-aos="fade-up" className="cardDiv grid">
          {/* Group Size Dropdown - Moved to top */}
          <div className="custom-dropdown" ref={groupRef}>
            <label className="dropdown-label">Group Size</label>
            <div className="dropdown-header" onClick={() => setIsGroupOpen(!isGroupOpen)}>
              {selectedGroup}<span className="arrow">&#9662;</span>
            </div>
            {isGroupOpen && (
              <ul className="dropdown-list">
                {groupOptions.map(option => (
                  <li key={option} onClick={() => {
                    setSelectedGroup(option);
                    setIsGroupOpen(false);
                    setGroupError(false);
                    updateBudgetOptions(option);
                  }}>{option}</li>
                ))}
              </ul>
            )}
            {groupError && <p className="error-message">Please select group size.</p>}
          </div>

          {/* Budget Dropdown */}
          <div className="custom-dropdown" ref={budgetRef}>
            <label className="dropdown-label">Budget</label>
            <div className="dropdown-header" onClick={() => {
              if (!selectedGroup || selectedGroup === 'Select Group Size') {
                alert('Please select group size first');
                return;
              }
              setIsBudgetOpen(!isBudgetOpen);
            }}>
              {selectedBudget === 'Select Your Budget' ? selectedBudget : 
               `${selectedBudget.level} (${selectedBudget.range})`}
              <span className="arrow">&#9662;</span>
            </div>
            {isBudgetOpen && (
              <ul className="dropdown-list">
                {budgetOptions.map((option, index) => (
                  <li key={index} onClick={() => {
                    setSelectedBudget(option);
                    setIsBudgetOpen(false);
                    setBudgetError(false);
                  }}>
                    {option.level} ({option.range})
                  </li>
                ))}
              </ul>
            )}
            {budgetError && <p className="error-message">Please select your budget.</p>}
          </div>

          {/* Activity Preference Dropdown */}
          <div className="custom-dropdown" ref={ActivityRef}>
            <label className="dropdown-label">Activity Preference</label>
            <div className="dropdown-header" onClick={() => setIsActivity(!isActivity)}>
              {selectedActivity}<span className="arrow">&#9662;</span>
            </div>
            {isActivity && (
              <ul className="dropdown-list">
                {ActivityOptions.map(option => (
                  <li key={option} onClick={() => {
                    setSelectedActivity(option);
                    setIsActivity(false);
                    setActivityError(false);
                  }}>{option}</li>
                ))}
              </ul>
            )}
            {activityError && <p className="error-message">Please select an activity.</p>}
          </div>

          {/* Season Dropdown */}
          <div className="custom-dropdown" ref={SeasonRef}>
            <label className="dropdown-label">Season</label>
            <div className="dropdown-header" onClick={() => setIsSeason(!isSeason)}>
              {selectedSeason}<span className="arrow">&#9662;</span>
            </div>
            {isSeason && (
              <ul className="dropdown-list">
                {SeasonOptions.map(option => (
                  <li key={option} onClick={() => {
                    setSelectedSeason(option);
                    setIsSeason(false);
                    setSelectedMonth('Select Month');
                    setSeasonError(false);
                    setMonthError(false);
                  }}>{option}</li>
                ))}
              </ul>
            )}
            {seasonError && <p className="error-message">Please select a season.</p>}
          </div>

          {/* Month Dropdown */}
          <div className="custom-dropdown" ref={MonthRef}>
            <label className="dropdown-label">Month</label>
            <div className="dropdown-header" onClick={() => setIsMonth(!isMonth)}>
              {selectedMonth}<span className="arrow">&#9662;</span>
            </div>
            {isMonth && (
              <ul className="dropdown-list">
                {seasonMonthMap[selectedSeason]?.map((month, index) => (
                  <li key={index} onClick={() => {
                    setSelectedMonth(month);
                    setIsMonth(false);
                    setMonthError(false);
                  }}>{month}</li>
                ))}
              </ul>
            )}
            {monthError && <p className="error-message">Please select a month.</p>}
          </div>
        </div>

        <div className="buttonDiv">
          <button onClick={handleStart} className="btn">
            {isLoading ? 'Loading...' : 'Start Planning'}
          </button>
        </div>

        {/* Display recommendations */}
        {recommendations.length > 0 && (
          <div className="recommendations" data-aos="fade-up">
            <h3>Recommended Travel Destinations</h3>
            <ul>
              {recommendations.map((place, index) => (
                <li key={index}>
                  <span className="place-number">{index + 1}.</span>
                  <span className="place-name">{place}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>
    </section>
  );
};

export default Home;