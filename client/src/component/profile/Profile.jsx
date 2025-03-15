import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Sharebtn from './Sharebtn';
import Middlerow from './Middlerow';
import Loading from '../pages/Loading';

function Profile() {
  const apiUrlProcess = `${window.location.origin}/apis`;
  // for profile ----
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('dark-mode') === 'enabled');
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSideBarActive, setIsSideBarActive] = useState(false);
  const [IfAdmin_1, setIfAdmin_1] = useState(false);
  // for profile ----

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [updatedUser, setUpdatedUser] = useState({
    firstname: '',
    lastname: '',
    language: '',
    address: '',
    image: null,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [FistNameError, setFistNameError] = useState('');
  const [isLoadingUpdateUserProfile, setIsLoadingUpdateUserProfile] = useState(false);
  const [isLoadinglogOut, setIsLoadinglogOut] = useState(false);

  // upadate profile image 

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // setSelectedFile(file);
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('_id', user._id);
    // console.log(user._id,file);

    try {
      const response = await fetch(`${apiUrlProcess}/update-user-profile-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      alert('Image uploaded successfully');
      const responseData = await response.json();
      const imagePath = responseData.user.image;

      if (imagePath) {
        // Update the image preview
        // Assuming you have IDs for the image elements
        const NewimagePath = `${imagePath}`
        document.getElementById('image-preview').src = NewimagePath;
        document.getElementById('profile-img-preview').src = NewimagePath;
        document.getElementById('profile-img-preview-header').src = NewimagePath;
      } else {
        console.error('User image not found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  // upadate profile image end

  // upadate profile 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleImageChange = (e) => {
    setUpdatedUser({ ...updatedUser, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingUpdateUserProfile(true);
    const formData = new FormData();
    formData.append('firstname', updatedUser.firstname);
    formData.append('lastname', updatedUser.lastname);
    formData.append('language', updatedUser.language);
    formData.append('address', updatedUser.address);
    formData.append('image', updatedUser.image);
    formData.append('_id', user._id);

    try {
      const response = await fetch(`${apiUrlProcess}/update-user-profile`, {
        method: 'POST',
        body: formData,
      });


      const responseData = await response.json();
      if (response.ok) {
        alert('Profile updated successfully');
        const imagePath = responseData.user.image;
        // Update the UI if necessary
        if (imagePath) {
          document.querySelector('#image-preview').src = `${imagePath}`;
          document.querySelector('#profile-img-preview').src = `${imagePath}`;
          document.querySelector('#profile-img-preview-header').src = `${imagePath}`;
          document.querySelector('.user-name').innerHTML = responseData.user.firstname + ' ' + responseData.user.lastname;
          document.querySelector('.name1').innerHTML = responseData.user.firstname + ' ' + responseData.user.lastname;
          document.querySelector('.name2').innerHTML = responseData.user.firstname + ' ' + responseData.user.lastname;
          document.querySelector('.user-address').innerHTML = responseData.user.address;
          document.querySelector('.user-language').innerHTML = responseData.user.language;
        } else {
          alert('Please select an image file to upload.');
        }
        setFormSubmitted(false);
        setFistNameError('');
      }
      else {
        if (responseData.error === 'First name already exists') {
          setFistNameError('First name already exists');
          setTimeout(function () {
            setFistNameError('');
          }, 5000);
        }
        else {
          setFistNameError(responseData.error);
          setTimeout(function () {
            setFistNameError('');
          }, 3000);
          throw new Error('Failed to upload image');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingUpdateUserProfile(false);
    }
  };
  const togglePopup = () => {
    setShowPopup(!showPopup);
    setFormSubmitted(true);
    setUpdatedUser({
      firstname: user.firstname,
      lastname: user.lastname,
      language: user.language,
      address: user.address,
    });
  };
  const closePopup = () => {
    setUpdatedUser({
      firstname: '',
      lastname: '',
      language: '',
      address: '',
    });
    setShowPopup(false);
    setFormSubmitted(false);
    setFistNameError('');
  };
  // upadate profile end


  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiUrlProcess}/profile`, {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        navigate("/auth?startwith=signIn")
        console.error(error);
        setError('Failed to fetch profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const now = new Date();
  const midnight = new Date();
  midnight.setHours(23, 59, 0, 0);
  const timeUntilMidnight = midnight - now;

  setTimeout(() => {
    localStorage.setItem('quizRemainingTime', '0');
    localStorage.setItem('QuizMarks', '0');
  }, timeUntilMidnight);

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

  //   --- logout--
  const handleLogout = async () => {
    setIsLoadinglogOut(true);
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
    } finally {
      setIsLoadinglogOut(false);
    }
  };

  const ShowOtherUsersIfAdmin_1 = () => {
    setIfAdmin_1(!IfAdmin_1);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <header className="header">
        <section className="flex">
          <Link to="#" className="logo">NewsApi</Link>
          <form action="search.html" method="post" className={`search-form ${isSearchActive ? 'active' : ''}`}>
            <input type="text" name="search_box" required placeholder="search..." maxLength="100" />
            <button type="submit" className="fas fa-search"></button>
          </form>
          <div className="profile-icons">
            <div id={`${user.admin === '1' ? 'menu-btn-role' : 'menu-btn-role-none'}`} className='fas fa-user-secret'
              onClick={ShowOtherUsersIfAdmin_1}></div>
            <div id="menu-btn" className='fas fa-bars' onClick={handleMenuButtonClick}></div>
            <div id="search-btn" className='fas fa-search' onClick={handleSearchButtonClick}></div>
            <div id="user-btn" className='fas fa-user' onClick={handleUserButtonClick}></div>
            <div id="toggle-btn" onClick={handleToggleButtonClick} className={`fas ${isDarkMode ? 'fa-moon' : 'fa-sun'}`}></div>
          </div>
          <div className={`profile ${isProfileActive ? 'active' : ''}`} >
            {user.image.split('/').slice(0, 3).join('/') === 'https://lh3.googleusercontent.com' ?
              <img id="profile-img-preview-header" src={`${user.image}`} className="image" alt="" />
              :
              <img id="profile-img-preview-header" src={`${user.image}`} className="image" alt="" />
            }
            <h3 className="name name1">{user.firstname} {user.lastname}</h3>
            <p className="role">student</p>
            <div className="flex-btn">
              {user ?
                <Link href="#" onClick={handleLogout} className="option-btn">
                  {isLoadinglogOut ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '25px' }}><Loading width="20px" height="20px" ISORNOT='please wait' /></div> : 'logOut'}
                </Link>
                :
                <>
                  <Link href="auth?startwith=signIn" className="option-btn">logIn</Link>
                  <Link href="auth?startwith=signUp" className="option-btn">register</Link>
                </>}
            </div>
          </div>
        </section>
      </header>
      <div className="container">
        <div className={`left-container side-bar ${isSideBarActive ? 'active' : ''}`}>
          <div id="close-btn" onClick={handleSidebarCloseButtonClick}>
            <i className="fas fa-times"></i>
          </div>
          <div className="profile">
            {user.image.split('/').slice(0, 3).join('/') === 'https://lh3.googleusercontent.com' ?
              <img id="profile-img-preview" src={`${user.image}`} className="image" alt="" />
              :
              <img id="profile-img-preview" src={`${user.image}`} className="image" alt="" />
            }
            <h3 className="name name2">{user.firstname} {user.lastname}</h3>
            <p className="role">studen</p>
            <button className="btn">User profile</button>
          </div>
          <nav className="navbar">
            <Link to="/index"><i className="fas fa-home"></i><span>home</span></Link>
            <Link to="/NewsApis"><i className="fas fa-chalkboard-user"></i><span>Newsapis</span></Link>
            <Link to="/DataBaseData"><i className="fas fa-database"></i><span>Database</span></Link>
            <Link to="/Profile"><i className="fas fa-graduation-cap"></i><span>profile</span></Link>
            <Link to="/contact"><i className="fas fa-headset"></i><span>contact us</span></Link>
          </nav>
        </div>
        <div className="right-container">
          <section className="about">
            <div className="row">
              <div className="left-row">
                <div className="edit-profile">
                  {user.image.split('/').slice(0, 3).join('/') === 'https://lh3.googleusercontent.com' ?
                    <img id="image-preview" src={`${user.image}`} alt="Preview Image" />
                    :
                    <img id="image-preview" src={`${user.image}`} alt="Preview Image" />
                  }
                  <label htmlFor="file-upload" className="custom-file-upload">
                    <i className="fas fa-pen"></i>
                  </label>
                  <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} />
                  <h1 className="user-name">{user.firstname} {user.lastname}</h1>
                </div>
                <h2 className="user-address">{user.address}</h2>
                <h3>language</h3>
                <h4 className="user-language">{user.language}</h4>
                <div id="userEmail" data-email={user.email}></div>
                <div id="user_id" data-id={user._id}></div>
                <button id="Edit-profile-btn" className="btn" onClick={togglePopup}>Edit Profile</button>
              </div>
              {IfAdmin_1 ? <Middlerow /> : user.admin==='0' ? <Link style={{border:'2px solid #c3cbff',padding:'10px',fontSize:'12px'}} to="/contact"><i className="fas fa-envelope"></i><span>Send an email to become an admin</span></Link>:<span style={{border:'2px solid #c3cbff',padding:'10px',fontSize:'12px'}}>click on the "Admin" button above.</span>}
            </div>
            <div className="box-container"></div>
            <Sharebtn />
            <div className={`popup-box ${showPopup && formSubmitted ? 'show' : ''}`}>
              {showPopup && (
                <div className="popup">
                  <div className="content-box">
                    <header>
                      <p>Update Your Profile</p>
                      <i className="fa fa-times" onClick={closePopup}></i>
                    </header>
                    <form onSubmit={handleSubmit}>
                      <div className="row title">
                        <label>Fill The Details <span>*</span> <b className='popBox-exist-name'>{FistNameError ? FistNameError : ''}</b></label>
                        <input
                          type="text"
                          name="firstname"
                          placeholder="First Name"
                          value={updatedUser.firstname}
                          onChange={handleInputChange}
                        />
                        <input
                          type="text"
                          name="lastname"
                          placeholder="Last Name"
                          value={updatedUser.lastname}
                          onChange={handleInputChange}
                        />
                        <input
                          type="text"
                          name="language"
                          placeholder="Language"
                          value={updatedUser.language}
                          onChange={handleInputChange}
                        />
                        <input
                          type="text"
                          name="address"
                          placeholder="Address"
                          value={updatedUser.address}
                          onChange={handleInputChange}
                        />
                        <label>Profile image <span>*</span></label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                      <button type="submit">
                        {isLoadingUpdateUserProfile ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '25px' }}><Loading width="20px" height="20px" ISORNOT='please wait' /></div> : 'Update Profile'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Profile;
