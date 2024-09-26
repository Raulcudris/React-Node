import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";
import "./layout.scss";

function Layout() {
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet/>
      </div>
    </div>
  );
}

function RequiereAuth() {
  const { currentUser  } = useContext(AuthContext);
  return !currentUser ?(
      <Navigate to="/login"/>
    ): (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet/>
      </div>
    </div>
  );
}

export { Layout, RequiereAuth };

