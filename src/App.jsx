import React from 'react';
import './css/styles.css';
import { Routes, Route } from 'react-router-dom';
import Main from './layouts/Main';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './layouts/PrivateRoute';
import PublicRoute from './layouts/PublicRoute';
import Layout from './layouts/Layout';
import 'react-toastify/dist/ReactToastify.css';
import UserList from './components/user/UserList';
import UserAdd from './components/user/UserAdd';
import UserUpdate from './components/user/UserUpdate';
import PageNotFound from './components/PageNotFound';

const App = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route element={<Main />}>
                    <Route element={<PrivateRoute />}>
                        <Route path='/' element={<Dashboard />} />
                        <Route path='/users' element={<UserList />} />
                        <Route path='/user/add' element={<UserAdd />} />
                        <Route path='/user/edit/:id' element={<UserUpdate />} />
                    </Route>
                </Route>
                {/* Login và Register không có sidebar và header nằm ngoài này */}
                <Route element={<PublicRoute />}>
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                </Route>
            </Route>
            {/* Những cái nào không có địa chỉ được định nghĩa ở trên thì vào đây */}
            <Route path='*' element={<PageNotFound />} />
        </Routes>
    );
};

export default App;
