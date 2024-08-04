import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  return (
    <>
      <div className="login">
        <main>
          <h1 className="heading">Login</h1>
          {/*    // * Gender */}
          <div>
            <label> Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          {/*    // * Date of Birth */}
          <div>
            <label> Date of Birth</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            ></input>
          </div>

          {/*    // * Already SignIn */}
          <div>

            <p> Already Signed In</p>
            <button>
                <FcGoogle /> <span> SignIn with Google</span>
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Login;
