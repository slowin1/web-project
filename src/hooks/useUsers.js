import { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '../api/admin';

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const data = await usersAPI.getAll(params);
            setUsers(data.data || data);
        } catch (err) {
            setError(err.message);
            // Fallback to mock data for development
            setUsers([
                { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', joinedAt: '2024-01-15' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'editor', status: 'active', joinedAt: '2024-02-20' },
                { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'user', status: 'inactive', joinedAt: '2024-03-10' },
                { id: 4, name: 'Mary Johnson', email: 'mary@example.com', role: 'user', status: 'active', joinedAt: '2024-04-05' },
            ]);
        } finally {
            setLoading(false);
        }
    }, []);

    const createUser = async (userData) => {
        try {
            const newUser = await usersAPI.create(userData);
            setUsers(prev => [...prev, newUser.data || newUser]);
            return newUser;
        } catch (err) {
            throw err;
        }
    };

    const updateUser = async (id, userData) => {
        try {
            const updated = await usersAPI.update(id, userData);
            setUsers(prev => prev.map(user => user.id === id ? { ...user, ...updated.data } : user));
            return updated;
        } catch (err) {
            throw err;
        }
    };

    const deleteUser = async (id) => {
        try {
            await usersAPI.delete(id);
            setUsers(prev => prev.filter(user => user.id !== id));
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        loading,
        error,
        refreshUsers: fetchUsers,
        createUser,
        updateUser,
        deleteUser,
    };
}
