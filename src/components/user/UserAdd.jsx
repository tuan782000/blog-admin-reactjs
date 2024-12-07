import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as actions from '../../redux/actions';
import requestApi from '../../helpers/api';
import { toast } from 'react-toastify';

const UserAdd = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        register, // đăng ký các field cần quản lý với register
        handleSubmit, // handleSubmit quản lý việc sumbit form - bằng nút button kèm dữ liệu - gọi hàm handleSubmitFormAdd
        formState: { errors } // đăng ký các lỗi của các filed có thể gặp phải
    } = useForm();

    // thay vì then catch - dùng async và await
    const handleSubmitFormAdd = async data => {
        console.log('data form. => ', data);
        dispatch(actions.controlLoading(true));
        try {
            const res = await requestApi('/users', 'POST', data);
            console.log('res =>', res);
            dispatch(actions.controlLoading(false));
            // Thêm thông báo đăng nhập thành công
            toast.success('User has been create successfully!', {
                position: 'top-right',
                autoClose: 2000
            });
            navigate('/users');
        } catch (error) {
            console.log('error =>', error);
            dispatch(actions.controlLoading(false));
        }
    };
    return (
        <div id='layoutSidenav_content'>
            <main>
                <div className='container-fluid px-4'>
                    <h1 className='mt-4'>New users</h1>
                    <ol className='breadcrumb mb-4'>
                        <li className='breadcrumb-item'>
                            <Link to='/'>Dashboard</Link>
                        </li>
                        <li className='breadcrumb-item'>
                            <Link to='/users'>Users</Link>
                        </li>
                        <li className='breadcrumb-item active'>Add new</li>
                    </ol>
                    <div className='card mb-4'>
                        <div className='card-header'>
                            <i className='fa fa-plus me-1'></i>
                            Add
                        </div>
                        <div className='card-body'>
                            <div className='row mb_3'>
                                <form>
                                    <div className='col-md-6'>
                                        <div className='mt-3 mb-3'>
                                            <label
                                                htmlFor=''
                                                className='form-label'
                                            >
                                                First name:
                                            </label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                placeholder='Enter first name'
                                                {...register('first_name', {
                                                    required:
                                                        'First name is required.'
                                                })}
                                            />
                                            {errors.first_name && (
                                                <p style={{ color: 'red' }}>
                                                    {errors.first_name.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className='mt-3'>
                                            <label
                                                htmlFor=''
                                                className='form-label'
                                            >
                                                Last name:
                                            </label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                placeholder='Enter last name'
                                                {...register('last_name', {
                                                    required:
                                                        'Last name is required.'
                                                })}
                                            />
                                            {errors.last_name && (
                                                <p style={{ color: 'red' }}>
                                                    {errors.last_name.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className='mt-3 mb-3'>
                                            <label
                                                htmlFor=''
                                                className='form-label'
                                            >
                                                Email:
                                            </label>
                                            <input
                                                type='email'
                                                className='form-control'
                                                placeholder='Enter email'
                                                {...register('email', {
                                                    required:
                                                        'Email is required.',
                                                    pattern: {
                                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                                                        message:
                                                            'Invalid email address'
                                                    }
                                                })}
                                            />
                                            {errors.email && (
                                                <p style={{ color: 'red' }}>
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className='mt-3'>
                                            <label
                                                htmlFor=''
                                                className='form-label'
                                            >
                                                Password:
                                            </label>
                                            <input
                                                type='password'
                                                className='form-control'
                                                placeholder='Enter password'
                                                {...register('password', {
                                                    required:
                                                        'Password is required.'
                                                })}
                                            />
                                            {errors.password && (
                                                <p style={{ color: 'red' }}>
                                                    {errors.password.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className='mt-3 mb-3'>
                                            <label
                                                htmlFor=''
                                                className='form-label'
                                            >
                                                Status:
                                            </label>
                                            <select
                                                name=''
                                                id=''
                                                className='form-select'
                                                {...register('status')}
                                            >
                                                <option value='1'>
                                                    Active
                                                </option>
                                                <option value='2'>
                                                    InActive
                                                </option>
                                            </select>
                                        </div>
                                        <button
                                            type='button'
                                            className='btn btn-success'
                                            onClick={handleSubmit(
                                                handleSubmitFormAdd
                                            )}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserAdd;
