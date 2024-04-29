import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import ModalEdit from "../Forms/ModalEditOrder";
import Pagination from "../Utils/Pagination";
import api from "../../api";

function Order({ orders, fetchData, tableTab, setNotificationMessage, setNotificationType, setShowNotification }) {
    // Estado de la expansión de cada fila
    const [expandedRows, setExpandedRows] = useState({});

    // Estado del modal de edición
    const [isModalActive, setIsModalActive] = useState(false);

    // Estado de los pedidos según su estado
    const [unfinishedOrders, setUnfinishedOrders] = useState([]);
    const [finishedOrders, setFinishedOrders] = useState([]);

    // Estados para recordar la página actual de cada pestaña
    const [currentPageUnfinished, setCurrentPageUnfinished] = useState(1);
    const [currentPageFinished, setCurrentPageFinished] = useState(1);

    // Número de pedidos por página
    const ordersPerPage = 15;

    // Obtener pedidos actuales según la pestaña
    const currentUnfinishedOrders = unfinishedOrders.slice((currentPageUnfinished - 1) * ordersPerPage, currentPageUnfinished * ordersPerPage);
    const currentFinishedOrders = finishedOrders.slice((currentPageFinished - 1) * ordersPerPage, currentPageFinished * ordersPerPage);

    // Invertir el orden de `orders` antes de filtrarlos
    const reversedOrders = [...orders].reverse();

    useEffect(() => {
        if (orders && Array.isArray(orders)) {
            setUnfinishedOrders(reversedOrders.filter((order) => !order.finished));
            setFinishedOrders(reversedOrders.filter((order) => order.finished));
        } else {
            setUnfinishedOrders([]);
            setFinishedOrders([]);
        }
    }, [orders]);

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString("it-IT", options);
    };

    // Estado de los pedidos enviados
    const shippedStatus = {
        0: "Not shipped",
        1: "Shipped",
        2: "In shop"
    };

    // Manejar el finalizado del pedido
    const handleFinishOrder = async (idOrder) => {
        setShowNotification(true);
        try {
            console.log(idOrder);
            await api.put(`/api/orders/${idOrder}/`, { finished: true });
            fetchData();
            setNotificationMessage("Order marked as finished");
            setNotificationType("success");
        } catch (error) {
            setNotificationMessage("Order can't be marked as finished");
            setNotificationType("danger");
        }
    };

    // Alternar la expansión de una fila específica
    const handleRowClick = (idOrder) => {
        setExpandedRows((prev) => ({
            ...prev,
            [idOrder]: !prev[idOrder]
        }));
    };

    // Animaciones de apertura y cierre con GSAP
    const additionalInfoRefs = useRef({});
    useLayoutEffect(() => {
        Object.keys(expandedRows).forEach((idOrder) => {
            const ref = additionalInfoRefs.current[idOrder];
            if (ref) {
                gsap.to(ref, {
                    height: expandedRows[idOrder] ? ref.scrollHeight : 0,
                    duration: 0.5,
                    ease: "power2.inOut",
                });
            }
        });
    }, [expandedRows]);

    // Manejar el cambio de página
    const handlePaginate = (pageNumber) => {
        if (tableTab === 'unfinished') {
            setCurrentPageUnfinished(pageNumber);
        } else if (tableTab === 'finished') {
            setCurrentPageFinished(pageNumber);
        }
    };

    // Cuando se cambie de pestaña, restablecer la página actual de la pestaña
    useEffect(() => {
        if (tableTab === 'unfinished') {
            setCurrentPageUnfinished(1);
        } else if (tableTab === 'finished') {
            setCurrentPageFinished(1);
        }
    }, [tableTab]);

    return (
        <div>
            <table className="table is-striped is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th>Order Date</th>
                        <th>Customer</th>
                        <th>Piece Name</th>
                        <th>Status</th>
                        <th>Model Phone</th>
                        <th>Defect</th>
                        <th>Shipped</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(tableTab === 'unfinished' ? currentUnfinishedOrders : currentFinishedOrders).map((order) => (
                        <React.Fragment key={order.idOrder}>
                            {/* Fila principal */}
                            <tr onClick={() => handleRowClick(order.idOrder)} style={{ cursor: "pointer" }}>
                                <td>{formatDate(order.createdAt)}</td>
                                <td>{order.nameCustomer} {order.surnameCustomer}</td>
                                <td>{order.pieceName}</td>
                                <td>{order.status}</td>
                                <td>{order.modelPhone}</td>
                                <td>{order.defect}</td>
                                <td>{shippedStatus[order.shipped]}</td>
                                <td>
                                    <button
                                        className="mr-3 fa fa-edit" // Clase CSS para el ícono de editar
                                        style={{ color: "#FFF177" }}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Evita la expansión de la fila al hacer clic
                                            setIsModalActive(true);
                                        }}
                                    >
                                    </button>
                                    {setIsModalActive && <ModalEdit isActive={isModalActive}
                                        closeModal={() => setIsModalActive(false)} formData={order} />}
                                    {!order.finished && (
                                        <button
                                            className="fa fa-check-square" // Clase CSS para el ícono de finalizar
                                            style={{ color: "#63E6BE" }}
                                            onClick={() => handleFinishOrder(order.idOrder)}
                                        >
                                        </button>
                                    )}
                                </td>
                            </tr>

                            {/* Información adicional cuando la fila está expandida */}
                            <tr>
                                <td colSpan="8" style={{ padding: 0, border: 0 }}>
                                    <div
                                        ref={el => additionalInfoRefs.current[order.idOrder] = el}
                                        style={{
                                            height: 0,
                                            overflow: "hidden",
                                            backgroundColor: "transparent",
                                        }}
                                    >
                                        <div className="content">
                                            <p className="has-text-centered is-size-4">
                                                <strong>Order Date:</strong> {formatDate(order.createdAt)}
                                            </p>

                                            <div className="columns has-text-centered is-gapless p-1 mb-5">
                                                <div className="column">
                                                    <p><strong>Piece Name:</strong> {order.pieceName}</p>
                                                    <p><strong>Model Phone:</strong> {order.modelPhone}</p>
                                                    <p><strong>Guarantee:</strong> {order.guarantee ? 'Yes' : 'No'}</p>
                                                    <p><strong>Client Adviser:</strong> {order.clientAdviser ? 'Yes' : 'No'}</p>
                                                </div>
                                                <div className="column">
                                                    <p><strong>Customer:</strong> {order.nameCustomer} {order.surnameCustomer}</p>
                                                    <p><strong>Defect:</strong> {order.defect}</p>
                                                    <p><strong>Price:</strong> {order.price} €</p>
                                                    <p className="has-text-centered is-gapless"><strong>Notes:</strong> {order.notes}</p>
                                                </div>
                                                <div className="column">
                                                    <p><strong>Finished:</strong> {order.finished ? 'Yes' : 'No'}</p>
                                                    <p><strong>Status:</strong> {order.status}</p>
                                                    <p><strong>Shipped:</strong> {shippedStatus[order.shipped]}</p>
                                                    <p><strong>Brand Phone:</strong> {order.brandPhone}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
                        
            {/* Paginación */}
            <Pagination
                ordersPerPage={ordersPerPage}
                totalOrders={tableTab === 'unfinished' ? unfinishedOrders.length : finishedOrders.length}
                paginate={handlePaginate}
                activePage={tableTab === 'unfinished' ? currentPageUnfinished : currentPageFinished}
            />
        </div>
    );
}

export default Order;
