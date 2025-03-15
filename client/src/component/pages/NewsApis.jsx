import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
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
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'IN', label: 'India' },
];

const categories = [
  { value: 'business', label: 'Business' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'general', label: 'General' },
  { value: 'health', label: 'Health' },
  { value: 'science', label: 'Science' },
  { value: 'sports', label: 'Sports' },
  { value: 'technology', label: 'Technology' },
];

const sources = [
  { value: 'techcrunch', label: 'TechCrunch' },
  { value: 'bbc-news', label: 'BBC News' },
  { value: 'cnn', label: 'CNN' },
  { value: 'MacRumors', label: 'MacRumors' },
];

const domains = [
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
        }
        else {
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
  // for profile ----
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('dark-mode') === 'enabled');
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSideBarActive, setIsSideBarActive] = useState(false);
  // for profile ---
  // for profile---btns 
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
  // for profile---btns 

  // sharebtn 
  const handleButtonClick = () => {
    setIsExpanded(!isExpanded);
  };
  // sharebtn end

  // ---news api start 
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [CalculatedPage, setCalculatedPage] = useState(null);
  const [SearchBox, setSearchBox] = useState(null);
  const [error, setError] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [formSubmittedNews, setFormSubmittedNews] = useState(false);
  const [Keys, setKeys] = useState({});
  const [apiKey, setapiKey] = useState('');
  const [LoadingKeys, setLoadingKeys] = useState(true);
  useEffect(() => {
    // Fetch user data from your API endpoint
    const fetchKeyData = async () => {
      setLoadingKeys(true);
      try {
        const response = await fetch(`${apiUrlProcess}/keys`, {
          method: 'GET',
          credentials: 'include', // Include cookies if necessary
        });

        const KEYSData = await response.json();
        setKeys(KEYSData.KEYS);
        setapiKey(KEYSData.KEYS.FRONTEND_APIKEY1);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoadingKeys(false);
      }
    };

    fetchKeyData();
  }, []);


  useEffect(() => {
    fetchNews();
  }, [page]);

  const fetchNews = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    let url = 'https://newsapi.org/v2/everything';
    let params = {
      apiKey,
      page,
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
      url = 'https://newsapi.org/v2/top-headlines';
      params.country = selectedCountry.value;
      console.log(companyQuery, from, to, selectedCountry, selectedCategory, selectedSource, selectedDomain)
    }
    if (selectedCategory) {
      url = 'https://newsapi.org/v2/top-headlines';
      params.category = selectedCategory.value;
    }
    if (selectedSource) {
      url = 'https://newsapi.org/v2/top-headlines';
      params.sources = selectedSource.value;
    }
    if (selectedDomain) {
      params.domains = selectedDomain.value;
    }

    if (!companyQuery && !selectedCountry && !selectedCategory && !selectedSource && !selectedDomain) {
      setLoading(false);
      setError('Both date and filter selection are required. Please select them to proceed.')
      return;
    }

    try {
      const response = await axios.get(url, { params });
      if (response && response.config && response.config.params) {
        setSearchBox(response.config.params)
      }
      setCalculatedPage(parseInt(response.data.totalResults / 20) + 1);
      if (page === 1) {
        setNews(response.data.articles);
      } else {
        setNews(prevNews => [...prevNews, ...response.data.articles]);
      }
      if (parseInt(response.data.totalResults / 20) + 1 === page) {
        setHasMore(false);
      }
      if (response.data.articles.length === 0 && page === 1) {
        setError("The data isn't available. Please try a different selection.")
      }
      if (response.data.articles.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setHasMore(response.data.articles.length > 0);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setError('Too many requests. Please try again later.');
      } else {
        setError('Error fetching news. Please try again.');
      }
      setapiKey(Keys.FRONTEND_APIKEY2);
      setHasMore(false);
      console.error('Error fetching news:', error);
    }

    setLoading(false);
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
    setNews([]);
    setPage(1);
    fetchNews();
  };
  // ---news api End

  //   --- logout--
  const handleLogout = async () => {
    try {
      const response = await fetch(`${apiUrlProcess}/logOut`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        console.error("data.error");
      }
      else {
        navigate("/auth?startwith=signIn")
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  // --- logout end
  const storeNewsapiData = async () => {

    if (news && SearchBox) {
      const postData = {
        news: news.map((...articles) => {
          return {
            SearchBox,
            ...articles[0]
          };
        }).slice(0, 80)
      };
      if (news && postData.news.length > 0 && SearchBox) {
        try {
          const response = await fetch(`${apiUrlProcess}/NewsapiDatasend`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
          });
          if (!response.ok) {
            console.error("data.error");
          }
          else {
            alert('Data Post successfully')
          }
        } catch (error) {
          console.error('Data Not Send:', error);
        }
      }
      else {
        alert('filter the Data')
      }
    }
    else {
      alert('filter the Data')
    }
  };

  const togglePopupNews = () => {
    setShowPopup(!showPopup);
    setFormSubmittedNews(true);
  }
  const closePopupNews = () => {
    setNewapiPostStore({
      source_id: '',
      source_name: '',
      author: '',
      title: '',
      description: '',
      url: '',
      urlToImage: '',
      publishedAt: '',
      content: '',
    });
    setShowPopup(false);
    setFormSubmittedNews(false);
  };

  //   webd Post 
  const [NewapiPostStore, setNewapiPostStore] = useState({
    source_id: '',
    source_name: '',
    author: '',
    title: '',
    description: '',
    url: '',
    urlToImage: '',
    publishedAt: '',
    content: '',
  });
  const handleInputChangeNews = (e) => {
    const { name, value } = e.target;
    setNewapiPostStore({ ...NewapiPostStore, [name]: value });
  };

  const NewsProfilePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('source_id', NewapiPostStore.source_id);
    formData.append('source_name', NewapiPostStore.source_name);
    formData.append('author', NewapiPostStore.author);
    formData.append('title', NewapiPostStore.title);
    formData.append('description', NewapiPostStore.description);
    formData.append('url', NewapiPostStore.url);
    formData.append('urlToImage', NewapiPostStore.urlToImage);
    formData.append('publishedAt', NewapiPostStore.publishedAt);
    formData.append('content', NewapiPostStore.content);
    formData.append('_id', user._id);
    try {
      const response = await fetch(`${apiUrlProcess}/PostNewsApistore`, {
        method: 'POST',
        body: formData,
      });
      const responseData = await response.json();
      if (response.ok) {
        alert('successfully Posted');
        setFormSubmittedNews(false);
        closePopupNews();
      }
      else {
        alert('Failed to upload');
        throw new Error('Failed to upload');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  //   webd Post end


  if (!user || isLoading || LoadingKeys) {
    return <Loading/>;
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
            <div id="menu-btn" className='fas fa-send' onClick={storeNewsapiData}></div>
            <div id="menu-btn" className='fas fa-bars' onClick={handleMenuButtonClick}></div>
            <div id="search-btn" className='fas fa-search' onClick={handleSearchButtonClick}></div>
            <div id="user-btn" className='fas fa-user' onClick={handleUserButtonClick}></div>
            <div id="toggle-btn" onClick={handleToggleButtonClick} className={`fas ${isDarkMode ? 'fa-moon' : 'fa-sun'}`}></div>
          </div>
          <div className={`profile ${isProfileActive ? 'active' : ''}`} >
            <img id="profile-img-preview-header" src={`${user.image}`} className="image" alt="" />
            <h3 className="name">{user.firstname} {user.lastname}</h3>
            <p className="role">studen</p>
            <Link to="/profile" className="btn">view profile</Link>
            <div className="flex-btn">
              {/* <Link to="/auth?startwith=signIn" className="option-btn">login</Link> */}
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
                isMulti
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
              {error && <p style={{}} className="error">{error}</p>}
              {news.map((article, index) => (
                <div key={index} className="news-item">
                  <h3>{article.title ? article.title.substring(0, 100) : ''}...</h3>
                  <img style={{ width: '90%', height: '150px', margin: '20px 10px' }} src={article.urlToImage ? article.urlToImage : ''} alt="Image" />
                  <p>{article.content ? article.content.substring(0, 200) : ''}...</p>
                  <p><strong>Source:</strong> {article.source.name}</p>
                  <p><strong>Author: </strong>{article.author ? article.author : 'Not'}</p>
                  <a href={article.url} target="_blank">Read more</a>
                </div>
              ))}
              {loading && <Loading />}
            </div>
            {!hasMore ? <p style={{ color: '#ccc', fontSize: '20px', textAlign: 'center', marginTop: '40px' }}>No More Data</p> : ''}
          </section>
          <div className="share-btn" onClick={handleButtonClick}>
            <a className={`fab fa-brands fa-linkedin-in ${isExpanded ? 'expanded' : 'compress'}`} href={`https://www.linkedin.com/shareArticle?mini=true&url=`}></a>
            <a className={`fab fa-instagram ${isExpanded ? 'expanded' : 'compress'}`} href={`https://www.instagram.com/?url=`}></a>
            <a className={`fab fa-whatsapp ${isExpanded ? 'expanded' : 'compress'}`} href={`https://api.whatsapp.com/send?text=`}></a>
            <button className={`fa fa-share-alt ${isExpanded ? 'expanded' : ''}`}></button>
          </div>
        </div>
      </div>
      {/* ------- */}
      <div className={`popup-box ${showPopup && formSubmittedNews ? 'show' : ''}`}>
        {showPopup && (
          <div className="popup">
            <div className="content-box">
              <header>
                <p>Post News data</p>
                <i className="fa fa-times" onClick={closePopupNews}></i>
              </header>
              <form onSubmit={NewsProfilePost}>
                <div className="row title">
                  {/* <label>Fill The Details <span>*</span> <b className='popBox-exist-name'>{FistNameError ? FistNameError : ''}</b></label> */}
                  <input style={{ marginBottom: '10px' }} type="text" name="source_id" placeholder="source_id" value={NewapiPostStore.source_id} onChange={handleInputChangeNews} />
                  <input style={{ marginBottom: '10px' }} type="text" name="source_name" placeholder="source_name" value={NewapiPostStore.source_name} onChange={handleInputChangeNews} />
                  <input style={{ marginBottom: '10px' }} type="text" name="author" placeholder="author" value={NewapiPostStore.author} onChange={handleInputChangeNews} />
                  <input style={{ marginBottom: '10px' }} type="text" name="title" placeholder="title" value={NewapiPostStore.title} onChange={handleInputChangeNews} />
                  <input style={{ marginBottom: '10px' }} type="text" name="description" placeholder="description" value={NewapiPostStore.description} onChange={handleInputChangeNews} />
                  <input style={{ marginBottom: '10px' }} type="text" name="url" placeholder="url" value={NewapiPostStore.url} onChange={handleInputChangeNews} />
                  <input style={{ marginBottom: '10px' }} type="text" name="urlToImage" placeholder="urlToImage" value={NewapiPostStore.urlToImage} onChange={handleInputChangeNews} />
                  <input style={{ marginBottom: '10px' }} type="text" name="publishedAt" placeholder="publishedAt" value={NewapiPostStore.publishedAt} onChange={handleInputChangeNews} />
                  <input style={{ marginBottom: '10px' }} type="text" name="content" placeholder="content" value={NewapiPostStore.content} onChange={handleInputChangeNews} />
                </div>
                <button type="submit">Post</button>
              </form>
            </div>
          </div>
        )}
      </div>
      <div className="about-wrapper-add-box" onClick={togglePopupNews}>
        <div className="about-icon"><i className="fas fa-plus"></i></div>
        <p>Post</p>
      </div>
      {/* ------- */}
    </>
  );
}

export default DataBaseData;
