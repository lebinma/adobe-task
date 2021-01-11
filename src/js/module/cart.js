import $ from "jquery";
import { getItemDetails } from "./item";
import { showAlert } from "./alert";

//define basic structure for the cart item
class CartItem {
  constructor(id, details, count) {
    this.id = id;
    this.details = details;
    this.count = count;
  }
}

//initialize cart with empty items
export const initCart = () => {
  const cart = [];
  setCart(cart);
  hideCart();
};

//save cart to session storage
export const setCart = (cart) => {
  sessionStorage.setItem("cart", JSON.stringify(cart));
};

//get cart from session storage
export const getCart = () => {
  const cart = JSON.parse(sessionStorage.getItem("cart"));
  return cart;
};

//hide cart and replace it with "empty" alert
export const hideCart = () => {
  $(".cart__empty").show();
  $(".cart__table").hide();
  $(".cart__price").hide();
};

//show cart with added items
export const showCart = () => {
  $(".cart__empty").hide();
  $(".cart__table").show();
  $(".cart__price").show();
};

//update cart and do the calculations
export const updateCart = () => {
  const cart = getCart();
  const count = cart.length;

  //hide cart if there are no items
  if (cart.length === 0) {
    hideCart();
    return;
  }

  let totalPrice = 0,
    effectivePrice = 0;

  //find total price and effective price
  for (let item of cart) {
    totalPrice += item.details.price.display * item.count;
    effectivePrice += item.details.price.actual * item.count;
  }

  const discount = totalPrice - effectivePrice;

  //update price on DOM
  $(".items-count").text(count);
  $(".cart__price .total .amount").text(`$${totalPrice}`);
  $(".cart__price .discount .amount").text(`-$${discount}`);
  $(".cart__price .type-discount .amount").text(`-$0`);
  $(".cart__price .effective .amount").text(`$${effectivePrice}`);
};

//set count and total price per item on cart
export const setItemPrice = (id, itemPrice, itemCount) => {
  const totalPrice = itemPrice * itemCount;
  const cartItem = $(`.cart-item[data-id="${id}"]`);

  cartItem.find(".cart-item__quantity-input").val(itemCount);
  cartItem.find(".cart-item__price").text(`$${totalPrice}`);
};

//add item to cart
export const addToCart = (id, count) => {
  let cart = getCart();
  let newItem = true;
  let itemCount = count ? count : 1; //initialize with supplied count or 1

  if (cart.length === 0) {
    //show cart if adding item for the first time
    showCart();
  } else {
    //update cart if the item is already there
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

  //if it's a new item, add it to DOM
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

  //save and update cart
  setCart(cart);
  updateCart();
};

//remove item from cart (removeAll = remove all instance of the item)
export const removeFromCart = (id, removeAll) => {
  let cart = getCart();

  for (let i in cart) {
    if (cart[i].id === id) {
      if (removeAll || cart[i].count === 1) {
        //remove all instances if stated or if it's the last instance
        cart.splice(i, 1);
        $(`.cart-item[data-id="${id}"]`).remove();
      } else {
        //reduce item count by one if there are more than one same item
        const itemCount = cart[i].count - 1;
        const itemDetails = getItemDetails(id);
        const itemPrice = itemDetails.price.actual;

        cart[i].count = itemCount;
        setItemPrice(id, itemPrice, itemCount);
      }
    }
  }

  //save and update cart
  setCart(cart);
  updateCart();
};

//handle manual entry of count of items from the cart
export const handleCountChange = (id, count) => {
  const itemCount = parseInt(count);

  //if given 0 or invalid value, remove item
  if (itemCount <= 0) {
    removeFromCart(id, true);
    return;
  }

  //add given count of item to the cart
  addToCart(id, itemCount);
};
