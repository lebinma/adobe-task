import $ from "jquery";
import { getItemDetails } from "./item";
import { showAlert } from "./alert";

class CartItem {
  constructor(id, details, count) {
    this.id = id;
    this.details = details;
    this.count = count;
  }
}

export const initCart = () => {
  const cart = [];
  setCart(cart);
  hideCart();
};

export const setCart = (cart) => {
  sessionStorage.setItem("cart", JSON.stringify(cart));
};

export const getCart = () => {
  const cart = JSON.parse(sessionStorage.getItem("cart"));
  return cart;
};

export const hideCart = () => {
  $(".cart__empty").show();
  $(".cart__table").hide();
  $(".cart__price").hide();
};

export const showCart = () => {
  $(".cart__empty").hide();
  $(".cart__table").show();
  $(".cart__price").show();
};

export const loadCart = () => {
  const cart = getCart();
  const count = cart.length;

  if (cart.length === 0) {
    hideCart();
    return;
  }

  let totalPrice = 0,
    effectivePrice = 0;

  for (let item of cart) {
    totalPrice += item.details.price.display * item.count;
    effectivePrice += item.details.price.actual * item.count;
  }

  const discount = totalPrice - effectivePrice;

  $(".items-count").text(count);
  $(".cart__price .total .amount").text(`$${totalPrice}`);
  $(".cart__price .discount .amount").text(`-$${discount}`);
  $(".cart__price .type-discount .amount").text(`-$0`);
  $(".cart__price .effective .amount").text(`$${effectivePrice}`);
};

export const getItemCount = (id) => {
  const cart = getCart();

  for (let item of cart) {
    if (item.id === id) {
      return item.count;
    }
  }

  return 0;
};

export const setItemPrice = (id, itemPrice, itemCount) => {
  const totalPrice = itemPrice * itemCount;
  const cartItem = $(`.cart-item[data-id="${id}"]`);

  cartItem.find(".cart-item__quantity-input").val(itemCount);
  cartItem.find(".cart-item__price").text(`$${totalPrice}`);
};

export const addToCart = (id, count) => {
  let cart = getCart();
  let newItem = true,
    itemCount = count ? count : 1;

  if (cart.length === 0) {
    showCart();
  } else {
    for (let item of cart) {
      if (item.id === id) {
        itemCount = count ? count : item.count + 1;
        item.count = itemCount;
        newItem = false;
        break;
      }
    }
  }

  const itemDetails = getItemDetails(id);
  const itemPrice = itemDetails.price.actual;

  if (newItem) {
    const cartItem = new CartItem(id, itemDetails, 1);

    cart.push(cartItem);
    showAlert(`${id} is added to cart`);

    const el = `
    <tr class="cart-item" data-id="${id}">
      <td>
          <div class="cart-item__details">
              <img class="cart-item__details-image"
                  src=${itemDetails.image}>
              <span class="cart-item__details-name">
                  ${itemDetails.name}
              </span>
              <span class="cart-item__details-delete" onclick="removeFromCart('${id}', true)">
                  x
              </span>
          </div>
      </td>
      <td>
          <div class="cart-item__quantity">
              <span class="cart-item__quantity-button" onclick="removeFromCart('${id}')">
                  -
              </span>
              <input type="number" class="cart-item__quantity-input" value=${itemCount} onchange=" handleCountChange('${id}', this.value)">
              <span class="cart-item__quantity-button" onclick="addToCart('${id}')">
                  +
              </span>
          </div>
      </td>
      <td class="cart-item__price">
          $${itemPrice}
      </td>
    </tr>`;

    $(".cart__table-items").append(el);
  } else {
    setItemPrice(id, itemPrice, itemCount);
  }

  setCart(cart);
  loadCart();
};

export const removeFromCart = (id, removeAll) => {
  let cart = getCart();

  for (let i in cart) {
    if (cart[i].id === id) {
      if (removeAll || cart[i].count === 1) {
        //remove all instances if stated or if count is 0
        cart.splice(i, 1);
        $(`.cart-item[data-id="${id}"]`).remove();
      } else {
        const itemCount = cart[i].count - 1;
        const itemDetails = getItemDetails(id);
        const itemPrice = itemDetails.price.actual;

        cart[i].count = itemCount;
        setItemPrice(id, itemPrice, itemCount);
      }
    }
  }

  setCart(cart);
  loadCart();
};

export const handleCountChange = (id, count) => {
  const itemCount = parseInt(count);

  if (itemCount <= 0) {
    removeFromCart(id, true);
    return;
  }

  addToCart(id, itemCount);
};
