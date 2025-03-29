import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditUser from '../EditUser/EditUser';
import './Dashboard.css';

const Dashboard = () => {
    // Keep only one set of state declarations at the top
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // Changed from 6 to 1 and made it updatable
    const [loading, setLoading] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const navigate = useNavigate();

    const showMessage = useCallback((text, type) => {
        const timeoutId = setTimeout(() => {
            setMessage({ text: '', type: '' });
        }, 3000);
        setMessage({ text, type });
        return timeoutId;
    }, []);

    const fetchUsers = useCallback(async (page) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=6`);
            const { data: apiUsers, total_pages } = response.data;
            setAllUsers(apiUsers);
            setUsers(apiUsers);
            setTotalPages(total_pages);
        } catch (error) {
            console.error('Error:', error);
            showMessage('Failed to fetch users', 'error');
        } finally {
            setLoading(false);
        }
    }, [showMessage]);

    useEffect(() => {
        if (!allUsers.length) return;
        
        if (searchTerm) {
            const filtered = allUsers.filter(user => {
                const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
                return fullName.includes(searchTerm.toLowerCase());
            });
            setUsers(filtered);
        } else {
            setUsers(allUsers);
        }
    }, [searchTerm, allUsers]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        fetchUsers(currentPage);

        // Clean return without unused variables
        return () => {};
    }, [currentPage, navigate, fetchUsers]);

    const handleUpdate = async (updatedUser) => {
        try {
            await axios.put(`https://reqres.in/api/users/${updatedUser.id}`, updatedUser);
            setUsers(users.map(user => 
                user.id === updatedUser.id ? updatedUser : user
            ));
            setEditingUser(null);
            showMessage('User updated successfully!', 'success');
        } catch (error) {
            showMessage('Failed to update user', 'error');
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`https://reqres.in/api/users/${userId}`);
                setUsers(users.filter(user => user.id !== userId));
                showMessage('User deleted successfully!', 'success');
            } catch (error) {
                showMessage('Failed to delete user', 'error');
            }
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
    };

   

    // Add handlePageChange function
    const handlePageChange = (newPage) => {
        setSearchTerm('');
        setCurrentPage(newPage);
    };

    return (
        <div className="dashboard">
            

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            {loading ? (
                <div className="loading-spinner">Loading users...</div>
            ) : (
                <>
                    <div className="user-grid">
                        {users.map(user => (
                            <div key={user.id} className="user-card">
                                <img src={user.avatar} alt={`${user.first_name}`} />
                                <h3>{user.first_name} {user.last_name}</h3>
                                <p>{user.email}</p>
                                <div className="card-actions">
                                    <button onClick={() => handleEdit(user)} className="edit-btn">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(user.id)} className="delete-btn">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={currentPage === index + 1 ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {editingUser && (
                <EditUser 
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default Dashboard;