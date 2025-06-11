// api service files with all API calls

const API = 'http://localhost:5000/api';

//login functionality, send POST to /auth/login; if login successful it returns token;
export async function login(email, password) {
    console.log('Making login request to:', `${API}/auth/login`)
    const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //extra info about the request im sending, f.e. that im sending/expecting JSON format, so API knows how to read it
        body: JSON.stringify({email, password}), //convert a JavaScript object into a JSON string
    });

    console.log('Login response status:', response.status)
    if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed with error:', errorData)
        throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    console.log('Login response data:', data)
    return data; // returns token, in LoginPage component it is saved in data and stored in localStorage
}

//handlelogout asks for navigate = useNavigate to navigate back to the homepage;
export function handleLogout(navigate) {
    // return token from localstorage and navigate back to homepage
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
    const response = await fetch(`${API}/users/${id}`, {
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
        //use token to authorize
        const token = localStorage.getItem('token');
        response = await fetch(`${API}/users`, {
            //post method
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: userData.name,
                surname: userData.surname,
                hero: userData.hero,
                email: userData.email,
                password: userData.password,
                info: userData.info
            }),
        });
    } catch (error) {
        throw new Error(error.message || 'Something went wrong while creating the user');
    }
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user'); //when first value=false, then go to next value;
    }

    return await response.json(); // Return the created user or success message
};

//sends a PUT request to /users/:id with the updated user information
export async function updateUser(userId, updatedUserData) {
    try {
        const token = localStorage.getItem("token"); // or however you store it
        const response = await fetch(`${API}/users/${userId}`, {
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

        response = await fetch(`${API}/users/${userId}`, {
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

