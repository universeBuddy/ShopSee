import { Link } from "react-router-dom";
import ProductCard from "../components/product-cart";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import Loader from "../components/loader";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");

  const addToCartHandler = () => {};

  if (isError) {
    toast.error("Cannot Fetch the error");
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
        {isLoading ? (
          <Loader />
        ) : (
          data?.product.map((i) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handlder={addToCartHandler}
              photo={i.photo}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
