import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { err_m, err_s } from "../Components/Message";
import Cookies from "universal-cookie";
import Loading from "../Components/Loading";
import { FaEye, FaEyeSlash, FaEdit, FaSave } from "react-icons/fa";
import "../Shop/css/Profile.css";

export default function Profile() {
  const [profileInfo, setProfileInfo] = useState({
    F_name: "", 
    L_name: "",
    number: "",
    location: "",
  });
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const cookie = new Cookies();
  const token = cookie.get("token");
  const user_type = cookie.get("user_type");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/ShowProfile", {
        headers: {
          Authorization: "Bearer " + token,
          user_type: user_type,
        },
      })
      .then((res) => {
        console.log(res.data)
        setProfileInfo({
          F_name: res.data.profileInfo.F_name,
          L_name: res.data.profileInfo.L_name,
          number: res.data.profileInfo.number,
          location: res.data.profileInfo.location,
        });
        setUserInfo({
          username: res.data.userInfo.username,
          email: res.data.userInfo.email,
          password: res.data.userInfo.password,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section === "user") {
      setUserInfo((prev) => ({ ...prev, [name]: value }));
    } else {
      setProfileInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/EditProfile",
        {
          F_name: profileInfo.F_name,
          L_name: profileInfo.L_name,
          number: profileInfo.number,
          location: profileInfo.location,
          username: userInfo.username,
          email: userInfo.email,
          password: userInfo.password,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      // معالجة الاستجابة الناجحة
      if (
        response.data.message === "Success" ||
        response.data.message === "Your request is under review" ||
        response.data.message === "Your request has sent."
      ) {
        err_s(response.data.message);
      } else {
        err_m(response.data.message);
      }

      // تحديث البيانات بعد الحفظ
      const profileResponse = await axios.get(
        "http://127.0.0.1:8000/api/ShowProfile",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setProfileInfo({
        F_name: profileResponse.data.profileInfo.F_name,
        L_name: profileResponse.data.profileInfo.L_name,
        number: profileResponse.data.profileInfo.number,
        location: profileResponse.data.profileInfo.location,
      });

      setUserInfo({
        username: profileResponse.data.userInfo.username,
        email: profileResponse.data.userInfo.email,
        password: profileResponse.data.userInfo.password,
      });

      setIsEditing(false);
    } catch (error) {
      if (error.response) {
        const { data, status } = error.response;

        if (status === 422 && data.errors) {
          const errorMessages = Object.values(data.errors).flat().join("\n");
          err_m(errorMessages);
        } else {
          err_m(data.message || "An error occurred");
          console.error("Server Error:", error);
        }
      } else {
        err_m(error.message || "An unexpected error occurred");
        console.error("Network Error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  function handleCanel() {
    setIsEditing(false);
    axios
      .get("http://127.0.0.1:8000/api/ShowProfile", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setProfileInfo({
          F_name: res.data.profileInfo.F_name,
          L_name: res.data.profileInfo.L_name,
          number: res.data.profileInfo.number,
          location: res.data.profileInfo.location,
        });
        setUserInfo({
          username: res.data.userInfo.username,
          email: res.data.userInfo.email,
          password: res.data.userInfo.password,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }

  return loading ? (
    <Loading />
  ) : (
    <div>
      <div className="p-container pt-4 pb-4">
        <div className="profile-container p-2 col-lg-8 col-md-9 col-sm-9">
          <div className="edit-controls">
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <FaEdit className="me-2" />
                Edit
              </button>
            ) : (
              <div className="d-flex gap-2">
                <button className="save-btn" onClick={handleSave}>
                  <FaSave className="me-2" />
                  Save
                </button>
                <button className="cancel-btn" onClick={handleCanel}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="user-section">
            <h2>User Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Username</label>
                <input
                  name="username"
                  type="text"
                  value={userInfo.username}
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange(e, "user")}
                />
              </div>
              <div className="info-item">
                <label>Email</label>
                <input
                  name="email"
                  type="text"
                  value={userInfo.email}
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange(e, "user")}
                />
              </div>
              <div className="info-item password-field">
                <label>Password</label>
                <div className="password-input-container">
                  <input
                    name="password"
                    className="w-100"
                    type={
                      isEditing ? "text" : showPassword ? "text" : "password"
                    }
                    value={
                      isEditing
                        ? userInfo.password
                        : showPassword
                        ? userInfo.password
                        : "••••••••"
                    }
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange(e, "user")}
                  />
                  {!isEditing && (
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="separator"></div>

          <div className="profile-section">
            <h2>Customer Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>First name</label>
                <input
                  name="F_name"
                  type="text"
                  value={profileInfo.F_name}
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="info-item">
                <label>Last name</label>
                <input
                  name="L_name"
                  type="text"
                  value={profileInfo.L_name}
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="info-item">
                <label>Number</label>
                <input
                  name="number"
                  type="number"
                  value={profileInfo.number}
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="info-item">
                <label>Location</label>
                <input
                  name="location"
                  type="text"
                  value={profileInfo.location}
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
