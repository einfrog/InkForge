import React, { useState, useEffect } from 'react';
import * as apiService from '../services/apiService';

const AdminTest = () => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const testAdminAccess = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const data = await apiService.testAdminAccess(token);
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 >Admin Access Test</h2>
            <button 
                onClick={testAdminAccess}
                disabled={loading}
            >
                {loading ? 'Testing...' : 'Test Admin Access'}
            </button>

            {error && (
                <div >
                    Error: {error}
                </div>
            )}

            {result && (
                <div >
                    <h3 >Success!</h3>
                    <pre >
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default AdminTest; 