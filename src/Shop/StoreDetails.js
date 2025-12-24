import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import Loading from "../Components/Loading";
import "./css/Profile.css";
import "./css/Shop.css";
import "./css/Following.css";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import { err_s, err_m } from "../Components/Message";

const cookie = new Cookies();

export default function StoreDetails() {
  const { name } = useParams();
  const token = cookie.get("token");
  const user_type = cookie.get("userType");
  const [storeDetails, setStoreDetails] = useState({
    name: "",
    number: "",
    location: "",
    description: "",
    domainId: "",
  });
  const [products, setProducts] = useState([]);
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFollowConfirmation, setShowFollowConfirmation] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://quick-buy-x8r3.onrender.com/api/ShowStoreDetails/${name}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (res.data[0]) {
          setStoreDetails(res.data[0]);
        }
        if (res.data.products) {
          setProducts(res.data.products);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [name, token]);

  useEffect(() => {
    const fetchDomain = async () => {
      if (storeDetails.domainId) {
        try {
          const res = await axios.get(
            `https://quick-buy-x8r3.onrender.com/api/ShowDomain/${storeDetails.domainId}`
          );
          setDomain(res.data.name);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchDomain();
  }, [storeDetails.domainId]);

  const handleFollow = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://quick-buy-x8r3.onrender.com/api/Follow/${storeDetails.id}`,
        { headers: { Authorization: "Bearer " + token } }
      );
      if (response.data.message) {
        setIsFollowing(!isFollowing);
        err_s(response.data.message);
      }
    } catch (error) {
      err_m(error);
      console.error("Follow error:", error);
    } finally {
      setShowFollowConfirmation(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user_type === 2) {
      handleIsFollowed();
    }
  }, []);

  const handleIsFollowed = async () => {
    try {
      setLoading(true);
      axios
        .get(`https://quick-buy-x8r3.onrender.com/api/IsFollowed/${name}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          if (res.data.success === "true") {
            setIsFollowing(true);
          } else {
            setIsFollowing(false);
          }
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div>
      {user_type === 2 && (
        <button
          className={`follow-btn ${isFollowing ? "following" : ""}`}
          onClick={() => setShowFollowConfirmation(true)}
        >
          {isFollowing ? (
            <>
              Following
              <FaUserCheck className="icon" />
            </>
          ) : (
            <>
              Follow
              <FaUserPlus className="icon" />
            </>
          )}
        </button>
      )}

      {showFollowConfirmation && (
        <div
          className="confirmation-overlay"
          onClick={(e) =>
            e.target.classList.contains("confirmation-overlay") &&
            setShowFollowConfirmation(false)
          }
        >
          <div className="confirmation-popup">
            {!isFollowing && <p>Do you want to follow {storeDetails.name}?</p>}
            {isFollowing && <p>Do you want to Unfollow {storeDetails.name}?</p>}
            <div className="confirmation-buttons">
              <button className="confirm-button" onClick={handleFollow}>
                {isFollowing ? "UnFollow" : "Follow"}
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowFollowConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="p-container pt-4 pb-4" style={{ minHeight: "0" }}>
        <div className="profile-container p-2 col-lg-9 col-md-9 col-sm-9">
          <div className="profile-section">
            <h2>Store Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <input
                  name="name"
                  type="text"
                  value={storeDetails.name}
                  readOnly
                />
              </div>
              <div className="info-item">
                <label>Number</label>
                <input
                  name="number"
                  type="number"
                  value={storeDetails.number}
                  readOnly
                />
              </div>
              <div className="info-item">
                <label>Location</label>
                <input
                  name="location"
                  type="text"
                  value={storeDetails.location}
                  readOnly
                />
              </div>
              <div className="info-item">
                <label>Description</label>
                <input
                  name="description"
                  type="text"
                  value={storeDetails.description}
                  readOnly
                />
              </div>
              <div className="info-item">
                <label>Domain</label>
                <input name="domain" type="text" value={domain} readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-list row gap-3 ps-5 pe-5">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={index}
              className="product-item"
              onClick={() =>
                nav(`/product/${product.id}`, {
                  state: {
                    isEditable: false,
                    Order: false,
                  },
                })
              }
            >
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="product-name mt-2">{product.name}</h3>
                {product.price && (
                  <p className="product-price">Price:${product.price}</p>
                )}
              </div>
              {product.description && (
                <p className="product-des">{product.description}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center"></p>
        )}
      </div>
    </div>
  );
}
