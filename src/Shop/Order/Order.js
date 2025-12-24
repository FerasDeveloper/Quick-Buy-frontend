import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import "../css/Order.css";
import Loading from "../../Components/Loading";
import { useNavigate } from "react-router-dom";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const modalRef = useRef(null);

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
          setOrders(res.data.data);
        } else {
          setError("There are no orders now.");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch orders");
        console.log(error)
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

  const showDetails = (orderId) => {
    nav(`/shop-page/orderDetails/${orderId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowConfirmation(false);
      }
    };

    if (showConfirmation || showEditModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showConfirmation, showEditModal]);

  const handleEditClick = (orderId, currentStatus, e) => {
    e.stopPropagation();
    setSelectedOrderId(orderId);
    setSelectedStatus(currentStatus);
    setShowEditModal(true);
  };

  const confirmEditStatus = () => {
    setShowEditModal(false);
    setLoading(true);
    axios
      .post(
        `http://127.0.0.1:8000/api/EditOrder/${selectedOrderId}`,
        { status: selectedStatus },
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then(() => {
        fetchOrders();
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to update order status");
        setLoading(false);
      });
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

{showEditModal && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup" ref={modalRef}>
            <h3>Update Order Status</h3>
            <div className="status-options">
              {["Not Received", "Pending", "Received"].map((status) => (
                <label key={status} className="status-label">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={selectedStatus === status}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  />
                  <span className={`status-text ${status.toLowerCase()}`}>
                    {status}
                  </span>
                </label>
              ))}
            </div>
            <div className="confirmation-buttons">
              <button className="confirm-button" onClick={confirmEditStatus}>
                Update
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowEditModal(false)}
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
              onClick={() => showDetails(order.order.orderId)}
            >
              <div className="action-buttons">
                <button
                  className="edit-btn"
                  onClick={(e) => handleEditClick(order.order.id, order.order.status, e)}
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button
                  className="delete-btn"
                  onClick={(e) => handleDeleteClick(order.order.id, e)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
              <div className="order-number">
                <span>Order number: </span>
                <span>#{index + 1}</span>
              </div>
              <div className="order-details">
                <p className="customer-name pb-1">
                  <span>Customer name: </span>
                  <span>{order.customerName}</span>
                </p>
                <p
                  className={`order-status ${order.order.status.toLowerCase()}`}
                >
                  <span>Status: </span>
                  <span>{order.order.status}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
