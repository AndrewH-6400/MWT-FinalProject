import React from "react";
import { Link } from "react-router-dom";
import "../stylesheets/NavBar.css";

const NavBar = () => {
    // Check if user is logged in based on token stored in local storage
    const isLoggedIn = localStorage.getItem("token") !== null;
    const handleLogout = () => {
        // Clear the token from local storage upon logout
        localStorage.removeItem("token");
        // Redirect user to the login page or perform any other action upon logout
        window.location.href = "/";
    };
    return (
        <nav>
            <div className="nav-item">
                <Link className="link" to="/">
                    Home
                </Link>
            </div>

            {/* Conditional rendering based on authentication status */}
            {isLoggedIn && (
                <>
                    <div className="nav-item">
                        <Link className="link" to="/item/add">
                            Add Item
                        </Link>
                    </div>
                    <div className="nav-logout">
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </>
            )}
            {!isLoggedIn && (
                <>
                    <div className="nav-item">
                        <Link className="link" to="/register">
                            Register
                        </Link>
                    </div>

                    <div className="nav-item">
                        <Link className="link" to="/login">
                            Login
                        </Link>
                    </div>
                </>
            )}
        </nav>
    );
};
export default NavBar;
