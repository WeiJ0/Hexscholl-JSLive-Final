import * as api from "./helper/api.js";
import * as bootstrap from "bootstrap/js/src/collapse.js";
import validate from "validate.js";
import Aos from "aos";
import { constraints } from "./helper/validate.js";
import { successAlert, errorAlert, productAlert } from "./helper/alert.js";

const productFilter = document.querySelector('#productFilter');
const cartTotal = document.querySelector('#cartTotal');
const cartClearLoading = document.querySelector('#cartClearLoading');

// 商品分類篩選
productFilter.addEventListener('change', (e) => {
    product.filter = e.target.value;
    product.renderProducts();
})

let product = {
    items: [],
    category: [],
    // 目前篩選
    filter: '',
    renderCategories: function () {
        this.category = Array.from(new Set(this.items.map((item) => item.category)));
        this.category.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.innerHTML = item;
            productFilter.appendChild(option);
        })
    },
    renderProducts: function () {
        let productList = document.querySelector('.product__list .row')
        let htmlStr = "";
        let productItems = this.filter ? this.items.filter((item) => item.category === this.filter) : this.items;
        productItems.forEach(item => {
            const { id, category, title, price, origin_price, images } = item;
            htmlStr += `
                        <div class="col-4 col-lg-3 product__item">
                            <div class="product__item__img">
                                <img class="img-fluid" src="${images}" data-id="${id}" alt="${title}" />
                            </div>
                            <div class="product__item__btn d-grid gap-2">
                                <button class="btn btn-black btn-block" data-id="${id}">
                                    加入購物車
                                    <span class="d-none loading spinner-border spinner-border-sm" role="status"></span>
                                </button>
                            </div>
                            <h3 class="product__item__name">${title}</h3>
                            <h5 class="product__item__price-origan">NT$${origin_price}</h5>
                            <h4 class="product__item__price-discount">NT$${price}</h4>
                        </div>
                        `;
        })
        productList.innerHTML = htmlStr;
    },
    eventBind: function () {
        const productItem = document.querySelectorAll('.product__item__img');
        const addCartBtns = document.querySelectorAll('.product__item__btn button');

        productItem.forEach(item => {
            item.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.showDetail(id);
            })
        })

        addCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // 防止連點
                const loading = e.target.querySelector('.loading');
                if (!loading.classList.contains('d-none'))
                    return;

                const id = e.target.dataset.id;
                this.addLoading(id, true);
                cart.add(id);
            })
        })
    },
    showDetail: function (id) {
        productAlert(this.items.find(item => item.id === id))
            .then(result => {
                if (result.isConfirmed) {
                    cart.add(id);
                }
            })
    },
    // 按下加入購物車按鈕時，顯示 loading
    addLoading: function (id, show) {
        const loading = document.querySelector(`[data-id="${id}"] .loading`);

        if (show)
            loading.classList.remove('d-none');
        else
            loading.classList.add('d-none');
    },
    init: function () {
        api.apiGetProduct()
            .then((res) => new Promise((resolve, reject) => {
                const { status, products, message } = res.data;
                if (status) {
                    this.items = products;
                    resolve();
                } else {
                    alert(message);
                    reject();
                }
            }))
            .then(() => {
                this.renderCategories();
                this.renderProducts();
                this.eventBind();
            })
    }
}

let cart = {
    items: [],
    renderCarts: function () {
        let cartList = document.querySelector('.cart__table tbody');
        let htmlStr = "";
        this.items.forEach(item => {
            const { id, quantity, product } = item;
            const { title, price, images } = product;
            htmlStr += `
                        <tr class="cart__item">
                            <td>
                                <div class="d-flex align-items-center">
                                    <img class="cart__item__img img-fluid" src="${images}" alt="${title}" />
                                    <h2 class="cart__item__title">${title}</h2>
                                </div>
                            </td>
                            <td>NT$${price}</td>
                            <td>${quantity}</td>
                            <td>${price * quantity}</td>
                            <td>
                                <a href="#" class="h3 cart__item__remove" data-id="${id}">
                                    <i class="bi bi-x-lg text-black"></i>
                                </a>
                            </td>
                        </tr>
                        `;
        })
        cartList.innerHTML = htmlStr;
    },
    eventBind: function () {
        const clearBtn = document.querySelector('#cartClear');
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // 沒有購物車項目不執行
            if (this.items.length === 0)
                return;

            this.clearLoading(true);
            this.clear();
        })

        const removeBtns = document.querySelectorAll('.cart__item__remove');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = e.target.dataset.id;
                this.remove(id);
                e.stopPropagation();
            })
        })
    },
    init: function () {
        api.apiGetCart()
            .then((res) => new Promise((resolve, reject) => {
                const { status, carts, finalTotal, message } = res.data;
                if (status) {
                    this.items = carts;
                    cartTotal.textContent = finalTotal;
                    resolve();
                } else {
                    alert(message);
                    reject();
                }
            }))
            .then(() => {
                this.renderCarts();
                this.eventBind();
            })
    },
    add: function (id) {
        api.apiAddCart({
            data: {
                productId: id,
                quantity: 1
            }
        }).then((res) => {
            const { status, carts, finalTotal, message } = res.data;
            if (status) {
                this.items = carts;
                cartTotal.textContent = finalTotal;
                this.renderCarts();
                this.eventBind();
                product.addLoading(id, false);
                successAlert('加入購物車成功');
            } else {
                errorAlert(message);
            }
        })
    },
    remove: function (id) {
        api.apiDeleteCart(id).then((res) => {
            const { status, carts, finalTotal, message } = res.data;
            if (status) {
                this.items = carts;
                cartTotal.textContent = finalTotal;
                this.renderCarts();
                this.eventBind();
            } else {
                errorAlert(message);
            }
        })
    },
    clear: function () {
        api.apiClearCart().then((res) => {
            const { status, carts, finalTotal, message } = res.data;
            if (status) {
                this.items = carts;
                cartTotal.textContent = finalTotal;
                this.renderCarts();
                this.clearLoading(false);
            } else {
                errorAlert(message);
            }
        })
    },
    // 按下清空購物車按鈕時，顯示 loading
    clearLoading: function (show) {
        if (show)
            cartClearLoading.classList.remove('d-none');
        else
            cartClearLoading.classList.add('d-none');
    }
}

let form = {
    element: '',
    init: function () {
        this.element = document.querySelector('#form');
        this.element.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitEvent();
        })
    },
    submitEvent: function () {
        const formLoading = document.querySelector('#formLoading');
        if (!formLoading.classList.contains('d-none'))
            return;

        let errors = validate(this.element, constraints);

        if (errors) {
            this.showErrors(errors);
            return;
        }

        this.submitLoading(true);
        const formData = new FormData(this.element);
        const inputObject = Object.fromEntries(formData);

        api.apiAddOrder({
            "data": {
                "user": inputObject
            }
        }).then((res) => {
            const { status, message } = res.data;
            if (status) {
                successAlert('訂單送出成功');
                this.submitLoading(false);
                this.element.reset();
            } else {
                errorAlert(message);
            }
        })
    },
    // 驗證失敗顯示錯誤文字
    showErrors: function (errors) {
        Object.keys(errors).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            input.parentElement.nextElementSibling.textContent = '必填!';
        })
    },
    submitLoading: function (show) {
        const formLoading = document.querySelector('#formLoading');

        if (show)
            formLoading.classList.remove('d-none');
        else
            formLoading.classList.add('d-none');
    }
}

product.init();
cart.init();
form.init();
Aos.init();