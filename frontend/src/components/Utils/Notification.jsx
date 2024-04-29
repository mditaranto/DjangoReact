import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/Notification.css'; // Asegúrate de importar el archivo de estilo

function Notification({ message, onClose, type = 'primary' }) {
    return (
        <article className={`message is-${type} notification-centered`}>
            <div className="message-header">
                <p>Alert</p>
                <button className="delete" aria-label="delete" onClick={onClose}></button>
            </div>
            <div className="message-body">
                <strong>{message}</strong>
            </div>

        </article>
    );
}

// Define los tipos de propiedades que acepta el componente
Notification.propTypes = {
    message: PropTypes.string.isRequired, // El mensaje que se muestra en la notificación
    onClose: PropTypes.func.isRequired, // La función de cierre que se invoca al hacer clic en el botón de cierre
    type: PropTypes.string, // El tipo de notificación (default: 'primary')
};

// Valor por defecto para el tipo de notificación
Notification.defaultProps = {
    type: 'primary',
};

export default Notification;
