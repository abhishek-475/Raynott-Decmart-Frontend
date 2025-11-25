export const loadCart = () => JSON.parse(localStorage.getItem('cart') || '[]');
export const saveCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));
export const addToCart = (item) => {
  const cart = loadCart();
  const idx = cart.findIndex(i => i.product === item.product);
  if (idx >= 0) { cart[idx].qty += item.qty; }
  else cart.push(item);
  saveCart(cart);
};
export const clearCart = () => localStorage.removeItem('cart');
