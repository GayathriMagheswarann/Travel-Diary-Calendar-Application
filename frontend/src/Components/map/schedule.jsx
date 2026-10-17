import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import ReactConfetti from "react-confetti";
import confetti from "canvas-confetti";
import './schedule.css';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

function Schedule() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get locations from navigation state
  const selectedLocations = location.state?.locations || [];

  // State management
  const [eventName, setEventName] = useState(
    selectedLocations.length > 0 
      ? `Trip to ${selectedLocations.join(', ')}`
      : ""
  );
  const [eventDescription, setEventDescription] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Force token refresh to ensure we have a valid token
          await currentUser.getIdToken(true);
          setUser(currentUser);
        } catch (error) {
          console.error("Token refresh error:", error);
          setUser(null);
          setError("Session expired. Please sign in again.");
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/calendar');
      provider.addScope('https://www.googleapis.com/auth/calendar.events');
      
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Sign-in error:", error);
      setError(error.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const fireConfetti = () => {
    setShowConfetti(true);
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'],
    });
    
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#ff61a6', '#9b5de5', '#00f5d4'],
      });
    }, 300);
  };

const saveEvent = async () => {
  if (!user) {
    setError("You must be signed in to schedule an event.");
    return;
  }

  setIsLoading(true);
  setError("");

  try {
    // Force token refresh and get fresh ID token with calendar scopes
    const token = await user.getIdToken(true);
    
    if (!token) {
      throw new Error("Failed to get authentication token");
    }

    // Prepare event data with proper timezone handling
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const event = {
      summary: eventName || `Trip to ${selectedLocations.join(', ')}`,
      description: eventDescription || `Places to visit:\n- ${selectedLocations.join('\n- ')}`,
      start: {
        dateTime: start.toISOString(),
        timeZone: timeZone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: timeZone,
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 30 }
        ],
      },
    };

    // Make the API request with fresh token
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Google API Error:", responseData);
      let errorMessage = "Failed to create calendar event";
      if (responseData.error) {
        if (responseData.error.message) {
          errorMessage += `: ${responseData.error.message}`;
        }
        if (responseData.error.status === "UNAUTHENTICATED") {
          errorMessage += " - Please sign out and sign in again.";
        }
      }
      throw new Error(errorMessage);
    }

    // Success handling
    fireConfetti();
    alert(`Trip scheduled successfully!\n\nView it in Google Calendar: ${responseData.htmlLink}`);
    navigate("/");
  } catch (err) {
    console.error("Error saving event:", err);
    setError(err.message || "Failed to create Google Calendar event. Please check your permissions.");
  } finally {
    setIsLoading(false);
  }
};
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="schedule-wrapper"
    >
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}
      
      <div className="schedule-card">
        <div className="mb-6 text-center">
          <h2 className="schedule-title">Schedule Your Trip</h2>
          {selectedLocations.length > 0 && (
            <p className="schedule-subtitle">
              {selectedLocations.join(' → ')}
            </p>
          )}
        </div>

        {!user ? (
          <div className="text-center">
            <p className="mb-4 text-gray-600">You need to sign in to schedule events</p>
            <button
              onClick={handleGoogleSignIn}
              className="signin-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In with Google'}
            </button>
            {error && <div className="error-box mt-4">{error}</div>}
          </div>
        ) : (
          <>
            {error && (
              <div className="error-box">
                {error}
              </div>
            )}
            <div className="space-y-5">
              <div>
                <label className="input-label">Event Name</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="text-input"
                  placeholder={`Trip to ${selectedLocations.join(', ')}`}
                />
              </div>
              <div>
                <label className="input-label">Description</label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="text-area"
                  rows={3}
                  placeholder="What's your trip about?"
                />
              </div>
              <div>
                <label className="input-label">Start Date & Time</label>
                <DatePicker
                  selected={start}
                  onChange={(date) => setStart(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="datepicker"
                />
              </div>
              <div>
                <label className="input-label">End Date & Time</label>
                <DatePicker
                  selected={end}
                  onChange={(date) => setEnd(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  minDate={start}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="datepicker"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={saveEvent}
                disabled={isLoading}
                className={`submit-btn ${isLoading ? "submit-btn-disabled" : "submit-btn-enabled"}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Event"
                )}
              </motion.button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Schedule;