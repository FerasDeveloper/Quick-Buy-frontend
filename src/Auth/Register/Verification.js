import "../Register/Verification.css";
import React, { useRef, useState } from "react";
import axios from 'axios'
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import Loading from '../../Components/Loading';
import { err_m, err_s } from "../../Components/Message";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Verification() {
  const [code, setCodes] = useState(Array(5).fill("")); // Initialize an array of empty strings
  const inputRefs = useRef([]);

  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value.length > 1) {
      e.target.value = value.slice(0, 1);
    }

    const newcode = [...code];
    newcode[index] = e.target.value;
    setCodes(newcode);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const cookie = new Cookies();
  const username = cookie.get('username')

  async function Resend(e) {
    e.preventDefault();
    setLoading(true);
    try{
    const res = await axios.get(
      `https://quick-buy-x8r3.onrender.com/api/ResendCode/${username}`
    )
    .then((response) => {
      if(response.data.message === 'We have sent the code to your email address'){
        setLoading(false);
        err_s(response.data.message)
      }
      
    })
  }
  catch(err){
    setLoading(false);
    console.log(err)
  }
}

  async function Verify(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const combinedCode = Number(code.join(''));
      const res = await axios.post(
        `https://quick-buy-x8r3.onrender.com/api/Check/${username}`, {
          verification_code: combinedCode
        }
      )
      .then((response) => {
        if(response.data.message === 'your email has been verified successfully'){
          setLoading(false);
          err_s(response.data.message);
          if (cookie.get("userType") === 2) {
            nav("/customer-page/home");
          } else if (cookie.get("userType") === 3) {
            nav("/shop-page/home");
          }
        }
        else if(response.data.message === 'the code is wrong, please try again'){
          setLoading(false);
          err_m(response.data.message)
        }
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return loading ? (
    <Loading/>
  ) : (
    <div className="VerificationContainer d-flex align-items-center justify-content-center">
    <div className="form col-lg-6 col-md-6 col-sm-8 col-11 p-4 pt-3 pb-4 text-center">
      <h1>Verification</h1>
      <p>We sent you a verification code. Please enter it here:</p>
      <div className="row text-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="number me-3" key={index}>
            <div className="formm w-100 h-100">
              <input
                className="input"
                type="number"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                value={code[index]}
                onChange={(e) => handleChange(e, index)}
                onFocus={(e) => e.target.select()}
              />
              <span className="input-border"></span>
            </div>
          </div>
        ))}
        <div className="d-flex justify-content-evenly mt-4">
          
          <button className="button" onClick={(e) => Resend(e)}>
            <span className="shadow"></span>
            <span className="edge"></span>
            <div className="front">
              <span>Resend</span>
            </div>
          </button>

          <button className="animated-button" onClick={(e) => Verify(e)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="arr-2"
              viewBox="0 0 24 24"
            >
              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
            </svg>
            <span className="text">V e r i f y</span>
            <span className="circle"></span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="arr-1"
              viewBox="0 0 24 24"
            >
              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <ToastContainer />
  </div>
  );
}
