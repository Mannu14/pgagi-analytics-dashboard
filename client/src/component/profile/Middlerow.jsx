import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Loading from '../pages/Loading';

function Middlerow() {
  const apiUrlProcess = `${window.location.origin}/apis`;
  const [users, setUsers] = useState(null);
  const [User, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Track current page
  const navigate = useNavigate();

  // upadate other users profile 
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [FistNameError, setFistNameError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const [ClickedUserDetails, setClickedUserDetails] = useState('');
  const [ClickedUserAdmin, setClickedUserAdmin] = useState(false);
  const [ChouseImage, setChouseImage] = useState({ image: null });
  const [isLoadingUpdateUserProfile, setIsLoadingUpdateUserProfile] = useState(false);
  const [isLoadingDeleteProfile, setIsLoadingDeleteProfile] = useState(false);

  const [updatedUser, setUpdatedUser] = useState({
    firstname: '',
    lastname: '',
    language: '',
    address: '',
    phone: '',
    image: null,
  });


  const handleInputChangeAdmin = (e) => { setClickedUserAdmin(e.target.checked) };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleImageChange = (e) => {
    setUpdatedUser({ ...updatedUser, image: e.target.files[0] });
    setChouseImage({ image: null })
  };

  const handleSubmitOtherUsers = async (e) => {
    setIsLoadingUpdateUserProfile(true);
    e.preventDefault();
    const formData = new FormData();
    let MakeUserAdmin = '0';
    ClickedUserAdmin ? (MakeUserAdmin = '1') : (MakeUserAdmin = '0')

    formData.append('firstname', updatedUser.firstname);
    formData.append('lastname', updatedUser.lastname);
    formData.append('language', updatedUser.language);
    formData.append('address', updatedUser.address);
    formData.append('admin', MakeUserAdmin);
    formData.append('phone', updatedUser.phone);
    formData.append('image', updatedUser.image);
    formData.append('_id', User._id);
    formData.append('Make_Admin_id', ClickedUserDetails._id);

    try {
      const response = await fetch(`${apiUrlProcess}/update-Other-users-profile`, {
        method: 'POST',
        body: formData,
      });


      const responseData = await response.json();
      if (response.ok) {
        alert('Profile updated successfully');
        setFormSubmitted(false);
        setFistNameError('');
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === ClickedUserDetails._id
              ? { ...user, ...responseData.user }
              : user
          )
        );
      }
      else {
        if (responseData.error === 'First name already exists') {
          setFistNameError('First name already exists');
          setTimeout(function () {
            setFistNameError('');
          }, 10000);
        }
        else {
          setFistNameError(responseData.error);
          setTimeout(function () {
            setFistNameError('');
          }, 10000);
          throw new Error('Failed to upload image');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingUpdateUserProfile(false);
    }
  };

  const [formSubmittedDelete, setformSubmittedDelete] = useState(false);
  const [showPopupDelete, setshowPopupDelete] = useState(false);
  const [DeleteUserDetail, setDeleteUser] = useState(null);

  const deleteUser = (DeleteUser) => {
    setformSubmittedDelete(true);
    setshowPopupDelete(true);
    if (DeleteUser) {
      setDeleteUser(DeleteUser)
    }
  };

  const closePopupDelete = () => {
    setformSubmittedDelete(false);
    setshowPopupDelete(false);
  };

  const handleSubmitOtherUsersDelete = async (e) => {
    setIsLoadingDeleteProfile(true);
    e.preventDefault();

    if (!User || !DeleteUserDetail || !User._id || !DeleteUserDetail._id) {
      alert('Failed to delete user profile. User details are missing.');
      return;
    }

    const formData = new FormData();
    formData.append('_id', User._id);
    formData.append('DeleteUser_id', DeleteUserDetail._id);


    try {
      const response = await fetch(`${apiUrlProcess}/Delete-Other-users-profile`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || 'Failed to delete user profile');
      }

      alert('User Profile Deleted successfully');
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== DeleteUserDetail._id));
      setshowPopupDelete(false);
      setformSubmittedDelete(false);
    } catch (error) {
      console.error('Error deleting user profile:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoadingDeleteProfile(false);
    }
  };




  const togglePopup = (OtherUser) => {
    setShowPopup(!showPopup);
    setFormSubmitted(true);
    setClickedUserDetails(OtherUser);
    setUpdatedUser({
      firstname: OtherUser.firstname,
      lastname: OtherUser.lastname,
      language: OtherUser.language,
      address: OtherUser.address,
      phone: OtherUser.phone,
    });
    setChouseImage({ image: OtherUser.image });
  };
  const closePopup = () => {
    setUpdatedUser({
      firstname: '',
      lastname: '',
      language: '',
      address: '',
      phone: '',
    });
    setShowPopup(false);
    setFormSubmitted(false);
    setFistNameError('');
  };
  // upadate other User profile end

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiUrlProcess}/profile`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setUsers(data.users);
        setUser(data.user);
      } catch (error) {
        console.error(error);
        navigate("/auth?startwith=signIn")
        setError('Failed to fetch profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(users.length / itemsPerPage) - 1) {
      setCurrentPage(currentPage + 1);
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }
  function showMenu(e) {
    e.parentElement.classList.toggle("about-show");
    document.addEventListener("click", e2 => {
      // removing show class from the setting menu on document click
      if (e2.target.tagName != "I" || e2.target != e) {
        e.parentElement.classList.remove("about-show");
      }
    });
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Pagination logic
  const itemsPerPage = 24;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min((currentPage + 1) * itemsPerPage, users?.length);
  const paginatedUsers = users?.slice(startIndex, endIndex);


  return (
    <>
      <div className="middle-row">
        {!isLoading ?
          <>
            {paginatedUsers?.map((u, index) => (
              <div key={`middle-row-users-${index}`}>
                <div key={index} className="other-user-img">
                  <Link to='#' className="display-name-link">
                    {u.image.split('/').slice(0, 3).join('/') === 'https://lh3.googleusercontent.com' ?
                      <img src={`${u.image}`} alt="" />
                      : <img src={`${u.image}`} alt="" />
                    }
                  </Link>
                  <h1 className="other-user-name">{u.firstname} {u.lastname}</h1>
                </div>
              </div>
            ))}
          </>
          :
          <Loading stroke='#88C5E1' width='25px' height='25px' />
        }
        <button id="prevButton" className="fa fa-angle-left" onClick={handlePrevPage}></button>
        <label htmlFor="" className="prev-btn">Previous</label>
        <button id="nextButton" className="fa fa-angle-right" onClick={handleNextPage}></button>
        <label htmlFor="" className="next-btn">Next</label>
      </div>
      <div key="Quiz-Given" className='OtherUsersTable'>
        {!isLoading ?
          <table className="Users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone No.</th>
                <th>address</th>
                <th>language</th>
                <th>admin</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers?.map((u, index) => (
                <tr key={`-users-${index}`}>
                  <td>
                    {u.image.split('/').slice(0, 3).join('/') === 'https://lh3.googleusercontent.com' ?
                      (<img src={`${u.image}`} alt="" />)
                      :
                      (<img src={`${u.image}`} alt="" />)
                    }
                    {u.firstname + ' ' + u.lastname}
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{u.address}</td>
                  <td>{u.language}</td>
                  <td>{u.admin}</td>
                  <td>
                    <ul className="about-settings">
                      <i onClick={(e) => showMenu(e.target)} className="fas fa-ellipsis-h"></i>
                      <ul className="about-menu">
                        <li onClick={() => togglePopup(u)}><i className="fas fa-pen"></i>Edit</li>
                        <li onClick={() => deleteUser(u)}><i className="fas fa-trash"></i>Delete</li>
                      </ul>
                    </ul>
                  </td>
                </tr>
              ))}
              <tr><td className="precentage-label">Total user: {users?.length} </td><td className="precentage-value"></td></tr>
            </tbody>
          </table>
          : <Loading stroke='#88C5E1' width='25px' height='25px' />
        }
      </div>
      <div className={`popup-box ${showPopup && formSubmitted ? 'show' : ''}`}>
        {showPopup && (
          <div className="popup">
            <div className="content-box">
              <header>
                <p>Update user profile</p>
                <i className="fa fa-times" onClick={closePopup}></i>
              </header>
              <form onSubmit={handleSubmitOtherUsers}>
                <div className="row title">
                  <label>Fill The Details <span>*</span> <b className='popBox-exist-name'>{FistNameError ? FistNameError : ''}</b></label>
                  <input type="text" name="firstname" placeholder="First Name" value={updatedUser.firstname} onChange={handleInputChange} />
                  <input type="text" name="lastname" placeholder="Last Name" value={updatedUser.lastname} onChange={handleInputChange} />
                  <input type="text" name="language" placeholder="Language" value={updatedUser.language} onChange={handleInputChange} />
                  <input type="text" name="address" placeholder="Address" value={updatedUser.address} onChange={handleInputChange} />
                  <input type="number" pattern="[1-9]{1}[0-9]{9}" name="phone" placeholder="Phone Number" value={updatedUser.phone} onChange={handleInputChange} />
                  <label>Make Admin or Not</label>
                  <input type="checkbox" style={{ width: '15px' }} name="admin" placeholder="admin" value={updatedUser.admin} onChange={handleInputChangeAdmin} />
                  <label>Profile image <span>*</span></label>
                  {ChouseImage.image == null ? (
                    ''
                  ) : (
                    ChouseImage.image.split('/').slice(0, 3).join('/') === 'https://lh3.googleusercontent.com' ? (
                      <img src={`${ChouseImage.image}`} style={{ width: '25px', height: '25px' }} alt="Edit" />
                    ) : (
                      <img src={`${ChouseImage.image}`} style={{ width: '25px', height: '25px' }} alt="Edit" />
                    )
                  )}

                  <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                <button type="submit">
                  {isLoadingUpdateUserProfile ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '25px' }}><Loading width="20px" height="20px" ISORNOT='please wait' /></div> : 'Update Profile'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className={`popup-box ${showPopupDelete && formSubmittedDelete ? 'show' : ''}`}>
        {showPopupDelete && (
          <div className="popup">
            <div className="content-box">
              <header>
                <p>Delete user profile</p>
                <i className="fa fa-times" onClick={closePopupDelete}></i>
              </header>
              <form onSubmit={handleSubmitOtherUsersDelete}>
                <div className="row title" style={{ color: '#c5cae9', fontSize: '15px' }}>Are you sure you want to delete the {DeleteUserDetail.firstname + ' ' + DeleteUserDetail.lastname}</div>
                <button type="submit">
                  {isLoadingDeleteProfile ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '25px' }}><Loading width="20px" height="20px" ISORNOT='please wait' /></div> : 'Delete'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Middlerow;
