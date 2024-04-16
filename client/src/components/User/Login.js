import React, { useState } from "react";
import NavBar from "../NavBar";
import "../../stylesheets/Base.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [error, setError] = useState("");
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                "https://mwt-final-project-server.vercel.app/user/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.errors) {
                    setErrors(errorData.errors.map((err) => err.msg));
                } else {
                    throw new Error(errorData.msg || "An error occurred");
                }
                return;
            }
            const data = await response.json();
            const token = data.token;
            localStorage.setItem("token", token);
            console.log("Login successful");
            window.location.href = "/";
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="page">
            <NavBar />
            <h2>Login</h2>
            {error && <p>{error}</p>}
            {errors.length > 0 && (
                <ul>
                    {errors.map((err, index) => (
                        <li key={index}>{err}</li>
                    ))}
                </ul>
            )}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
