import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { useParams } from "react-router-dom";
import { Buffer } from "buffer";
import { jwtDecode } from "jwt-decode";
import "../stylesheets/Base.css";
import "../stylesheets/AddEdit.css";

const EditItem = () => {
    const [image, setImage] = useState();
    const token = localStorage.getItem("token");

    const [item, setItem] = useState({});
    const [updatedItem, setUpdatedItem] = useState({
        title: "",
        description: "",
        img: {
            data: "",
            contentType: "",
        },
    });

    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://mwt-final-project-server.vercel.app/nat_hist/edit/${id}`
                );
                const data = await response.json();

                setItem(data.item);

                setUpdatedItem({
                    title: data.item.title,
                    description: data.item.description,
                    img: {
                        data: data.item.img.data,
                        contentType: data.item.img.contentType,
                    },
                });

                //setImage(data.item.img.data);
            } catch (error) {
                console.error("Error fetching item data:", error);
            }
        };

        fetchData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setUpdatedItem((prevItem) => ({
            ...prevItem,
            [name]: type === "checkbox" ? [...prevItem[name], value] : value,
        }));
    };

    const fileChangeHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(updatedItem);
        const data = new FormData();
        // If no image is submitted then in the server req.file will be null and no changes to the image will be made
        data.append("image", image);
        data.append("title", updatedItem.title);
        data.append("description", updatedItem.description);

        fetch(
            `https://mwt-final-project-server.vercel.app/nat_hist/edit/${id}`,
            {
                method: "POST",
                headers: {
                    Authorization: token,
                },
                body: data,
            }
        )
            .then((response) => response.json())
            .then((data) => {
                console.log("Update Successful", data);
            })
            .catch((error) => {
                console.error("Error updating item", error);
                alert("Edit Unsuccessful");
            });
    };

    return (
        <div className="page">
            <NavBar />
            <div className="add-item-container">
                <h1>{item.title}</h1>
                <form onSubmit={handleSubmit}>
                    <div id="form-group">
                        <label>Title: </label>
                        <input
                            className="form-control"
                            name="title"
                            type="text"
                            value={updatedItem.title}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div id="form-group">
                        <label>Description: </label>
                        <input
                            className="form-control"
                            name="description"
                            value={updatedItem.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div id="form-group">
                        <label>Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={fileChangeHandler}
                        />
                    </div>
                    <input
                        className="btn btn-primary"
                        type="submit"
                        value="Submit"
                    />
                </form>
                {image == null && (
                    <img
                        alt=""
                        width={200}
                        height={200}
                        src={`data:image/jpg;base64,${Buffer.from(
                            updatedItem.img.data
                        ).toString("base64")}`}
                    />
                )}
                {image != null && (
                    <img
                        alt=""
                        width={200}
                        height={200}
                        src={URL.createObjectURL(image)}
                    />
                )}
            </div>
        </div>
    );
};

export default EditItem;
