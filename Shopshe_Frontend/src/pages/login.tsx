import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";

const Login = () => {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");


  const loginHandler = async()=>{

    try {
       const provider = new GoogleAuthProvider();
            
       const {user}=  await signInWithPopup(auth,provider);
       console.log(user)

    } catch (error) {
      toast.error("Sign In Falid ")
    }
  }
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
            <button onClick={loginHandler}>
                <FcGoogle /> <span> SignIn with Google</span>
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Login;
