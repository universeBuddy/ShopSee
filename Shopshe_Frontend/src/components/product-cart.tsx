import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
// this is the comment
type ProductProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handlder: () => void;
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
          <button onClick={()=>handlder()}><FaPlus /></button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
