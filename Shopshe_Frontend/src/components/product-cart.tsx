import { FaPlus } from "react-icons/fa";
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
  const server = "dummyServer";

  return (
    <>
      <div className="product-card">
        <img src={photo} alt={name} />
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
