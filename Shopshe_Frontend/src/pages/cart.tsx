import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../pages/cart-item";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/rediucer-types";
import { CartItem } from "../types/types";
import { addtoCart } from "../redux/reducer/cartReducer";



const Cart = () => {


  const {cartItem,subtotal,tax, total,shippingCharges,discount} = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );


  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);



  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1)

    dispatch(addtoCart({...cartItem,quantity:cartItem.quantity+1}))
  }; 


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
          cartItem.map((i, idx) => <CartItemCard key={idx} cartItem={i} />)
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
