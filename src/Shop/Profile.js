import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { err_m, err_s } from "../Components/Message";
import Cookies from "universal-cookie";
import Loading from "../Components/Loading";
import { FaEye, FaEyeSlash, FaEdit, FaSave } from "react-icons/fa";
import "./css/Profile.css";

export default function Profile() {
  const [allDomain, setAll] = useState("");
  const [showDomainList, setShowDomainList] = useState(false);
  const domainListRef = useRef(null);
  const [profileInfo, setProfileInfo] = useState({
    name: "",
    number: "",
    location: "",
    description: "",
  });
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
    domain: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const cookie = new Cookies();
  const token = cookie.get("token");
  const user_type = cookie.get("user_type");
  let domains;

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/ShowProfile", {
        headers: {
          Authorization: "Bearer " + token,
          user_type: user_type,
        },
      })
      .then((res) => {
        setProfileInfo({
          name: res.data.profileInfo.name,
          number: res.data.profileInfo.number,
          location: res.data.profileInfo.location,
          description: res.data.profileInfo.description,
        });
        setUserInfo({
          username: res.data.userInfo.username,
          email: res.data.userInfo.email,
          password: res.data.userInfo.password,
          domain: res.data.domain["name"],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });

    axios.get("http://127.0.0.1:8000/api/ShowDomains").then((res) => {
      setAll(res.data);
      setLoading(false);
    });
  }, []);

  if (allDomain != "") {
    domains = allDomain.map((ele, index) => (
      <option
        key={index}
        onClick={() => {
          setUserInfo((prev) => ({ ...prev, domain: ele.name }));
          setShowDomainList(false);
        }}
        className="dropdown-item"
      >
        {ele.name}
      </option>
    ));
  }

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
          name: profileInfo.name,
          description: profileInfo.description,
          number: profileInfo.number,
          location: profileInfo.location,
          username: userInfo.username,
          email: userInfo.email,
          password: userInfo.password,
          domain: userInfo.domain,
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
        name: profileResponse.data.profileInfo.name,
        number: profileResponse.data.profileInfo.number,
        location: profileResponse.data.profileInfo.location,
        description: profileResponse.data.profileInfo.description,
      });

      setUserInfo({
        username: profileResponse.data.userInfo.username,
        email: profileResponse.data.userInfo.email,
        password: profileResponse.data.userInfo.password,
        domain: profileResponse.data.domain?.name,
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
          name: res.data.profileInfo.name,
          number: res.data.profileInfo.number,
          location: res.data.profileInfo.location,
          description: res.data.profileInfo.description,
        });
        setUserInfo({
          username: res.data.userInfo.username,
          email: res.data.userInfo.email,
          password: res.data.userInfo.password,
          domain: res.data.domain["name"],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        domainListRef.current &&
        !domainListRef.current.contains(event.target)
      ) {
        setShowDomainList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              <div className="info-item domain-field" ref={domainListRef}>
                <label>Domain</label>
                <div className="domain-input-container">
                  <input
                    name="domain"
                    type="text"
                    value={userInfo.domain}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange(e, "user")}
                    onFocus={() => setShowDomainList(true)}
                  />
                  {isEditing && showDomainList && (
                    <div className="domain-dropdown">
                      {domains && domains.length > 0 ? (
                        domains
                      ) : (
                        <div className="dropdown-item">
                          No domains available
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="separator"></div>

          <div className="profile-section">
            <h2>Store Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <input
                  name="name"
                  type="text"
                  value={profileInfo.name}
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
              <div className="info-item">
                <label>Description</label>
                <input
                  name="description"
                  type="text"
                  value={profileInfo.description}
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
