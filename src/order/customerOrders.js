document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = sessionStorage.getItem('customerId');
    const userId = urlParams.get('userId');

    fetch(`http://localhost:8090/sales/users/${userId}`)
        .then(response => response.json())
        .then(responseData => {
            if (responseData.success) {
                const data = responseData.data;
                // Sort orders by saleDate in descending order
                data.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));
                populateOrdersTable(data);
            } else {
                console.error('Error fetching orders:', responseData.message);
            }
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
        });

    function populateOrdersTable(data) {
        const tableBody = document.getElementById('ordersTableBody');
        tableBody.innerHTML = '';
        data.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.saleId}</td>
                <td>${order.userId}</td>
                <td>${new Date(order.saleDate).toLocaleString()}</td>
                <td>${order.salePrice}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    document.getElementById('backButton').addEventListener('click', function() {
        if (customerId) {
            window.location.href = `../user/customer/customerPage.html?id=${customerId}`;
        } else {
            window.location.href = '../user/customer/customerPage.html';
        }
    });
});
