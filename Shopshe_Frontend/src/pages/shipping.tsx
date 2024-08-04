import { ChangeEvent, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";


const Shipping = () => {

  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { 
    setShippingInfo((prev) => ({ ...prev, [e.target.name] : e.target.value }));
  };

  return ( 
    <div className="shipping">
      <button className="back-btn" onClick={()=> navigate("/cart")}>
        <BiArrowBack />
      </button>

      <form>
        <h1>Shipong Address</h1>
        <input
          required
          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />

        <input
          required
          type="text"
          placeholder="city"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
        />

        <input
          required
          type="text"
          placeholder="state"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
        />

        <select
          required
          name="country"
          value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value=" ">Choose Country</option>
          <option value="in">India</option>
          <option value="in">U.S.A</option>
        </select>

        <input
          required
          type="number"
          placeholder="pin code"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />
        <button type="button">Pay Now</button>
      </form>
    </div>
  );
};

export default Shipping;
