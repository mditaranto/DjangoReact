import React, { useState, useEffect } from "react";
import api from "../api";
import Header from "../components/Home/Header";

function Home() {
    const [orders, setOrders] = useState([]);

    // Fetch data from the API
    const fetchData = () => {
        api.get("api/orders/")
            .then((res) => {
                setOrders(res.data);
            })
            // TODO: Notification
            .catch((err) => alert(err));
    };

    // Carga los datos iniciales
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            {/* Header Component */}
            <Header orders={orders} fetchData={fetchData} />

        </div>
    );
}

export default Home;
