import React, { useState } from "react";
import NavBar from "./NavBar";
import { jwtDecode } from "jwt-decode";
import "../stylesheets/Base.css";
import "../stylesheets/AddEdit.css";

const AddItem = () => {
    const token = localStorage.getItem("token");
    const decodedToken = token ? jwtDecode(token) : null;
    const userId = decodedToken ? decodedToken.id : null; //assuming id is the key for user id in the decoded token

    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });
    const [image, setImage] = useState();

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]:
                type === "checkbox" ? [...prevFormData[name], value] : value,
        }));
    };

    const fileChangeHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);

        const data = new FormData();
        data.append("image", image);
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("userId", userId);

        fetch(
            "https://mwt-final-project-server.vercel.app/nat_hist/add/image",
            {
                method: "POST",
                headers: {
                    Authorization: token,
                },
                body: data,
            }
        )
            .then((result) => {
                console.log(result);
                if (result.status === 403) {
                    alert("Please login to add to collection");
                } else {
                    console.log("File Sent");
                    alert("Addition Successful");
                }
            })
            .catch((err) => {
                console.log(err.message);
                alert(err.message);
            });

        setFormData({
            title: "",
            description: "",
        });
        setImage();
    };

    return (
        <div className="page">
            <NavBar />
            <div className="add-item-container">
                <h1>Add Item</h1>
                <form onSubmit={handleSubmit}>
                    <div id="form-group">
                        <label>Title: </label>
                        <input
                            className="form-control"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div id="form-group">
                        <label>Description: </label>
                        <input
                            className="form-control"
                            name="description"
                            type="text"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div id="form-group">
                        <label>Image: </label>
                        <input
                            type="file"
                            name="image"
                            onChange={fileChangeHandler}
                            required
                        />
                    </div>
                    <input
                        className="btn btn-primary"
                        type="submit"
                        value="Submit"
                    />
                </form>
                {image != null && (
                    <img
                        alt=""
                        src={URL.createObjectURL(image)}
                        width="100"
                        height="100"
                    />
                )}
            </div>
        </div>
    );
};

export default AddItem;
