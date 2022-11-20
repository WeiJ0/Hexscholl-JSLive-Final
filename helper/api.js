import axios from 'axios';

const token = '0bJiql309keHPOBRt2fQH7YccYQ2';

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
/*
{
  "data": {
    "productId": "產品 ID (String)",
    "quantity": 5
  }
}
*/
export const apiModifyCart = data => userRequest.patch('/carts', data);
/* 
{
  "data": {
    "id": "購物車 ID (String)",
    "quantity": 6
  }
} 
*/

export const apiClearCart = () => userRequest.delete(`/carts/`);
export const apiDeleteCart = id => userRequest.delete(`/carts/${id}`);
export const apiAddOrder = data => userRequest.post('/orders', data);
/* 
{
  "data": {
    "user": {
      "name": "六角學院",
      "tel": "07-5313506",
      "email": "hexschool@hexschool.com",
      "address": "高雄市六角學院路",
      "payment": "Apple Pay"
    }
  }
}
*/
export const apiGetOrder = () => adminRequest.get('/orders');
export const apiUpdateOrder = data => adminRequest.put('/orders/', data);
/* 
{
  "data": {
    "id": "訂單 ID (String)",
    "paid": true
  }
}
*/

export const apiClearOrder = id => adminRequest.delete('/orders');
export const apiDeleteOrder = id => adminRequest.delete(`/orders/${id}`);
