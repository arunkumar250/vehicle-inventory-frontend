document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('name');
    const url = `http://localhost:8090/vehicleinventory/vehicles/search/${searchTerm}`; // Endpoint for fetching search results

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                populateSearchResults(data.data);
            } else {
                console.error('Failed to fetch vehicles:', data.message);
                alert('Failed to fetch vehicles. Please try again later.');
            }
        })
        .catch(error => {
            console.error('Error fetching vehicles:', error);
            alert('Error fetching vehicles. Please try again later.');
        });

    function populateSearchResults(vehicles) {
        const vehicleListElement = document.getElementById('vehicleList');
        vehicleListElement.innerHTML = ''; // Clear previous results

        vehicles.forEach(vehicle => {
            const vehicleCard = document.createElement('div');
            vehicleCard.classList.add('vehicle-card');
            vehicleCard.innerHTML = `
                <div class="vehicle-model">${vehicle.model}</div>
                <div class="vehicle-price">Price: ${vehicle.price}</div>
                <div class="vehicle-engine">Engine Capacity: ${vehicle.engineCapacity} cc</div>
                <div class="vehicle-brand">Brand: ${vehicle.brand.brandName}</div>
                <div class="vehicle-created-at">Created At: ${new Date(vehicle.createdAt).toLocaleString()}</div>
                <button class="view-details-btn" data-vehicle-id="${vehicle.vehicleId}">View Details</button>
            `;
            vehicleListElement.appendChild(vehicleCard);
        });

        // Attach event listeners to view details buttons
        const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', function() {
                const vehicleId = this.getAttribute('data-vehicle-id');
                if (vehicleId) {
                    window.location.href = `vehicleDisplay.html?id=${vehicleId}`;
                } else {
                    alert('Invalid vehicle selected');
                }
            });
        });
    }
});
