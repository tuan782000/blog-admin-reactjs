// // cài đặt axios

// version 1

// import axios from 'axios';
// export default function requestApi(
//     endpoint,
//     method,
//     body,
//     responseType = 'json'
// ) {
//     const headers = {
//         Accept: 'application/json',
//         'Content-type': 'application/json',
//         'Access-Control-Allow-Origin': '*'
//     };

//     const instance = axios.create({ headers });

//     return instance.request({
//         method: method,
//         // url: `${process.env.REACT_APP_API_URL}${endpoint}`,
//         url: `${import.meta.env.VITE_API_URL}${endpoint}`,
//         data: body,
//         responseType: responseType
//     });
// }

// version 2

// import axios from 'axios';

// export default function requestApi(
//     endpoint,
//     method,
//     body = null,
//     responseType = 'json'
// ) {
//     const token = localStorage.getItem('access_token');
//     const headers = {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         Authorization: token ? `Bearer ${token}` : ''
//     };

//     const instance = axios.create({
//         baseURL: import.meta.env.VITE_API_URL,
//         headers
//     });

//     const config = {
//         method,
//         url: endpoint,
//         responseType
//     };

//     if (body) {
//         config.data = body; // Chỉ thêm `data` khi body hợp lệ
//     }

//     return instance.request(config);
// }

// Refresh token với Axios Interceptors, JWT Authentication - Duy trì trạng thái đăng nhập

// axios nó sẽ có tính interceptor - nhiệm vụ xử lý các yêu cầu trước khi gửi đi hoặc sau khi nhận phản hồi từ server
// xử lý ngầm
// Tận dụng interceptor này để xử lý cái refreshtoken call api lấy accesstoken mới

// version 3 - set up interceptor làm refreshtoken call api lấy accesstoken mới

import axios from 'axios';

export default function requestApi(
    endpoint,
    method,
    body = null,
    responseType = 'json'
) {
    const token = localStorage.getItem('access_token');
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
    };

    const instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers
    });

    // xử lý riêng cho token
    // phần gửi đi sẽ xử lý ở đây
    // xử lý đính kèm chuỗi token khi mà refresh 1 api private
    instance.interceptors.request.use(
        // callback - tham số nhận vào config
        config => {
            const token = localStorage.getItem('access_token');
            // kiểm tra xem có token hay chưa
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }

            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    // xử lý response nếu như cái access_token hết hạn - thì phải tự động lấy refresh_token để mà cấp access_token mới
    instance.interceptors.response.use(
        // callback - trường hợp không có lỗi gì - access_token còn hạn
        response => {
            return response;
        },

        // access_token hết hạn - call api để xin cấp lại access_token mới dựa vào refresh_token
        async error => {
            const originalConfig = error.config;
            console.log('access_token expired');
            // xử lý khi hết hạn
            if (error.response && error.response.status === 419) {
                try {
                    console.log('Call refresh token api');
                    const result = await instance.post(
                        `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
                        {
                            refresh_token: localStorage.getItem('refresh_token')
                        }
                    );
                    // sau khi gọi thành công trả về 1 cặp access_token và refresh_token mới
                    const { access_token, refresh_token } = result.data; // sau khi nhận mới - bước tiếp theo cập nhật trong localStorage
                    localStorage.setItem('access_token', access_token);
                    localStorage.setItem('refresh_token', refresh_token);

                    // sau đó đính kèm access_token mới vào trong header
                    originalConfig.headers[
                        'Authorization'
                    ] = `Bearer ${access_token}`;

                    return instance(originalConfig);
                } catch (err) {
                    // xử lý trường hợp refresh_token bị lỗi
                    if (err.response && err.response.status === 400) {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        // đá và trang login bắt đăng nhập lại
                        window.location.href = '/login';
                    }

                    return Promise.reject(err);
                }
            }
            return Promise.reject(error);
        }
    );

    const config = {
        method,
        url: endpoint,
        responseType
    };

    if (body) {
        config.data = body; // Chỉ thêm `data` khi body hợp lệ
    }

    return instance.request(config);
}

// version 4

/*
Phiên bản cho react native - sử dụng Asyncstore thay cho localStorage để lưu trữ token và sử dụng useNavigate thay vì  window.location.href để điều hướng

cấu hình lại .env sao cho phù hợp **---- npm install react-native-dotenv ---- **

import { useNavigation } from '@react-navigation/native';  // Import useNavigation from React Navigation

export default async function requestApi(endpoint, method, body = null, responseType = 'json') {
    const token = await AsyncStorage.getItem('access_token');
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
    };

    const instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers
    });

    const navigation = useNavigation();  // Initialize navigation

    instance.interceptors.request.use(
        config => {
            const token = AsyncStorage.getItem('access_token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        response => {
            return response;
        },
        async error => {
            const originalConfig = error.config;
            if (error.response && error.response.status === 419) {  // Token expired
                try {
                    const result = await instance.post(
                        `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
                        {
                            refresh_token: await AsyncStorage.getItem('refresh_token')
                        }
                    );
                    const { access_token, refresh_token } = result.data;
                    await AsyncStorage.setItem('access_token', access_token);
                    await AsyncStorage.setItem('refresh_token', refresh_token);

                    originalConfig.headers['Authorization'] = `Bearer ${access_token}`;
                    return instance(originalConfig);
                } catch (err) {
                    if (err.response && err.response.status === 400) {
                        await AsyncStorage.removeItem('access_token');
                        await AsyncStorage.removeItem('refresh_token');
                        
                        // Instead of window.location.href, use navigation.navigate
                        navigation.navigate('Login');  // Navigate to login screen
                    }
                }
            }
        }
    );

    const config = {
        method,
        url: endpoint,
        responseType
    };

    if (body) {
        config.data = body;
    }

    return instance.request(config);
}
*/
