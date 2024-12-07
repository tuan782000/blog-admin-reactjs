import React, { useEffect, useState } from 'react';
import requestApi from '../helpers/api';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as actions from '../redux/actions';

const Dashboard = () => {
    const dispatch = useDispatch();

    const [dashBoardData, setDashBoardData] = useState({});

    // xử lý được 1 api

    // useEffect(() => {
    //     requestApi('/users', 'GET')
    //         .then(response => {
    //             console.log(response);
    //             setDashBoardData({
    //                 ...dashBoardData,
    //                 totalUser: response.data.total // chỉ cần lấy tổng không show chi tiết
    //             });
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         });
    // }, []);

    // xử lý nhiều api cùng 1 lúc
    useEffect(() => {
        // user
        const pormiseUser = requestApi('/users', 'GET'); // call api
        // post
        const pormisePost = requestApi('/posts', 'GET'); // call api
        // category
        const pormiseCategory = requestApi('/categories', 'GET'); // call api

        dispatch(actions.controlLoading(true));

        // xử lý song song
        Promise.all([pormiseUser, pormisePost, pormiseCategory])
            .then(res => {
                dispatch(actions.controlLoading(false));
                console.log('res =>', res);
                setDashBoardData({
                    ...dashBoardData,
                    totalUser: res[0].data.total,
                    totalPost: res[1].data.total,
                    totalCategory: res[2].data.total
                });
            })
            .catch(error => {
                dispatch(actions.controlLoading(false));
                console.log('error => ', error);
            });
    }, []);
    return (
        <div id='layoutSidenav_content'>
            <main>
                <div className='container-fluid px-4'>
                    <h1 className='mt-4'>Dashboard</h1>
                    <ol className='breadcrumb mb-4'>
                        <li className='breadcrumb-item active'>Dashboard</li>
                    </ol>
                    <div className='row'>
                        <div className='col-xl-3 col-md-6'>
                            <div className='card bg-primary text-white mb-4'>
                                <div className='card-body'>
                                    Total Users
                                    <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                                        {dashBoardData.totalUser}
                                    </span>
                                </div>
                                <div className='card-footer d-flex align-items-center justify-content-between'>
                                    <Link
                                        className='small text-white stretched-link'
                                        to='/users'
                                    >
                                        View user
                                    </Link>
                                    <div className='small text-white'>
                                        <i className='fas fa-angle-right'></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-3 col-md-6'>
                            <div className='card bg-warning text-white mb-4'>
                                <div className='card-body'>
                                    Total Posts
                                    <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                                        {dashBoardData.totalPost}
                                    </span>
                                </div>
                                <div className='card-footer d-flex align-items-center justify-content-between'>
                                    {/* <a
                                        className='small text-white stretched-link'
                                        href='#'
                                    >
                                        View Details
                                    </a> */}
                                    <Link
                                        className='small text-white stretched-link'
                                        to='/posts'
                                    >
                                        View Posts
                                    </Link>
                                    <div className='small text-white'>
                                        <i className='fas fa-angle-right'></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-3 col-md-6'>
                            <div className='card bg-success text-white mb-4'>
                                <div className='card-body'>
                                    Total categories
                                    <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                                        {dashBoardData.totalCategory}
                                    </span>
                                </div>
                                <div className='card-footer d-flex align-items-center justify-content-between'>
                                    <Link
                                        className='small text-white stretched-link'
                                        to='/categories'
                                    >
                                        View user
                                    </Link>
                                    <div className='small text-white'>
                                        <i className='fas fa-angle-right'></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className='col-xl-3 col-md-6'>
                            <div className='card bg-danger text-white mb-4'>
                                <div className='card-body'>Danger Card</div>
                                <div className='card-footer d-flex align-items-center justify-content-between'>
                                    <a
                                        className='small text-white stretched-link'
                                        href='#'
                                    >
                                        View Details
                                    </a>
                                    <div className='small text-white'>
                                        <i className='fas fa-angle-right'></i>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
