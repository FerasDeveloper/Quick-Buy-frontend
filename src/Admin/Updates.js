import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Cookies from "universal-cookie";
import Loading from "../Components/Loading";
import "./css/Updates.css";
import { err_s, err_m } from "../Components/Message";

const cookie = new Cookies();

export default function Updates() {
  const token = cookie.get("token");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState({
    id: null,
    action: "",
  });
  const modalRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("https://quick-buy-x8r3.onrender.com/api/ShowUpdates", {
        headers: { Authorization: "Bearer " + token },
      });

      if (res.data.length === 0) {
        setErrorMessage("There are no requests");
      } else {
        setStores(
          res.data.map((store) => ({
            ...store,
            domain: store.specificDomain,
          }))
        );
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setErrorMessage("Failed to fetch requests");
      setLoading(false);
    }
  };

  const handleDomainChange = (id, newValue) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === id ? { ...store, domain: newValue } : store
      )
    );
  };

  const handleAction = async () => {
    try {
      setLoading(true);
      const targetStore = stores.find(
        (store) => store.id === selectedRequest.id
      );

      if (selectedRequest.action === "accept") {
        await axios
          .post(
            `https://quick-buy-x8r3.onrender.com/api/AcceptRequest/${selectedRequest.id}`,
            {
              domain: targetStore.domain,
            },
            { headers: { Authorization: "Bearer " + token } }
          )
          .then((res) => {
            console.log(res.data.message);
            if (res.data.message === "Request Accepted Successfully") {
              err_s(res.data.message);
            } else err_m(res.data.message);
          });
      } else {
        await axios
          .get(
            `https://quick-buy-x8r3.onrender.com/api/RejectRequest/${selectedRequest.id}`,
            { headers: { Authorization: "Bearer " + token } }
          )
          .then((res) => {
            console.log(res.data.message);
            if (res.data.message === "Request Rejected Successfully") {
              err_s(res.data.message);
            } else err_m(res.data.message);
          });
      }
      fetchData();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
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

  return loading ? (
    <Loading />
  ) : (
    <div className="updates-container d-flex align-items-center justify-content-center flex-column">
      <h2 className="text-center mt-4">Requests</h2>
      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup" ref={modalRef}>
            <h3>
              Confirm{" "}
              {selectedRequest.action === "accept" ? "Acceptance" : "Rejection"}
            </h3>

            {selectedRequest.action === "accept" && (
              <div className="domain-preview">
                <p>Domain will be set to:</p>
                <code>
                  {stores.find((s) => s.id === selectedRequest.id)?.domain}
                </code>
              </div>
            )}

            <div className="confirmation-buttons">
              <button className="confirm-btn" onClick={handleAction}>
                Confirm
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="cont col-lg-7 col-md-9 col-sm-11 col-12">
        {errorMessage ? (
          <div className="no-requests">
            <p>{errorMessage}</p>
          </div>
        ) : (
          stores.map((request) => (
            <div key={request.id} className="store-card">
              <div className="store-info">
                <p>
                  Name: <span>{request.name}</span>
                </p>
                <p>
                  Description:{" "}
                  <span className="des">{request.description}</span>
                </p>
                <p>
                  Location: <span>{request.location}</span>
                </p>
                <p>
                  Number: <span>{request.number}</span>
                </p>
                <div className="domain-section">
                  <label>Domain:</label>
                  <input
                    type="text"
                    value={request.domain}
                    onChange={(e) =>
                      handleDomainChange(request.id, e.target.value)
                    }
                    placeholder="Enter domain"
                  />
                </div>
              </div>
              <div className="actions">
                <button
                  className="accept-btn"
                  onClick={() => {
                    setSelectedRequest({
                      id: request.id,
                      action: "accept",
                    });
                    setShowConfirmation(true);
                  }}
                >
                  Accept
                </button>
                <button
                  className="reject-btn"
                  onClick={() => {
                    setSelectedRequest({
                      id: request.id,
                      action: "reject",
                    });
                    setShowConfirmation(true);
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
