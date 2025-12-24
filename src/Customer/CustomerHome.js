import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Loading from "../Components/Loading";
import Cookies from "universal-cookie";
import { err_m, err_s } from "../Components/Message";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./css/Home.css";

const cookie = new Cookies();
export default function CustomerHome() {
  const [domain, setDomain] = useState("");
  const [location, setLocation] = useState("");
  const [hasText1, setHasText1] = useState(false);
  const [hasText2, setHasText2] = useState(false);
  const [allDomains, setAllDomains] = useState("");
  const [allLocations, setAllLocations] = useState("");
  const [showDomainList, setShowDomainList] = useState(false);
  const [showLocationList, setShowLocationList] = useState(false);
  const domainListRef = useRef(null);
  const locationListRef = useRef(null);
  const [products, setproducts] = useState([]);
  const [Searchproducts, setSearchproducts] = useState([]);
  const hasSearchCriteria = domain || location;
  const [loading, setLoading] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(true);
  const [isOrderMode, setIsOrderMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [quantities, setQuantities] = useState({});

  const token = cookie.get("token");
  const nav = useNavigate();
  const toggleProductsView = (showAll) => {
    setShowAllProducts(showAll);
    setDomain("");
    setLocation("");
  };
  useEffect(() => {
    setLoading(true);
    const apiEndpoint = showAllProducts
      ? "https://quick-buy-x8r3.onrender.com/api/ShowProducts"
      : "https://quick-buy-x8r3.onrender.com/api/ShowFollowingProducts";

    axios
      .get(apiEndpoint, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        if (showAllProducts) {
          setproducts(res.data[0]);
        } else {
          setproducts(res.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [showAllProducts]);

  useEffect(() => {
    const apiEndpoint = showAllProducts
      ? "https://quick-buy-x8r3.onrender.com/api/Search"
      : "https://quick-buy-x8r3.onrender.com/api/SearchInFollowingProduct";

    const searchProducts = async () => {
      try {
        const requestData = { domain, location };

        const response = await axios.post(apiEndpoint, requestData, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (showAllProducts) setSearchproducts(response.data[0] || []);
        else setSearchproducts(response.data || []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchproducts([]);
      }
    };

    if (hasSearchCriteria) {
      searchProducts();
    } else {
      setSearchproducts([]);
    }
  }, [domain, location, token, hasSearchCriteria, showAllProducts]);

  useEffect(() => {
    setHasText1(domain !== "");
    if (domain !== "") {
      axios
        .post(
          "https://quick-buy-x8r3.onrender.com/api/SearchInDomains",
          { letters: domain },
          { headers: { Authorization: "Bearer " + token } }
        )
        .then((res) => {
          setAllDomains(res.data[0]);
          setShowDomainList(true);
        })
        .catch((error) => {
          console.error("Domain search error:", error);
        });
    } else {
      setShowDomainList(false);
    }
  }, [domain, token]);

  // Location search logic
  useEffect(() => {
    setHasText2(location !== "");
    if (location !== "") {
      axios
        .post(
          "https://quick-buy-x8r3.onrender.com/api/SearchInLocations",
          { letters: location },
          { headers: { Authorization: "Bearer " + token } }
        )
        .then((res) => {
          setAllLocations(res.data[0]);
          setShowLocationList(true);
        })
        .catch((error) => {
          console.error("Location search error:", error);
        });
    } else {
      setShowLocationList(false);
    }
  }, [location, token]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        domainListRef.current &&
        !domainListRef.current.contains(event.target)
      ) {
        setShowDomainList(false);
      }
      if (
        locationListRef.current &&
        !locationListRef.current.contains(event.target)
      ) {
        setShowLocationList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Domain and location delete handlers
  const deleteDomain = (e) => {
    e.preventDefault();
    setDomain("");
  };

  const deleteLocation = (e) => {
    e.preventDefault();
    setLocation("");
  };

  function handleCancel() {
    setIsOrderMode(false);
  }

  const handleOrderClick = async () => {
    if (!isOrderMode) {
      setIsOrderMode(true);
    } else {
      try {
        const orderProducts = Object.entries(selectedItems)
          .filter(([id, selected]) => selected)
          .map(([id]) => {
            const product = displayedProducts.find((p) => p.id == id);
            return {
              amount: quantities[id] || 1,
              storeId: product.storeId,
              productId: product.id,
            };
          });

        if (orderProducts.length === 0) {
          alert("Please select at least one item");
          return;
        }
        setLoading(true);
        const response = await axios.post(
          "https://quick-buy-x8r3.onrender.com/api/CreateOrder",
          { products: orderProducts },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.data.message) {
          err_s("Order submitted successfully");
          setIsOrderMode(false);
          setSelectedItems({});
          setQuantities({});
          setLoading(false);
        }
      } catch (error) {
        console.error("Order submission error:", error);
        err_m(error.message);
      }
    }
  };

  const handleQuantityChange = (productId, value) => {
    const numValue = Math.max(1, parseInt(value) || 1);
    setQuantities((prev) => ({
      ...prev,
      [productId]: numValue,
    }));
  };

  const toggleItemSelection = (productId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Generate domain and location suggestions
  const domainNames = Array.isArray(allDomains)
    ? allDomains.map((ele) => ele.name)
    : [];
  const locationNames = Array.isArray(allLocations)
    ? allLocations.map((ele) => ele.location)
    : [];
  const displayedProducts = hasSearchCriteria ? Searchproducts : products;

  return loading ? (
    <Loading />
  ) : (
    <div className="home">
      <div className="top-bar d-flex justify-content-between">
        <div className="searchLine d-flex w-100 align-items-center">
          {/* Domain Input */}
          <div className="InputContainer one">
            <input
              placeholder="Domain"
              className="input"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              type="text"
            />
            <p
              className={hasText1 ? "d-block delete_button" : "d-none"}
              onClick={deleteDomain}
            >
              ×
            </p>
            {showDomainList && (
              <div className="domain-list" ref={domainListRef}>
                {domainNames.map((name, index) => (
                  <span
                    key={index}
                    className="domain-item"
                    onClick={() => setDomain(name)}
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="InputContainer two">
            <input
              placeholder="Location"
              className="input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              type="text"
            />
            <p
              className={hasText2 ? "d-block delete_button" : "d-none"}
              onClick={deleteLocation}
            >
              ×
            </p>
            {showLocationList && (
              <div className="domain-list" ref={locationListRef}>
                {locationNames.map((name, index) => (
                  <span
                    key={index}
                    className="domain-item"
                    onClick={() => setLocation(name)}
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="toggle-container">
        <button
          className={`toggle-btn ${showAllProducts ? "active" : ""}`}
          onClick={() => toggleProductsView(true)}
        >
          All Products
        </button>
        <button
          className={`toggle-btn ${!showAllProducts ? "active" : ""}`}
          onClick={() => toggleProductsView(false)}
        >
          Following
        </button>
        <div
          className={`button ${isOrderMode ? "active" : ""}`}
          onClick={handleOrderClick}
        >
          <div className="button-wrapper">
            <div className="text">{isOrderMode ? "Submit" : "Order"}</div>
            <span className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="2em"
                height="2em"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"
                ></path>
              </svg>
            </span>
          </div>
        </div>

        {isOrderMode && (
          <button className="cancel btn" onClick={handleCancel}>
            <span>Cancel</span>
          </button>
        )}
      </div>

      {/* Products List */}
      <div className="products-list row gap-3">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product, index) => (
            <div
              key={index}
              className={`product-item ${
                selectedItems[product.id] ? "selected" : ""
              }`}
              onClick={() => {
                if (!isOrderMode) {
                  nav(`/product/${product.id}`, {
                    state: {
                      isEditable: !showAllProducts,
                      isReportable: true,
                      Order: false,
                    },
                  });
                }
                else{
                  isOrderMode && toggleItemSelection(product.id)
                }
              }}
            >
              {isOrderMode && (
                <div className="order-controls">
                  <input
                    type="number"
                    min="1"
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(product.id, e.target.value)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                  <input
                    type="checkbox"
                    checked={!!selectedItems[product.id]}
                    onChange={() => toggleItemSelection(product.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="product-name mt-2">{product.name}</h3>
                {product.price && (
                  <p className="product-price">Price:{product.price}$</p>
                )}
              </div>
              {product.description && (
                <p className="product-des">{product.description}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center">
            {hasSearchCriteria ? "No results found" : "No products available"}
          </p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
