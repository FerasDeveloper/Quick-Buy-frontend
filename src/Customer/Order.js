import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import "../Shop/css/Order.css";
import Loading from "../Components/Loading";
import { useNavigate } from "react-router-dom";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const modalRef = useRef(null);
  const getStoreColor = (index) => {
    const colors = ["#3498db", "#2ecc71", "#e74c3c", "#9b59b6", "#f1c40f"];
    return colors[index % colors.length];
  };

  const cookie = new Cookies();
  const token = cookie.get("token");
  const nav = useNavigate();

  const fetchOrders = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/ShowOrders", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          const sortedOrders = res.data.data.sort(
            (a, b) =>
              new Date(b.order.created_at) - new Date(a.order.created_at)
          );
          setOrders(sortedOrders);
        } else {
          setError("There are no orders now.");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch orders");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteClick = (orderId, e) => {
    e.stopPropagation();
    setSelectedOrderId(orderId);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    setShowConfirmation(false);
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/api/DeleteOrder/${selectedOrderId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => {
        fetchOrders();
      })
      .catch((error) => {
        setError("Failed to delete order");
        console.error(error);
        setLoading(false);
      });
  };

  const showDetails = (productId) => {
    nav(`/customer-page/orderDetails/${productId}`);
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

  const getUniqueStoreNames = (stores) => {
    const uniqueStores = [];
    const seen = new Set();

    stores.forEach((store) => {
      if (!seen.has(store.storeName)) {
        seen.add(store.storeName);
        uniqueStores.push(store.storeName);
      }
    });

    return uniqueStores;
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="orders-container d-flex align-items-center justify-content-center flex-column">
      <h1 className="orders-title">Orders</h1>

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup" ref={modalRef}>
            <p>Do you want to delete this order?</p>
            <div className="confirmation-buttons">
              <button
                className="confirm-button"
                onClick={() => {
                  confirmDelete();
                }}
              >
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
          {orders.map((order, index) => (
            <div
              key={index}
              className="order-card"
              onClick={() => showDetails(order.order.id)}
            >
              <button
                className="delete-btn"
                onClick={(e) => handleDeleteClick(order.order.id, e)}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
              <div className="order-number">
                <span>Order number: </span>
                <span>#{index + 1}</span>
              </div>
              <div className="order-details">
                <p className="customer-name">
                  <span>Stores Count: </span>
                  <span style={{ fontWeight: "bold" }}>
                    {getUniqueStoreNames(order.storesName).length}
                  </span>
                </p>
                <p className="order-status">
                  <span>Stores: </span>
                  <span className="stores">
                    {order.storesName?.length > 0
                      ? getUniqueStoreNames(order.storesName).map(
                          (store, index) => (
                            <span
                              key={index}
                              className="store-tag"
                              style={{
                                backgroundColor: getStoreColor(index),
                              }}
                            >
                              {store}
                            </span>
                          )
                        )
                      : "No stores"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
