import React, { useState, useEffect } from 'react';
import api from "../../api";
//import styles/Modal.css";
import { Input } from './Input';
import { FormProvider, useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom';

function ModalEdit({ formData, closeModal, isActive }) {
    const methods = useForm()
    const [formData2, setFormData] = useState({});
    const orderId = formData && formData.idOrder; // Verifica si formData está definido antes de acceder a idOrder

    useEffect(() => {
        if (formData)
            setFormData(formData);

    }, [formData]); // Fetch the order data when the component mounts


    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setFormData({ ...formData2, [name]: inputValue });
    };

    const onSubmit = methods.handleSubmit(e => {
        //put
        api.put(`/api/orders/${orderId}/`, formData2)
            .then((res) => {
                alert('Order updated successfully')

                window.location.reload()
            })
            .catch((err) => alert(err))

        closeModal();  

    })

    return (
        <div className={`modal is-mobile dark ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head" style={{ backgroundColor: '#00D1B2' }}>
                    <p className="modal-card-title">Edit Order</p>
                    <button className="delete" aria-label="close" onClick={closeModal}></button>
                </header>
                <section style={{ margin: 0 }} className="modal-card-body">
                    <FormProvider {...methods}>
                        <form onSubmit={e => e.preventDefault()} noValidate className="box p-5" style={{margin:0}}>
                            {/* Formulario */}
                            <div className="field mb-4 is-grouped" style={{ justifyContent: 'space-between' }}>
                                <Input
                                    label="Nome"
                                    type="text"
                                    name="nameCustomer"
                                    placeholder="Nome"
                                    value={formData2.nameCustomer || ''}
                                    onChange={handleChange}
                                />
                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="Cognome" className="label is-small" style={{bottom:5.25}}>
                                        Cognome
                                    </label>
                                    <input
                                        className='input is-medium'
                                        type="text"
                                        name="surnameCustomer"
                                        placeholder="Cognome"
                                        value={formData2.surnameCustomer || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="field mb-4">
                                <label htmlFor="Telefono" className="label is-small">
                                    Telefono
                                </label>
                                <input
                                    className='input is-medium'
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Telefono"
                                    value={formData2.phoneNumber || ''}
                                    onChange={handleChange}
                                    pattern="[0-9]*"
                                />
                            </div>

                            <div className="field mb-4">
                                <Input
                                    label="Modello di telefono"
                                    type="text"
                                    name="modelPhone"
                                    placeholder="Modello di telefono"
                                    value={formData2.modelPhone || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field mb-4">
                                <Input
                                    label="Defetto"
                                    type="text"
                                    name="defect"
                                    placeholder="Defetto"
                                    value={formData2.defect || ''}
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
                                        className='input is-medium'
                                        type="text"
                                        name="pieceName"
                                        placeholder="Pezzo"
                                        value={formData2.pieceName || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="Costo" className="label is-small">
                                        Costo
                                    </label>
                                    <input
                                        className='input is-medium'
                                        placeholder="Costo"
                                        type="number"
                                        name="price"
                                        value={formData2.price || 0}
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
                                            <div className='select is-fullwidth is-medium'>
                                                <select
                                                    name="status"
                                                    value={formData2.status || ''}
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
                                            <div className="select is-fullwidth is-medium">
                                                <select
                                                    name="shipped"
                                                    value={formData2.shipped || ''}
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
                                        className="textarea is-medium"
                                        name="notes"
                                        value={formData2.notes || ''}
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
                                            checked={formData2.guarantee || false}
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
                                            checked={formData2.clientAdviser || false}
                                            onChange={handleChange}
                                            className='ml-2'
                                        />
                                    </label>
                                </div>
                            </div>
                        </form>
                    </FormProvider>

                </section>
                <footer className="modal-card-foot" style={{ backgroundColor: '#00D1B2' }}>
                    <div className="buttons">
                        <button type="submit" className="button is-success" onClick={onSubmit} style={{ backgroundColor: '#2c3c5b', color: 'white' }}>Save</button>
                    </div>
                </footer>
            </div>
        </div >
    );
}

export default ModalEdit;
