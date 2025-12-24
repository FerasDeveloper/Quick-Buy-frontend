import "./App.css";
import { Route, Routes } from "react-router-dom";
import Register from "./Auth/Register/Register";
import LogIn from "./Auth/LogIn/LogIn";
import Verification from "./Auth/Register/Verification";
import ShopHome from "./Shop/ShopHome";
import Customer from "./Customer/Customer";
import CustomerHome from "./Customer/CustomerHome";
import Shop from "./Shop/Shop";
import Product from "./Product/Product";
import Profile from "./Shop/Profile";
import Profile2 from "./Customer/Profile";
import EditProduct from "./Product/EditProduct";
import AddProduct from "./Product/AddProduct";
import Wallet from "./Shop/Wallet";
import Order from "./Shop/Order/Order";
import Order2 from "./Customer/Order";
import OrderDetails from "./Shop/Order/OrderDetails";
import OrderDetails2 from "./Customer/OrderDetails";
import StoreDetails from "./Shop/StoreDetails";
import Follower from "./Shop/Follower";
import Following from "./Customer/Following";
import Admin from "./Admin/Admin";
import AdminHome from "./Admin/AdminHome";
import AdminStoreDetails from "./Admin/StoreDetails";
import Reports from "./Admin/Reports";
import Updates from "./Admin/Updates";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Offers from "./Shop/Offers";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/verification-page" element={<Verification />} />
        <Route path="/shop-page" element={<Shop />}>
          <Route path="home" element={<ShopHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="offers" element={<Offers />} />
          <Route path="orders" element={<Order />} />
          <Route path="orderDetails/:id" element={<OrderDetails />} />
          <Route path="followers" element={<Follower />} />
        </Route>
        <Route path="/product/:id" element={<Product />} />
        <Route path="/customer-page" element={<Customer />}>
          <Route path="home" element={<CustomerHome />} />
          <Route path="profile" element={<Profile2 />} />
          <Route path="orders" element={<Order2 />} />
          <Route path="orderDetails/:id" element={<OrderDetails2 />} />
          <Route path="store-details/:name" element={<StoreDetails />} />
          <Route path="following" element={<Following />} />
        </Route>
        <Route path="/admin-page" element={<Admin />}>
          <Route path="home" element={<AdminHome />} />
          <Route path="store-details/:name" element={<AdminStoreDetails />} />
          <Route path="reports" element={<Reports />} />
          <Route path="updates" element={<Updates />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
