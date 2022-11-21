import * as api from "./helper/api.js";
import * as bootstrap from "bootstrap/js/src/collapse.js";

import { timestampToTime } from "./helper/date.js";
import { successAlert, errorAlert } from "./helper/alert.js";

const typeFilter = document.querySelector("#typeFilter");
const chartTitle = document.querySelector("#chartTitle");

typeFilter.addEventListener("change", (e) => {
    order.filter = e.target.value;
    order.render(order.filter);

    if (order.filter === 'category')
        chartTitle.textContent = '全產品類別營收比重';
    else
        chartTitle.textContent = '全品項營收比重';
})

let order = {
    data: [],
    filter: '',
    init: function () {
        api.apiGetOrder().then(res => {
            const { status, orders, message } = res.data;

            if (status) {
                this.data = orders;
                this.render('category');
                this.renderTable();
            } else
                errorAlert(message)
        })
    },
    render: function (type = 'category') {
        const products = this.data.map(item => item.products).flat();
        let dataset;

        if (type === 'category') {

            const category = products.map(item => item.category).reduce((acc, cur) => {
                if (acc[cur]) {
                    acc[cur]++;
                } else {
                    acc[cur] = 1;
                }
                return acc;
            }, {});

            dataset = Object.entries(category);

        } else if (type === 'product') {

            // 整理成 [產品名稱 , 產品數量]
            const product = products.map(item => item.title).reduce((acc, cur) => {
                if (acc[cur]) {
                    acc[cur]++;
                } else {
                    acc[cur] = 1;
                }
                return acc;
            }, {});

            // 整理成題目條件，取前三者，後者皆為其他
            dataset = Object.entries(product)
                .sort((a, b) => b[1] - a[1])
                .reduce((acc, cur, index) => {
                    if (index < 3)
                        acc.push(cur);
                    else if (index === 3)
                        acc.push(['其他', cur[1]]);
                    else
                        acc[3][1] += cur[1];

                    return acc;
                }, []);
        }

        this.renderChart(dataset);
    },
    renderChart: function (dataset) {
        c3.generate({
            bindto: '#chart',
            data: {
                columns: dataset,
                type: 'pie',
                labels: true
            },
            bar: {
                width: 50
            },
        });
    },
    renderTable: function () {
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';

        let htmlStr = '';
        this.data.forEach(item => {
            const { id, paid, user, products, createdAt } = item;
            const { name, tel, email, address } = user;
            const productItems = products.map(item => item.title).join('<br>');

            // 切換付款狀態
            const paidSwitch = `<div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" id="paid_${id}" data-id="${id}" ${paid ? "checked" : ""}>
                                    <label class="form-check-label" for="paid_${id}">${paid ? "已付款" : "未付款"}</label>
                                    <span class="d-none loading spinner-border spinner-border-sm" role="status"></span>
                                </div>`;

            // 刪除按鈕
            const delBtn = `<button class="btn btn-danger btn-sm data__remove" data-id="${id}">
                                刪除
                                <span class="d-none loading spinner-border spinner-border-sm" role="status"></span>
                            </button>`;

            htmlStr += `
                <tr>
                    <td>${id}</td>
                    <td>${name} <br/> ${tel}</td>
                    <td>${address}</td>
                    <td>${email}</td>
                    <td>${productItems}</td>
                    <td>${timestampToTime(createdAt)}</td>
                    <td>${paidSwitch}</td>
                    <td>${delBtn}</td>
                </tr>
            `;
        });

        tbody.innerHTML = htmlStr;
        this.eventBind();
    },
    eventBind: function () {
        const delBtn = document.querySelectorAll('.data__remove');
        delBtn.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;

                // 防止連點送出 API
                const loading = e.target.querySelector('.loading');
                if (!loading.classList.contains('d-none'))
                    return;

                this.removeLoading(id, true);
                this.remove(id);
            });
        })

        const paidSwitch = document.querySelectorAll('[role="switch"]');
        paidSwitch.forEach(switchBtn => {
            switchBtn.addEventListener('change', (e) => {
                e.preventDefault();
                const loading = e.target.parentNode.querySelector('.loading');

                if (!loading.classList.contains('d-none'))
                    return;

                const id = e.target.dataset.id;
                const paid = e.target.checked;

                this.update(id, paid);
            });
        })

        const clearBtn = document.querySelector('.data__clear__btn');
        clearBtn.addEventListener('click', () => {
            const loading = document.querySelector('.data__clear__loading');
            if (!loading.classList.contains('d-none'))
                return;

            this.clearLoading(true);
            this.clear();
        })
    },
    update: function (id, paid) {
        api.apiUpdateOrder({
            "data": {
                id,
                paid
            }
        }).then(res => {
            const { status, orders, message } = res.data;
            if (status) {
                this.data = orders;
                this.render('category');
                this.renderTable();
            }
            else
                errorAlert(message);
        })
    },
    updateLoading: function (id, show) {
        const paidSwitch = document.querySelector(`[data-id="${id}"]`);
        const loading = paidSwitch.parentNode.querySelector('.loading');

        if (show)
            loading.classList.remove('d-none');
        else
            loading.classList.add('d-none');
    },
    remove: function (id) {
        api.apiDeleteOrder(id).then(res => {
            const { status, orders, message } = res.data;
            if (status) {
                this.data = orders;
                this.render();
                this.renderTable();
                successAlert('刪除成功');
                this.removeLoading(id, false)
            } else
                errorAlert(message);
        })
    },
    removeLoading: function (id, show) {
        const loading = document.querySelector(`.data__remove[data-id="${id}"] .loading`);

        if (show)
            loading.classList.remove('d-none');
        else
            loading.classList.add('d-none');
    },
    clear: function () {
        api.apiClearOrder().then(res => {
            const { status, orders, message } = res.data;
            if (status) {
                this.data = orders;
                this.render();
                successAlert('清除成功');
                this.clearLoading(false);
            } else
                errorAlert(message)
        })
    },
    clearLoading: function (show) {
        const loading = document.querySelector('#clearLoading');

        if (show)
            loading.classList.remove('d-none');
        else
            loading.classList.add('d-none');
    }
}

order.init();