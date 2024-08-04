import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

type CartItemProps = {
  cartItem: any;
};


const CartItem = ({ cartItem }) => {
  //

  const { photo, productId, name, price, quantity } = cartItem;
  return (
    <div className="cart-item">
      <img src={photo} alt="" />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span> Rs 3000{price}</span>
      </article>

      <div>
        <button>+</button>
        <p>{quantity}</p>
        <button>-</button>
      </div>

      <button>
        <FaTrash />
      </button>

    </div>
  );
};

export default CartItem;
