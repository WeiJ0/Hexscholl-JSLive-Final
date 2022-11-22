# 2022 六角學院 JS 直播班最終主線任務

[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)
[![made-for-VSCode](https://img.shields.io/badge/Made%20for-VSCode-1f425f.svg)](https://code.visualstudio.com/)

## Demo Link
- [Demo](https://weij0.github.io/Hexscholl-JSLive-Final/)

## 相關資源
- [設計稿](https://xd.adobe.com/view/a48b8617-4588-4817-9062-b62130dce916-f1d8/specs/)
- [流程圖](https://whimsical.com/Eg1f7MCzy9UcBJjkpq8TLP)

## 使用相關套件
- [aos](https://michalsnik.github.io/aos/)
- [axios](https://axios-http.com/)
- [sweetalert2](https://sweetalert2.github.io/)
- [validate.js](https://validatejs.org/)

## CSS
- bootstrap scss
- bootstrap icons
- google fonts

## 和以往寫 Code 的不同
這次的程式以物件模式出發，將各個頁面上的操作以物件的方式來做呼叫，換了這個做法之後我覺得開發上可以更直覺一點，可能有一些 function 是會在很多地方用到的，  
例如我可能篩選完某個 category 類別，更新後重新 render，此時如果是之前 `renderProduct()` 獨立寫一個 function 的情形下  
第一天開發可能還可以，但過了幾天回去就要回去找這個 function 我是取什麼名子，  
但透過物件的方式在 vscode 中我可能只要輸入 `product.` 他就會直接跳出所有的屬性，也包含 `render()`
```js
let product = {
    items: [],
    category: [],
    filter: '',
    init: function(){ this.items = api.data },
    render: function(){},
}
```

透過 bootstrap5 來做 `Debounce`， Debounce 詳細介紹可以參考 [Debounce & Throttle — 那些前端開發應該要知道的小事(一)](https://medium.com/@alexian853/debounce-throttle-%E9%82%A3%E4%BA%9B%E5%89%8D%E7%AB%AF%E9%96%8B%E7%99%BC%E6%87%89%E8%A9%B2%E8%A6%81%E7%9F%A5%E9%81%93%E7%9A%84%E5%B0%8F%E4%BA%8B-%E4%B8%80-76a73a8cbc39)  
這次因為是用 bootstrap5 來做 ui framework，所以就直接取用了裡面的 [Spinners + Button](https://getbootstrap.com/docs/5.2/components/spinners/#buttons) 元件  
以送出訂單為例，送出訂單的按鈕如下，裡面也放入了 spinner 
```html
<button type="submit" id="formBtn" class="btn btn-lg btn-black">
  送出預定資料
  <span id="formLoading" class="d-none spinner-border spinner-border-sm" role="status"></span>
</button>
```
預設的 spinner 是加上 `d-none` 不顯示，而當我觸發表單送出時則移除這個 className 讓 loading 效果顯示，也代表著我正在用 API 與後端通訊中，這時候不能做重複送出 API 的動作  
所以在送出表單的事件中最前面加上判斷，如果 spinner 的 className 中不含有 `d-none` 則代表通訊中不能點擊，若有的話才可以送出
```js
const formLoading = document.querySelector('#formLoading');
if (!formLoading.classList.contains('d-none'))
  return;
```
> 這邊其實也是可以使用 attr 加上 `disabled` 來實作
