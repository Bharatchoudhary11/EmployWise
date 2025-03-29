import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        general: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
        // Clear errors when user starts typing
        setErrors({
            email: '',
            password: '',
            general: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ email: '', password: '', general: '' });
        setSuccessMessage('');
    
        // Check password specifically
        if (credentials.password !== 'cityslicka') {
            setErrors({ ...errors, password: 'Please enter the correct password' });
            return; // Stop here if password is wrong
        }
    
        try {
            const response = await axios.post('https://reqres.in/api/login', credentials);
            if (response.data.token) {
                setSuccessMessage('Login successful!');
                localStorage.setItem('authToken', response.data.token);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            }
        } catch (err) {
            if (credentials.email !== 'eve.holt@reqres.in' && credentials.password !== 'cityslicka') {
                setErrors({ ...errors, general: 'Both email and password are incorrect' });
            } else if (credentials.email !== 'eve.holt@reqres.in') {
                setErrors({ ...errors, email: 'Incorrect email address' });
            } else if (credentials.password !== 'cityslicka') {
                setErrors({ ...errors, password: 'Incorrect password' });
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    {errors.general && <div className="error-message">{errors.general}</div>}
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={credentials.email}
                            onChange={handleChange}
                            className={errors.email ? 'input-error' : ''}
                            required
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={handleChange}
                            className={errors.password ? 'input-error' : ''}
                            required
                        />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;