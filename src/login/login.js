document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Clear previous error messages
        document.getElementById('usernameError').textContent = '';
        document.getElementById('passwordError').textContent = '';

        try {
            const response = await fetch("http://localhost:8090/vehicleinventory/users/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Handle incorrect password
                    document.getElementById('passwordError').textContent = 'Incorrect password';
                } else if (response.status === 404) {
                    // Handle username not found
                    document.getElementById('usernameError').textContent = 'Username does not exist';
                } else {
                    throw new Error('Login failed');
                }
                return;
            }

            const responseData = await response.json(); // Parse JSON response

            // Extract userId and role from responseData
            const userId = responseData.userId;
            const userRole = responseData.role;
            sessionStorage.setItem('userId', userId);

            // Redirect based on user role
            if (userRole.roleName === 'admin') {
                window.location.href = `../user/admin/AdminPage.html?id=${userId}`;
            } else {
                window.location.href = `../user/customer/customerPage.html?id=${userId}`;
            }

        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    });

    // Event listener for signup button
    document.getElementById('signupButton').addEventListener('click', () => {
        window.location.href = '../signup/signup.html';
    });
});
