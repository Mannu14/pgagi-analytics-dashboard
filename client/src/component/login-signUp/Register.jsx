import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import GoogleLoginUse from './GoogleLogin';
import Loading from '../pages/Loading';

function RegistrationForm() {
  const apiUrlProcess = `${window.location.origin}/apis`;
  const [alertMsg, setAlertMsg] = useState('');
  const [ISLoading, setISLoading] = useState(false);

  const navigate = useNavigate();

  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [language, setLanguage] = useState('');
  const [image, setImage] = useState(null); // Store image as a file object
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event) => {
    setISLoading(true);
    event.preventDefault();

    if (!firstname || !email || !password || !confirmpassword) {
      setAlertMsg('Please fill in all required fields.');
      return;
    }
    if (password !== confirmpassword) {
      setAlertMsg('Passwords do not match.');
      return;
    }

    const formData = new FormData();
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('language', language);
    if (image) {
      formData.append('image', image);
    }
    formData.append('password', password);
    formData.append('confirmpassword', confirmpassword);

    try {
      const response = await fetch(`${apiUrlProcess}/register`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      const data = await response.json();
      setAlertMsg(data.alertMsg);
      if (data.alertMsg === 'successful registration') {
        setAlertMsg('');
        navigate('/auth?startwith=signIn');
      }
    } catch (error) {
      console.error(error);
      setAlertMsg('Registration failed. Please try again.');
    }finally{
      setISLoading(false);
    }
  };

  const closeAlert = () => {
    setAlertMsg('');
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAlertMsg('')
    }, 7000);

    return () => clearInterval(intervalId);
  }, [alertMsg]);

  const handleGoogleSignIn = () => {
    // Handle Google Sign-In logic
  };

  return (
    <div className="Register-form">
      <div className="Register-container">
        <h2 className="Register-heading" style={{ textAlign: 'center', color: '#c5cae9', fontSize: '22px', marginBottom: '20px', marginTop: '20px' }}>
          <span>Create an Account</span>
        </h2>
        <hr style={{ border: '1px solid #ccc' }} />
        <div className="Register-field">
          <form id="register-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="two-two-input">
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-user icon"></i>
                  <input type="text" id="firstname" onChange={(e) => setFirstName(e.target.value)} autoComplete="off" name="firstname" placeholder="First Name Unique*" required />
                </div>
              </div>
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-user icon"></i>
                  <input type="text" id="lastname" onChange={(e) => setLastName(e.target.value)} autoComplete="off" name="lastname" placeholder="Last Name" />
                </div>
              </div>
            </div>
            <div className="two-two-input">
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-envelope icon"></i>
                  <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} autoFocus name="email" placeholder="name123@gmail.com" required />
                </div>
              </div>
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-phone icon"></i>
                  <input type="number" id="phone" onChange={(e) => setPhone(e.target.value)} autoComplete="off" name="phone" placeholder="Phone Number" />
                </div>
              </div>
            </div>
            <div className="two-two-input">
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-address-card icon"></i>
                  <input type="text" id="address" onChange={(e) => setAddress(e.target.value)} autoComplete="off" name="address" placeholder="Address" />
                </div>
              </div>
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-globe icon"></i>
                  <input type="text" id="language" onChange={(e) => setLanguage(e.target.value)} autoComplete="off" name="language" placeholder="Language" />
                </div>
              </div>
            </div>
            <div className="two-two-input">
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-image icon"></i>
                  <input type="file" id="image" onChange={(e) => setImage(e.target.files[0])} name="image" placeholder="Upload Image" />
                </div>
              </div>
            </div>
            <div className="two-two-input">
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-lock icon"></i>
                  <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} autoComplete="off" name="password" placeholder="Password *" required />
                </div>
              </div>
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-lock icon"></i>
                  <input type="password" id="confirmpassword" onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="off" name="confirmpassword" placeholder="Confirm Password *" required />
                </div>
              </div>
            </div>
            {alertMsg &&
              <div id="customAlert" className="alert">
                <span className="closebtn" onClick={closeAlert}>&times;</span>
                <strong>Error:</strong> {alertMsg}
              </div>
            }
            <div className="submit-Register">
              <button style={{ marginTop: '30px' }} type="submit" className="input-submit">
                {ISLoading ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '25px' }}><Loading width="20px" height="20px" ISORNOT='please wait' /></div> : 'Register'}
              </button>
            </div>
          </form>
          <div className="google-signin">
            <button type="button" className="google-button" onClick={handleGoogleSignIn}>
              <img src="data:image/png;base64,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" alt="Google" className="google-icon" />
              <GoogleLoginUse />
            </button>
          </div>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span className="text-center" style={{ fontSize: '17px', color: '#c5cae9' }}>Already have an account?</span>
            <Link style={{ color: '#ccc', fontWeight: '500', textAlign: 'center', paddingLeft: '10px', fontSize: '14px' }} to="/auth?startwith=signIn">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
