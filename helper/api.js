import axios from 'axios';

const token = '0bJiql309keHPOBRt2fQH7YccYQ2';

// 統一路徑前綴
const userRequest = axios.create({
    baseURL: 'https://livejs-api.hexschool.io/api/livejs/v1/customer/weij0/',
    headers: {
        'Content-Type': 'application/json',
    }
})

const adminRequest = axios.create({
    baseURL: 'https://livejs-api.hexschool.io/api/livejs/v1/admin/weij0/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
    }
})

// 產品相關
export const apiGetProduct = data => userRequest.get('/products');

// 購物車
export const apiGetCart = () => userRequest.get('/carts');
export const apiAddCart = data => userRequest.post('/carts', data);
export const apiModifyCart = data => userRequest.patch('/carts', data);
export const apiClearCart = () => userRequest.delete(`/carts/`);
export const apiDeleteCart = id => userRequest.delete(`/carts/${id}`);

// 訂單
export const apiAddOrder = data => userRequest.post('/orders', data);
export const apiGetOrder = () => adminRequest.get('/orders');
export const apiUpdateOrder = data => adminRequest.put('/orders/', data);
export const apiClearOrder = id => adminRequest.delete('/orders');
export const apiDeleteOrder = id => adminRequest.delete(`/orders/${id}`);
