import "./SideBar.css";
import MyImage from "../Assests/logo.jpg";
import Cookies from "universal-cookie";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

const cookie = new Cookies();
export default function Shop_SideBar({ isOpen, toggleSidebar }) {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user_type = cookie.get("userType");
  const token = cookie.get("token");

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios
        .get("https://quick-buy-x8r3.onrender.com/api/Logout", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          if (res.data.message === "You logged out successfully") {
            navigate("/login");
            cookie.remove("token");
            cookie.remove("userType");
            setLoading(false);
          }
        });
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  return (
    <div id="sidebar" className={isOpen ? "sidebar active" : ""}>
      <div className="logo d-flex align-items-center mb-4">
        <img src={MyImage} alt="" className="img-fluid" />
        <span
          style={{ paddingLeft: "35px", transition: "1s linear all" }}
          className={isOpen ? "text active" : ""}
        >
          Quick Buy
        </span>
      </div>

      <button
        className={isOpen ? "button active" : ""}
        type="button"
        onClick={toggleSidebar}
      >
        <i className="fa-solid fa-arrow-right-to-bracket"></i>
      </button>

      {user_type === 3 ? (
        <NavLink className="link" to="/shop-page/home">
          <div className="icon">
            <i className="fa-solid fa-house"></i>
            <span className={isOpen ? "text active" : ""}>Home</span>
          </div>
        </NavLink>
      ) : user_type === 2 ? (
        <NavLink className="link" to="/customer-page/home">
          <div className="icon">
            <i className="fa-solid fa-house"></i>
            <span className={isOpen ? "text active" : ""}>Home</span>
          </div>
        </NavLink>
      ) : (
        <NavLink className="link" to="/admin-page/home">
          <div className="icon">
            <i className="fa-solid fa-house"></i>
            <span className={isOpen ? "text active" : ""}>Home</span>
          </div>
        </NavLink>
      )}
      {user_type === 3 ? (
        <NavLink className="link" to="/shop-page/profile">
          <div className="icon">
            <i className="fa-solid fa-user"></i>
            <span className={isOpen ? "text active" : ""}>Profile</span>
          </div>
        </NavLink>
      ) : user_type === 2 ? (
        <NavLink className="link" to="/customer-page/profile">
          <div className="icon">
            <i className="fa-solid fa-user"></i>
            <span className={isOpen ? "text active" : ""}>Profile</span>
          </div>
        </NavLink>
      ) : (
        <></>
      )}
      {user_type === 3 ? (
        <NavLink className="link" to="/shop-page/add-product">
          <div className="icon">
            <i className="fa-solid fa-square-plus"></i>
            <span className={isOpen ? "text active" : ""}>New Product</span>
          </div>
        </NavLink>
      ) : user_type === 1 ? (
        <NavLink className="link" to="/admin-page/reports">
          <div className="icon">
            <i className="fa-solid fa-flag"></i>
            <span className={isOpen ? "text active" : ""}>Reports</span>
          </div>
        </NavLink>
      ) : (
        <></>
      )}
      {user_type === 3 ? (
        <NavLink className="link" to="/shop-page/wallet">
          <div className="icon">
            <i className="fa-solid fa-wallet"></i>
            <span className={isOpen ? "text active" : ""}>Wallet</span>
          </div>
        </NavLink>
      ) : (
        <></>
      )}
      {user_type === 3 ? (
        <NavLink className="link" to="/shop-page/offers">
          <div className="icon">
            <i className="fa-solid fa-envelope-open-text"></i>{" "}
            <span className={isOpen ? "text active" : ""}>Offers</span>
          </div>
        </NavLink>
      ) : (
        <div></div>
      )}
      {user_type === 3 ? (
        <NavLink className="link" to="/shop-page/orders">
          <div className="icon">
            <i className="fa-solid fa-folder-open"></i>
            <span className={isOpen ? "text active" : ""}>Orders</span>
          </div>
        </NavLink>
      ) : user_type === 2 ? (
        <NavLink className="link" to="/customer-page/orders">
          <div className="icon">
            <i className="fa-solid fa-folder-open"></i>
            <span className={isOpen ? "text active" : ""}>Orders</span>
          </div>
        </NavLink>
      ) : (
        <div></div>
      )}
      {user_type === 3 ? (
        <NavLink className="link" to="/shop-page/followers">
          <div className="icon">
            <i className="fa-solid fa-users"></i>
            <span className={isOpen ? "text active" : ""}>Followers</span>
          </div>
        </NavLink>
      ) : user_type === 2 ? (
        <NavLink className="link" to="/customer-page/following">
          <div className="icon">
            <i className="fa-solid fa-users"></i>
            <span className={isOpen ? "text active" : ""}>Following</span>
          </div>
        </NavLink>
      ) : (
        <></>
      )}
      {user_type === 1 ? (
        <NavLink className="link" to="/admin-page/updates">
          <div className="icon">
            <i className="fa-solid fa-envelope-open-text"></i>{" "}
            <span className={isOpen ? "text active" : ""}>Updates</span>
          </div>
        </NavLink>
      ) : (
        <div></div>
      )}
      <div
        className="link"
        onClick={handleLogout}
        style={{ cursor: "pointer" }}
      >
        <div className="icon">
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <span className={isOpen ? "text active" : ""}>Logout</span>
        </div>
      </div>
    </div>
  );
}
