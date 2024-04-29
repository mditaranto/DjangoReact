import React, { useState, useEffect } from 'react';
import api from "../../api";
//import "../styles/Modal.css";
import { Input } from './Input';
import { FormProvider, useForm } from 'react-hook-form'

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
                        <form onSubmit={e => e.preventDefault()}
                            noValidate>
                            {/* Nombre del cliente */}
                            <div className="field" style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                                <Input
                                    label="nome"
                                    type="text"
                                    name="nameCustomer"
                                    placeholder="Nome"
                                    value={formData2.nameCustomer || ""}
                                    onChange={handleChange}
                                />

                                <Input
                                    label="cognome"
                                    type="text"
                                    name="surnameCustomer"
                                    placeholder='Cognome'
                                    value={formData2.surnameCustomer || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field">
                                <div className="control">
                                    <Input
                                        label={"Telefono:"}
                                        type="text"
                                        name="phoneNumber"
                                        placeholder='Telefono'
                                        value={formData2.phoneNumber || ""}
                                        onChange={handleChange}
                                        pattern="[0-9]*" // Solo permite números

                                    />
                                </div>
                            </div>

                            <div className="field">
                                <div className="control">
                                    <Input
                                        label={"Modello"}
                                        type="text"
                                        name="modelPhone"
                                        placeholder='Modello'
                                        value={formData2.modelPhone || ""}
                                        onChange={handleChange}
                                    />
                                </div>
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

                            <div className="field">
                                <div className="control">
                                    <Input
                                        label={"Defetto:"}
                                        type="text"
                                        name="defect"
                                        placeholder='Defetto'
                                        value={formData2.defect || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <div className="control">
                                    <Input
                                        label={"Pezzo"}
                                        type="text"
                                        name="pieceName"
                                        placeholder='Pezzo'
                                        value={formData2.pieceName || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <div className="control">
                                    <Input
                                        label={"Costo"}
                                        placeholder={"Costo"}
                                        type="number"
                                        name="price"
                                        value={formData2.price || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label is-small">Stato:</label>
                                <div className="control">
                                    <div className="select" style={{ color: 'black' }}>
                                        <select
                                            name="status"
                                            value={formData2.status || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="0">Pending</option>
                                            <option value="1">In Progress</option>
                                            <option value="2">Finished</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label is-small">Spedito:</label>
                                <div className="control">
                                    <div className="select">
                                        <select
                                            name="shipped"
                                            value={formData2.shipped || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="0">No</option>
                                            <option value="1">Yes</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label is-small">Note:</label>
                                <div className="control">
                                    <textarea
                                        className="textarea"
                                        name="notes"
                                        value={formData2.notes || ""}
                                        onChange={handleChange}
                                        placeholder='Enter notes...'
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <div className="control" style={{ minWidth: 100 }}>
                                    <label className="checkbox" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                        Garanzia:
                                        <input
                                            type="checkbox"
                                            name="guarantee"
                                            checked={formData2.guarantee || false}
                                            onChange={handleChange}
                                            style={{ maxWidth: 50, margin: 0 }} // Ajusta el espacio entre el checkbox y el texto
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="field">
                                <div className="control" style={{ minWidth: 100 }}>
                                    <label className="checkbox" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                        Finito:
                                        <input
                                            type="checkbox"
                                            name="finished"
                                            checked={formData2.finished || false}
                                            onChange={handleChange}
                                            style={{ maxWidth: 50, margin: 0 }} // Ajusta el espacio entre el checkbox y el texto
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
        </div>
    );
}

export default ModalEdit;
