import { Link } from "react-router-dom";
import ProductCard from "../components/product-cart";

const Home = () => {

  const addToCartHandler =()=>{

  }
  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Product
        <Link to="/search" className="findmore">
          MOre{" "}
        </Link>
      </h1>

      <main>
        <ProductCard productId="afdfdaf" name="macbook" price={200} stock ={10}  handlder={addToCartHandler} photo="https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg" />
        <ProductCard productId="afdfdaf" name="macbook" price={200} stock ={10}  handlder={addToCartHandler} photo="https://m.media-amazon.com/images/I/61ZEQXGTepL._SX679_.jpg" />
        <ProductCard productId="afdfdaf" name="macbook" price={200} stock ={10}  handlder={addToCartHandler} photo="https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg" />

      </main>
    </div>
  );
};

export default Home;
