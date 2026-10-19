const deliveryPrice = 30000;
const freeDeliveryFrom = 50000;
const save10MinSubtotal = 20000;
const save10Percent = 10;

function assertValidQuantity(quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new RangeError('Количество должно быть целым числом не меньше 1');
  }
}

function assertInStock(quantity, stock) {
  if (quantity > stock) {
    throw new RangeError(`Недостаточно товара на складе. Доступно: ${stock}`);
  }
}

function addToCart(cart, product, quantity) {
  assertValidQuantity(quantity);

  const existingItem = cart.find((item) => item.id === product.id);
  const newQuantity = (existingItem ? existingItem.quantity : 0) + quantity;
  assertInStock(newQuantity, product.stock);

  if (existingItem) {
    return cart.map((item) => (item.id === product.id ? { ...item, quantity: newQuantity } : item));
  }
  
  return [...cart, { ...product, quantity }];
}

function changeQuantity(cart, productId, quantity) {
  assertValidQuantity(quantity);

  const existingItem = cart.find((item) => item.id === productId);
  if (!existingItem) return [...cart];

  assertInStock(quantity, existingItem.stock);
  return cart.map((item) => (item.id === productId ? { ...item, quantity } : item));
}

function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

function calculateCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateOrderTotal(cart, promoCode) {
  const subtotal = calculateCartSubtotal(cart);
  const code = String(promoCode || '').trim().toUpperCase();

  const discount = code === 'SAVE10' && subtotal >= save10MinSubtotal
    ? Math.round((subtotal * save10Percent) / 100)
    : 0;
  const delivery = subtotal === 0 || subtotal >= freeDeliveryFrom ? 0 : deliveryPrice;

  return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}

const cartApi = { addToCart, changeQuantity, removeFromCart, calculateCartSubtotal, calculateOrderTotal };

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;