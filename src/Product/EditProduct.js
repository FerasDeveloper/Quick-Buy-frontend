import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { err_m } from "../Components/Message";
import Loading from "../Components/Loading";
import "./AddProduct.css";

export default function EditProduct() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const cookie = new Cookies();
  const token = cookie.get("token");
  const nav = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/ShowDetails/${id}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const productData = res.data[0];
        setName(productData.name);
        setDescription(productData.description);
        setPrice(productData.price);
        setAmount(productData.amount);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProduct();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("amount", amount);
    formData.append("available", "available");
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/EditProduct/${id}`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.message === "Product Edited Successfully.") {
        nav(`/shop-page/product/${id}`);
      } else {
        err_m(res.data.message);
      }
    } catch (error) {
      err_m(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div>
      <div className="add-product-container">
        <form
          onSubmit={handleSubmit}
          className="product-form p-4 col-lg-8 col-md-10 col-sm-11 col-12"
        >
          <h2 className="form-title text-start mb-4">Edit Product</h2>

          <div className="row">
            <div className="gap-2 d-flex flex-column col-6">
              <label>Product name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="gap-2 d-flex flex-column col-6">
              <label>Price</label>
              <input
                type="number"
                step="0.1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="gap-2 d-flex flex-column col-6">
              <label>Amount</label>
              <input
                type="number"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="gap-2 d-flex flex-column col-6">
              <label>Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="custom-file-input"
              />
            </div>
          </div>

          <div className="gap-2 d-flex flex-column">
            <label>Description</label>
            <textarea
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button variant="primary" type="submit" className="submit-btn">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}