import items from "../data/items";

export const getItems = () => {
  return items;
};

export const getItemDetails = (id) => {
  for (let item of items) {
    if (item.name === id) {
      return item;
    }
  }

  console.log("Item not found");
  return null;
};
