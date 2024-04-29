import React, { useState, useEffect } from 'react';
import api from '../../api';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from './Input';

function FormOrder() {
    const methods = useForm();
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const currentDateTime = `${currentDate}T${currentTime}`;
        setFormData({ ...formData, createdAt: currentDateTime });
    }, []);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: inputValue });
    };

    const handleSubmit = methods.handleSubmit(async (e) => {

        try {                       
            await api.post('/api/orders/', formData);
            alert('Order created successfully');
            navigate('/'); // Redirigir a la página principal
        } catch (error) {
            alert('An error occurred while creating the order');
        }
    });

    return (
        <div className="container" style={{ margin: '30px auto', maxWidth: '1000px' }}>
            <div className="columns is-justify-content-center is-align-items-center">
                <div className="column is-8-tablet is-7-desktop is-6-widescreen">
                    {/* Encabezado con botón "Back to Home" e icono de home */}
                    <div className="is-flex is-justify-content-space-between">
                        <h2 className="title is-2">Create Order</h2>
                        <Link to="/" className="button is-link is-small px-5" style={{ height: '50px' }}>
                            <span className="icon">
                                <i className="fas fa-home"></i>
                            </span>
                            <span>Home</span>
                        </Link>
                    </div>

                    <FormProvider {...methods}>
                        <form onSubmit={e => e.preventDefault()} noValidate className="box p-5">
                            {/* Formulario */}
                            <div className="field mb-4 is-grouped" style={{justifyContent:'space-between'}}>
                                <Input
                                    label="Nome"
                                    type="text"
                                    name="nameCustomer"
                                    placeholder="Nome"
                                    value={formData.nameCustomer || ''}
                                    onChange={handleChange}
                                />
                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="Cognome" className="label is-small" style={{margin:'0'}}>
                                        Cognome
                                    </label>
                                    <input
                                        className='input'
                                        type="text"
                                        name="surnameCustomer"
                                        placeholder="Cognome"
                                        value={formData.surnameCustomer || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="field mb-4">
                                <label htmlFor="Telefono" className="label is-small">
                                    Telefono
                                </label>
                                <input
                                    className='input'
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Telefono"
                                    value={formData.phoneNumber || ''}
                                    onChange={handleChange}
                                    pattern="[0-9]*"
                                />
                            </div>

                            <div className="field mb-4">
                                <Input
                                    label="Modello"
                                    type="text"
                                    name="modelPhone"
                                    placeholder="Modello"
                                    value={formData.modelPhone || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field mb-4">
                                <Input
                                    label="Marchio"
                                    type="text"
                                    name="brandPhone"
                                    placeholder="Marchio"
                                    value={formData.brandPhone || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field mb-4">
                                <Input
                                    label="Defetto"
                                    type="text"
                                    name="defect"
                                    placeholder="Defetto"
                                    value={formData.defect || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Campos de "Pezzo" y "Costo" en el mismo div */}
                            <div className="field mb-4 is-grouped" style={{ justifyContent: 'space-between' }}>
                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="Pezzo" className="label is-small">
                                        Pezzo
                                    </label>
                                    <input
                                        className='input'
                                        type="text"
                                        name="pieceName"
                                        placeholder="Pezzo"
                                        value={formData.pieceName || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="Costo" className="label is-small">
                                        Costo
                                    </label>
                                    <input
                                        className='input'
                                        placeholder="Costo"
                                        type="number"
                                        name="price"
                                        value={formData.price || 0}
                                        onChange={handleChange}
                                        min={0}
                                    />
                                </div>
                            </div>

                            {/* Campos de selección */}
                            <div className="field mb-4">
                                <div className="columns is-variable is-8">
                                    <div className="column">
                                        <label className="label is-small">Stato</label>
                                        <div className="control">
                                            <div className="select is-fullwidth">
                                                <select
                                                    name="status"
                                                    value={formData.status || ''}
                                                    onChange={handleChange}
                                                >
                                                    <option value="0">Pending</option>
                                                    <option value="1">In Progress</option>
                                                    <option value="2">Finished</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column">
                                        <label className="label is-small">Spedito</label>
                                        <div className="control">
                                            <div className="select is-fullwidth">
                                                <select
                                                    name="shipped"
                                                    value={formData.shipped || ''}
                                                    onChange={handleChange}
                                                >
                                                    <option value="0">No</option>
                                                    <option value="1">Yes</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Campo de notas */}
                            <div className="field mb-4">
                                <label className="label is-small">Note</label>
                                <div className="control">
                                    <textarea
                                        className="textarea"
                                        name="notes"
                                        value={formData.notes || ''}
                                        onChange={handleChange}
                                        placeholder="Enter notes..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="field mb-4 is-grouped is-justify-content-space-between">
                                <div className="control ml-1">
                                    <label className="checkbox">
                                        Garanzia
                                        <input
                                            type="checkbox"
                                            name="guarantee"
                                            checked={formData.guarantee || false}
                                            onChange={handleChange}
                                            className='ml-2'
                                        />
                                    </label>
                                </div>

                                <div className="control mr-1">
                                    <label className="checkbox">
                                        Client Adviser
                                        <input
                                            type="checkbox"
                                            name="clientAdviser"
                                            checked={formData.clientAdviser || false}
                                            onChange={handleChange}
                                            className='ml-2'
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Botón de envío */}
                            <div className="m-3 columns is-justify-content-center is-align-items-center">
                                <button type="submit" onClick={handleSubmit} className="button is-link px-5">Save</button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
}

export default FormOrder;