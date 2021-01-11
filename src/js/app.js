import $ from "jquery";
import {
  initCart,
  addToCart,
  removeFromCart,
  handleCountChange,
} from "./module/cart";
import { getItems } from "./module/item";

window.$ = $;
window.jQuery = $;

//add event handlers to global for using in template
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.handleCountChange = handleCountChange;

//initialize empty cart
initCart();

//get items from file and show them in DOM. Item name is used as the ID
const items = getItems();

for (let item of items) {
  const el = `
    <div class="item" data-id="${item.name}">
      <span class="item__offer">${item.discount}% off</span>
      <img class="item__image" src=${item.image}>
      <div class="item__footer">
        <h3 class="item__footer-name">${item.name}</h3>
        <div class="item__footer-row">
          <div class="price">
            <span class="price__old">$${item.price.display}</span>
            <span class="price__new">$${item.price.actual}</span>
          </div>
        <button class="add-button button button-primary" onclick="addToCart('${item.name}')">Add to cart</button>
        </div>
      </div>
    </div>`;

  $(".items").append(el);
}
