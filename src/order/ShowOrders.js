document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:8090/sales/getall')
        .then(response => response.json())
        .then(data => {
            if (data && data.data && Array.isArray(data.data)) {
                populateOrdersTable(data.data);
            } else {
                throw new Error('Invalid data format received');
            }
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
        });

    function populateOrdersTable(data) {
        const tableBody = document.getElementById('ordersTableBody');
        tableBody.innerHTML = '';

        data.forEach(order => {
            fetch(`http://localhost:8090/vehicleinventory/users/${order.userId}`)
                .then(response => response.json())
                .then(userData => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${order.saleId}</td>
                        <td>${order.userId}</td>
                        <td>${userData.username}</td>
                        <td>${userData.email}</td>
                        <td>${userData.phone}</td>
                        <td>${order.saleDate ? new Date(order.saleDate).toLocaleString() : 'N/A'}</td>
                        <td>${order.salePrice}</td>
                    `;
                    tableBody.appendChild(row);
                })
                .catch(error => {
                    console.error(`Error fetching user details for user ID ${order.userId}:`, error);
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${order.saleId}</td>
                        <td>${order.userId}</td>
                        <td>N/A</td>
                        <td>N/A</td>
                        <td>N/A</td>
                        <td>${order.saleDate ? new Date(order.saleDate).toLocaleString() : 'N/A'}</td>
                        <td>${order.salePrice}</td>
                    `;
                    tableBody.appendChild(row);
                });
        });
    }

    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', function() {
        window.location.href = '../user/admin/AdminPage.html';
    });
});
