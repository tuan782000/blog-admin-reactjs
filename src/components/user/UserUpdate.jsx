import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as actions from '../../redux/actions';
import requestApi from '../../helpers/api';
import { toast } from 'react-toastify';

const UserUpdate = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams(); // /user/edit/:id cho nên params,id
    // console.log('user id => ', params.id);
    const {
        register,
        setValue, // giúp cập nhật value mới cho các fields đã đăng ký trong register
        handleSubmit,
        formState: { errors }
    } = useForm();

    // Lấy thông tin cụ thể của user cần update
    useEffect(() => {
        // trong useEffect không dùng async await được nên phải khai báo 1 hàm async await bọc để call api
        dispatch(actions.controlLoading(true));
        try {
            // hàm gọi api có thể đem ra ngoài
            const getDetailUser = async () => {
                const res = await requestApi(`/users/${params.id}`, 'GET');
                console.log(res);
                dispatch(actions.controlLoading(false));
                const fields = ['first_name', 'last_name', 'status']; // các fileds là mảng chứa các filed con đã quy định form
                fields.forEach(field => setValue(field, res.data[field])); // dùng vòng lặp nhả đúng dữ liệu cho từng ô input của form
                // load data tương ứng cho các field -
                // và cập nhật dữ liệu cho các filed nếu người dùng gõ
            };

            getDetailUser();
        } catch (error) {
            console.log('error', errpr);
            dispatch(actions.controlLoading(false));
        }
    }, []);

    const handleSubmitFormUpdate = async data => {
        console.log('data form. => ', data);
        dispatch(actions.controlLoading(true));

        try {
            const res = await requestApi(`/users/${params.id}`, 'PUT', data);
            console.log('res =>', res);
            // Thêm thông báo đăng nhập thành công
            dispatch(actions.controlLoading(false));
            toast.success('User has been update successfully!', {
                position: 'top-right',
                autoClose: 2000
            });
            // setTimeout(() => navigate('/users'), 3000);
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
                    <h1 className='mt-4'>Update user</h1>
                    <ol className='breadcrumb mb-4'>
                        <li className='breadcrumb-item'>
                            <Link to='/'>Dashboard</Link>
                        </li>
                        <li className='breadcrumb-item'>
                            <Link to='/users'>Users</Link>
                        </li>
                        <li className='breadcrumb-item active'>Update</li>
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
                                                handleSubmitFormUpdate
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

export default UserUpdate;
