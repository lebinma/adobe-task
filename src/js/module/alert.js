export const showAlert = (message) => {
  $(".alert").text(message).show().delay(3000).fadeOut();
};
