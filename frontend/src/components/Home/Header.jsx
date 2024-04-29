import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import Papa from "papaparse";
import Order from "../Models/Order";
import Customer from "../Models/Customer";
import Searchbar from "../Utils/SearchBar";
import Phone from "../Models/Phone";
import Piece from "../Models/Piece";

function Header({ orders, originalOrders, setOrders, fetchData }) {
    const [navTab, setNavTab] = useState("pane-1");
    const [tableTab, setTableTab] = useState("unfinished");
    const [isMenuActive, setIsMenuActive] = useState(false);
    const [isDocsActive, setIsDocsActive] = useState(false); // Estado para controlar la visibilidad de `Docs`

    const exportToCSV = async () => {
        try {
            const response = await api.get("api/orders/");
            const orders = response.data;
            const csv = Papa.unparse(orders);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
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

    const toggleMenu = () => {
        setIsMenuActive(!isMenuActive);
    };

    const toggleDocsMenu = () => {
        setIsDocsActive(!isDocsActive);
    };

    return (
        <div>
            <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a
                        role="button"
                        className={`navbar-burger burger ${isMenuActive ? "is-active" : ""}`}
                        aria-label="menu"
                        aria-expanded="false"
                        data-target="navbarMenu"
                        onClick={toggleMenu}
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="navbarMenu" className={`navbar-menu ${isMenuActive ? "is-active" : ""}`}>
                    <div className="navbar-start">
                        <div className="navbar-item is-hoverable">
                            <Link className="navbar-item" to="/">Home</Link>

                            <p className="navbar-link" onClick={toggleDocsMenu}>
                                Docs
                            </p>
                            <div className={`navbar-dropdown is-boxed ${isDocsActive ? "" : "is-hidden"}`}>
                                <a className="navbar-item" href="admin.html">Admin</a>
                                <a className="navbar-item" href="cover.html">Support</a>
                            </div>
                        </div>
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <button className="button is-link" onClick={exportToCSV}>
                                    <span className="icon">
                                        <i className="fas fa-download"></i>
                                    </span>
                                    <span>Download Data</span>
                                </button>
                                <Link className="button is-danger" to="/logout">
                                    <span className="icon">
                                        <i className="fa fa-user-times"></i>
                                    </span>
                                    <span>Log out</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="hero is-primary">
                <div className="container m-1">
                    <img
                        src={"/public/img/logo.png"}
                        alt="site-logo"
                        className="py-2 px-2"
                        style={{ maxHeight: 90 }}
                    />
                </div>
            </section>

            <div>
                <nav className="mt-2 tabs is-medium is-centered nav-menu" id="nav">
                    <ul>
                        <li onClick={() => setNavTab("pane-1")} className={navTab === "pane-1" ? "is-active" : ""}>
                            <a>
                                <span className="icon is-small">
                                    <i className="fa fa-envelope"></i>
                                </span>
                                <span>Ordini</span>
                            </a>
                        </li>
                        <li onClick={() => setNavTab("pane-2")} className={navTab === "pane-2" ? "is-active" : ""}>
                            <a>
                                <span className="icon is-small">
                                    <i className="fa fa-users"></i>
                                </span>
                                <span>Clientela</span>
                            </a>
                        </li>
                        <li onClick={() => setNavTab("pane-3")} className={navTab === "pane-3" ? "is-active" : ""}>
                            <a>
                                <span className="icon is-small">
                                    <i className="fa fa-mobile"></i>
                                </span>
                                <span>Telefono</span>
                            </a>
                        </li>
                        <li onClick={() => setNavTab("pane-4")} className={navTab === "pane-4" ? "is-active" : ""}>
                            <a>
                                <span className="icon is-small">
                                    <i className="fa fa-screwdriver"></i>
                                </span>
                                <span>Pezzo</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                <div className="tab-content mt-5 ">
                    <div className="tab-pane">
                        <div className="container">
                            <div className="columns is-centered">
                                <div className="column">
                                    {(() => {
                                        switch (navTab) {
                                            case "pane-1":
                                                return (
                                                    <div>
                                                        <div className="columns">
                                                            <div className="navbar">
                                                                <a
                                                                    className={`navbar-item ${tableTab === "unfinished" ? "is-active" : ""}`}
                                                                    onClick={() => setTableTab("unfinished")}
                                                                >
                                                                    Unfinished Orders
                                                                </a>
                                                                <a
                                                                    className={`navbar-item ${tableTab === "finished" ? "is-active" : ""}`}
                                                                    onClick={() => setTableTab("finished")}
                                                                >
                                                                    Finished Orders
                                                                </a>
                                                            </div>
                                                            <div className="columns control ml-auto">
                                                                <div className="column ">
                                                                    <Searchbar
                                                                        originalOrders={originalOrders}
                                                                        setOrders={setOrders}
                                                                        navTab={navTab}
                                                                    />
                                                                </div>
                                                                <div className="column">
                                                                    <Link className="button is-success" to="/orders/create">
                                                                        <span className="icon">
                                                                            <i className="fas fa-plus-circle"></i>
                                                                        </span>
                                                                        <span>Create Order</span>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="table-container is-justify-content-center mb-6">
                                                            <Order orders={orders} fetchData={fetchData} tableTab={tableTab} />
                                                        </div>
                                                    </div>
                                                );
                                            case "pane-2":
                                                return <div>
                                                    <div className="columns">
                                                        <div className="column" style={{ maxWidth: 300 }}>
                                                            <Searchbar
                                                                originalOrders={originalOrders}
                                                                setOrders={setOrders}
                                                                navTab={navTab}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Customer orders={orders} />
                                                </div>;
                                            case "pane-3":
                                                return <div>
                                                    <div className="columns">
                                                        <div className="column" style={{ maxWidth: 300 }}>
                                                            <Searchbar
                                                                originalOrders={originalOrders}
                                                                setOrders={setOrders}
                                                                navTab={navTab}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Phone orders={orders} />
                                                </div>;
                                            case "pane-4":
                                                return <div>
                                                <div className="columns">
                                                    <div className="column" style={{ maxWidth: 300 }}>
                                                        <Searchbar
                                                            originalOrders={originalOrders}
                                                            setOrders={setOrders}
                                                            navTab={navTab}
                                                        />
                                                    </div>
                                                </div>
                                                <Piece orders={orders} />
                                            </div>;
                                            default:
                                                return null;
                                        }
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;

