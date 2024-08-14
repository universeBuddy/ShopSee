import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/store";
import { CartItem } from "../types/types";


type CartItemProps = {
  cartItem: any;
   incrementHandler: (CartItem:CartItem) =>void
  decrementHandler: (cartItem:CartItem)  =>void
  removeHandler: (id:string)  =>void
}

const CartItem = ({ cartItem,incrementHandler,decrementHandler,removeHandler}:CartItemProps) => {
  //

  const { photo, productId, name, price, quantity } = cartItem;
  return (
    <div className="cart-item">
      <img src={`${server}/${photo}`} alt="Product" />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span> Rs 3000{price}</span>
      </article>

      <div>
        <button onClick={()=>incrementHandler(cartItem)}>+</button>
        <p>{quantity}</p>
        <button onClick={()=>decrementHandler(cartItem)}>-</button>
      </div>

      <button onClick={()=>removeHandler(productId)} >
        <FaTrash />
      </button>

    </div>
  );
};

export default CartItem;
