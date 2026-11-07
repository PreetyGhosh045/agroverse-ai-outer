import './App.css'
import { useState, useEffect, useRef } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import FarmDraw from './FarmDraw'
import Login from './components/Login/Login'
import LandingPage from './components/LandingPage/LandingPage' // 🟢 ১. LandingPage ইম্পোর্ট করা হলো

const seasons = ["Kharif", "Rabi", "Zaid"];

const seasonMeta = {
  Kharif: { emoji: "🌧️", label: "Kharif" },
  Rabi: { emoji: "❄️", label: "Rabi" },
  Zaid: { emoji: "☀️", label: "Zaid" }
};

const cropOptions = [
  { en: "Rice", bn: "ধান" },
  { en: "Maize", bn: "ভুট্টা" },
  { en: "Ragi", bn: "রাগি" },
  { en: "Horse Gram", bn: "কুলথি" },
  { en: "Moth Bean", bn: "মটকি" },
  { en: "Peas / Beans", bn: "মটর / শিম" },
  { en: "Safflower", bn: "কুসুম" },
  { en: "Potato", bn: "আলু" },
  { en: "Tomato", bn: "টমেটো" },
  { en: "Brinjal", bn: "বেগুন" },
  { en: "Cucurbits", bn: "কুমড়াজাতীয়" },
  { en: "Cabbage", bn: "বাঁধাকপি" },
  { en: "Cauliflower", bn: "ফুলকপি" },
  { en: "Bhindi", bn: "ঢেঁড়স" },
  { en: "Onion", bn: "পেঁয়াজ" }
];

// Seasonal crop groups used by BOTH recommendation and rotation.
// A crop can belong to more than one season.
const cropsBySeason = {
  Kharif: ["Rice", "Maize", "Ragi", "Horse Gram", "Moth Bean", "Peas / Beans", "Tomato", "Brinjal", "Cucurbits", "Bhindi", "Onion"],
  Rabi: ["Horse Gram", "Moth Bean", "Peas / Beans", "Safflower", "Potato", "Tomato", "Brinjal", "Cabbage", "Cauliflower", "Onion"],
  Zaid: ["Maize", "Ragi", "Peas / Beans", "Potato", "Tomato", "Brinjal", "Cucurbits", "Bhindi", "Onion"]
};

const cropEmoji = {
  "Rice": "🍚", "Maize": "🌽", "Ragi": "🌾", "Horse Gram": "🫘",
  "Moth Bean": "🫘", "Peas / Beans": "🫛", "Safflower": "🌼", "Potato": "🥔",
  "Tomato": "🍅", "Brinjal": "🍆", "Cucurbits": "🥒", "Cabbage": "🥬",
  "Cauliflower": "🥦", "Bhindi": "🌿", "Onion": "🧅"
};

