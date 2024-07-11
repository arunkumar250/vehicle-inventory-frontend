document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:8090/vehicleinventory/users/getalluser')
        .then(response => response.json())
        .then(data => {
            populateUserTable(data);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });

    function populateUserTable(data) {
        const userTableBody = document.getElementById('userTableBody');
        userTableBody.innerHTML = '';
        data.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.userId}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.role.roleName}</td>
                <td>${new Date(user.dateOfBirth).toLocaleDateString()}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            `;
            userTableBody.appendChild(row);
        });
    }

    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', function() {
        window.location.href = 'admin/AdminPage.html';
    });
});
