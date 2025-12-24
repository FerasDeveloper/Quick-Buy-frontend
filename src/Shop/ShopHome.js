import { useEffect, useState, useRef } from "react";
import "./css/Shop.css";
import axios from "axios";
import Loading from "../Components/Loading";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const cookie = new Cookies();
export default function ShopHome() {
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
  const [showAllProducts, setShowAllProducts] = useState(false);

  const token = cookie.get("token");
  const nav = useNavigate();
  const toggleProductsView = (showAll) => {
    setShowAllProducts(showAll);
    setDomain(""); // إعادة تعيين البحث
    setLocation(""); // إعادة تعيين البحث
  };
  useEffect(() => {
    setLoading(true);
    const apiEndpoint = showAllProducts
      ? "https://quick-buy-x8r3.onrender.com/api/ShowProducts"
      : "https://quick-buy-x8r3.onrender.com/api/ShowByOwner";

    axios
      .get(apiEndpoint, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setproducts(res.data[0]);
        setLoading(false);
        console.log(res.data[0]);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [showAllProducts]);

  useEffect(() => {
    const apiEndpoint = showAllProducts
      ? "https://quick-buy-x8r3.onrender.com/api/Search"
      : "https://quick-buy-x8r3.onrender.com/api/SearchInOwnerProduct";

    const searchProducts = async () => {
      try {
        const requestData = showAllProducts ? { domain, location } : { domain };

        const response = await axios.post(apiEndpoint, requestData, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setSearchproducts(response.data[0] || []);
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
          <div
            className={
              showAllProducts ? "InputContainer one" : "InputContainer test1"
            }
          >
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

          {/* Location Input */}
          {showAllProducts && (
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
          )}
          {!showAllProducts && (
            <div className="toggle-container test2">
              <button
                className={`toggle-btn ${!showAllProducts ? "active" : ""}`}
                onClick={() => toggleProductsView(false)}
              >
                My Products
              </button>
              <button
                className={`toggle-btn ${showAllProducts ? "active" : ""}`}
                onClick={() => toggleProductsView(true)}
              >
                All Products
              </button>
            </div>
          )}
        </div>
      </div>

      {/* إضافة زرين التبديل */}
      {showAllProducts && (
        <div className="toggle-container">
          <button
            className={`toggle-btn ${!showAllProducts ? "active" : ""}`}
            onClick={() => toggleProductsView(false)}
          >
            My Products
          </button>
          <button
            className={`toggle-btn ${showAllProducts ? "active" : ""}`}
            onClick={() => toggleProductsView(true)}
          >
            All Products
          </button>
        </div>
      )}

      {/* Products List */}
      <div className="products-list row gap-3">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product, index) => (
            <div
              key={index}
              className="product-item"
              onClick={() =>
                nav(`/product/${product.id}`, {
                  state: {
                    isEditable: !showAllProducts,
                    // isReportable: false,
                    Order: false,
                  },
                })
              }
            > 
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="product-name mt-2">{product.name}</h3>
                {product.price && (
                  <p className="product-price">Price:${product.price}</p>
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
    </div>
  );
}