function App() {
  // 🟢 ২. পেজ নেভিগেশন কন্ট্রোল করার জন্য নতুন স্টেট ('home', 'login', 'dashboard')
  const [currentPage, setCurrentPage] = useState('home')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef(null)

  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [profileMessage, setProfileMessage] = useState('')
  const [soil, setSoil] = useState('')
  const [water, setWater] = useState('')
  const [recommendation, setRecommendation] = useState('')
  const [rotationSaved, setRotationSaved] = useState(false)
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false)
  const [advisorQuestion, setAdvisorQuestion] = useState('')
  const [advisorAnswer, setAdvisorAnswer] = useState('')
  const [isAdvisorLoading, setIsAdvisorLoading] = useState(false)
  const [farmName, setFarmName] = useState('')
  const [farmLocation, setFarmLocation] = useState('')
  const [landArea, setLandArea] = useState('')
  const [farmSoil, setFarmSoil] = useState('')
  const [currentCrop, setCurrentCrop] = useState('')
  const [nextCrop, setNextCrop] = useState('Pulses')
  const [followingCrop, setFollowingCrop] = useState('Vegetables')
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [selectedRotationSeasons, setSelectedRotationSeasons] = useState([]);
  const [selectedRecommendationSeason, setSelectedRecommendationSeason] = useState('');
  const [selectedRecommendationCrops, setSelectedRecommendationCrops] = useState([]);
  const [rotationResult, setRotationResult] = useState(null);
  const [soilPH, setSoilPH] = useState("");
  const [soilPHResult, setSoilPHResult] = useState(null);
  const [soilPHLoading, setSoilPHLoading] = useState(false);
  const [soilPHError, setSoilPHError] = useState("");
  const [temperature, setTemperature] = useState('Awaiting Data')
  const [rainfall, setRainfall] = useState('Awaiting Data')
  const [humidity, setHumidity] = useState('Awaiting Data')
  const [solarRadiation, setSolarRadiation] = useState('Awaiting Data')
  const [climateMessage, setClimateMessage] = useState('')
  const [climateGraphData, setClimateGraphData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [dailyClimateData, setDailyClimateData] = useState([])

  const latitude = 23.3316
  const longitude = 86.3759

  useEffect(() => {
    const savedClimate = localStorage.getItem('agroverseClimate')
    if (savedClimate) {
      const climate = JSON.parse(savedClimate)
      setTemperature(climate.temperature)
      setRainfall(climate.rainfall)
      setHumidity(climate.humidity)
      setSolarRadiation(climate.solarRadiation)
    }
  }, [])

  useEffect(() => {
    const savedFarm = localStorage.getItem('agroverseFarm')
    if (savedFarm) {
      const farm = JSON.parse(savedFarm)
      setFarmName(farm.farmName || '')
      setFarmLocation(farm.farmLocation || '')
      setLandArea(farm.landArea || '')
      setFarmSoil(farm.farmSoil || '')
      setCurrentCrop(farm.currentCrop || '')
      setNextCrop(farm.nextCrop || 'Pulses')
      setFollowingCrop(farm.followingCrop || 'Vegetables')
    }
    const savedRotation = localStorage.getItem('agroverseRotation')
    if (savedRotation) {
      const rotation = JSON.parse(savedRotation)
      setNextCrop(rotation.nextCrop)
      setFollowingCrop(rotation.followingCrop)
      setRotationSaved(true)
    }
  }, [])

  // Dropdown-এর বাইরে ক্লিক করলে মেনু বন্ধ করার ব্যবস্থা
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 🟢 ৩. লগআউট করলে আবার হোম পেজে ফিরিয়ে নিয়ে যাওয়া
  const handleLogout = () => {
    setCurrentPage('home')
    setIsProfileOpen(false)
  }

  const askAdvisor = () => {
    setIsAdvisorLoading(true)
    if (!advisorQuestion.trim()) {
      setAdvisorAnswer('⚠️ Please write your farming question first.')
      setIsAdvisorLoading(false)
      return
    }

    setAdvisorAnswer(
      'Your question: ' +
        advisorQuestion +
        ' — AI Advisor connection will be added soon!'
    )
    setIsAdvisorLoading(false)
  }

  const getClimateData = async () => {
    try {
      setClimateMessage('Loading NASA climate data...')

      const endDate = new Date()
      endDate.setDate(endDate.getDate() - 5)

      const startDate = new Date(endDate)
      startDate.setMonth(startDate.getMonth() - 6)

      const formatDate = (date) =>
        date.toISOString().slice(0, 10).replaceAll('-', '')

      const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOTCORR,RH2M,ALLSKY_SFC_SW_DWN&community=AG&longitude=${longitude}&latitude=${latitude}&start=${formatDate(startDate)}&end=${formatDate(endDate)}&format=JSON`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('NASA API request failed')
      }

      const data = await response.json()
      const parameters = data.properties.parameter
      const dates = Object.keys(parameters.T2M)

      const monthlyData = {}

      dates.forEach((date) => {
        const month = date.slice(0, 6)

        if (!monthlyData[month]) {
          monthlyData[month] = {
            temperature: [],
            rainfall: [],
            humidity: [],
            solar: []
          }
        }

        const temp = parameters.T2M[date]
        const rain = parameters.PRECTOTCORR[date]
        const hum = parameters.RH2M[date]
        const sol = parameters.ALLSKY_SFC_SW_DWN[date]

        if (temp !== -999) monthlyData[month].temperature.push(temp)
        if (rain !== -999) monthlyData[month].rainfall.push(rain)
        if (hum !== -999) monthlyData[month].humidity.push(hum)
        if (sol !== -999) monthlyData[month].solar.push(sol)
      })

      const graphData = Object.entries(monthlyData).map(([month, values]) => ({
        month: new Date(
          Number(month.slice(0, 4)),
          Number(month.slice(4, 6)) - 1
        ).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        }),
        temperature: values.temperature.length
          ? values.temperature.reduce((a, b) => a + b, 0) / values.temperature.length
          : 0,
        rainfall: values.rainfall.reduce((a, b) => a + b, 0),
        humidity: values.humidity.length
          ? values.humidity.reduce((a, b) => a + b, 0) / values.humidity.length
          : 0,
        solar: values.solar.length
          ? values.solar.reduce((a, b) => a + b, 0) / values.solar.length
          : 0
      }))

      setClimateGraphData(graphData)
      const dailyData = dates.map((date) => ({
        date,
        temperature: parameters.T2M[date],
        rainfall: parameters.PRECTOTCORR[date],
        humidity: parameters.RH2M[date],
        solar: parameters.ALLSKY_SFC_SW_DWN[date],
      }))

      setDailyClimateData(dailyData)
      const latestValue = (values) =>
        Object.values(values)
          .filter((value) => value !== -999)
          .at(-1)

      setTemperature(`${latestValue(parameters.T2M)} °C`)
      setHumidity(`${latestValue(parameters.RH2M)} %`)
      setSolarRadiation(
        `${latestValue(parameters.ALLSKY_SFC_SW_DWN)} kWh/m²/day`
      )

      const rainValues = Object.values(parameters.PRECTOTCORR)
        .filter((value) => value !== -999)
        .slice(-7)

      const totalRain = rainValues.reduce(
        (total, value) => total + value,
        0
      )

      setRainfall(`${totalRain.toFixed(1)} mm (7-day total)`)
      localStorage.setItem(
        'agroverseClimate',
        JSON.stringify({
          temperature: `${latestValue(parameters.T2M)} °C`,
          humidity: `${latestValue(parameters.RH2M)} %`,
          solarRadiation: `${latestValue(parameters.ALLSKY_SFC_SW_DWN)} kWh/m²/day`,
          rainfall: `${totalRain.toFixed(1)} mm (7-day total)`,
        }),
      )
      setClimateMessage(
        `NASA climate data loaded successfully! Date: ${endDate.toLocaleDateString('en-GB')}`
      )
    } catch (error) {
      setClimateMessage('Unable to load climate data. Please try again.')
    }
  }

  const getRecommendation = async () => {
    setIsLoadingRecommendation(true)
    await new Promise(resolve => setTimeout(resolve, 800))

    if (!selectedRecommendationSeason) {
      setRecommendation('⚠️ Please select a season before getting recommendations.')
      setIsLoadingRecommendation(false)
      return
    }

    if (selectedRecommendationCrops.length === 0) {
      setRecommendation('⚠️ Please select at least one crop before getting recommendations.')
      setIsLoadingRecommendation(false)
      return
    }

    setRecommendation(
      `Season: ${selectedRecommendationSeason} | Selected crops: ${selectedRecommendationCrops.join(', ')}`
    )
    setIsLoadingRecommendation(false)
  }

  const handleCheckSoilPH = async () => {
    if (soilPH === "" || Number(soilPH) < 0 || Number(soilPH) > 14) {
      setSoilPHError("Enter a valid pH between 0 and 14.");
      return;
    }

    setSoilPHLoading(true);
    setSoilPHError("");
    setSoilPHResult(null);

    try {
      const response = await fetch("http://localhost:8000/api/soil-ph", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ph: Number(soilPH),
        }),
      });

      if (!response.ok) {
        throw new Error("Soil analysis failed.");
      }

      const data = await response.json();
      setSoilPHResult(data);
    } catch (error) {
      setSoilPHError(
        "Unable to analyze soil. Backend connection is not available."
      );
    } finally {
      setSoilPHLoading(false);
    }
  };

  return (
    <div className="app">
      {/* 🟢 ৪. পেজ সুইচিং লজিক */}
      {currentPage === 'home' && (
        <LandingPage 
          onGetStarted={() => setCurrentPage('login')} 
          onLoginClick={() => setCurrentPage('login')} 
        />
      )}

      {currentPage === 'login' && (
        <Login onLogin={() => setCurrentPage('dashboard')} />
      )}

      {currentPage === 'dashboard' && (
        <>
          <aside className="sidebar">
            <h2>🌱 AGROVERSE AI</h2>
            <p>Smart Farming, Better Tomorrow.</p>

            <nav>
              <a href="#dashboard" className="active">🏠 Dashboard</a>
              <a href="#farm-profile" className="active">🌱 Farm Profile</a>
              <a
                href="#crop-recommendation"
                onClick={() => setActiveMenu('crop-recommendation')}
                className="active"
              >
                🌾 Crop Recommendation
              </a>
              <a
                href="#climate-insights"
                onClick={() => setActiveMenu('climate-insights')}
                className="active"
              >
                🌦️ Climate Insights
              </a>
              <a
                href="#crop-rotation"
                onClick={() => setActiveMenu('crop-rotation')}
                className="active"
              >
                🔄 Crop Rotation
              </a>
              <a href="#farm-map" className="active">
                📍 Farm Map
              </a>
              <a href="#ai-advisor" className="active">
                🤖 AI Advisor
              </a>
            </nav>

            <h3>Grow Smart<br />Grow Green</h3>
          </aside> 

          <main className="dashboard">
            {/* Header / Profile Dropdown Section */}
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', marginBottom: '20px' }}>
              <div className="profile-container" ref={dropdownRef} style={{ position: 'relative' }}>
                <button 
                  className="profile-icon-btn" 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  style={{
                    background: '#22c55e',
                    border: 'none',
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  👨‍🌾
                </button>

                {isProfileOpen && (
                  <div 
                    className="profile-dropdown"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '55px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      width: '220px',
                      zIndex: 1000,
                      padding: '12px',
                      color: '#1e293b'
                    }}
                  >
                    <div style={{ paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '15px' }}>
                        🌾 {farmName || 'My Farm'}
                      </p>
                      <small style={{ color: '#64748b' }}>
                        📍 {farmLocation || 'Purulia, WB'}
                      </small>
                    </div>
                    <div style={{ paddingTop: '8px' }}>
                      <a 
                        href="#farm-profile" 
                        onClick={() => setIsProfileOpen(false)}
                        style={{
                          display: 'block',
                          padding: '8px 10px',
                          color: '#334155',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          marginBottom: '4px',
                          transition: 'background 0.2s'
                        }}
                      >
                        🌱 View Farm Profile
                      </a>
                      <button 
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 10px',
                          background: '#ef4444',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </header>

            <section className="welcome">
              <div className="welcome-text">
                <h1>🌱 Welcome back, Farmer!</h1>
                <p>Let's grow a greener future together 🌱</p>

                <div className="farm-location-badge">
                  📍 Purulia, West Bengal
                </div>
              </div>

              <div className="welcome-illustration">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2909/2909760.png"
                  alt="Farm illustration"
                />
              </div>
            </section>

            <section className="features">
              <div className="feature-card">
                <h3>🌾 Crop Recommendation</h3>
                <p>Discover suitable crops for your farm.</p>
              </div>

              <div className="feature-card">
                <h3>🌦️ Climate Insights</h3>
                <p>Understand weather and climate patterns.</p>
              </div>

              <div className="feature-card">
                <h3>🔄 Crop Rotation</h3>
                <p>Plan smarter seasonal crop rotations.</p>
              </div>

              <div className="feature-card">
                <h3>🤖 AI Farming Advisor</h3>
                <p>Get intelligent farming guidance.</p>
              </div>

              <h2 id="dashboard" className="overview-title">Farm Overview</h2>

              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <div className="card-icon">🌱</div>
                  <h3>Farm Overview</h3>
                  <p>📍 {farmLocation || 'Location not set'}</p>
                  <p>🌱 {farmSoil || 'Soil not set'}</p>
                  <p>📏 {landArea ? `${landArea} acres` : 'Area not set'}</p>
                </div>

                <div className="dashboard-card">
                  <div className="card-icon">🌦️</div>
                  <h3>Climate Status</h3>
                  <p>🌡️ Temperature: {temperature} °C</p>
                  <p>🌧️ Rainfall: {rainfall} mm/day</p>
                  <p>💧 Humidity: {humidity} %</p>
                </div>

                <div className="dashboard-card">
                  <div className="card-icon">🔄</div>
                  <h3>Crop Rotation</h3>
                  <p>🌾 Next Crop: {nextCrop || 'Not planned'}</p>
                  <p>🌱 Following Crop: {followingCrop || 'Not planned'}</p>
                </div>

                <div className="dashboard-card">
                  <div className="card-icon">🤖</div>
                  <h3>AI Farming Advisor</h3>
                  <p>
                    {advisorAnswer
                      ? '✅ Advisor Response Available'
                      : '🤖 Ready to assist with farming questions.'}
                  </p>
                </div>
              </div>
            </section>

            <section className="soil-ph-section">
              <h2>Soil pH Checking</h2>
              <p>Enter your soil pH value to analyze soil condition.</p>

              <div className="soil-ph-form">
                <input
                  type="number"
                  min="0"
                  max="14"
                  step="0.1"
                  placeholder="Enter soil pH (0–14)"
                  value={soilPH}
                  onChange={(e) => setSoilPH(e.target.value)}
                />

                <button
                  onClick={handleCheckSoilPH}
                  disabled={soilPHLoading || soilPH === ""}
                >
                  {soilPHLoading ? "Checking..." : "Check Soil pH"}
                </button>
              </div>

              {soilPHError && (
                <p className="soil-ph-error">{soilPHError}</p>
              )}

              {soilPHResult && (
                <div className="soil-ph-result">
                  <h3>Soil Analysis Result</h3>
                  <p>pH: {soilPHResult.ph}</p>
                  <p>Condition: {soilPHResult.condition}</p>
                  <p>Suitable Crops: {soilPHResult.suitableCrops}</p>
                  <p>Soil Improvement: {soilPHResult.improvementTips}</p>
                </div>
              )}
            </section>  

            <section className="farm-dashboard">
              <h2>Farm Dashboard</h2>
              <p>Your agricultural overview at a glance.</p>

              <div className="dashboard-stats">
                <div className="feature-card">
                  <h3>🌱 Farm Area</h3>
                  <h2>{farmName || 'Not set'}</h2>
                  <p>{landArea ? `${landArea} acres` : 'Add your farm details'}</p>
                </div>

                <div className="feature-card">
                  <h3>🌾 Current Crop</h3>
                  <h2>{currentCrop || 'Not selected'}</h2>
                  <p>Choose your crop</p>
                </div>

                <div className="feature-card">
                  <h3>🌱 Soil Type</h3>
                  <h2>{farmSoil || 'Not selected'}</h2>
                  <p>Your farm soil information</p>
                </div>

                <div className="feature-card">
                  <h3>🌦️ Climate Status</h3>
                  <h2>{temperature}</h2>
                  <p>{temperature === 'Awaiting Data' ? 'Loading climate data...' : 'Latest climate data available'}</p>
                </div>

                <div className="feature-card">
                  <h3>🌧️ Rainfall</h3>
                  <h2>{rainfall}</h2>
                  <p>7-day rainfall total</p>
                </div>

                <div className="feature-card">
                  <h3>💧 Humidity</h3>
                  <h2>{humidity}</h2>
                  <p>Relative humidity</p>
                </div>

                <div className="feature-card">
                  <h3>☀️ Solar Radiation</h3>
                  <h2>{solarRadiation}</h2>
                  <p>Daily solar radiation</p>
                </div>

                <div className="feature-card">
                  <h3>🔄 Next Rotation</h3>
                  <h2>{nextCrop || 'Not planned'}</h2>
                  <p>Following Crop: {followingCrop || 'Not planned'}</p>
                </div>
              </div>
            </section>

            <section className="farm-profile">
              <h2 id="farm-profile">Farm Profile</h2>
              <p>Keep your farm information organized.</p>

              <div className="profile-card">
                <h3>🌱 Your Farm Information</h3>

                <label>Farm Name</label>
                <input
                  type="text"
                  placeholder="Enter farm name"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                />

                <label>Farm Location</label>
                <input
                  type="text"
                  placeholder="Enter farm location"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                />

                <label>Land Area (in acres)</label>
                <input
                  type="number"
                  placeholder="Enter land area"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                />

                <label>Soil Type</label>
                <select
                  value={farmSoil}
                  onChange={(e) => setFarmSoil(e.target.value)}
                >
                  <option value="">Select Soil Type</option>
                  <option value="Clay Soil">Clay Soil</option>
                  <option value="Sandy Soil">Sandy Soil</option>
                  <option value="Loamy Soil">Loamy Soil</option>
                  <option value="Silty Soil">Silty Soil</option>
                </select>

                <label>Current Crop</label>
                <select
                  value={currentCrop}
                  onChange={(e) => setCurrentCrop(e.target.value)}
                >
                  <option value="">Select Current Crop</option>
                  <option value="Rice">Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Maize">Maize</option>
                  <option value="Millet">Millet</option>
                  <option value="Pulses">Pulses</option>
                  <option value="Vegetables">Vegetables</option>
                </select>

                <button
                  onClick={() => {
                    localStorage.setItem(
                      'agroverseFarm',
                      JSON.stringify({
                        farmName,
                        farmLocation,
                        landArea,
                        farmSoil,
                        currentCrop,
                        nextCrop,
                        followingCrop,
                      })
                    )
                    setProfileMessage('✅ Farm Profile Saved Successfully!')
                  }}
                >
                  Save Farm Profile
                </button>

                {profileMessage && <p>{profileMessage}</p>}
              </div>
            </section>

            <section className="crop-recommendation">
              <h2 id="crop-recommendation">Crop Recommendation</h2>
              <p>Select the season and crops you are considering for your farm.</p>

              <div className="profile-card">
                <h3>🌾 Find the Right Crop</h3>

                <label>Season</label>
                <div className="crop-grid">
                  {seasons.map((season) => (
                    <button
                      key={season}
                      type="button"
                      className={
                        selectedRecommendationSeason === season
                          ? "crop-option selected"
                          : "crop-option"
                      }
                      onClick={() => {
                        setSelectedRecommendationSeason(season);
                        setSelectedRecommendationCrops([]);
                      }}
                    >
                      {selectedRecommendationSeason === season ? "✅ " : seasonMeta[season].emoji + " "}
                      {seasonMeta[season].label}
                    </button>
                  ))}
                </div>

                {selectedRecommendationSeason && (
                  <>
                    <label>{seasonMeta[selectedRecommendationSeason].emoji} Crops suitable for {selectedRecommendationSeason}</label>
                    <div className="crop-grid">
                      {cropOptions
                        .filter((crop) => cropsBySeason[selectedRecommendationSeason].includes(crop.en))
                        .map((crop) => (
                          <button
                            key={crop.en}
                            type="button"
                            className={
                              selectedRecommendationCrops.includes(crop.en)
                                ? "crop-option selected"
                                : "crop-option"
                            }
                            onClick={() =>
                              setSelectedRecommendationCrops((prev) =>
                                prev.includes(crop.en)
                                  ? prev.filter((c) => c !== crop.en)
                                  : [...prev, crop.en]
                              )
                            }
                          >
                            {selectedRecommendationCrops.includes(crop.en) ? "✅ " : cropEmoji[crop.en] + " "}
                            {crop.en} ({crop.bn})
                          </button>
                        ))}
                    </div>
                  </>
                )}

                <p>
                  Selected Crops: <strong>{selectedRecommendationCrops.length}</strong>
                </p>

                <button onClick={getRecommendation} disabled={isLoadingRecommendation}>
                  {isLoadingRecommendation ? 'Loading...' : 'Get Crop Recommendation'}
                </button>

                {recommendation && (
                  <div className={`recommendation-result ${recommendation.startsWith('⚠️') ? 'recommendation-warning' : ''}`}>
                    <h3>🌱 Recommendation Input</h3>
                    <p>{recommendation}</p>
                  </div>
                )}
              </div>
            </section>

            <section className="crop-rotation">
              <h2 id="crop-rotation">🌱 AI Crop Rotation Planner</h2>
              <p>Select one or more seasons and the crops you want the planner to consider.</p>

              <div className="profile-card">
                <h3>🌦️ Select Seasons</h3>
                <div className="crop-grid">
                  {seasons.map((season) => (
                    <button
                      key={season}
                      type="button"
                      className={
                        selectedRotationSeasons.includes(season)
                          ? "crop-option selected"
                          : "crop-option"
                      }
                      onClick={() =>
                        setSelectedRotationSeasons((prev) =>
                          prev.includes(season)
                            ? prev.filter((s) => s !== season)
                            : [...prev, season]
                        )
                      }
                    >
                      {selectedRotationSeasons.includes(season) ? "✅ " : seasonMeta[season].emoji + " "}
                      {seasonMeta[season].label}
                    </button>
                  ))}
                </div>

                <h3>🌾 Select Crops by Season (English + বাংলা)</h3>
                {selectedRotationSeasons.length === 0 && (
                  <p>Please select at least one season to see its suitable crops.</p>
                )}

                {selectedRotationSeasons.map((season) => (
                  <div key={season} className="crop-category">
                    <h4>{seasonMeta[season].emoji} {seasonMeta[season].label} Crops</h4>
                    <div className="crop-grid">
                      {cropOptions
                        .filter((crop) => cropsBySeason[season].includes(crop.en))
                        .map((crop) => (
                          <button
                            key={`${season}-${crop.en}`}
                            type="button"
                            className={
                              selectedCrops.includes(crop.en)
                                ? "crop-option selected"
                                : "crop-option"
                            }
                            onClick={() =>
                              setSelectedCrops((prev) =>
                                prev.includes(crop.en)
                                  ? prev.filter((c) => c !== crop.en)
                                  : [...prev, crop.en]
                              )
                            }
                          >
                            {selectedCrops.includes(crop.en) ? "✅ " : cropEmoji[crop.en] + " "}
                            {crop.en} ({crop.bn})
                          </button>
                        ))}
                    </div>
                  </div>
                ))}

                <p>
                  Selected Seasons: <strong>{selectedRotationSeasons.length}</strong>
                </p>
                <p>
                  Selected Crops: <strong>{selectedCrops.length}</strong>
                </p>

                <button
                  type="button"
                  className="rotation-primary-button"
                  onClick={() => {
                    if (selectedRotationSeasons.length === 0) {
                      alert("Please select at least 1 season!");
                      return;
                    }

                    if (selectedCrops.length < 3) {
                      alert("Please select at least 3 crops!");
                      return;
                    }

                    const seasonsWithoutCrops = selectedRotationSeasons.filter(
                      (season) =>
                        !selectedCrops.some((crop) =>
                          cropsBySeason[season].includes(crop)
                        )
                    );

                    if (seasonsWithoutCrops.length > 0) {
                      alert(
                        `Please select at least one suitable crop for: ${seasonsWithoutCrops.join(", ")}`
                      );
                      return;
                    }

                    const firstSeason = selectedRotationSeasons[0];
                    const firstSeasonCrops = selectedCrops.filter((crop) =>
                      cropsBySeason[firstSeason].includes(crop)
                    );

                    if (firstSeasonCrops.length < 3) {
                      alert(
                        `Please select at least 3 suitable crops for ${firstSeason} because the planner creates 3 rotation plans.`
                      );
                      return;
                    }

                    setRotationResult(
                      `${selectedRotationSeasons.join(" → ")} | ${selectedCrops.join(" → ")}`
                    );
                  }}
                >
                  Generate Rotation Plan
                </button>

                {rotationResult && (
                  <div className="rotation-result">
                    <h3>🌿 Your Selected Rotation</h3>
                    <p>{rotationResult}</p>
                  </div>
                )}
              </div>
            </section>

            <section className="climate-insights">
              <h2 id="climate-insights">NASA Climate Insights</h2>
              <p>Explore climate information for smarter farming decisions.</p>

              <button onClick={getClimateData}>
                Load Climate Data
              </button>

              {climateMessage && <p>{climateMessage}</p>}

              <p className="last-updated">
                Last Updated: {new Date().toLocaleDateString('en-GB')}
              </p>

              <div className="dashboard-stats climate-graphs">
                {/* Temperature */}
                <div className="feature-card climate-chart">
                  <h3>🌡️ Temperature</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={climateGraphData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} °C`, 'Temperature']} />
                      <Line type="monotone" dataKey="temperature" stroke="#16a34a" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Rainfall */}
                <div className="feature-card climate-chart">
                  <h3>🌧️ Rainfall</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={climateGraphData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} mm`, 'Rainfall']} />
                      <Line type="monotone" dataKey="rainfall" stroke="#0284c7" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Humidity */}
                <div className="feature-card climate-chart">
                  <h3>💧 Humidity</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={climateGraphData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} %`, 'Humidity']} />
                      <Line type="monotone" dataKey="humidity" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Solar Radiation */}
                <div className="feature-card climate-chart">
                  <h3>☀️ Solar Radiation</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={climateGraphData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} kWh/m²/day`, 'Solar Radiation']} />
                      <Line type="monotone" dataKey="solar" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            <section className="farm-map">
              <h2 id="farm-map">Farm Map</h2>
              <p>Explore your farmland across West Bengal.</p>

              <div className="farm-map-card">
                <div className="farm-map-header">
                  <div>
                    <h3>🌿 Purulia Farmland</h3>
                    <p>Satellite Agricultural View</p>
                  </div>
                  <span className="map-live-badge">● LIVE MAP</span>
                </div>

                <MapContainer
                  center={[23.332, 86.365]}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="farm-leaflet-map"
                >
                  <TileLayer
                    attribution='Tiles © Esri'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                  <FarmDraw />
                  <Marker position={[23.332, 86.365]}>
                    <Popup>
                      🌱 Purulia Farm Location
                    </Popup>
                  </Marker>

                  <Polygon
                    positions={[
                      [23.334, 86.363],
                      [23.335, 86.367],
                      [23.331, 86.369],
                      [23.329, 86.365]
                    ]}
                    pathOptions={{
                      color: '#22c55e',
                      fillColor: '#4ade80',
                      fillOpacity: 0.25,
                      weight: 3
                    }}
                  />
                </MapContainer>

                <div className="farm-map-footer">
                  <span>📍 Purulia, West Bengal, India</span>
                  <span>🛰️ Satellite Imagery</span>
                </div>
              </div>
            </section>

            <section className="farm-ai-insights">
              <h2>🤖 AI Farm Map Insights</h2>
              <p className="farm-ai-subtitle">
                Satellite-powered farmland monitoring
              </p>

              <div className="farm-ai-grid">
                {/* NDVI */}
                <div className="farm-ai-card">
                  <span className="farm-ai-icon">🌱</span>
                  <h3>Vegetation Health (NDVI)</h3>
                  <p>Satellite vegetation index for your selected farmland.</p>

                  <div className="ndvi-visual">
                    <div className="ndvi-gradient"></div>
                    <div className="ndvi-labels">
                      <span>Low</span>
                      <span>Moderate</span>
                      <span>Healthy</span>
                    </div>
                  </div>

                  <div className="analysis-status">
                    <span className="status-dot"></span>
                    Waiting for satellite analysis
                  </div>
                </div>

                {/* Crop Health */}
                <div className="farm-ai-card">
                  <span className="farm-ai-icon">🛰️</span>
                  <h3>Crop Health Visualization</h3>
                  <p>Spatial crop health information across your field.</p>

                  <div className="crop-health-preview">
                    <div className="health-cell health-1"></div>
                    <div className="health-cell health-2"></div>
                    <div className="health-cell health-3"></div>
                    <div className="health-cell health-4"></div>
                    <div className="health-cell health-5"></div>
                    <div className="health-cell health-6"></div>
                    <div className="health-cell health-7"></div>
                    <div className="health-cell health-8"></div>
                    <div className="health-cell health-9"></div>
                  </div>

                  <div className="analysis-status">
                    <span className="status-dot"></span>
                    Waiting for crop health data
                  </div>
                </div>

                {/* Water Stress */}
                <div className="farm-ai-card">
                  <span className="farm-ai-icon">💧</span>
                  <h3>Water Stress Detection</h3>
                  <p>Satellite-based indication of possible water stress.</p>

                  <div className="water-stress-visual">
                    <div className="water-stress-bar">
                      <div className="water-stress-fill"></div>
                    </div>
                    <div className="water-stress-labels">
                      <span>Low</span>
                      <span>Moderate</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div className="analysis-status">
                    <span className="status-dot"></span>
                    Waiting for water stress analysis
                  </div>
                </div>
              </div>
            </section> 

            <section className="ai-advisor">
              <h2 id="ai-advisor">AI Farming Advisor</h2>
              <p>Get helpful guidance for your farming decisions.</p>

              <div className="profile-card">
                <h3>🤖 Ask Your Farming Advisor</h3>

                <textarea
                  placeholder="Write your farming question here..."
                  rows="4"
                  value={advisorQuestion}
                  onChange={(e) => setAdvisorQuestion(e.target.value)}
                />

                <button onClick={askAdvisor} disabled={isAdvisorLoading}>
                  {isAdvisorLoading ? 'Thinking...' : 'Ask Advisor'}
                </button>

                {advisorAnswer && (
                  <p className={advisorAnswer.startsWith('⚠️') ? 'advisor-warning' : ''}>
                    {advisorAnswer}
                  </p>
                )}
              </div>
            </section>
          </main>
        </>
      )}
    </div>
  )
}

export default App