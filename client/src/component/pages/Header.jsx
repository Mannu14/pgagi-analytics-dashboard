import '../styles/Header.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Search from './Search';

function Header() {
  const apiUrlProcess = `${window.location.origin}/apis`;
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('dark-mode') === 'enabled');
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSideBarActive, setIsSideBarActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrlProcess}/NewsApi`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (!response.ok) {
          navigate("/auth?startwith=signIn");
        }
        if (data.error === 'User not found') {
          navigate("/auth?startwith=signIn");
        } else {
          setUser(data.user);
        }
      } catch (error) {
        navigate("/auth?startwith=signIn");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [navigate]);

  useEffect(() => {
    if (isDarkMode) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  }, [isDarkMode]);

  const enableDarkMode = () => {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
    localStorage.setItem('dark-mode', 'enabled');
  };

  const disableDarkMode = () => {
    const toggleBtn = document.getElementById('toggle-btn');
    if (toggleBtn) {
      toggleBtn.classList.replace('fa-moon', 'fa-sun');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      localStorage.setItem('dark-mode', 'disabled');
    }
  };

  const handleToggleButtonClick = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleUserButtonClick = () => {
    setIsProfileActive(!isProfileActive);
    setIsSearchActive(false);
  };

  const handleSearchButtonClick = () => {
    setIsSearchActive(!isSearchActive);
    setIsProfileActive(false);
  };

  const handleMenuButtonClick = () => {
    setIsSideBarActive(!isSideBarActive);
    document.body.classList.toggle('active');
  };

  const handleSidebarCloseButtonClick = () => {
    setIsSideBarActive(false);
    document.querySelector('.side-bar').classList.add('active');
    document.body.classList.remove('active');
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

  const handleLogout = async () => {
    try {
      const response = await fetch(`${apiUrlProcess}/logOut`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        console.error("data.error");
      } else {
        navigate("/auth?startwith=signIn");
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setIsSearchActive(true); // Show the search popup as the user types
  };

  if (!user || isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <header className="header">
        <section className="flex">
          <Link to="#" className="logo">NewsApi</Link>
          <div className={`search-form ${isSearchActive ? 'active' : ''}`}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="search..."
              maxLength="100"
            />
            <button type="button" className="fas fa-search" onClick={handleSearchButtonClick}></button>
          </div>
          <div className="profile-icons">
            <div id="menu-btn" className='fas fa-bars' onClick={handleMenuButtonClick}></div>
            <div id="search-btn" className='fas fa-search' onClick={handleSearchButtonClick}></div>
            <div id="user-btn" className='fas fa-user' onClick={handleUserButtonClick}></div>
            <div id="toggle-btn" onClick={handleToggleButtonClick} className={`fas ${isDarkMode ? 'fa-moon' : 'fa-sun'}`}></div>
          </div>
          <div className={`profile ${isProfileActive ? 'active' : ''}`} >
            <img id="profile-img-preview-header" src={`${user.image}`} className="image" alt="" />
            <h3 className="name">{user.firstname} {user.lastname}</h3>
            <p className="role">student</p>
            <Link to="Profile" className="btn">view profile</Link>
            <div className="flex-btn">
              {user ?
                <Link to="#" onClick={handleLogout} className="option-btn">logOut</Link>
                :
                <>
                  <Link to="auth?startwith=signIn" className="option-btn">logIn</Link>
                  <Link to="auth?startwith=signUp" className="option-btn">register</Link>
                </>}
            </div>
          </div>
        </section>
      </header>
      {isSearchActive && <Search searchQuery={searchQuery} />}
    </>
  );
}

export default Header;
