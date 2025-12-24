import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import "../Shop/css/Shop.css";
import "./css/Reports.css";
import Loading from "../Components/Loading";
import { useNavigate } from "react-router-dom";

const cookie = new Cookies();

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = cookie.get("token");
  const nav = useNavigate();

  useEffect(() => {
    const fetchReports = () => {
      setLoading(true);
      axios
        .get("http://127.0.0.1:8000/api/ShowReportedProducts", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            const sortedReports = res.data.sort((a, b) => b.count - a.count);
            setReports(sortedReports);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching reports:", error);
          setLoading(false);
        });
    };

    fetchReports();
  }, [token]);

  return loading ? (
    <Loading />
  ) : (
    <div className="home">
      <h1 className="text-center mb-4">Reported Products</h1>

      <div className="products-list row gap-3">
        {reports.length > 0 ? (
          reports.map((report, index) => (
            <div
              key={index}
              className="product-item"
              onClick={() => nav(`/product/${report.product.id}`, {
                state: {
                  isAdmin: true,
                }
              })}
            >
              <div className="position-relative">
                <img
                  src={`http://127.0.0.1:8000${report.product.image}`}
                  alt={report.product.name}
                  className="product-image"
                />
              </div>

              <div className="product-details p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <h3
                    className="product-name"
                    style={{
                      fontSize: "calc(.4rem + .9vw)",
                      color: "black",
                      fontWeight: "600",
                    }}
                  >
                    Product name:{" "}
                    <span
                      style={{
                        fontSize: "calc(.4rem + .7vw)",
                        color: "rgba(22, 189, 244, 0.85)",
                        fontWeight: "700",
                      }}
                    >
                      {report.product.name}
                    </span>
                  </h3>
                </div>

                <p className="product-description mt-2" style={{
                      fontSize: "calc(.4rem + .9vw)",
                      color: "black",
                      fontWeight: "600",
                    }}>
                  Reports: {" "}
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {report.count}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-100 td">
            <p className="text-muted">No reported products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
