import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "./cart-item";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/rediucer-types";

const cartItem = [
  {
    productId: "fdfsfsdff",
    photo: "https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg",
    name: "MacBook",
    quantity: 4,
    stock: 10,
  },
];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
const shippingCharges = 200;
const discount = 400;
const total = subtotal + tax + shippingCharges;

const Cart = () => {


  const {cartItems,subtotal,tax, total,} = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (Math.random() > 0.5) setIsValidCouponCode(true);
      else setIsValidCouponCode(false);
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  return (
    <div className="cart">
      {/* main section */}
      <main>
        {cartItem.length > 0 ? (
          cartItem.map((i, idx) => <CartItem key={idx} cartItem={i} />)
        ) : (
          <h1> No Item Added</h1>
        )}
      </main>
      {/* ------------------------- */}
      <aside>
        <p>Subtotal: {subtotal}</p>
        <p>Shipping Charges: {shippingCharges}</p>
        <p>Tax : {tax}</p>
        <p>
          Discount-<em className="red"> {discount}</em>{" "}
        </p>
        <p>
          <strong>Total : {total}</strong>
        </p>

        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              {" "}
              Rs {discount} off using the <code> {couponCode}</code>{" "}
            </span>
          ) : (
            <span className="red">
              {" "}
              Invalid Coupon <VscError />
            </span>
          ))}

        {cartItem.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
