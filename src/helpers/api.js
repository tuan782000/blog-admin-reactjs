// // cài đặt axios
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

// Refresh token với Axios Interceptors, JWT Authentication - Duy trì trạng thái đăng nhập
