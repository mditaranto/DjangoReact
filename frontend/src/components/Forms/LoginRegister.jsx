import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
import LoadingIndicator from '../Utils/LoadingIndicator';
import { Input } from './Input';
import "../../styles/Login.css";
import { FormProvider, useForm } from 'react-hook-form';

function Form({ route, method }) {
    const methods = useForm();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    useEffect(() => {
        setFormData({ username: '', password: '' });

    }, []);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: inputValue });
    };

    const handleSubmit = methods.handleSubmit(async (e) => {
        setLoading(true);
        try {
            const res = await api.post(route, {
                username: formData.username,
                password: formData.password
            });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate('/');
            } else {
                navigate('/login');
            }
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    });

    return (
        <section class="hero is-success is-fullheight">
            <div class="hero-body">
                <div class="container has-text-centered">
                    <div class="column is-4 is-offset-4">
                        <h3 class="title has-text-black">{name}</h3>
                        <hr class="login-hr"></hr>
                        <p class="subtitle ha-text-black">Please {name} to proceed.</p>
                        <div class="box" style={{margin:'', backgroundColor: '#00D1B2' }}>
                            <br/>
                            <figure >
                                <img src="../../../public/img/logo.png" style={{width:320}}></img>
                            </figure>
                            <br/>
                            <FormProvider {...methods}>
                                <form onSubmit={e => e.preventDefault()} noValidate>
                                    <div class="field">
                                        <div class="control">   
                                            <Input
                                                type="text"
                                                name="username"
                                                className="input is-large"
                                                value={formData.username}
                                                placeholder="Your Username"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div class="field">
                                        <div class="control">
                                            <Input
                                                type="password"
                                                name="password"
                                                className="input is-large"
                                                value={formData.password}
                                                placeholder="Your Password"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    
                                    <button className="button is-block is-info is-large is-fullwidth" onClick={handleSubmit}>{name} <i class="fa fa-sign-in" aria-hidden="true"></i></button>
                                </form>
                            </FormProvider>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Form;
