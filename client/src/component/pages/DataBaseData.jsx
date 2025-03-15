import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/NewsApis.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/index.css';
import Loading from './Loading';

const companies = [
  { value: 'apple', label: 'Apple' },
  { value: 'google', label: 'Google' },
  { value: 'microsoft', label: 'Microsoft' },
  { value: 'nio', label: 'Nio' },
  { value: 'tesla', label: 'Tesla' },
  { value: 'rivian', label: 'Rivian' },
  { value: 'byd', label: 'BYD' },
];

const sortOptions = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'relevancy', label: 'Relevancy' },
  { value: 'publishedAt', label: 'Published At' },
];

const countries = [
  { value: '', label: '' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'IN', label: 'India' },
];

const categories = [
  // { value: '', label: '' },
  { value: 'business', label: 'Business' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'general', label: 'General' },
  { value: 'health', label: 'Health' },
  { value: 'science', label: 'Science' },
  { value: 'sports', label: 'Sports' },
  { value: 'technology', label: 'Technology' },
];

const sources = [
  // { value: '', label: '' },
  { value: 'techcrunch', label: 'TechCrunch' },
  { value: 'bbc-news', label: 'BBC News' },
  { value: 'cnn', label: 'CNN' },
  { value: 'MacRumors', label: 'MacRumors' },
];

const domains = [
  // { value: '', label: '' },
  { value: 'wsj.com', label: 'Wall Street Journal' },
  { value: 'nytimes.com', label: 'New York Times' },
  { value: 'forbes.com', label: 'Forbes' },
];

