import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./components/index";
import Item from "./components/Item";
import AddItem from "./components/AddItem";
import EditItem from "./components/EditItem";
import Register from "./components/User/Register";
import Login from "./components/User/Login";
function App() {
    // State and fetch to pull info from mongo atlas and pass to the pages that need it
    const [items, setItems] = useState([]);
    useEffect(() => {
        fetch("https://mwt-final-project-server.vercel.app/")
            .then((response) => response.json())
            .then((data) => setItems(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Index title="Items" items={items} />}
                />
                <Route path="/item/:id" element={<Item />} />
                <Route path="/item/add" element={<AddItem />} />
                <Route path="/item/edit/:id" element={<EditItem />} />
                <Route path="/register" element={<Register />} />{" "}
                <Route path="/login" element={<Login />} />{" "}
            </Routes>
        </BrowserRouter>
    );
}
export default App;
