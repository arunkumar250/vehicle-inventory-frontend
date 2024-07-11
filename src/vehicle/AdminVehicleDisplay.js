document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const brandName = urlParams.get('brand');

    if (brandName) {
        fetch(`http://localhost:8090/vehicleinventory/vehicles/findbybrandname/${brandName}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    populateTable(data.data);
                } else {
                    alert("Failed to fetch vehicles: " + data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('Error fetching data. Please try again later.');
            });
    } else {
        console.error('Brand name not specified in URL');
        alert('Brand name not specified in URL');
    }

    function populateTable(data) {
        const tableBody = document.getElementById('vehicleTableBody');
        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.brand.brandName}</td>
                <td>${item.model}</td>
                <td>${item.engineCapacity} cc</td>
                <td>${item.price}</td>
                <td>${item.availableCount}</td>
                <td><button class="edit-button" data-vehicle-id="${item.vehicleId}">Edit</button></td>
                <td><button class="delete-button" data-vehicle-id="${item.vehicleId}">Delete</button></td>
            `;
            tableBody.appendChild(row);
        });
        attachButtonListeners();
    }

    function attachButtonListeners() {
        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const vehicleId = parseInt(this.getAttribute('data-vehicle-id'), 10);
                window.location.href = `editVehicle.html?vehicleId=${vehicleId}`; // Pass vehicleId in URL
            });
        });

        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const vehicleId = parseInt(this.getAttribute('data-vehicle-id'), 10);
                if (confirm('Are you sure you want to delete this vehicle?')) {
                    deleteVehicle(vehicleId);
                }
            });
        });
    }

    document.getElementById('backButton').addEventListener('click', function() {
        window.location.href = '../user/admin/AdminPage.html';
    });

    document.getElementById('addVehicleButton').addEventListener('click', function() {
        window.location.href = `editVehicle.html?brand=${brandName}`;
    });
});
