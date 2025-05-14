import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Spinner from '../components/spinner';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import BarChart from '../components/barChart';
import LineChart from '../components/lineChart';
import PieChart from '../components/pieChart';

function DemoCarousel({ moods, num, logs, tags }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const textColor =  'text-white';
  const bgColor = 'bg-gradient-to-br from-gray-300 via-gray-950 to-black';

  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        useKeyboardArrows
        interval={3000}
        transitionTime={600}
        dynamicHeight
        onChange={(index) => setActiveIndex(index)}
        autoPlay
      >
        {/* Slide 1 */}
        <div
          className="carousel-slide"
          style={{
            backgroundSize: 'cover',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            height: '100%',
            padding: '2em',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            boxShadow: '0px 15px 25px rgba(0,0,0,0.5)',
          }}
        >
          <h2 className="carousel-title text-3xl sm:text-4xl lg:text-5xl" style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: '700',
            color: '#f0f0f0',
            textShadow: '3px 3px 8px rgba(0, 0, 0, 0.5)',
          }}>
            GitHub Metrics Overview
          </h2>
          <h2 className="carousel-title text-xl sm:text-2xl lg:text-3xl" style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: '500',
            color: '#f0f0f0',
            textShadow: '3px 3px 8px rgba(0, 0, 0, 0.5)',
          }}>
            Analyze Repositories, Commits, and More
          </h2>
          <h2 className="carousel-title text-lg sm:text-xl lg:text-2xl mt-4" style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: '500',
            color: '#f0f0f0',
            textShadow: '3px 3px 8px rgba(0, 0, 0, 0.5)',
          }}>
            {num} Repositories Tracked!
          </h2>
        </div>

        {/* Slide 2 */}
        <div className="carousel-slide" style={slideStyle}>
          <h2 className="carousel-title text-xl sm:text-2xl lg:text-3xl" style={titleStyle}>
            Commits per Repository
          </h2>
          <BarChart moods={moods} animate={activeIndex === 1} />
        </div>

        {/* Slide 3 */}
        <div className="carousel-slide" style={slideStyle}>
          <h2 className="carousel-title text-xl sm:text-2xl lg:text-3xl" style={titleStyle}>
            Daily Commit Activity
          </h2>
          <LineChart logs={logs} animate={activeIndex === 2} />
        </div>

        {/* Slide 4 */}
        <div className="carousel-slide" style={slideStyle}>
          <h2 className="carousel-title text-xl sm:text-2xl lg:text-3xl" style={titleStyle}>
            Top Languages Used
          </h2>
          <PieChart tags={tags} animate={activeIndex === 3} />
        </div>

        {/* Slide 5 */}
        <div className="carousel-slide" style={slideStyle}>
          <h2 className="carousel-title text-xl sm:text-2xl lg:text-3xl" style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: '700',
            color: '#E8EAF6',
            textShadow: '3px 3px 8px rgba(0, 0, 0, 0.5)',
          }}>
            Thanks for Viewing GitHub Metrics!
          </h2>
        </div>
      </Carousel>
    </div>
  );
}

const slideStyle = {
  backgroundImage: `url('analysis.jpg')`,
  backgroundSize: 'cover',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  height: '100%',
  padding: '2em',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  boxShadow: '0px 15px 25px rgba(0,0,0,0.5)',
};

const titleStyle = {
  fontFamily: 'Poppins, sans-serif',
  fontWeight: '700',
  fontSize: '3em',
  color: '#f0f0f0',
  textShadow: '3px 3px 8px rgba(0, 0, 0, 0.5)',
};

// -----------------------------
// Main Metrics Page Component
// -----------------------------
function Metrics() {
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [moods, setMoods] = useState([]);
  const [num, setNum] = useState(0);
  const [logs, setLogs] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const spinnerTimeout = setTimeout(() => {
      setShowSpinner(false);
    }, 1000);

    // Sample data for demonstration
    const hardcodedMoods = [
      { mood: 'Repo-A', count: 120 },
      { mood: 'Repo-B', count: 95 },
      { mood: 'Repo-C', count: 60 },
      { mood: 'Repo-D', count: 45 },
      { mood: 'Repo-E', count: 30 },
    ];

    const hardcodedLogs = [
      { date: '2024-04-08', entries: 8 },
      { date: '2024-04-09', entries: 14 },
      { date: '2024-04-10', entries: 10 },
      { date: '2024-04-11', entries: 6 },
      { date: '2024-04-12', entries: 12 },
      { date: '2024-04-13', entries: 7 },
      { date: '2024-04-14', entries: 11 },
    ];

    const hardcodedTags = [
      { tag: 'JavaScript', count: 45 },
      { tag: 'Python', count: 30 },
      { tag: 'TypeScript', count: 15 },
      { tag: 'HTML', count: 20 },
      { tag: 'CSS', count: 10 },
    ];

    // Set the data
    setMoods(hardcodedMoods);
    setLogs(hardcodedLogs);
    setTags(hardcodedTags);
    setNum(hardcodedMoods.length);
    setLoading(false);

    return () => clearTimeout(spinnerTimeout);
  }, []);

  if (loading || showSpinner) {
    return (
      <div className="h-screen overflow-y-auto bg-gradient-to-br from-gray-500 via-gray-950 to-black">
        <Navbar />
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center bg-fixed bg-gradient-to-br from-gray-500 via-gray-950 to-black text-white">
      <Navbar />
      <DemoCarousel moods={moods} num={num} logs={logs} tags={tags} />
    </div>
  );
}

export default Metrics;
