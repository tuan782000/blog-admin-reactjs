import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import avatar from '../assets/img/default.jpg';
import { useDispatch } from 'react-redux';
import * as actions from '../redux/actions';
import requestApi from '../helpers/api';
import { toast } from 'react-toastify';

const Profile = () => {
    const [profileData, setProfileData] = useState({});
    // state quản lý xem ẩn hiện nút update - tránh cho việc chưa load file lên đã nhấn update
    const [isSelectedFile, setIsSelectedFile] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.controlLoading(true));
        requestApi('/users/profile', 'GET')
            .then(res => {
                dispatch(actions.controlLoading(false));
                setProfileData({
                    ...res.data,
                    avatar: import.meta.env.VITE_API_URL + '/' + res.data.avatar
                });
                console.log('res:', res);
            })
            .catch(err => {
                dispatch(actions.controlLoading(false));
                console.log('err:', err);
            });
    }, []);

    const onImageChange = event => {
        if (event.target.files[0]) {
            const file = event.target.files[0]; // Gán tệp đầu tiên được chọn vào biến file

            // Kiểm tra loại file
            // const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            // if (!validImageTypes.includes(file.type)) {
            //     alert('Please upload a valid image file (JPEG, PNG, GIF).');
            //     return;
            // }

            // Kiểm tra kích thước file (giới hạn 5MB)
            // const maxFileSize = 5 * 1024 * 1024; // 5MB
            // if (file.size > maxFileSize) {
            //     alert('File size exceeds the maximum limit of 5MB.');
            //     return;
            // }

            const reader = new FileReader(); // Khởi tạo FileReader

            // Khi đọc tệp xong, cập nhật trạng thái
            reader.onload = e => {
                setProfileData({
                    ...profileData,
                    avatar: e.target.result, // Dữ liệu base64 của ảnh
                    file: file // Tệp gốc
                });
            };

            reader.readAsDataURL(file); // Đọc file dưới dạng Data URL
            setIsSelectedFile(true);
        }
    };

    const handleUpdateAvatar = () => {
        // api của mình yêu gửi lên dạng form data
        // tạo formData
        let formData = new FormData(); // dạng json
        formData.append('avatar', profileData.file); // mình đã thêm cho profileData 1 trường file trong lúc upload ảnh avatar mới - lúc này tận dụng cái file đó đẩy lên

        // thực hiện gửi file này thông qua api
        dispatch(actions.controlLoading(true));
        requestApi(
            '/users/upload-avatar',
            'POST',
            formData,
            'json',
            'multipart/form-data' // chuyển đổi từ 'application/json' sang 'multipart/form-data'  để có thể gửi file
        )
            .then(res => {
                console.log('res =>', res);
                dispatch(actions.controlLoading(false));
                toast.success('Avatar has been uploaded successfully!', {
                    position: 'top-right',
                    autoClose: 2000
                });
            })
            .catch(error => {
                console.log('error =>', error);
                dispatch(actions.controlLoading(false));
            });
    };
    return (
        <div id='layoutSidenav_content'>
            <main>
                <div className='container-fluid px-4'>
                    <h1 className='mt-4'>Profile</h1>
                    <ol className='breadcrumb mb-4'>
                        <li className='breadcrumb-item'>
                            <Link to='/'>Dashboard</Link>
                        </li>
                        <li className='breadcrumb-item active'>Setting</li>
                    </ol>
                    <div className='card mb-4'>
                        <div className='card-body'>
                            <div className='row mb-3'>
                                <div className='col-md-4'>
                                    <img
                                        // src={avatar}
                                        src={
                                            profileData
                                                ? profileData.avatar
                                                : avatar
                                        } // nếu người dùng chưa có avtar trả về từ server sẽ lấy avatar có sẵn trong thư viện hiển thị lên
                                        alt=''
                                        className='img-thumbnail rounded mb-2'
                                    />
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                            // backgroundColor: 'coral'
                                        }}
                                    >
                                        <div className='input-file '>
                                            <label
                                                htmlFor='file'
                                                className='btn-file btn-sm btn btn-primary'
                                            >
                                                Browse Files
                                            </label>
                                            {/* Mình đã dùng css để ẩn inpit này đi rồi - cái mình đang thấy là label - nhờ có htmlFor mà label trỏ đến input */}
                                            <input
                                                type='file'
                                                id='file'
                                                accept='image/*'
                                                onChange={onImageChange}
                                            />
                                        </div>
                                        {isSelectedFile && (
                                            <button
                                                className='btn btn-sm btn-success'
                                                onClick={handleUpdateAvatar}
                                            >
                                                Updated
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
