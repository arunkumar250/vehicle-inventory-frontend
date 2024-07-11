document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:8090/vehicleinventory/brands/getallbrands')
        .then(response => response.json())
        .then(data => {
            populateBrandTable(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    function populateBrandTable(data) {
        const tableBody = document.getElementById('vehicleTableBody');
        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.brandName}</td>
                <td>${item.type}</td>
                <td>${item.availableModelsCount}</td>
                <td><button class="action-button" data-brand="${item.brandName}">Show ${item.brandName} ${item.type}s</button></td>
            `;
            tableBody.appendChild(row);
        });
        attachButtonListeners();
    }

    function attachButtonListeners() {
        const buttons = document.querySelectorAll('.action-button');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const brandName = this.getAttribute('data-brand');
                window.location.href = `../../vehicle/AdminVehicleDisplay.html?brand=${brandName}`;
            });
        });
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            window.location.href = '../../login/login.html';
        });
    }

    const showOrdersButton = document.getElementById('showOrdersButton');
    if (showOrdersButton) {
        showOrdersButton.addEventListener('click', function() {
            window.location.href = '../../order/ShowOrders.html';
        });
    }

    const showUsersButton = document.getElementById('showUsersButton');
    if (showUsersButton) {
        showUsersButton.addEventListener('click', function() {
            window.location.href = '../UserDisplay.html';
        });
    }
});
