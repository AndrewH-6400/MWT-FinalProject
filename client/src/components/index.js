import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Buffer } from "buffer";
import NavBar from "./NavBar";
import "../stylesheets/Base.css";
import "../stylesheets/Index.css";

const Index = ({ title, items }) => {
    // Getting user info and token
    const [userName, setUserName] = useState("");
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setUserName(decoded.name);
            console.log(decoded);
        }
    }, []);

    return (
        <div className="page">
            <NavBar />
            <div className="intro">
                <h1>{title}</h1>
                {userName && <p>Hello, {userName}!</p>}
            </div>
            <div className="index-container">
                {items.map((item) => (
                    <div key={item._id} className="item-container">
                        <a className="title-box" href={`/item/${item._id}`}>
                            <label className="item-title">
                                <p className="title-link">{item.title}</p>
                            </label>
                        </a>
                        <div className="info-box">
                            <p className="item-info">
                                Description: {item.description}
                            </p>
                        </div>
                        <div className="image-box">
                            {/* the image on mongodb atlas is in Buffer format and needs to be converted into base64 to be displayed */}
                            <img
                                alt=""
                                className="item-image"
                                width={200}
                                height={200}
                                src={`data:image/jpg;base64,${Buffer.from(
                                    item.img.data
                                ).toString("base64")}`}
                            />
                        </div>
                    </div>
                ))}
                <br />
            </div>
        </div>
    );
};
export default Index;
