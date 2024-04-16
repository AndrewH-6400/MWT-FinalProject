import React, { useState, useEffect } from "react";
import { Buffer } from "buffer";
import { useParams, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../stylesheets/Item.css";
import NavBar from "./NavBar";

const Item = () => {
    const [item, setItem] = useState({});
    // Recieve id to know what has been selected
    const { id } = useParams();

    // Token key will be used to authenticate whether or not the logged in user created this item
    // and whether or not they should be able to delete and edit it
    const token = localStorage.getItem("token");
    const decodedToken = token ? jwtDecode(token) : null;
    const userId = decodedToken ? decodedToken.id : null;

    // Fetching the info from the server and then the database
    useEffect(() => {
        fetch(`http://localhost:8000/nat_hist/${id}`)
            .then((response) => response.json())
            .then((data) => setItem(data.item))
            .catch((error) =>
                console.error("Error fetching book data:", error)
            );
    }, [id]);

    if (!item || Object.keys(item).length === 0) {
        return <div>Loading....</div>;
    }

    const handleDelete = async () => {
        try {
            // Fetch to delete with token
            const response = await fetch(
                `http://localhost:8000/nat_hist/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: token,
                    },
                    body: {
                        userId: userId,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                alert("delete successful");
                window.location.href = "/";
            } else {
                console.error("Error deleting Item:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting Item:", error);
        }
    };

    return (
        <div className="page">
            <NavBar />
            <div className="showcase-container">
                <h1>{item.title}</h1>
                <h4>Description: {item.description}</h4>
                <img
                    alt=""
                    src={`data:image/jpg;base64,${Buffer.from(
                        item.img.data
                    ).toString("base64")}`}
                />
            </div>
            <div className="button-footer">
                <Link to={`/item/edit/${item._id}`}>Edit Item</Link>
                <button data-id={item._id} onClick={handleDelete}>
                    Delete Item
                </button>
            </div>
        </div>
    );
};

export default Item;
