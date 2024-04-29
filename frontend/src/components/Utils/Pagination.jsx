import React, { useState } from "react";
import "../../styles/Pagination.css";

function Pagination({ ordersPerPage, totalOrders, paginate, activePage }) {
    const pageNumbers = [];
    const maxPagesToShow = 4; // Número máximo de páginas a mostrar

    // Calcular el rango de páginas a mostrar
    let startPage, endPage;

    if (totalOrders <= maxPagesToShow * ordersPerPage) {
        // Si hay menos de `maxPagesToShow` páginas, muestra todas
        startPage = 1;
        endPage = Math.ceil(totalOrders / ordersPerPage);
    } else {
        // Si hay más de `maxPagesToShow` páginas, calcula el rango alrededor de la página activa
        const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
        const maxPagesAfterCurrentPage = maxPagesToShow - maxPagesBeforeCurrentPage - 1;

        if (activePage <= maxPagesBeforeCurrentPage) {
            // Si la página activa está cerca del inicio, muestra las primeras `maxPagesToShow` páginas
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (activePage + maxPagesAfterCurrentPage >= Math.ceil(totalOrders / ordersPerPage)) {
            // Si la página activa está cerca del final, muestra las últimas `maxPagesToShow` páginas
            startPage = Math.ceil(totalOrders / ordersPerPage) - maxPagesToShow + 1;
            endPage = Math.ceil(totalOrders / ordersPerPage);
        } else {
            // De lo contrario, muestra las páginas alrededor de la página activa
            startPage = activePage - maxPagesBeforeCurrentPage;
            endPage = activePage + maxPagesAfterCurrentPage;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    // Funciones para cambiar de página
    const handlePreviousPage = () => {
        if (activePage > 1) {
            paginate(activePage - 1);
        }
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(totalOrders / ordersPerPage);
        if (activePage < totalPages) {
            paginate(activePage + 1);
        }
    };

    return (
        <div className="container is-flex column is-centered">
            <div className="column">
            <nav className="pagination is-rounded" role="navigation" aria-label="pagination" >
                <ul className="pagination-list">
                    {/* Botón de página anterior */}
                    <li>
                        <a
                            href="#"
                            className={`pagination-link ${activePage === 1 ? 'is-disabled' : ''}`}
                            onClick={handlePreviousPage}
                            aria-label="Previous page"
                        >
                            &laquo; Previous
                        </a>
                    </li>

                    {/* Números de página */}
                    {pageNumbers.map((number) => (
                        <li key={number}>
                            <a
                                href="#"
                                className={`pagination-link ${activePage === number ? 'is-current' : ''}`}
                                onClick={() => paginate(number)}
                            >
                                {number}
                            </a>
                        </li>
                    ))}

                    {/* Botón de siguiente página */}
                    <li>
                        <a
                            href="#"
                            className={`pagination-link ${activePage === Math.ceil(totalOrders / ordersPerPage) ? 'is-disabled' : ''}`}
                            onClick={handleNextPage}
                            aria-label="Next page"
                        >
                            Next &raquo;
                        </a>
                    </li>
                </ul>
            </nav>
            </div>
        </div>

    );
}

export default Pagination;
