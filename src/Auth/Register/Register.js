import { useState, useRef, useEffect } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { ToastContainer } from "react-toastify";
import { err_m, err_s } from "../../Components/Message";
import "react-toastify/dist/ReactToastify.css";
import Loading from '../../Components/Loading';

export default function Register() {
  const [username, setUsername] = useState("");
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [Rpass, setRpass] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [user, setUser] = useState(2);
  const [S_username, setS_username] = useState("");
  const [S_name, setS_name] = useState("");
  const [S_description, setS_description] = useState("");
  const [S_email, setS_email] = useState("");
  const [S_pass, setS_pass] = useState("");
  const [S_Rpass, setS_Rpass] = useState("");
  const [S_location, setS_location] = useState("");
  const [S_phone, setS_phone] = useState("");
  const [domain, setDomian] = useState("");
  const [allDomain, setAll] = useState("");
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(true);

  const cookie = new Cookies();
  const nav = useNavigate();
  const customerRef = useRef(null);
  const storeRef = useRef(null);
  const customerLabel = useRef(null);
  const storeLabel = useRef(null);

  let domains;

  useEffect(() => {
    axios
      .get("https://quick-buy-x8r3.onrender.com/api/ShowDomains")
      .then((res) => {
        setAll(res.data);
        setLoading(false);
      });
  }, []);

  if (allDomain != "") {
    domains = allDomain.map((ele, index) => (
      <option style={{ background: "gray", color: "white" }} key={index}>
        {ele.name}
      </option>
    ));
  }

  function showStore() {
    setUser(3);
    setAccept(false);
    setUsername("");
    setFname("");
    setLname("");
    setEmail("");
    setPass("");
    setRpass("");
    setPhone("");
    setLocation("");
    if (customerRef.current) {
      customerRef.current.classList.remove("show_Customer");
      customerRef.current.classList.add("hide_Customer");
    }
    if (storeRef.current) {
      storeRef.current.classList.remove("hide_Store");
      storeRef.current.classList.add("show_Store");
    }
    if (customerLabel.current) {
      customerLabel.current.classList.add("hide_Customer");
    }
    if (storeLabel.current) {
      customerLabel.current.classList.remove("show_Customer");
    }
  }

  function showCustomer() {
    setUser(2);
    setAccept(false);
    setS_username("");
    setS_name("");
    setS_description("");
    setS_email("");
    setS_pass("");
    setS_Rpass("");
    setS_location("");
    setS_phone("");
    setDomian("");
    if (storeRef.current) {
      storeRef.current.classList.remove("show_Store");
      storeRef.current.classList.add("hide_Store");
    }
    if (customerRef.current) {
      customerRef.current.classList.remove("hide_Customer");
      customerRef.current.classList.add("show_Customer");
    }
    if (customerLabel.current) {
      customerLabel.current.classList.remove("hide_Customer");
    }
    if (storeLabel.current) {
      customerLabel.current.classList.add("show_Customer");
    }
  }

  // const validateEmail = (e) => {
  //   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return regex.test(e);
  // };

  async function Submit() {
    let flag = true;
    setAccept(true);
    if (user === 2) {
      if (
        username === "" ||
        // email === "" ||
        pass.length === "" ||
        pass !== Rpass
      ) {
        flag = false;
      }
      // if (!validateEmail(email)) {
      //   err_m('Please Enter a Valid Email')
      // }

      if (flag) {
        setLoading(true);
        try {
          const result = await axios.post(
            "https://quick-buy-x8r3.onrender.com/api/CreateCustomer",
            {
              username: username,
              F_name: Fname,
              L_name: Lname,
              email: email,
              password: pass,
              user_type: user,
              number: phone,
              location: location,
            }
          )
          .then((response) => {
            if (
              response.status === 200 &&
              response.data.message === "success"
            ) {
              setLoading(false);
              err_s(response.data.message);
              cookie.set("token", response.data.token);
              cookie.set("userType", response.data.User_data.user_type);
              cookie.set("username", response.data.User_data.username);
              if (cookie.get("userType") !== 1) {
                nav("/verification-page");
              } else {
                nav("/admin-page/all-shopes");
              }
            }
            else{
              err_m('error')
            }
          })
          .catch((e) => {
            err_m(e.response.data.message)
            setLoading(false);
          })
        } catch (err) {
          console.log(err.response.data.message);
        }
      }
    } else if (user === 3) {
      if (
        S_username === "" ||
        S_email === "" ||
        S_name === "" ||
        S_description === "" ||
        S_phone === "" ||
        S_location === "" ||
        S_pass.length === "" ||
        S_pass !== S_Rpass ||
        domain === ""
      ) {
        flag = false;
      }
      // if (!validateEmail(email)) {
      //   err_m('Please Enter a Valid Email')
      // }

      if (flag) {
        setLoading(true);
        try {
          const result = await axios
            .post("https://quick-buy-x8r3.onrender.com/api/CreateStore", {
              username: S_username,
              name: S_name,
              description: S_description,
              email: S_email,
              password: S_pass,
              user_type: user,
              number: S_phone,
              location: S_location,
              domain: domain,
            })
            .then((response) => {
              if (
                response.status === 200 &&
                response.data.message === "success"
              ) {
                setLoading(false);
                err_s(response.data.message);
                cookie.set("token", response.data.token);
                cookie.set("userType", response.data.User_data.user_type);
                cookie.set("username", response.data.User_data.username);
                if (cookie.get("userType") !== 1) {
                  nav("/verification-page");
                } else {
                  nav("/admin-page/all-shopes");
                }
              }
            })
            .catch((e) => {
              err_m(e.response.data.message)
              console.log(e.response.data.message)
              setLoading(false);
            })
        } catch (err) {
          console.log(err.response.data.message);
        }
      }
    }
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRPasswordVisible, setIsRPasswordVisible] = useState(false);
  const [PasswordVisible, setPasswordVisible] = useState(false);
  const [RPasswordVisible, setRPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleRPasswordVisibility = () => {
    setIsRPasswordVisible(!isRPasswordVisible);
  };
  const PasswordVisibility = () => {
    setPasswordVisible(!PasswordVisible);
  };
  const RPasswordVisibility = () => {
    setRPasswordVisible(!RPasswordVisible);
  };

  return loading ? (
    <Loading/>
  ) : (
    <div>
      <div className="RegisterContainer d-flex align-items-center justify-content-center pt-5 pb-5">
        <div className="form col-lg-6 col-md-6 col-sm-8 col-10 p-4 pt-3 pb-4">
          <div className="slide pt-1">
            <span className="customer" onClick={showCustomer}>
              Customer
            </span>
            <span className="store" onClick={showStore}>
              Store
            </span>
          </div>
          <div className="fields d-flex">
            <div ref={customerRef} className="customerPage show_Customer pt-3">
              <h1
                className="text-center CustomerLabel pt-5"
                ref={customerLabel}
              >
                New Customer
              </h1>
              <form className="row d-flex justify-content-between m-0">
                <div className="col-5-5">
                  <div className="username p-0 d-flex align-items-center">
                    <input
                      type="text"
                      placeholder=" "
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                    </label>
                    <i className="fa-solid fa-id-card ps-1" />
                  </div>
                  {accept && username === "" && (
                    <p
                      style={{
                        color: "#00ffd8",
                        position: "absolute",
                        top: "80px",
                      }}
                    >
                      Username is required
                    </p>
                  )}
                </div>

                <div className="col-5-5">
                  <div className="Fname p-0 d-flex align-items-center">
                    <input
                      type="text"
                      placeholder=" "
                      value={Fname}
                      onChange={(e) => setFname(e.target.value)}
                    />
                    <label>
                      <span style={{ transitionDelay: "0ms" }}>F</span>
                      <span style={{ transitionDelay: "50ms" }}>i</span>
                      <span style={{ transitionDelay: "100ms" }}>r</span>
                      <span style={{ transitionDelay: "150ms" }}>s</span>
                      <span style={{ transitionDelay: "200ms" }}>t</span>
                      <span style={{ transitionDelay: "200ms" }}></span>
                      <span style={{ transitionDelay: "250ms" }}>n</span>
                      <span style={{ transitionDelay: "300ms" }}>a</span>
                      <span style={{ transitionDelay: "350ms" }}>m</span>
                      <span style={{ transitionDelay: "400ms" }}>e</span>
                    </label>
                    <i className="fa-solid fa-user ps-1" />
                  </div>
                  {accept && Fname === "" && (
                    <p
                      style={{
                        color: "#00ffd8",
                        position: "absolute",
                        top: "80px",
                      }}
                    >
                      First name is required
                    </p>
                  )}
                </div>

                <div className="col-5-5">
                  <div className="Lname p-0 d-flex align-items-center">
                    <input
                      type="text"
                      placeholder=" "
                      value={Lname}
                      onChange={(e) => setLname(e.target.value)}
                    />
                    <label>
                      <span style={{ transitionDelay: "0ms" }}>L</span>
                      <span style={{ transitionDelay: "50ms" }}>a</span>
                      <span style={{ transitionDelay: "100ms" }}>s</span>
                      <span style={{ transitionDelay: "150ms" }}>t</span>
                      <span style={{ transitionDelay: "150ms" }}></span>
                      <span style={{ transitionDelay: "250ms" }}>n</span>
                      <span style={{ transitionDelay: "300ms" }}>a</span>
                      <span style={{ transitionDelay: "350ms" }}>m</span>
                      <span style={{ transitionDelay: "400ms" }}>e</span>
                    </label>
                    <i className="fa-solid fa-user ps-1" />
                  </div>
                  {accept && Lname === "" && (
                    <p
                      style={{
                        color: "#00ffd8",
                        position: "absolute",
                        top: "80px",
                      }}
                    >
                      Last name is required
                    </p>
                  )}
                </div>

                <div className="col-5-5">
                  <div className="email p-0 d-flex align-items-center">
                    <input
                      type="text"
                      placeholder=" "
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>
                      <span style={{ transitionDelay: "0ms" }}>E</span>
                      <span style={{ transitionDelay: "50ms" }}>m</span>
                      <span style={{ transitionDelay: "100ms" }}>a</span>
                      <span style={{ transitionDelay: "150ms" }}>i</span>
                      <span style={{ transitionDelay: "200ms" }}>l</span>
                    </label>
                    <i className="fa-solid fa-envelope ps-1" />
                  </div>
                  {accept && email === "" && (
                    <p
                      style={{
                        color: "#00ffd8",
                        position: "absolute",
                        top: "80px",
                      }}
                    >
                      Your Email is required
                    </p>
                  )}
                </div>

                <div className="col-5-5">
                  <div className="pass p-0 d-flex align-items-center">
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
                      <span style={{ transitionDelay: "250ms" }}>r</span>
                      <span style={{ transitionDelay: "300ms" }}>d</span>
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
                  {accept && pass.length <=5 && (
                    <p
                      style={{
                        color: "#00ffd8",
                        position: "absolute",
                        top: "80px",
                      }}
                    >
                      Password too short
                    </p>
                  )}
                </div>

                <div className="col-5-5">
                  <div className="Rpass p-0 d-flex align-items-center">
                    <input
                      type={isRPasswordVisible ? "text" : "password"}
                      placeholder=" "
                      value={Rpass}
                      onChange={(e) => setRpass(e.target.value)}
                    />
                    <label>
                      <span style={{ transitionDelay: "0ms" }}>R</span>
                      <span style={{ transitionDelay: "50ms" }}>e</span>
                      <span style={{ transitionDelay: "100ms" }}>p</span>
                      <span style={{ transitionDelay: "150ms" }}>e</span>
                      <span style={{ transitionDelay: "200ms" }}>a</span>
                      <span style={{ transitionDelay: "250ms" }}>t</span>
                      <span style={{ transitionDelay: "300ms" }}></span>
                      <span style={{ transitionDelay: "350ms" }}>P</span>
                      <span style={{ transitionDelay: "400ms" }}>a</span>
                      <span style={{ transitionDelay: "450ms" }}>s</span>
                      <span style={{ transitionDelay: "500ms" }}>s</span>
                      <span style={{ transitionDelay: "550ms" }}>w</span>
                      <span style={{ transitionDelay: "600ms" }}>r</span>
                      <span style={{ transitionDelay: "650ms" }}>d</span>
                    </label>
                    {Rpass ? (
                      <i
                        className={`fa-solid ${
                          isRPasswordVisible ? "fa-eye-slash" : "fa-eye"
                        } ps-1`}
                        onClick={toggleRPasswordVisibility}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <i className="fa-solid fa-key ps-1" />
                    )}
                  </div>
                  {accept && Rpass !== pass && (
                    <p
                      style={{
                        color: "#00ffd8",
                        position: "absolute",
                        top: "80px",
                      }}
                    >
                      Passwords does not match
                    </p>
                  )}
                </div>

                <div className="col-5-5">
                  <div className="phone p-0 d-flex align-items-center">
                    <input
                      type="number"
                      placeholder=" "
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <label>
                      <span style={{ transitionDelay: "0ms" }}>P</span>
                      <span style={{ transitionDelay: "50ms" }}>h</span>
                      <span style={{ transitionDelay: "100ms" }}>o</span>
                      <span style={{ transitionDelay: "150ms" }}>n</span>
                      <span style={{ transitionDelay: "200ms" }}>e</span>
                      <span style={{ transitionDelay: "250ms" }}></span>
                      <span style={{ transitionDelay: "300ms" }}>n</span>
                      <span style={{ transitionDelay: "350ms" }}>u</span>
                      <span style={{ transitionDelay: "400ms" }}>m</span>
                      <span style={{ transitionDelay: "450ms" }}>b</span>
                      <span style={{ transitionDelay: "500ms" }}>e</span>
                      <span style={{ transitionDelay: "550ms" }}>r</span>
                    </label>
                    <i className="fa-solid fa-phone ps-1" />
                  </div>
                  {accept && phone === "" && (
                    <p
                      style={{
                        color: "#00ffd8",
                        position: "absolute",
                        top: "80px",
                      }}
                    >
                      Phone number is required
                    </p>
                  )}
                </div>

                <div className="col-5-5">
                  <div className="location p-0 d-flex align-items-center">
                    <input
                      type="text"
                      placeholder=" "
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <label>
                      <span style={{ transitionDelay: "0ms" }}>L</span>
                      <span style={{ transitionDelay: "50ms" }}>o</span>
                      <span style={{ transitionDelay: "100ms" }}>c</span>
                      <span style={{ transitionDelay: "150ms" }}>a</span>
                      <span style={{ transitionDelay: "200ms" }}>t</span>
                      <span style={{ transitionDelay: "250ms" }}>i</span>
                      <span style={{ transitionDelay: "300ms" }}>o</span>
                      <span style={{ transitionDelay: "350ms" }}>n</span>
                    </label>
                    <i className="fa-solid fa-location-dot ps-1" />
                  </div>
                  {accept && location === "" && (
                    <p
                      style={{
                        color: "#00ffd8",
                        position: "absolute",
                        top: "80px",
                      }}
                    >
                      Location is required
                    </p>
                  )}
                </div>
              </form>
            </div>
            <div ref={storeRef} className="storePage hide_Store">
              <h1 className="text-center StoreLabel pt-5 mt-3" ref={storeLabel}>
                New Store
              </h1>
              <form className="row d-flex justify-content-between m-0">
                <div className="col-5-5">
                  <div className="S_username p-0 d-flex align-items-center">
                    <input
                      type="text"
                      placeholder=" "
                      value={S_username}
                      onChange={(e) => setS_username(e.target.value)}
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
                    </label>
                    <i className="fa-solid fa-id-card ps-1" />
                  </div>
                  {accept && S_username === "" && (
                    <p
                      style={{
                        color: "#00ffd8",
                        position: "absolute",
                        top: "80px",
                      }}
                    >
                      Username is required
                    </p>
                  )}
                </div>

                <div className="col-5-5">
                  <div className="S_name p-0 d-flex align-items-center">
                    <input
                      type="text"
                      placeholder=" "
                      value={S_name}
                      onChange={(e) => setS_name(e.target.value)}
                    />
                    <label>
                      <span style={{ transitionDelay: "0ms" }}>S</span>
                      <span style={{ transitionDelay: "50ms" }}>t</span>
                      <span style={{ transitionDelay: "100ms" }}>o</span>
                      <span style={{ transitionDelay: "150ms" }}>r</span>
                      <span style={{ transitionDelay: "200ms" }}>e</span>
                      <span style={{ transitionDelay: "250ms" }}></span>
                      <span style={{ transitionDelay: "300ms" }}>n</span>
                      <span style={{ transitionDelay: "350ms" }}>a</span>
                      <span style={{ transitionDelay: "400ms" }}>m</span>
                      <span style={{ transitionDelay: "450ms" }}>e</span>
                    </label>
                    <i className="fa-solid fa-signature ps-1" />
                  </div>
                  {accept && S_name === "" && (
                    <p
                      style={{
                        color: "#00ffd8",
                        position: "absolute",
                        top: "80px",
                      }}
                    >
                      Store name is required
                    </p>
                  )}
                </div>

                <div className="col-5-5">
                  <div className="S_description p-0 d-flex align-items-center">
                    <input
                      type="text"
                      placeholder=" "
                      value={S_description}
                      onChange={(e) => setS_description(e.target.value)}
                    />
                    <label>
                      <span style={{ transitionDelay: "0ms" }}>D</span>
                      <span style={{ transitionDelay: "50ms" }}>e</span>
                      <span style={{ transitionDelay: "100ms" }}>s</span>
                      <span style={{ transitionDelay: "150ms" }}>c</span>
                      <span style={{ transitionDelay: "200ms" }}>r</span>
                      <span style={{ transitionDelay: "250ms" }}>i</span>
                      <span style={{ transitionDelay: "300ms" }}>p</span>
                      <span style={{ transitionDelay: "350ms" }}>t</span>
                      <span style={{ transitionDelay: "400ms" }}>i</span>
                      <span style={{ transitionDelay: "450ms" }}>o</span>
                      <span style={{ transitionDelay: "500ms" }}>n</span>
                    </label>
                    <i className="fa-solid fa-file-waveform ps-1" />
                  </div>
                  {accept && S_description === "" && (
                    <p
                      style={{
                        color: "#00ffd8",
                        position: "absolute",
                        top: "80px",
                      }}
                    >
                      Description is required
                    </p>
                  )}
                </div>

                <div className="col-5-5">
                  <div className="S_email p-0 d-flex align-items-center">
                    <input
                      type=""
                      placeholder=" "
                      value={S_email}
                      onChange={(e) => setS_email(e.target.value)}
                    />
                    <label>
                      <span style={{ transitionDelay: "0ms" }}>E</span>
                      <span style={{ transitionDelay: "50ms" }}>m</span>
                      <span style={{ transitionDelay: "100ms" }}>a</span>
                      <span style={{ transitionDelay: "150ms" }}>i</span>
                      <span style={{ transitionDelay: "200ms" }}>l</span>
                    </label>
                    <i className="fa-solid fa-envelope ps-1" />
                  </div>
                  {accept && S_email === "" && (
                    <p
                      style={{
                        color: "#00ffd8",
                        position: "absolute",
                        top: "80px",
                      }}
                    >
                      Your Email is required
                    </p>
                  )}
                </div>

                <div className="col-5-5">
                  <div className="S_pass p-0 d-flex align-items-center">
                    <input
                      type={PasswordVisible ? "text" : "password"}
                      placeholder=" "
                      value={S_pass}
                      onChange={(e) => setS_pass(e.target.value)}
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
                    {S_pass ? (
                      <i
                        className={`fa-solid ${
                          isPasswordVisible ? "fa-eye-slash" : "fa-eye"
                        } ps-1`}
                        onClick={PasswordVisibility}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <i className="fa-solid fa-key ps-1" />
                    )}
                  </div>
                  {accept && S_pass === "" && (
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

                <div className="col-5-5">
                  <div className="S_Rpass p-0 d-flex align-items-center">
                    <input
                      type={RPasswordVisible ? "text" : "password"}
                      placeholder=" "
                      value={S_Rpass}
                      onChange={(e) => setS_Rpass(e.target.value)}
                    />
                    <label>
                      <span style={{ transitionDelay: "0ms" }}>R</span>
                      <span style={{ transitionDelay: "50ms" }}>e</span>
                      <span style={{ transitionDelay: "100ms" }}>p</span>
                      <span style={{ transitionDelay: "150ms" }}>e</span>
                      <span style={{ transitionDelay: "200ms" }}>a</span>
                      <span style={{ transitionDelay: "250ms" }}>t</span>
                      <span style={{ transitionDelay: "300ms" }}></span>
                      <span style={{ transitionDelay: "350ms" }}>P</span>
                      <span style={{ transitionDelay: "400ms" }}>a</span>
                      <span style={{ transitionDelay: "450ms" }}>s</span>
                      <span style={{ transitionDelay: "500ms" }}>s</span>
                      <span style={{ transitionDelay: "550ms" }}>w</span>
                      <span style={{ transitionDelay: "600ms" }}>r</span>
                      <span style={{ transitionDelay: "650ms" }}>d</span>
                    </label>
                    {S_Rpass ? (
                      <i
                        className={`fa-solid ${
                          isPasswordVisible ? "fa-eye-slash" : "fa-eye"
                        } ps-1`}
                        onClick={RPasswordVisibility}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <i className="fa-solid fa-key ps-1" />
                    )}
                  </div>
                  {accept && S_pass !== S_Rpass && (
                    <p
                      style={{
                        color: "#00ffd8",
                        position: "absolute",
                        top: "80px",
                      }}
                    >
                      Passwords does not match
                    </p>
                  )}
                </div>

                <div className="col-5-5">
                  <div className="S_location p-0 d-flex align-items-center">
                    <input
                      type="text"
                      placeholder=" "
                      value={S_location}
                      onChange={(e) => setS_location(e.target.value)}
                    />
                    <label>
                      <span style={{ transitionDelay: "0ms" }}>L</span>
                      <span style={{ transitionDelay: "50ms" }}>o</span>
                      <span style={{ transitionDelay: "100ms" }}>c</span>
                      <span style={{ transitionDelay: "150ms" }}>a</span>
                      <span style={{ transitionDelay: "200ms" }}>t</span>
                      <span style={{ transitionDelay: "250ms" }}>i</span>
                      <span style={{ transitionDelay: "300ms" }}>o</span>
                      <span style={{ transitionDelay: "350ms" }}>n</span>
                    </label>
                    <i className="fa-solid fa-location-dot ps-1" />
                  </div>
                  {accept && S_location === "" && (
                    <p
                      style={{
                        color: "#00ffd8",
                        position: "absolute",
                        top: "80px",
                      }}
                    >
                      Location is required
                    </p>
                  )}
                </div>

                <div className="col-5-5">
                  <div className="S_domain p-0 d-flex align-items-center">
                    <select
                      className="w-100"
                      value={domain}
                      onChange={(e) => setDomian(e.target.value)}
                      style={{
                        color: domains ? "white" : "rgba(255, 255, 255, 0.463)",
                      }}
                    >
                      <option value="" disabled hidden>
                        Select Domain
                      </option>
                      {domains}
                    </select>
                  </div>
                  {accept && domain === "" && (
                    <p
                      style={{
                        color: "#00ffd8",
                        position: "absolute",
                        top: "80px",
                      }}
                    >
                      Domain is required
                    </p>
                  )}
                </div>

                <div className="col-5">
                  <div className="S_phone p-0 d-flex align-items-center w-100">
                    <input
                      type="number"
                      placeholder=" "
                      value={S_phone}
                      onChange={(e) => setS_phone(e.target.value)}
                    />
                    <label>
                      <span style={{ transitionDelay: "0ms" }}>P</span>
                      <span style={{ transitionDelay: "50ms" }}>h</span>
                      <span style={{ transitionDelay: "100ms" }}>o</span>
                      <span style={{ transitionDelay: "150ms" }}>n</span>
                      <span style={{ transitionDelay: "200ms" }}>e</span>
                      <span style={{ transitionDelay: "250ms" }}></span>
                      <span style={{ transitionDelay: "300ms" }}>n</span>
                      <span style={{ transitionDelay: "350ms" }}>u</span>
                      <span style={{ transitionDelay: "400ms" }}>m</span>
                      <span style={{ transitionDelay: "450ms" }}>b</span>
                      <span style={{ transitionDelay: "500ms" }}>e</span>
                      <span style={{ transitionDelay: "550ms" }}>r</span>
                    </label>
                    <i className="fa-solid fa-phone ps-1" />
                  </div>
                  {accept && S_phone === "" && (
                    <p
                      style={{
                        color: "#00ffd8",
                        position: "absolute",
                        top: "80px",
                      }}
                    >
                      Phone number is required
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
          <button className="mt-5" onClick={() => Submit()}>
            <span>Submit</span>
          </button>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ fontSize: "12px", fontWeight: "600" }}
          >
            <p className="mt-3 me-2">already have an account?</p>
            <Link
              to="/login"
              className="link"
              type="submit"
              style={{
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "700",
                color: "#ffffffc4",
              }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
