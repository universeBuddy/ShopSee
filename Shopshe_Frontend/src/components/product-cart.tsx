import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

// this is the comment
type ProductProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handlder: ( cartItem:CartItem) => string | undefined
};
const ProductCard = ({
  productId,
  photo,
  name,
  price,
  stock,
  handlder,
}: ProductProps) => {
 

  return ( 
    <>
      <div className="product-card">
        <img src={`${server}/${photo}`} alt={name} />
        <p>{name}</p>
        <span> ₹ {price}</span>


        <div>
          <button onClick={()=>handlder({productId,price,name,photo,stock,quantity:1} )}><FaPlus /></button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