function DataBaseData() {
  const apiUrlProcess = `${window.location.origin}/apis`;
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrlProcess}/NewsApi`, {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (!response.ok) {
          navigate("/auth?startwith=signIn")
        }
        if (data.error === 'User not found') {
          navigate("/auth?startwith=signIn")
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

  // for profile
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
    setIsSideBarActive(!isSideBarActive);
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

  // share button
  const handleButtonClick = () => {
    setIsExpanded(!isExpanded);
  };

  // news api
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [startDate, setStartDate] = useState(new Date('2024-06-12'));
  const [endDate, setEndDate] = useState(new Date());
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);

  const [news, setNews] = useState([]);
  const [ShowStoredDataNews, setShowStoredDataNews] = useState([]);

  const [page, setPage] = useState(1);
  const [pageAllData, setpageAllData] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingShowAll, setLoadingShowAll] = useState(false);
  const [hasMoreShowAll, setHasMoreShowAll] = useState(true);
  const [CalculatedPage, setCalculatedPage] = useState(null);
  const [CalculatedPageShowAll, setCalculatedPageShowAll] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, [page]);

  const fetchNews = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    let url = `${apiUrlProcess}/NewsapiDataGet`;
    let params = {
      page,
      pageSize: 10,
      sortBy: sortBy.value,
    };

    const companyQuery = selectedCompanies.map(c => c.value).join(' ');
    const from = startDate.toISOString().split('T')[0];
    const to = endDate.toISOString().split('T')[0];

    if (companyQuery) {
      params.q = companyQuery;
    }
    if (startDate) {
      params.from = from;
    }
    if (endDate) {
      params.to = to;
    }
    if (selectedCountry) {
      params.country = selectedCountry.value;
    }
    if (selectedCategory) {
      params.category = selectedCategory.value;
    }
    if (selectedSource) {
      params.sources = selectedSource.value;
    }
    if (selectedDomain) {
      params.domains = selectedDomain.value;
    }

    if (!companyQuery && !selectedCountry && !selectedCategory && !selectedSource && !selectedDomain) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(url, { params });
      const articles = response.data.news || [];

      setCalculatedPage(Math.ceil(response.data.totalResults / 10));
      if (page === 1) {
        setNews(articles);
      } else {
        setNews(prevNews => [...prevNews, ...articles]);
      }
      if (Math.ceil(response.data.totalResults / 10) === page) {
        setHasMore(false);
      }
      if (articles.length === 0 && page === 1) {
        setError("The data isn't available. Please try a different selection.");
      }
      if (articles.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setError('Data Not Match');
      } else {
        setError('Error fetching news. Please try again.');
      }
      setHasMore(false);
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const innerHeight = window.innerHeight;
    if (innerHeight + scrollTop >= scrollHeight - 450 && !loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setShowStoredDataNews([])
    setHasMoreShowAll(true);
    setHasMore(true);
    setLoadingShowAll(false);
    setNews([]);
    setPage(1);
    fetchNews();
  };

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

  const ShowStoredData = async () => {
    if (loadingShowAll) return;
    setLoadingShowAll(true);
    setError(null);

    try {
      let url = `${apiUrlProcess}/Showstoreddata-frontend`;
      let params = {
        pageAllData
      };
      const response = await axios.get(url, { params });
      setError(null);
      const articalsartical = response.data.news || [];
      setCalculatedPageShowAll(Math.ceil(response.data.totalResults / 50));
      if (pageAllData === 1) {
        setShowStoredDataNews(articalsartical);
      } else {
        console.log(pageAllData)
        setShowStoredDataNews(prevNews => [...prevNews, ...articalsartical]);
      }
      if (Math.ceil(response.data.totalResults / 50) === pageAllData) {
        setHasMoreShowAll(false);
        console.log('Equal')
      }
      if (articalsartical.length === 0) {
        setHasMoreShowAll(false);
      } else {
        setHasMoreShowAll(true);
      }

    } catch (error) {
      console.error('Data Error:', error);
    }
    setLoadingShowAll(false);
  };
  useEffect(() => {
    ShowStoredData()
  }, [pageAllData]);

  const handleScrollShowAll = () => {
    const scrollHeight = document.documentElement.offsetHeight;
    const scrollTop = document.documentElement.scrollTop;
    const innerHeight = window.innerHeight;
    if (innerHeight + scrollTop >= scrollHeight - 450 && !loadingShowAll && hasMoreShowAll) {
      setpageAllData(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScrollShowAll);
    return () => window.removeEventListener('scroll', handleScrollShowAll);
  }, [loadingShowAll, hasMoreShowAll]);

  if (!user || isLoading) {
    return <Loading />;
  }

  return (
    <>
      <header className="header">
        <section className="flex">
          <Link to="/NewsApis" className="logo">NewsApi</Link>
          <div className={`search-form ${isSearchActive ? 'active' : ''}`}>
            <input type="text" name="search_box" required placeholder="search..." maxLength="100" />
            <button type="submit" className="fas fa-search"></button>
          </div>
          <div className="profile-icons">
            <div id="menu-btn" className='fas fa-bars' onClick={handleMenuButtonClick}></div>
            <div id="search-btn" className='fas fa-search' onClick={handleSearchButtonClick}></div>
            <div id="user-btn" className='fas fa-user' onClick={handleUserButtonClick}></div>
            <div id="toggle-btn" onClick={handleToggleButtonClick} className={`fas ${isDarkMode ? 'fa-moon' : 'fa-sun'}`}></div>
          </div>
          <div className={`profile ${isProfileActive ? 'active' : ''}`} >
            <img id="profile-img-preview-header" src={`${user.image}`} className="image" alt={user.firstname} />
            <h3 className="name">{user.firstname} {user.lastname}</h3>
            <p className="role">student</p>
            <Link to="/profile" className="btn">view profile</Link>
            <div className="flex-btn">
              <Link to="#" onClick={handleLogout} className="option-btn">logOut</Link>
            </div>
          </div>
        </section>
      </header>
      <div className="container">
        <div className={`left-container side-bar ${isSideBarActive ? 'active' : ''}`}>
          <div id="close-btn" onClick={handleSidebarCloseButtonClick}>
            <i className="fas fa-times"></i>
          </div>
          <form onSubmit={handleApplyFilters} className="filters">
            <div className="filter">
              <label>Companies</label>
              <Select
                isMulti
                options={companies}
                value={selectedCompanies}
                onChange={setSelectedCompanies}
              />
            </div>
            <div className="dates">
              <div className="filter">
                <label>From</label>
                <DatePicker className='DateInputs' selected={startDate} onChange={date => setStartDate(date)} />
              </div>
              <div className="filter">
                <label>To</label>
                <DatePicker className='DateInputs' selected={endDate} onChange={date => setEndDate(date)} />
              </div>
            </div>
            <div className="filter">
              <label>Sort By</label>
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
              />
            </div>
            <div className="filter">
              <label>Country</label>
              <Select
                options={countries}
                value={selectedCountry}
                onChange={setSelectedCountry}
              />
            </div>
            <div className="filter">
              <label>Category</label>
              <Select
                options={categories}
                value={selectedCategory}
                onChange={setSelectedCategory}
              />
            </div>
            <div className="filter">
              <label>Source</label>
              <Select
                options={sources}
                value={selectedSource}
                onChange={setSelectedSource}
              />
            </div>
            <div className="filter">
              <label>Domain</label>
              <Select
                options={domains}
                value={selectedDomain}
                onChange={setSelectedDomain}
              />
            </div>
            <button className='ApplyFilter' type="submit">Apply Filters</button>
          </form>
        </div>
        <div className="right-container">
          <section className="about">
            <div className="news-list">
              {error && <p className="error">{error}</p>}
              {news.length > 0 ? news.map((article, index) => (
                <div key={index} className="news-item">
                  <h3>{article.title ? article.title.substring(0, 100) : ''}...</h3>
                  <img style={{ width: '90%', height: '150px', margin: '20px 10px' }} src={article.urlToImage ? article.urlToImage : ''} alt="Image" />
                  <p>{article.content ? article.content.substring(0, 200) : ''}...</p>
                  <p><strong>Source:</strong> {article.source.name}</p>
                  <p><strong>Author: </strong>{article.author ? article.author : 'Not'}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                </div>
              )) : ShowStoredDataNews.length > 0 ? ShowStoredDataNews.map((article, index) => (
                <div key={index} className="news-item">
                  <h3>{article.title ? article.title.substring(0, 100) : ''}...</h3>
                  <img style={{ width: '90%', height: '150px', margin: '20px 10px' }} src={article.urlToImage ? article.urlToImage : ''} alt="Image" />
                  <p>{article.content ? article.content.substring(0, 200) : ''}...</p>
                  <p><strong>Source:</strong> {article && article.source && article.source.name ? article.source.name : ''}</p>
                  <p><strong>Author: </strong>{article.author ? article.author : 'Not'}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                </div>
              )) : ''}
              {loading && <Loading />}
              {loadingShowAll && <Loading />}
            </div>
            {!hasMore || !hasMoreShowAll ? <p style={{ color: '#ccc', fontSize: '20px', textAlign: 'center', marginTop: '40px' }}>No More Data</p> : ''}
          </section>
          <div className="share-btn" onClick={handleButtonClick}>
            <a target='_blank' className={`fab fa-brands fa-linkedin-in ${isExpanded ? 'expanded' : 'compress'}`} href={`https://www.linkedin.com/shareArticle?mini=true&url=`}></a>
            <a target='_blank' className={`fab fa-instagram ${isExpanded ? 'expanded' : 'compress'}`} href={`https://www.instagram.com/?url=`}></a>
            <a target='_blank' className={`fab fa-whatsapp ${isExpanded ? 'expanded' : 'compress'}`} href={`https://api.whatsapp.com/send?text=`}></a>
            <button className={`fa fa-share-alt ${isExpanded ? 'expanded' : ''}`}></button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DataBaseData;
