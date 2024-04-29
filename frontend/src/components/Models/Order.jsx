import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import ModalEdit from "../Forms/ModalEditOrder";
import Pagination from "../Utils/Pagination";
import Swal from 'sweetalert2'
import "../../styles/Notification.css"
import api from "../../api";

function Order({ orders, fetchData, tableTab }) {
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

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const [isDarkMode, setIsDarkMode] = useState(darkModeMediaQuery.matches);

    // Filtrar los pedidos según su estado
    useEffect(() => {
        if (Array.isArray(orders)) {
            const unfinished = orders.filter(order => !order.finished);
            const finished = orders.filter(order => order.finished);
            setUnfinishedOrders(unfinished);
            setFinishedOrders(finished);
        } else {
            setUnfinishedOrders([]);
            setFinishedOrders([]);
        }
    }, [orders]);

    useEffect(() => {
        // Función de callback que se ejecuta cuando cambia la preferencia de esquema de color
        const handleColorSchemeChange = (event) => {
            setIsDarkMode(event.matches);
        };

        // Añadir el evento de escucha a darkModeMediaQuery
        darkModeMediaQuery.addEventListener('change', handleColorSchemeChange);

        // Limpiar el evento de escucha cuando el componente se desmonte
        return () => {
            darkModeMediaQuery.removeEventListener('change', handleColorSchemeChange);
        };
    }, []);


    // Formatear fecha
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

    // Confirmacion de eliminacion
    const handleChoice = async (order) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You will can change it later",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, changed it!',
            customClass: isDarkMode ? 'swal2-dark' : '',
        });

        if (result.isConfirmed) {
            // Lógica para manejar la confirmación
            handleFinishOrder(order);
        }
    };

    // Manejar el finalizado del pedido
    const handleFinishOrder = async (order) => {
        try {
            if (order.finished === false) {
                await api.put(`/api/orders/${order.idOrder}/`, { finished: true });
                // Muestra una notificación de éxito con SweetAlert2 que se cierra automáticamente después de 3 segundos
                await Swal.fire({
                    icon: 'success',
                    title: 'Order marked as finished',
                    text: 'The order has been successfully marked as finished.',
                    timer: 3000, // Cierra automáticamente después de 3 segundos (3000 milisegundos)
                    timerProgressBar: true, // Muestra una barra de progreso mientras cuenta el tiempo
                    customClass: 'swal2-dark',

                });
            } else {
                await api.put(`/api/orders/${order.idOrder}/`, { finished: false });
                // Muestra una notificación de advertencia con SweetAlert2 que se cierra automáticamente después de 3 segundos
                await Swal.fire({
                    icon: 'success',
                    title: 'Order marked as unfinished',
                    text: 'The order has been marked as unfinished and can be updated.',
                    timer: 3000, // Cierra automáticamente después de 3 segundos
                    timerProgressBar: true, // Muestra una barra de progreso mientras cuenta el tiempo
                    customClass: 'swal2-dark',

                });
            }
            // Vuelve a cargar los datos después de actualizar el pedido
            fetchData();

        } catch (error) {
            // Muestra una notificación de error con SweetAlert2 que se cierra automáticamente después de 3 segundos
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Order can't be changed",
                timer: 3000, // Cierra automáticamente después de 3 segundos
                timerProgressBar: true, // Muestra una barra de progreso mientras cuenta el tiempo
            });
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
                        <th>Phone Number</th>
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
                                <td>{order.phoneNumber}</td>
                                <td>{order.pieceName}</td>
                                <td>{order.status}</td>
                                <td>{order.modelPhone}</td>
                                <td>{order.defect}</td>
                                <td>{shippedStatus[order.shipped]}</td>
                                <td>
                                    <button
                                        className="mr-3 fa fa-edit"
                                        style={{ color: "#FFF177" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsModalActive(true);
                                        }}
                                    >
                                    </button>
                                    {setIsModalActive && <ModalEdit isActive={isModalActive}
                                        closeModal={() => setIsModalActive(false)} formData={order} />}
                                    {!order.finished && (
                                        <button
                                            className="fa fa-check-square"
                                            style={{ color: "#63E6BE" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleChoice(order)
                                            }}
                                        >
                                        </button>
                                    )}
                                    {
                                        // Si el pedido está terminado, muestra un botón para volver a ponerlo como no terminado
                                        order.finished && (
                                            <button
                                                className="fa fa-undo" // Clase CSS para el ícono de deshacer (o similar)
                                                style={{ color: "#E06D5B" }} // Puedes elegir un color diferente
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleChoice(order)
                                                }} // Llama a la función handleUnfinishedOrder al hacer clic
                                            >
                                            </button>
                                        )
                                    }
                                </td>
                            </tr>

                            {/* Información adicional */}
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
