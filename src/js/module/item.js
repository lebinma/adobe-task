import items from "../data/items";

//get items from the file
export const getItems = () => {
  return items;
};

//get details of a given item
export const getItemDetails = (id) => {
  for (let item of items) {
    if (item.name === id) {
      return item;
    }
  }

  console.log("Item not found");
  return null;
};
