import { useState } from "react";
import ProductCard from "../components/product-cart";
import { useCategoriesQuery } from "../redux/api/productAPI";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";

const Search = () => {
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const addToCartHandler = () => {};

  const isPrevPage = page > 1;
  const isNextPage = page < 4;
  if (isError) {
    toast.error((error as CustomError).data.message);
  }

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          {/* // * Sort Section  */}
          <h4> Sorts</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value=""> None</option>
            <option value="asc"> Price (low to high)</option>
            <option value="dsc"> Price (high to low)</option>
          </select>
        </div>

        {/* //* Range section */}
        <div>
          <h4>Max Price {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={1000000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        {/*  //* category Section */}
        <div>
          <h4> Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value=""> ALL</option>
            {!loadingCategories &&
              categoriesResponse?.categories.map((i) => (
                <option  key = {i} value={i}> {i.toUpperCase()}</option>
              ))}
          </select>
        </div>
      </aside>

      {/*//*    ||\\        //||      ****               ****        ===========        ==========         ============
//*       ||  \\    //  ||     **  **           **     **      ||                 ||                     ||
//*       ||    \\//    ||    **    **        **               ======             ||                     ||
//!       ||            ||   **      **     **                 ||                 =====                  ||
//!       ||            ||    **    **        **               ||                 ||                     ||
//^       ||            ||     **  **           ****           ||                 ||                     ||
//&       ||            ||      ****                **         ||                 ==========             ||
//&                                                     **                          
//&                                                   **    
//&                                                  ** 
//&                                         **     **                  
//&                                            ****                                                                                   */}
      <main>
        <h1> Product</h1>
        <input
          type="text"
          placeholder="Search by name... "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="search-product-list">
          <ProductCard
            productId="afdfdaf"
            name="macbook"
            price={200}
            stock={10}
            handlder={addToCartHandler}
            photo="https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg"
          />
        </div>
        <article>
          <button
            disabled={!isPrevPage}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>
            {" "}
            {page} of {4}
          </span>
          <button
            disabled={!isNextPage}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </article>
      </main>
    </div>
  );
};

export default Search;
