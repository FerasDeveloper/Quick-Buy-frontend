import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import Loading from "../Components/Loading";
import "../Shop/css/Profile.css";
import "../Shop/css/Shop.css";
import "../Shop/css/Following.css";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import { err_s, err_m } from "../Components/Message";

const cookie = new Cookies();

export default function StoreDetails() {
  const { name } = useParams();
  const token = cookie.get("token");
  const user_type = cookie.get("userType");
  const [storeDetails, setStoreDetails] = useState({
    id: "",
    name: "",
    number: "",
    location: "",
    description: "",
    domainId: "",
  });
  const [showBlockConfirmation, setShowBlockConfirmation] = useState(false);
  const [products, setProducts] = useState([]);
  const [domain, setDomain] = useState("");
  const [productCount, setProductCount] = useState("");
  const [reportCount, setReportCount] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFollowConfirmation, setShowFollowConfirmation] = useState(false);
  const location = useLocation();
  const isBlockable = location.state?.isBlockable || false;
  const [isBlocked, setIsBlocked] = useState(false);
  const [isReporting, setisReporting] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/ShowStoreDetails2/${name}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        if (res.data[0]) {
          setStoreDetails(res.data[0]);
          setProductCount(res.data.productsCount);
          setReportCount(res.data.reportsCount);

          const blockResponse = await axios.get(
            `http://127.0.0.1:8000/api/IsBlocked/${res.data[0].id}`,
            { headers: { Authorization: "Bearer " + token } }
          );
          setIsBlocked(blockResponse.data.success);
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
            `http://127.0.0.1:8000/api/ShowDomain/${storeDetails.domainId}`
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
        `http://127.0.0.1:8000/api/Follow/${storeDetails.id}`,
        { headers: { Authorization: "Bearer " + token } }
      );
      if (response.data.message) {
        setisReporting(!isReporting);
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

  const handleBlockStore = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/Block/${storeDetails.id}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      if (response.data.message) {
        err_s(response.data.message);

        const blockResponse = await axios.get(
          `http://127.0.0.1:8000/api/IsBlocked/${storeDetails.id}`,
          { headers: { Authorization: "Bearer " + token } }
        );
        setIsBlocked(blockResponse.data.success);

        const res = await axios.get(
          `http://127.0.0.1:8000/api/ShowStoreDetails/${name}`,
          { headers: { Authorization: "Bearer " + token } }
        );
        if (res.data[0]) setStoreDetails(res.data[0]);
      }
    } catch (error) {
      err_m(error.response?.data?.message || "Operation failed");
      console.error("Error:", error);
    } finally {
      setShowBlockConfirmation(false);
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
        .get(`http://127.0.0.1:8000/api/IsFollowed/${name}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          if (res.data.success === "true") {
            setisReporting(true);
          } else {
            setisReporting(false);
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
          className={`follow-btn ${isReporting ? "following" : ""}`}
          onClick={() => setShowFollowConfirmation(true)}
        >
          {isReporting ? (
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

      {isBlockable && (
        <button
          className={`floating-block-btn btn ${
            isBlocked ? "btn-success" : "btn-danger"
          }`}
          onClick={() => setShowBlockConfirmation(true)}
        >
          {isBlocked ? "Unblock Store" : "Block Store"}
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
            {!isReporting && <p>Do you want to follow {storeDetails.name}?</p>}
            {isReporting && <p>Do you want to Unfollow {storeDetails.name}?</p>}
            <div className="confirmation-buttons">
              <button className="confirm-button" onClick={handleFollow}>
                {isReporting ? "UnFollow" : "Follow"}
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
              <div className="info-item">
                <label>Product's Count</label>
                <input
                  name="productCount"
                  type="text"
                  value={productCount}
                  readOnly
                />
              </div>
              <div className="info-item">
                <label>Report's Count</label>
                <input
                  name="reportCount"
                  type="text"
                  value={reportCount}
                  readOnly
                />
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
                    isAdmin: true,
                    Order: false,
                  },
                })
              }
            >
              <img
                src={`http://127.0.0.1:8000${product.image}`}
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

      {showBlockConfirmation && (
        <div
          className="confirmation-overlay"
          onClick={(e) =>
            e.target.classList.contains("confirmation-overlay") &&
            setShowBlockConfirmation(false)
          }
        >
          <div className="confirmation-popup">
            <p>
              {isBlocked
                ? `Do you want to unblock ${storeDetails.name}?`
                : `Are you sure you want to block ${storeDetails.name}?`}
            </p>
            <div className="confirmation-buttons">
              <button className="confirm-button" onClick={handleBlockStore}>
                {isBlocked ? "Unblock" : "Block"}
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowBlockConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
