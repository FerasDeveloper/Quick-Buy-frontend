import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import "./css/Offers.css";
import Loading from "../Components/Loading";
import {err_m} from '../Components/Message'

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [message, setMessage] = useState("");
  const [currentOffer, setCurrentOffer] = useState(null);
  const [hoveredOffer, setHoveredOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [showConfirmation1, setshowConfirmation1] = useState(false);
  const [showConfirmation2, setshowConfirmation2] = useState(false);
  const [showConfirmation3, setshowConfirmation3] = useState(false);
  const modalRef1 = useRef(null);
  const modalRef2 = useRef(null);
  const modalRef3 = useRef(null);

  const cookie = new Cookies();
  const token = cookie.get("token");

  const fetchOffers = () => {
    setLoading(true);
    axios
      .get("https://quick-buy-x8r3.onrender.com/api/ShowOffers", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setMessage(res.data.message);
        if (res.data.message === "choose an offer.") {
          setOffers(res.data[1].slice(0, -1));
        } else {
          setCurrentOffer({
            ...res.data[1],
            postsNumber: res.data[0].postsNumber,
            offerId: res.data[0].offerId,
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  const handleSelectOffer = (id) => {
    setshowConfirmation1(true);
    setSelectedOfferId(id);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const confirmSelection1 = () => {
    setLoading(true);
    setshowConfirmation1(false);

    axios
      .get(`https://quick-buy-x8r3.onrender.com/api/SelectOffer/${selectedOfferId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => {
        fetchOffers();
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  function handleCancel() {
    setshowConfirmation2(true);
  }

  const confirmSelection2 = () => {
    setLoading(true);
    setshowConfirmation2(false);

    axios
      .get("https://quick-buy-x8r3.onrender.com/api/CancelOffer", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        fetchOffers();
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  function handleRecharge() {
    setshowConfirmation3(true);
  }

  const confirmSelection3 = () => {
    setLoading(true);
    setshowConfirmation3(false);

    axios
      .get("https://quick-buy-x8r3.onrender.com/api/RechargeOffer", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if(res.data.message === 'Done.'){
          fetchOffers();
        }
        else{
          err_m(res.data.message)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef1.current && !modalRef1.current.contains(event.target)) {
        setshowConfirmation1(false);
      }
      if (modalRef2.current && !modalRef2.current.contains(event.target)) {
        setshowConfirmation2(false);
      }
      if (modalRef3.current && !modalRef3.current.contains(event.target)) {
        setshowConfirmation3(false);
      }
    };

    if (showConfirmation1) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    if (showConfirmation2) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    if (showConfirmation3) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showConfirmation1, showConfirmation2, showConfirmation3]);
  useEffect(() => {
    if (message !== "") {
      setLoading(false);
    }
  }, [message]);
  return loading ? (
    <Loading />
  ) : (
    <div className="offers-page">
      {showConfirmation1 && (
        <div className="confirmation-modal">
          <div className="modal-content" ref={modalRef1}>
            <p>Do you want to select this offer?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmSelection1}>
                Select
              </button>
              <button
                className="cancel-btn"
                onClick={() => setshowConfirmation1(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirmation2 && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup" ref={modalRef2}>
            <p>Do you want to delete this offer?</p>
            <div className="confirmation-buttons">
              <button
                className="confirm-button"
                onClick={() => {
                  confirmSelection2();
                  setshowConfirmation2(false);
                }}
              >
                Delete
              </button>
              <button
                className="cancel-button"
                onClick={() => setshowConfirmation2(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirmation3 && (
        <div className="confirmation-modal">
          <div className="modal-content" ref={modalRef3}>
            <p>Do you want to select this offer?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmSelection3}>
                Recharge
              </button>
              <button
                className="cancel-btn"
                onClick={() => setshowConfirmation3(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {message === "choose an offer." ? (
        <div className="offers-container">
          <h2 className="section-title mb-5">Select a Special Offer:</h2>
          <div className="row gap-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="offer-card"
                onMouseEnter={() => setHoveredOffer(offer.id)}
                onMouseLeave={() => setHoveredOffer(null)}
              >
                <h3>{offer.name}</h3>
                <div className="offer-details">
                  <div className="d-flex align-items-center justify-content-around w-100">
                    <p className="ps-1">Offer Id: </p>
                    <span>#{offer.id}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-around w-100">
                    <p className="ps-4">Posts Number:</p>
                    <span className="pe-4">{offer.amount}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-around w-100">
                    <p>Price: </p>
                    <span>{offer.price}$</span>
                  </div>
                </div>
                <button
                  className="select-btn"
                  onClick={() => handleSelectOffer(offer.id)}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
          {hoveredOffer && <div className="overlay-blur"></div>}
        </div>
      ) : (
        <div className="current-offer-container">
          {message !== "choose an offer." && (
            <button className="floating-delete-btn" onClick={handleCancel}>
              Cancel Offer
            </button>
          )}

          {/* معلومات العرض الحالي */}
          {currentOffer && (
            <div className="current-offer-card">
              <h2 className="offer-title">{currentOffer.name}</h2>

              <div className="offer-info">
                <div className="info-row">
                  <span>Order Id:</span>
                  <span>#{currentOffer.id}</span>
                </div>
                <div className="info-row">
                  <span>Remaining Posts:</span>
                  <span>{currentOffer.postsNumber}</span>
                </div>
                <div className="info-row">
                  <span>Price:</span>
                  <span>${currentOffer.price}</span>
                </div>
              </div>

              {message === "recharge your offer." && (
                <button className="recharge-btn" onClick={handleRecharge}>
                  <i className="animation"></i>Recharge<i className="animation"></i>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
