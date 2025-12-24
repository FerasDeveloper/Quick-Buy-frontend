import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Shop/css/OrderDetails.css";
import axios from "axios";
import Cookies from "universal-cookie";
import Loading from "../Components/Loading";
import { err_m, err_s } from "../Components/Message";
import "react-toastify/dist/ReactToastify.css";

export default function OrderDetails() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);
  const modalRef = useRef(null);

  const cookie = new Cookies();
  const token = cookie.get("token");
  const nav = useNavigate();

  const fetchOrderDetails = () => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/api/ShowMiniOrders/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setProducts(res.data[0]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to load order details");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id, token]);

  // حذف المنتج
  const handleDeleteClick = (productId, e) => {
    e.stopPropagation();
    setSelectedProduct(productId);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    setShowConfirmation(false);
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/api/DeleteMiniOrder/${selectedProduct}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.message === "Order is Empty.") {
          err_s('Order deleted Successfully.')
          nav("/customer-page/orders");
          setLoading(false);
          setError("No products found in this order");
        } else if (res.data.message === "Order deleted Successfully.") {
          fetchOrderDetails();
          err_s(res.data.message);
        } else {
          err_m(res.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setError("Failed to delete product from order");
        setLoading(false);
      });
  };

  // تعديل الكمية
  const handleEditClick = (product, e) => {
    e.stopPropagation();
    setSelectedProduct(product.product);
    setNewQuantity(product.amount);
    setShowEditModal(true);
  };

  const confirmEdit = () => {
    setShowEditModal(false);
    setLoading(true);
    
    try{
    axios.post(`http://127.0.0.1:8000/api/UpdateMiniOrder/${selectedProduct.id}`, 
      { amount: newQuantity },
      {
        headers: { Authorization: "Bearer " + token }
      }
    )
    .then(res => {
      if(res.data.message === 'Quantity updated successfully'){
        fetchOrderDetails();
        err_s(res.data.message);
      }
      else {
        err_m(res.data.message)
        setLoading(false);
      }
    })
    .catch(error => {
      err_m(error);
      setLoading(false);
    });
  }
  catch(err){
    console.log(err)
  }
  };

  const showProduct = (productId) => {
    nav(`/product/${productId}`,{
      state:{
        isReportable: true
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowConfirmation(false);
        setShowEditModal(false);
      }
    };

    if (showConfirmation || showEditModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showConfirmation, showEditModal]);

  return (
    <div className="order-details-container">
      {/* نافذة تأكيد الحذف */}
      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup" ref={modalRef}>
            <p>Are you sure you want to delete this product from the order?</p>
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

      {/* نافذة تعديل الكمية */}
      {showEditModal && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup" ref={modalRef}>
            <h3>Edit Quantity</h3>
            <div className="edit-quantity">
              <input
                type="number"
                min="1"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
              />
            </div>
            <div className="confirmation-buttonss d-flex justify-content-between">
              <button className="confirm-button" onClick={confirmEdit}>
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

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="products-list col-lg-7 col-md-8 col-sm-10 col-12">
          <h2 className="order-title">Order #{id} Products</h2>
          {products.map((product, index) => (
            <div
              key={index}
              className="product-item w-100"
              data = {product.status}
              onClick={() => console.log(product.status)}
            >
              <span className="product-name">{product.product.name}</span>
              <div className="product-actions">
                <span className="product-quantity">{product.amount}x</span>
                <div className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={(e) => handleEditClick(product, e)}
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    className="delete-btnn"
                    onClick={(e) => handleDeleteClick(product.product.id, e)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}