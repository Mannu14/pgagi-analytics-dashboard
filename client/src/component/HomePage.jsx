import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const homePageStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#2c3e50', // Darker blue for a news feel
    color: '#ecf0f1', // Light color for contrast
    fontFamily: 'Georgia, serif', // Serif font for a more classic news look
    textAlign: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  };

  const titleStyle = {
    fontSize: '4rem',
    fontWeight: 'bold',
    margin: '0 0 20px 0',
  };

  const subtitleStyle = {
    fontSize: '1.5rem',
    margin: '0 0 30px 0',
    fontStyle: 'italic',
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'row', // Default to row for larger screens
    gap: '15px',
    flexWrap: 'wrap', // Allow wrapping on smaller screens
    justifyContent: 'center',
    width: '100%', // Ensure full width for buttons
  };

  const buttonStyle = {
    padding: '15px 30px',
    fontSize: '1.2rem',
    color: '#2c3e50',
    backgroundColor: '#ecf0f1',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
  };

  const buttonHoverStyle = {
    backgroundColor: '#95a5a6',
    color: '#fff',
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
    e.target.style.color = buttonHoverStyle.color;
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = buttonStyle.backgroundColor;
    e.target.style.color = buttonStyle.color;
  };

  return (
    <div style={homePageStyle}>
      <div style={titleStyle}>Breaking News!</div>
      <div style={subtitleStyle}>Stay Updated with the Latest Headlines</div>
      <div style={buttonContainerStyle}>
        <Link
          to="/DataBaseData"
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          View Local News
        </Link>
        <Link
          to="/Contact"
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Get in Touch
        </Link>
        <Link
          to="/NewsApis"
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Latest News APIs
        </Link>
        <Link
          to="/auth"
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Join Us
        </Link>
      </div>

      {/* Responsive Styles using Media Queries */}
      <style>
        {`
          @media (max-width: 768px) {
            .buttonContainer {
              flex-direction: column; // Change to column for smaller screens
              align-items: center; // Center the buttons
            }
          }
        `}
      </style>
    </div>
  );
}

export default HomePage;
