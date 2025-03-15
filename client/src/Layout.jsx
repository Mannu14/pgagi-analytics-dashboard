import { useLocation } from 'react-router-dom';
import Footer from './component/pages/Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideFooterPaths = ['/auth', '/register','/Search']; // Add paths where you want to hide the footer

  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <>
      {children}
      {!shouldHideFooter && <Footer />}
    </>
  );
};

export default Layout;
