import React from 'react';
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

const App = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route element={<Main />}>
                    <Route element={<PrivateRoute />}>
                        <Route path='/' element={<Dashboard />} />
                        <Route path='/users' element={<UserList />} />
                    </Route>
                </Route>
                {/* Login và Register không có sidebar và header nằm ngoài này */}
                <Route element={<PublicRoute />}>
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default App;
