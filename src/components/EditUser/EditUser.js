import React, { useState } from 'react';
import axios from 'axios';
import './EditUser.css';

const EditUser = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://reqres.in/api/users/${user.id}`, formData);
            if (response.status === 200) {
                setMessage('User updated successfully!');
                onUpdate({ ...user, ...formData });
                setTimeout(onClose, 1500);
            }
        } catch (error) {
            setMessage('Failed to update user. Please try again.');
        }
    };

    return (
        <div className="edit-modal">
            <div className="edit-content">
                <h2>Edit User</h2>
                {message && <div className="message">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit" className="save-btn">Save</button>
                        <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;