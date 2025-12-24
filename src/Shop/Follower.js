import "./css/Followers.css";
import Loading from "../Components/Loading";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

export default function Follower() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [followers, setFollowers] = useState([]);

  const cookie = new Cookies();
  const token = cookie.get("token");

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/ShowFollowers",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.data.success) {
          setFollowers(response.data.data);
          setMessage("");
        } else {
          setMessage("There are no followers");
        }
      } catch (e) {
        console.log(e);
        setMessage(e);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [token]);

  return loading ? (
    <Loading />
  ) : (
    <div className="followers-container">
      {followers.length > 0 ? (
        <div 
          className="followers-list col-12 col-md-8 col-lg-8 col-sm-10"
          style={{ 
            '--columns': Math.min(Math.max(followers.length, 1), 4) 
          }}
        >
          {followers.map((follower, index) => (
            <div key={index} className="follower-card">
              <span className="username">{follower.username}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-followers">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
