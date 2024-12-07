import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Login from './components/Login'; // Ensure Login.js has a default export
import Settings from './components/Settings'; // Ensure Settings.js has a default export
import Tabs from './components/Tabs';
import ShiftForm from './components/ShiftForm'; // Ensure ShiftForm.js has a default export
import ShiftList from './components/ShiftList';
import Summary from './components/Summary';
import { database, auth } from './firebase'; // Import Firebase
import { ref, onValue, push, remove, off, set } from 'firebase/database'; // Import necessary functions
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Authentication functions
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [shifts, setShifts] = useState([]);
  const [form, setForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    hourlyRate: 65,
    customDate: false,
    yesterday: false
  });
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0,7)); // Format: YYYY-MM
  const [customShift, setCustomShift] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });

  /* Profile Settings State */
  const [profile, setProfile] = useState({
    hourlyRate: 65,
    monthlyHours: 182,
    fullTimePercentage: 100
  });

  /* Temporary Profile Settings State for Modal */
  const [tempProfile, setTempProfile] = useState(profile);

  /* Tab State */
  const [activeTab, setActiveTab] = useState('regular'); // 'regular' or 'custom'

  const [user, setUser] = useState(null); // Store authenticated user

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm({
      ...form,
      [id]: type === 'checkbox' ? checked : value
    });
  };

  const handleTempProfileChange = (e) => {
    const { id, value } = e.target;
    setTempProfile({
      ...tempProfile,
      [id]: value
    });
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const shiftsRef = ref(database, `users/${user.uid}/shifts`);
        const profileRef = ref(database, `users/${user.uid}/profile`);

        const handleShiftsValueChange = (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const fetchedShifts = Object.keys(data).map(key => ({ id: key, ...data[key] }));
            setShifts(fetchedShifts);
          } else {
            setShifts([]);
          }
        };

        const handleProfileValueChange = (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setProfile(data);
            setTempProfile(data);
          }
        };

        onValue(shiftsRef, handleShiftsValueChange);
        onValue(profileRef, handleProfileValueChange);

        return () => {
          // Detach the listeners using the exact callback references
          off(shiftsRef, 'value', handleShiftsValueChange);
          off(profileRef, 'value', handleProfileValueChange);
        };
      } else {
        setUser(null);
        setShifts([]);
        setProfile({
          hourlyRate: 65,
          monthlyHours: 182,
          fullTimePercentage: 100
        });
        setTempProfile({
          hourlyRate: 65,
          monthlyHours: 182,
          fullTimePercentage: 100
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const getHourlyRate = (date, time) => {
    const dayOfWeek = new Date(date).getDay();
    const hour = parseInt(time.split(':')[0], 10);

    if (dayOfWeek === 5) { // Friday
      if (hour >= 7 && hour < 13) return 1.0;
      if (hour >= 13 && hour < 19) return 1.4;
      return 2.0;
    } else if (dayOfWeek === 6) { // Saturday
      if (hour >= 7 && hour < 19) return 1.75;
      return 2.0;
    } else { // Other days
      if (hour >= 7 && hour < 13) return 1.0;
      if (hour >= 13 && hour < 19) return 1.2;
      if (hour >= 19 || hour < 5) return 1.5;
      return 1.87;
    }
  };

  const calculateEarnings = (date, startTime, endTime) => {
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    if (end < start) end.setDate(end.getDate() + 1); // Handle overnight shifts

    let earnings = 0;
    let current = new Date(start);

    while (current < end) {
      const nextHour = new Date(current);
      nextHour.setHours(current.getHours() + 1);
      if (nextHour > end) nextHour.setTime(end.getTime());

      const hourlyRate = getHourlyRate(date, current.toTimeString().slice(0, 5));
      const hoursWorked = (nextHour - current) / (1000 * 60 * 60);
      earnings += hoursWorked * hourlyRate * profile.hourlyRate;

      current = nextHour;
    }

    return earnings;
  };

  const handleShiftClick = (shiftType) => {
    if (!user) return;

    let startTime, endTime;
    switch (shiftType) {
      case 'morning':
        startTime = '07:00';
        endTime = '15:00';
        break;
      case 'evening':
        startTime = '15:00';
        endTime = '23:00';
        break;
      case 'night':
        startTime = '23:00';
        endTime = '07:00';
        break;
      default:
        return;
    }

    let date = new Date().toISOString().split('T')[0]; // Default to today
    if (form.customDate) {
      date = form.date;
    } else if (form.yesterday) {
      date = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
    }

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    if (end < start) end.setDate(end.getDate() + 1); // Handle overnight shifts

    const hoursWorked = (end - start) / (1000 * 60 * 60);
    const earnings = calculateEarnings(date, startTime, endTime);

    const newShift = { date, startTime, endTime, hoursWorked, earnings };
    push(ref(database, `users/${user.uid}/shifts`), newShift); // Add shift to Firebase under the user's data
  };

  const handleDeleteShift = (id) => {
    if (!user) return;

    remove(ref(database, `users/${user.uid}/shifts/${id}`))
      .then(() => {
        console.log(`Shift with id ${id} deleted successfully.`);
      })
      .catch((error) => {
        console.error(`Error deleting shift with id ${id}:`, error);
      });
  };

  const handleUpdateShift = (id, startTime, endTime) => {
    if (!user) return;
  
    const shiftRef = ref(database, `users/${user.uid}/shifts/${id}`);
    const shift = shifts.find(shift => shift.id === id);
    if (!shift) return;
  
    const hoursWorked = (new Date(`${shift.date}T${endTime}`) - new Date(`${shift.date}T${startTime}`)) / (1000 * 60 * 60);
    const earnings = calculateEarnings(shift.date, startTime, endTime);
  
    set(shiftRef, { ...shift, startTime, endTime, hoursWorked, earnings })
      .then(() => {
        console.log(`Shift with id ${id} updated successfully.`);
      })
      .catch((error) => {
        console.error(`Error updating shift with id ${id}:`, error);
      });
  };

  const handleCustomShiftChange = (e) => {
    const { id, value } = e.target;
    setCustomShift({
      ...customShift,
      [id]: value
    });
  };

  const handleAddCustomShift = (e) => {
    e.preventDefault();
    if (!user) return;

    const { date, startTime, endTime } = customShift;
    if (!date || !startTime || !endTime) return;

    const hoursWorked = (new Date(`${date}T${endTime}`) - new Date(`${date}T${startTime}`)) / (1000 * 60 * 60);
    const earnings = calculateEarnings(date, startTime, endTime);

    const newShift = { date, startTime, endTime, hoursWorked, earnings };
    push(ref(database, `users/${user.uid}/shifts`), newShift); // Add custom shift to Firebase under the user's data
    setCustomShift({ date: '', startTime: '', endTime: '' });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!user) return;

    set(ref(database, `users/${user.uid}/profile`), tempProfile)
      .then(() => {
        setProfile(tempProfile);
        setShowSettings(false);
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
  };

  const sortShiftsByDate = (shifts) => {
    return shifts.sort((a, b) => new Date(a.date) - new Date(b.date)).map(shift => ({
      ...shift,
      date: new Date(shift.date).toLocaleDateString('en-GB') // Format date as dd-mm-yyyy
    }));
  };

  // Calculate totals for the selected month
  const filteredShifts = sortShiftsByDate(shifts.filter(shift => shift.date.startsWith(selectedMonth)));
  const totalHours = filteredShifts.reduce((acc, shift) => acc + shift.hoursWorked, 0);
  const totalEarnings = filteredShifts.reduce((acc, shift) => acc + shift.earnings, 0);
  const targetHours = profile.monthlyHours * (profile.fullTimePercentage / 100);
  const progressPercentage = Math.min((totalHours / targetHours) * 100, 100);

  /* Authentication State */
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  /* Handle Login */
  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Attempting to log in with email:', email);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Login successful:', userCredential);
        setIsAuthenticated(true);
        setEmail('');
        setPassword('');
      })
      .catch((error) => {
        alert('Incorrect Email or Password');
        console.error('Error logging in:', error);
      });
  };

  /* Handle Settings Toggle */
  const toggleSettings = () => {
    setShowSettings(!showSettings);
    // Sync tempProfile with current profile when opening the modal
    if (!showSettings) {
      setTempProfile(profile);
    }
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Login handleLogin={handleLogin} email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
      ) : (
        <>
          <Header user={user} toggleSettings={toggleSettings} /> {/* Pass user and toggleSettings */}
          {showSettings && (
            <Settings
              tempProfile={tempProfile}
              handleTempProfileChange={handleTempProfileChange}
              handleUpdateProfile={handleUpdateProfile}
              toggleSettings={toggleSettings}
            />
          )}

          <Tabs activeTab={activeTab} handleTabClick={handleTabClick} />

          <ShiftForm
            activeTab={activeTab}
            form={form}
            handleChange={handleChange} // Ensure handleChange is passed
            handleShiftClick={handleShiftClick}
            customShift={customShift}
            handleCustomShiftChange={handleCustomShiftChange}
            handleAddCustomShift={handleAddCustomShift}
          />

          {/* Month Selection */}
          <div style={{ marginTop: '20px' }}>
            <label htmlFor="monthSelect">Select Month: </label>
            <input
              type="month"
              id="monthSelect"
              value={selectedMonth}
              onChange={handleMonthChange}
            />
          </div>

          {/* Shifts Table */}
          <ShiftList filteredShifts={filteredShifts.map(shift => ({
            ...shift,
            shiftType: getShiftType(shift.startTime, shift.endTime)
          }))} handleDeleteShift={handleDeleteShift} handleUpdateShift={handleUpdateShift} />

          {/* Summary Section */}
          <Summary
            selectedMonth={selectedMonth}
            totalHours={totalHours}
            targetHours={targetHours}
            progressPercentage={progressPercentage}
            totalEarnings={totalEarnings}
          />
        </>
      )}
    </div>
  );
}

// Helper function to determine shift type
const getShiftType = (startTime, endTime) => {
  if (startTime === '07:00' && endTime === '15:00') return 'morning';
  if (startTime === '15:00' && endTime === '23:00') return 'evening';
  if (startTime === '23:00' && endTime === '07:00') return 'night';
  return 'custom';
};

export default App;