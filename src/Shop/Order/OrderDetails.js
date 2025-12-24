import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/OrderDetails.css";
import axios from "axios";
import Cookies from "universal-cookie";
import Loading from "../../Components/Loading";

export default function OrderDetails() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cookie = new Cookies();
  const token = cookie.get("token");
  const nav = useNavigate();

  useEffect(() => {
    axios
      .get(`https://quick-buy-x8r3.onrender.com/api/ShowMiniOrders/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log(res.data)

        if (res.data && res.data.length > 0) {
          setProducts(res.data[0]);
        } else {
          setError("No products found in this order");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load order details");
        setLoading(false);
      });
  }, [id, token]);

  const showProduct = (productId) => {
    nav(`/product/${productId}`)
  }

  return loading ? (
    <Loading />
  ) : (
    <div className="order-details-container customerOrderDetails">
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="products-list col-lg-7 col-md-8 col-sm-10 col-12">
          <h2 className="order-title">Order #{id} Products</h2>
          {products.map((product, index) => (
            <div key={index} className="product-item w-100" onClick={() => showProduct(product.product.id)}>
              <span className="product-name">{product.product.name}</span>
              <span className="product-quantity">{product.amount}x</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
