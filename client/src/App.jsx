import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorPage from "./component/pages/ErrorPage";
import DataBaseData from "./component/pages/DataBaseData";
import NewsApis from "./component/pages/NewsApis";
import CommonLoginSigUp from './component/login-signUp/auth';
import Profile from "./component/profile/Profile";
import Contact from "./component/login-signUp/contact";
import Layout from './Layout'; // Import the Layout component
import Search from './component/pages/Search';
import Header from './component/pages/Header';
import HomePage from './component/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route exact path='/' element={<HomePage/>} />
          <Route exact path='/auth' element={<CommonLoginSigUp />} />
          <Route exact path='/NewsApis' element={<NewsApis />} />
          <Route exact path='/Profile' element={<Profile />} />
          <Route exact path='/DataBaseData' element={<DataBaseData />} />
          <Route exact path='/Contact' element={<Contact />} />
          <Route exact path='/Search' element={<Search />} />
          <Route exact path='/Header' element={<Header />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;