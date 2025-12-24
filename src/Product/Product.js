import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import Loading from "../Components/Loading";
import "./Product.css";
import { err_m, err_s } from "../Components/Message";
import "react-toastify/dist/ReactToastify.css";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState("");
  const [storeName, setStoreName] = useState("");
  const [reportCount, setReportCount] = useState("");
  const [loading, setLoading] = useState(true);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteConfirmation2, setShowDeleteConfirmation2] = useState(false);
  const location = useLocation();
  const isEditable = location.state?.isEditable || false;
  const isAdmin = location.state?.isAdmin || false;
  const isReportable = location.state?.isReportable || false;
  const [showConfirmation, setshowConfirmation] = useState(false);
  const [showConfirmation2, setshowConfirmation2] = useState(false);
  const modalRef = useRef(null);
  const modalRef2 = useRef(null);
  const [isReported, setIsReported] = useState(false);

  const cookie = new Cookies();
  const token = cookie.get("token");
  const user_type = cookie.get("userType");
  const nav = useNavigate();

  useEffect(() => {
    try {
      axios
        .get(`https://quick-buy-x8r3.onrender.com/api/ShowDetails/${id}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          setProduct(res.data[0]);
          setStoreName(res.data[1]);
          setReportCount(res.data[2]);
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleDelete = async () => {
    try {
      const res = await axios.get(
        `https://quick-buy-x8r3.onrender.com/api/DeleteProduct/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (res.data.message === "Product deleted Successfully.") {
        nav("/shop-page/home");
      } else {
        err_m(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete2 = async () => {
    try {
      const res = await axios.get(
        `https://quick-buy-x8r3.onrender.com/api/DeleteProduct2/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (res.data.message === "Product deleted Succefully.") {
        nav("/admin-page/home");
      } else {
        err_m(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("confirmation-overlay")) {
      setShowDeleteConfirmation(false);
    }
  };

  const handleOverlayClick2 = (e) => {
    if (e.target.classList.contains("confirmation-overlay")) {
      setShowDeleteConfirmation2(false);
    }
  };

  useEffect(() => {
    if (isImageExpanded) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isImageExpanded]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setshowConfirmation(false);
      }
      if (modalRef2.current && !modalRef2.current.contains(event.target)) {
        setshowConfirmation2(false);
      }
    };

    if (showConfirmation) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    if (showConfirmation2) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showConfirmation, showConfirmation2]);

  const confirmSelection = () => {
    setLoading(true);
    setshowConfirmation(false);

    axios
      .get(`https://quick-buy-x8r3.onrender.com/api/Report/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res.data);
        err_s(res.data.message);
        handleIsReported();
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  const confirmSelection2 = () => {
    setLoading(true);
    setshowConfirmation2(false);

    axios
      .get(`https://quick-buy-x8r3.onrender.com/api/DeleteProduct2/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res.data);
        err_s(res.data.message);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  const handleReport = (id) => {
    setshowConfirmation(true);
  };

  useEffect(() => {
    handleIsReported();
  }, []);

  const handleIsReported = async () => {
    const user_type = cookie.get("userType");
    if (user_type === 2) {
      try {
        setLoading(true);
        axios
          .get(`https://quick-buy-x8r3.onrender.com/api/IsReported/${id}`, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((res) => {
            if (res.data.success === "true") {
              setIsReported(true);
            } else {
              setIsReported(false);
            }
            setLoading(false);
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="details-container">
      {isEditable && (
        <button
          className="edit-button"
          onClick={() => nav(`/shop-page/edit-product/${id}`)}
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
      )}

      {isReportable && (
        <>
          {isReported ? (
            <button
              className="edit-button"
              style={{ background: "red", transitionDuration: "0s" }}
              onClick={() => handleReport()}
            >
              <i className="fa-solid fa-thumbs-down"></i>
            </button>
          ) : (
            <button className="edit-button" onClick={() => handleReport()}>
              <i className="fa-solid fa-thumbs-down"></i>
            </button>
          )}
        </>
      )}

      <div className="product-card col-7 p-relative">
        <div
          className="product-image-container"
          onClick={() => setIsImageExpanded(true)}
        >
          <img
            src={`https://quick-buy-x8r3.onrender.com${product.image}`}
            alt={product.name}
            className="product-image"
          />
          <button className="zoom-button">⤡</button>
        </div>

        {isImageExpanded && (
          <div
            className="image-overlay"
            onClick={() => setIsImageExpanded(false)}
          >
            <div className="expanded-image-container">
              <img
                src={`https://quick-buy-x8r3.onrender.com${product.image}`}
                alt={product.name}
                className="expanded-image"
              />
            </div>
          </div>
        )}

        <div className="product-details">
          <div className="product-detail-section">
            <span className="detail-label">Product Name:</span>
            <h1 className="detail-value">{product.name}</h1>
          </div>

          <div className="product-detail-section">
            <span className="detail-label">Description:</span>
            <p className="detail-value">
              {product.description || "No description available"}
            </p>
          </div>

          <div
            className="product-detail-section  text-center"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <span className="detail-label">Price:</span>
              <p className="product-price">${product.price}</p>
            </div>
            {user_type === 1 ? (
              <div>
                <span className="detail-label">Report's Count:</span>
                <p
                  className="detail-value"
                  style={{ color: "#e80618", fontWeight: "bold" }}
                >
                  {reportCount}
                </p>
              </div>
            ) : (
              <div>
                <span className="detail-label">Availability:</span>
                <p
                  className={
                    product.available === "available"
                      ? "availability-in-stock"
                      : "availability-out-of-stock"
                  }
                >
                  {product.available === "available"
                    ? "Available"
                    : "Out of Stock"}
                </p>
              </div>
            )}
          </div>

          <div className="seller-info text-center">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <span className="detail-label">Quantity:</span>
              <p
                className="detail-value"
                style={{ color: "#28a745", fontWeight: "bold" }}
              >
                {product.amount}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <span className="detail-label">Sold by:</span>
              <p
                className="detail-value"
                style={{
                  color: "#0d6efd",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => nav(`/customer-page/store-details/${storeName}`)}
              >
                {storeName}
              </p>
            </div>
          </div>
        </div>

        {isEditable && (
          <button
            className="delete"
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        )}
        {isAdmin && (
          <button
            className="delete"
            onClick={() => setShowDeleteConfirmation2(true)}
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        )}
      </div>

      {showDeleteConfirmation && (
        <div className="confirmation-overlay" onClick={handleOverlayClick}>
          <div className="confirmation-popup">
            <p>Do you want to delete this product?</p>
            <div className="confirmation-buttons">
              <button
                className="confirm-button"
                onClick={() => {
                  handleDelete();
                  setShowDeleteConfirmation(false);
                }}
              >
                Delete
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmation2 && (
        <div className="confirmation-overlay" onClick={handleOverlayClick2}>
          <div className="confirmation-popup">
            <p>Do you want to delete this product?</p>
            <div className="confirmation-buttons">
              <button
                className="confirm-button"
                onClick={() => {
                  handleDelete2();
                  setShowDeleteConfirmation2(false);
                }}
              >
                Delete
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowDeleteConfirmation2(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="modal-content" ref={modalRef}>
            {!isReported && <p>Do you want to Report this product?</p>}
            {isReported && <p>Do you want to Cancel Report this product?</p>}
            <div className="modal-actions">
              {!isReported && (
                <button className="confirm-button" onClick={confirmSelection}>
                  Report
                </button>
              )}
              {isReported && (
                <button className="confirm-button" onClick={confirmSelection}>
                  DisReport
                </button>
              )}
              <button
                className="cancel-btn"
                onClick={() => setshowConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmation2 && (
        <div className="confirmation-modal">
          <div className="modal-content" ref={modalRef2}>
            <p>Do you want to delete this product?</p>
            <div className="modal-actions">
                <button className="confirm-button" onClick={confirmSelection2}>
                  Delete
                </button>
              <button
                className="cancel-btn"
                onClick={() => setshowConfirmation2(false)}
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
