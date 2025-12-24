import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import Loading from "../Components/Loading";
import { err_s, err_m } from "../Components/Message";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const cookie = new Cookies();

export default function AdminHome() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const modalRef = useRef(null);

  const token = cookie.get("token");
  const nav = useNavigate();

  const getStoreColor = (index) => {
    const colors = ["#3498db", "#2ecc71", "#e74c3c", "#9b59b6", "#f1c40f"];
    return colors[index % colors.length];
  };

  const fetchStores = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/ShowAllStores", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.length > 0) {
          setStores(res.data);
        } else {
          setError("No stores found");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch stores");
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleDeleteClick = (storeId, e) => {
    e.stopPropagation();
    setSelectedStoreId(storeId);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    setShowConfirmation(false);
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/api/DeleteStore/${selectedStoreId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.message === "Store deleted Successfully") {
          err_s(res.data.message);
          fetchStores();
        } else err_m(res.data.message);
      })
      .catch((error) => {
        setError("Failed to delete store");
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowConfirmation(false);
      }
    };

    if (showConfirmation) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showConfirmation]);

  return loading ? (
    <Loading />
  ) : (
    <div className="orders-container d-flex align-items-center justify-content-center flex-column">
      <h1 className="orders-title">Stores Management</h1>

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup" ref={modalRef}>
            <p>Do you want to delete this store?</p>
            <div className="confirmation-buttons">
              <button className="confirm-button" onClick={confirmDelete}>
                Delete
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {error ? (
        <div className="no-orders">
          <p>{error}</p>
        </div>
      ) : (
        <div className="orders-list col-lg-6 col-md-7 col-sm-9 col-11">
          {stores.map((store, index) => (
            <div key={store.id} onClick={() => {
              nav(`/admin-page/store-details/${store.name}`,{
                state:{
                  isBlockable: true
                }
              })
            }} className="order-card">
              <button
                className="delete-btn"
                onClick={(e) => handleDeleteClick(store.id, e)}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
              <div className="order-number">
                <span>Store Name: </span>
                <span>{store.name}</span>
              </div>
              <div className="order-details">
                <p className="customer-name">
                  <span>Location: </span>
                  <span style={{ fontWeight: "bold" }}>{store.location}</span>
                </p>
                <div className="store-tag-container mt-2">
                  <span
                    className="store-tag"
                    style={{ backgroundColor: getStoreColor(index) }}
                  >
                    #{index + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
