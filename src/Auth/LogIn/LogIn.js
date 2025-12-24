import { useState } from "react";
import "./LogIn.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { err_m } from "../../Components/Message";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Loading from '../../Components/Loading'

export default function LogIn() {
  const [logInType, setType] = useState("");
  const [pass, setPass] = useState("");
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);

  const cookie = new Cookies();
  const nav = useNavigate();

  async function Submit(e) {
    e.preventDefault();
    setAccept(true);
    let flag = true;
    if (logInType === "" || pass.length < 5) {
      flag = false;
    }

    if (flag) {
      setLoading(true);
      try {
        const result = await axios
          .post("http://127.0.0.1:8000/api/LogIn", {
            login_type: logInType,
            password: pass,
          })
          .then((response) => {
            if (
              response.status === 200 &&
              response.data.message === "Welcome"
            ) {
              setLoading(false);
              cookie.set("token", response.data.token);
              cookie.set("userType", response.data.data.user_type);
              if (cookie.get("userType") === 2) {
                nav("/customer-page/home");
              } else if (cookie.get("userType") === 3) {
                nav("/shop-page/home");
              } else if (cookie.get("userType") === 1) {
                nav("/admin-page/home");
              }
            } else if (
              response.status === 200 &&
              response.data[0] ===
                "Your Password is incorrect..Please try again"
            ) {
              setLoading(false);
              err_m(response.data[0]);
            } else if(
              response.data.message === 200 &&
              response.data[0] === 'Account does not found'
            ){
              err_m(response.data[0])
            }
            else {
              setLoading(false)
              err_m(response.data.message);
            }
          });
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    }
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return loading ? (
    <Loading/>
  ) : (
    <div>
    <div className="LogInContainer d-flex align-items-center justify-content-center pt-5 pb-5">
      <div className="formm col-lg-6 col-md-6 col-sm-8 col-10 p-4 pt-3 pb-4">
        <h1 className="text-center mt-5 mb-5">LogIn</h1>
        <div className="col-5e">
          <div className="logInType p-0 d-flex align-items-center w-100">
            <input
              type="text"
              placeholder=" "
              value={logInType}
              onChange={(e) => setType(e.target.value)}
            />
            <label>
              <span style={{ transitionDelay: "0ms" }}>U</span>
              <span style={{ transitionDelay: "50ms" }}>s</span>
              <span style={{ transitionDelay: "100ms" }}>e</span>
              <span style={{ transitionDelay: "150ms" }}>r</span>
              <span style={{ transitionDelay: "200ms" }}>n</span>
              <span style={{ transitionDelay: "250ms" }}>a</span>
              <span style={{ transitionDelay: "300ms" }}>m</span>
              <span style={{ transitionDelay: "350ms" }}>e</span>
              <span style={{ transitionDelay: "350ms" }}> </span>
              <span style={{ transitionDelay: "400ms" }}>.</span>
              <span style={{ transitionDelay: "450ms" }}>.</span>
              <span style={{ transitionDelay: "450ms" }}> </span>
              <span style={{ transitionDelay: "500ms" }}>E</span>
              <span style={{ transitionDelay: "550ms" }}>m</span>
              <span style={{ transitionDelay: "600ms" }}>a</span>
              <span style={{ transitionDelay: "650ms" }}>i</span>
              <span style={{ transitionDelay: "700ms" }}>l</span>
            </label>
            <i className="fa-solid fa-id-card ps-1" />
          </div>
          {accept && logInType === "" && (
            <p
              style={{
                color: "#00ffd8",
                position: "absolute",
                top: "80px",
              }}
            >
              Username or Email is required
            </p>
          )}
        </div>

        <div className="col-5e">
          <div className="pass p-0 d-flex align-items-center w-100">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder=" "
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <label>
              <span style={{ transitionDelay: "0ms" }}>P</span>
              <span style={{ transitionDelay: "50ms" }}>a</span>
              <span style={{ transitionDelay: "100ms" }}>s</span>
              <span style={{ transitionDelay: "150ms" }}>s</span>
              <span style={{ transitionDelay: "200ms" }}>w</span>
              <span style={{ transitionDelay: "250ms" }}>o</span>
              <span style={{ transitionDelay: "300ms" }}>r</span>
              <span style={{ transitionDelay: "350ms" }}>d</span>
            </label>
            {pass ? (
              <i
                className={`fa-solid ${
                  isPasswordVisible ? "fa-eye-slash" : "fa-eye"
                } ps-1`}
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <i className="fa-solid fa-key ps-1" />
            )}
          </div>
          {accept && pass === "" && (
            <p
              style={{
                color: "#00ffd8",
                position: "absolute",
                top: "80px",
              }}
            >
              Password is required
            </p>
          )}
        </div>

        <div className="d-flex align-items-center justify-content-center flex-column">
          <button className="mt-5" onClick={(e) => Submit(e)}>
            <span>Submit</span>
          </button>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ fontSize: "12px", fontWeight: "600" }}
          >
            <p className="mt-3 me-2">Don't have account?</p>
            <Link
              to="/register"
              className="link"
              type="submit"
              style={{
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "700",
                color: "#ffffffc4",
              }}
            >
              SignUp
            </Link>
          </div>
        </div>
      </div>
    </div>
    <ToastContainer/>
  </div>
  );
}
