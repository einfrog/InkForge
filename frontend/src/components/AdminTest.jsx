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
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Admin Access Test</h2>
            <button 
                onClick={testAdminAccess}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                {loading ? 'Testing...' : 'Test Admin Access'}
            </button>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    Error: {error}
                </div>
            )}

            {result && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
                    <h3 className="font-bold">Success!</h3>
                    <pre className="mt-2 whitespace-pre-wrap">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default AdminTest; 