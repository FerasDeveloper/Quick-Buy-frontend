import { useState } from "react";
import SideBar from "../Components/SideBar";
import { Outlet } from "react-router-dom";

export default function Customer() {
  const [isSidebarrOpen, setOpen] = useState(true);

  return (
    <div
      className="customer"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        height: "100vh",
        background: "#e4e9f7",
      }}
    >
      <SideBar
        isOpen={isSidebarrOpen}
        toggleSidebar={() => setOpen(!isSidebarrOpen)}
      />
      <div className={!isSidebarrOpen ? "open" : ""} id="content-container">
        <Outlet />
      </div>
    </div>
  );
}
