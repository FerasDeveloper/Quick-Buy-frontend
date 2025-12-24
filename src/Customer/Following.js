import "../Shop/css/Followers.css";
import Loading from "../Components/Loading";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

export default function Follower() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [followings, setFollowing] = useState([]);

  const cookie = new Cookies();
  const token = cookie.get("token");

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await axios.get(
          "https://quick-buy-x8r3.onrender.com/api/ShowFollowing",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        console.log(response.data)
        if (response.data.success) {
          setFollowing(response.data.data);
          setMessage("");
        } else {
          setMessage("There are no following stores");
        }
      } catch (e) {
        console.log(e);
        setMessage(e);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [token]);

  return loading ? (
    <Loading />
  ) : (
    <div className="followers-container">
      {followings.length > 0 ? (
        <div 
          className="followers-list col-12 col-md-8 col-lg-8 col-sm-10"
          style={{ 
            '--columns': Math.min(Math.max(followings.length, 1), 4) 
          }}
        >
          {followings.map((following, index) => (
            <div key={index} className="follower-card">
              <span className="username">{following.name}</span>
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
