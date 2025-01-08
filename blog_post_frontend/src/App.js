import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/account/Login';
import Dataprovider from './context/Dataprovider';
import Home from './components/home/Home';
import Header from './components/header/Header';
import UpdatePost from './components/update/UpdateBlog';
import Createpost from './components/create/Createpost';
import DetailView from './components/details/DetailView';
import Profile from './components/userprofile/Profile';
import Entermail from './components/account/resetpassword/I_enter_mail/Entermail.jsx';
import Enterotp from './components/account/resetpassword/II_enter_otp/Enterotp.jsx';
import AddnewPass from './components/account/resetpassword/III_add_newpassword/AddnewPass';
import UserPosts from './components/user_posts/UserPosts.jsx';
import Editprofiledetails from './components/userprofile/editprofile/Editprofiledetails.jsx';

const Privateroute = ({ isAuthenticated, children }) => {
  return isAuthenticated ?
    <>
      <Header />
      <Outlet />
    </>
    : <Navigate replace to="/login" />
}

function App() {
  const [isAuthenticated, isUserAuthenticated] = useState(false);

  return (
    <div className="App">
      <Dataprovider>
        <BrowserRouter>
          <Routes>
            <Route path='/login'
              element={<Login
                isUserAuthenticated={isUserAuthenticated} 
              />}>
            </Route>
            <Route path='/' element={<Privateroute isAuthenticated={isAuthenticated} />} >
              <Route path='/' element={<Home />}></Route>
              <Route path='/create' element={<Createpost />}></Route>
              <Route path='/details/:id' element={<DetailView />} ></Route>
              <Route path='/update/:id' element={<UpdatePost />} ></Route>
              <Route path='/profile' element={<Profile />} ></Route>
              <Route path='/profile/edit' element={<Editprofiledetails />} ></Route>
              <Route path='/user-posts' element={<UserPosts />} ></Route>
            </Route>
            <Route path="/entermail" element={<Entermail />} />
            <Route path="/enter-otp" element={<Enterotp />} />
            <Route path="/add-newpass" element={<AddnewPass />} />
          </Routes>
        </BrowserRouter>
      </Dataprovider>
    </div>
  );
}

export default App;