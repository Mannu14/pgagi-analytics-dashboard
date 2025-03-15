// not use 
import { useState, useEffect } from 'react';

const Profileicon = () => {
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('dark-mode') === 'enabled');
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSideBarActive, setIsSideBarActive] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  }, [isDarkMode]);

  const enableDarkMode = () => {
    document.getElementById('toggle-btn').classList.replace('fa-sun', 'fa-moon');
    document.body.classList.add('dark');
    document.body.classList.remove('light');
    localStorage.setItem('dark-mode', 'enabled');
  };

  const disableDarkMode = () => {
    document.getElementById('toggle-btn').classList.replace('fa-moon', 'fa-sun');
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    localStorage.setItem('dark-mode', 'disabled');
  };

  const handleToggleButtonClick = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleUserButtonClick = () => {
    setIsProfileActive(!isProfileActive);
  setIsSearchActive(!isSearchActive);
  };

  const handleSearchButtonClick = () => {
    setIsSearchActive(!isSearchActive);
    setIsProfileActive(false);
  };

  const handleMenuButtonClick = () => {
    setIsSideBarActive(!isSideBarActive);
    document.body.classList.toggle('active');
  };

  const handleWindowScroll = () => {
    setIsProfileActive(false);
    setIsSearchActive(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleWindowScroll);
    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, []);

  return (
    <>
      <div className="profile-icons">
        <div id="menu-btn" className={`fas fa-bars ${isSideBarActive ? 'active' : ''}`} onClick={handleMenuButtonClick}></div>
        <div id="search-btn" className={`fas fa-search ${isSearchActive ? 'active' : ''}`} onClick={handleSearchButtonClick}></div>
        <div id="user-btn" className={`fas fa-user ${isProfileActive ? 'active' : ''}`} onClick={handleUserButtonClick}></div>
        <div id="toggle-btn" onClick={handleToggleButtonClick} className={`fas ${isDarkMode ? 'fa-moon' : 'fa-sun'}`}></div>
      </div>
    </>
  );
};

export default Profileicon;