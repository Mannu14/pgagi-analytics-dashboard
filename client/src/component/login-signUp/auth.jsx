import RegistrationForm from './Register';
import Login from './login';
import '../styles/CommonLoginSignUp.css';
import { Link, useSearchParams } from 'react-router-dom';

function CommonLoginSignUp() {
  const [searchParams] = useSearchParams();
  const isSignInL = searchParams.get('startwith') === 'signIn';
  const isSignUpL = searchParams.get('startwith') === 'signUp';
  document.body.style.backgroundColor = "#080710"

  return (
    <div className="Common-container">
      <div className="button-group">
        <Link
          to="?startwith=signIn"
          className={`toggle-button ${isSignInL ? 'active' : ''}`}
        >
          Sign In
        </Link>
        <Link
          to="?startwith=signUp"
          className={`toggle-button ${isSignUpL ? 'active' : ''}`}
        >
          Sign Up
        </Link>
      </div>
      <div className="form-container">
        {isSignUpL ? <RegistrationForm /> : <Login />}
      </div>
    </div>
  );
}

export default CommonLoginSignUp;
