// api service files with all API calls

const API = 'http://localhost:5000/api';

// USER API CALLS
export async function login(email, password) {
    console.log('Making login request to:', `${API}/auth/login`)
    const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
        credentials: 'include'
    });

    console.log('Login response status:', response.status)
    if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed with error:', errorData)
        throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    console.log('Login response data:', data)
    return data;
}

export function handleLogout(navigate) {

    localStorage.removeItem('token');
    navigate('/');
}

// sends a GET request to /users with the user's Bearer token
export async function getUsers(token) {
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API}/inkforge_users`, {
        method: 'GET',
        headers
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    return await response.json(); // returns user list
}

//get userby id, fetch specific user's data
export async function getUserById(id, token) {
    //fetch user by id
    const response = await fetch(`${API}/inkforge_users/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user by ID');
    }

    return await response.json(); // returns user object
}

// sends a POST request to /users with the new user's data
export const createUser = async (userData) => {
    let response = null;
    try {
        response = await fetch(`${API}/inkforge_users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userData.username,
                email: userData.email,
                password: userData.password,
                biography: userData.biography
            }),
        });
    } catch (error) {
        throw new Error(error.message || 'Something went wrong while creating the user');
    }
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
    }

    return await response.json();
};

//sends a PUT request to /users/:id with the updated user information
export async function updateUser(userId, updatedUserData) {
    try {
        const token = localStorage.getItem("token"); // or however you store it
        const response = await fetch(`${API}/inkforge_users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updatedUserData),
        });

        if (!response.ok) {
            throw new Error("Error updating user");
        }

        return await response.json();
    } catch (error) {
        throw new Error(error);
    }
}

//sends a DELETE request to /users/:id
export async function deleteUser(userId) {
    let response = null;
    try {
        const token = localStorage.getItem("token");

        response = await fetch(`${API}/inkforge_users/${userId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    } catch (error) {
        throw new Error(error.message || "Failed to delete user");
    }

    if (!response.ok) {
        throw new Error("Error deleting user");
    }

    return await response.json();

}

// Test admin access
export async function testAdminAccess(token) {
    const response = await fetch(`${API}/inkforge_users/admin-test`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify admin access');
    }

    return await response.json();
}

// Check if current user is admin
export function isAdmin() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role === 'admin';
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
    }
}

// PROJECT API CALLS
export async function getOwnProjects(token) {
    const response = await fetch(`${API}/projects/own`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch own projects');
    }

    return await response.json(); // returns list of projects
}

export async function getProjectById(id, token) {
    //fetch user by id
    const response = await fetch(`${API}/projects/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch project by ID');
    }

    return await response.json(); // returns user object
}

export async function getPublicProjects() {
    const response = await fetch(`${API}/projects?visibility=public`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch public projects');
    }

    const data = await response.json();
    return data;
}