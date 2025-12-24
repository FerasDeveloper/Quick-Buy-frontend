import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import Loading from "../Components/Loading";
import "./css/Wallet.css";

export default function Wallet() {
  const [accountNumber, setAccountnumber] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(true);

  const cookie = new Cookies();
  const token = cookie.get("token");

  useEffect(() => {
    try {
      axios
        .get("https://quick-buy-x8r3.onrender.com/api/ShowWallet", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          setAccountnumber(res.data.accountNumber);
          setBalance(res.data.balance);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

    useEffect(() => {
      if (accountNumber !== "" && balance !== "") {
        setLoading(false);
      }
    }, [accountNumber, balance]);
  return loading ? (
    <Loading />
  ) : (
    <div className="wallet-page p-3">
      <div className="wallet-container p-2 col-md-7 col-sm-8 col-11">
        <div className="row1 w-100 p-1 pb-0 ps-0 pe-0">
          <div className="accountLabel pb-4 pt-3 ps-3 pe-3">Account Number</div>
          <div className="accountValue pb-4 pt-3 pe-3">{accountNumber}</div>
        </div>
        <div className="row2 w-100 p-1 pt-0 ps-0 pe-0">
          <div className="balanceLabel pb-4 pt-3 ps-3 pe-3">
            Account Balance
          </div>
          <div className="balanceValue pb-4 pt-3 pe-3">{balance}$</div>
        </div>
      </div>
      <button
        className="button1"
        onClick={() => window.open("https://wa.me/963981693564", "_blank")}
      >
        Charge
      </button>
    </div>
  );
}
