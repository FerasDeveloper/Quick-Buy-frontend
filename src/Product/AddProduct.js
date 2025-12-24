import { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import "./AddProduct.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { err_m, err_s } from "../Components/Message";
import Loading from "../Components/Loading";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const cookie = new Cookies();
  const token = cookie.get("token");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("amount", amount);
    formData.append("available", "available");
    formData.append("image", image);

    let res = "";
    try {
      res = await axios.post(
        "https://quick-buy-x8r3.onrender.com/api/CreateProduct",
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("data sent" + formData.image);
      console.log("data recived" + res.data );
      if (res.data.message === "Product has added Successfully.") {
        nav("/shop-page/home");
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
          <h2 className="form-title text-start mb-4">New Product</h2>

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
            Add Product
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
