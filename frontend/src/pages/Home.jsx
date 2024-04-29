import React, { useState, useEffect } from "react";
import api from "../api";
import Header from "../components/Home/Header";
import useErrorAndLogout from "../components/Utils/ErrorBd";

function Home() {
    const [orders, setOrders] = useState([]);
    const [originalOrders, setOriginalOrders] = useState([]);

    // Importa y usa el custom hook `useErrorAndLogout`
    const showErrorAndLogout = useErrorAndLogout();

    // Función para obtener datos de la API
    const fetchData = () => {
        api.get("api/orders/")
            .then((res) => {
                setOrders(res.data);
                setOriginalOrders(res.data);
            })
            .catch(() => {
                // Llama a `showErrorAndLogout` si ocurre un error
                showErrorAndLogout();
            });
    };

    // Carga los datos iniciales
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            {/* Componente Header */}
            <Header orders={orders} originalOrders={originalOrders} setOrders={setOrders} fetchData={fetchData} />
        </div>
    );
}

export default Home;
