import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import Papa from "papaparse";
import Order from "../Models/Order";
import Notification from "../Utils/Notification";

function Header({ orders, fetchData }) {

    // Estado para controlar la pestaña activa
    const [navTab, setNavTab] = useState('pane-1');
    // Estado para controlar la pestaña de la tabla orders
    const [tableTab, setTableTab] = useState('unfinished');

    // Define el estado de la notificación
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationType, setNotificationType] = useState("primary");

    // Función para exportar datos de `api/orders` a un archivo CSV
    const exportToCSV = async () => {
        try {
            // Obtener datos de `api/orders`
            const response = await api.get("api/orders/");
            const orders = response.data;

            // Convertir los datos a un archivo CSV usando `papaparse`
            const csv = Papa.unparse(orders);

            // Crear un blob con el contenido CSV
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

            // Crear un enlace para descargar el archivo
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", "orders.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert("Error al exportar los datos");
            console.error(error);
        }
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar is-primary">
                <div className="navbar-brand">
                    <div className="navbar-burger burger" data-target="navbarData">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div id="navbarData" className="navbar-menu">
                    <div className="navbar-start is-link">
                        <Link className="navbar-item" to="/">Home</Link>
                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link" href="/documentation/overview/start/">Docs</a>
                            <div className="navbar-dropdown is-boxed">
                                <a className="navbar-item" href="admin.html">Admin</a>
                                <a className="navbar-item" href="cover.html">Support</a>
                            </div>
                        </div>
                    </div>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="field is-grouped">
                                <p className="control">
                                    {/* Botón de Download Data con evento onClick */}
                                    <button className="button is-link" onClick={exportToCSV}>
                                        <span className="icon"><i className="fas fa-download"></i></span>
                                        <span>Download Data</span>
                                    </button>
                                </p>
                                <p className="control">
                                    <Link className="button is-danger" to="/logout">
                                        <span className="icon"><i className="fa fa-user-times"></i></span>
                                        <span>Log out</span>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero section */}
            <section className="hero is-primary">
                <div className="container m-1">
                    <img src={"/public/img/logo.png"} alt="site-logo" className="py-2 px-2" style={{ maxHeight: 90 }} />
                </div>
            </section>

            {/* Main Content */}
            <div>
                {/* Tabs Tables */}
                <nav className="mt-2 tabs is-medium is-centered nav-menu" id="nav">
                    <ul>
                        <li onClick={() => setNavTab('pane-1')} className={navTab === 'pane-1' ? 'is-active' : ''}>
                            <a>
                                <span className="icon is-small"><i className="fa fa-envelope"></i></span>
                                <span>Orders</span>
                            </a>
                        </li>
                        <li onClick={() => setNavTab('pane-2')} className={navTab === 'pane-2' ? 'is-active' : ''}>
                            <a>
                                <span className="icon is-small"><i className="fa fa-users"></i></span>
                                <span>Customers</span>
                            </a>
                        </li>
                        <li onClick={() => setNavTab('pane-3')} className={navTab === 'pane-3' ? 'is-active' : ''}>
                            <a>
                                <span className="icon is-small"><i className="fa fa-mobile"></i></span>
                                <span>Mobiles</span>
                            </a>
                        </li>
                        <li onClick={() => setNavTab('pane-4')} className={navTab === 'pane-4' ? 'is-active' : ''}>
                            <a>
                                <span className="icon is-small"><i className="fa fa-screwdriver"></i></span>
                                <span>Pieces</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Renderización condicional de Notification */}
            {showNotification && (
                <Notification
                    message={notificationMessage}
                    onClose={() => setShowNotification(false)}
                    type={notificationType}
                />
            )}

            {/* Content for each tab */}
            <div className="tab-content mt-5" style={{ display: "block" }}>
                <div className="tab-pane">
                    <div className="container">
                        <div className="columns is-centered">
                            <div className="column is-10">
                                {(() => {
                                    switch (navTab) {
                                        case 'pane-1':
                                            return (
                                                <div>
                                                    <div className="navbar-menu">
                                                        <div className="navbar">
                                                            <a className={`navbar-item ${tableTab === 'unfinished' ? 'is-active' : ''}
                                                          is-primary`} onClick={() => setTableTab('unfinished')}>
                                                                Unfinished Orders
                                                            </a>
                                                            <a className={`navbar-item ${tableTab === 'finished' ? 'is-active' : ''}
                                                          is-primary`} onClick={() => setTableTab('finished')}>
                                                                Finished Orders
                                                            </a>
                                                        </div>

                                                        {/* Create order button */}
                                                        <p className="control ml-auto">
                                                            <Link className="button is-success" to="/orders/create">
                                                                <span className="icon"><i className="fas fa-plus-circle"></i></span>
                                                                <span>Create Order</span>
                                                            </Link>
                                                        </p>

                                                    </div>

                                                    <div className="table-container is-justify-content-center mb-6">
                                                        <Order orders={orders} fetchData={fetchData} tableTab={tableTab}
                                                            setNotificationMessage={setNotificationMessage}
                                                            setNotificationType={setNotificationType}
                                                            setShowNotification={setShowNotification}
                                                        ></Order>

                                                    </div>
                                                </div>
                                            );
                                        case 'pane-2':
                                            return (
                                                <div>

                                                </div>
                                            );
                                        case 'pane-3':
                                            return (
                                                <div>
                                                    {/* Contenido de la pestaña Orders */}
                                                    <h2>Orders</h2>
                                                    <p>Contenido específico de la pestaña Orders.</p>
                                                </div>
                                            );
                                        case 'pane-4':
                                            return (
                                                <div>
                                                    {/* Contenido de la pestaña Orders */}
                                                    <h2>Orders</h2>
                                                    <p>Contenido específico de la pestaña Orders.</p>
                                                </div>
                                            );
                                        default:
                                            return null; // Manejo de casos no previstos
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Header;
