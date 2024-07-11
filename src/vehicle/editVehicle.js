document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('vehicleId');

    if (vehicleId) {
        // Fetch existing vehicle details if vehicleId is present
        fetch(`http://localhost:8090/vehicleinventory/vehicles/${vehicleId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch vehicle data');
                }
                return response.json();
            })
            .then(data => {
                if (!data || !data.data || !data.data.brand || !data.data.brand.brandName) {
                    throw new Error('Invalid vehicle data received');
                }
                populateForm(data.data); // Access data.data to get the vehicle details
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('Error fetching vehicle data. Please try again later.');
            });
    } else {
        // Populate brandName if provided in URL
        const brandName = urlParams.get('brand');
        if (brandName) {
            document.getElementById('brandName').value = brandName;
        }
    }

    function populateForm(data) {
        try {
            document.getElementById('brandName').value = data.brand.brandName;
            document.getElementById('model').value = data.model;
            document.getElementById('price').value = data.price;
            document.getElementById('availableCount').value = data.availableCount;
            document.getElementById('engineCapacity').value = data.engineCapacity || ''; // Handle optional field
        } catch (error) {
            console.error('Error populating form:', error);
            alert('Error populating form with vehicle data.');
        }
    }

    document.getElementById('editVehicleForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const brandName = document.getElementById('brandName').value;

        fetch(`http://localhost:8090/vehicleinventory/brands/getbrandbyname/${brandName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch brand data');
                }
                return response.json();
            })
            .then(brandData => {
                const updatedVehicle = {
                    model: document.getElementById('model').value,
                    price: parseFloat(document.getElementById('price').value),
                    status: document.getElementById('availableCount').value > 0 ? 'available' : 'sold',
                    availableCount: parseInt(document.getElementById('availableCount').value, 10),
                    engineCapacity: parseInt(document.getElementById('engineCapacity').value, 10),
                    brand: {
                        brandId: brandData.brandId
                    }
                };

                const apiUrl = vehicleId ? `http://localhost:8090/vehicleinventory/vehicles/update/${vehicleId}` : 'http://localhost:8090/vehicles/add';

                const method = vehicleId ? 'PUT' : 'POST'; // Use PUT for update, POST for add

                fetch(apiUrl, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedVehicle),
                })
                .then(response => {
                    if (response.ok) {
                        alert(vehicleId ? 'Vehicle updated successfully' : 'Vehicle added successfully');
                        if (vehicleId) {
                            window.location.href = `AdminVehicleDisplay.html?brand=${brandName}`;
                        } else {
                            window.location.href = `AdminVehicleDisplay.html?brand=${brandName}`;
                        }
                    } else {
                        return response.json().then(data => {
                            throw new Error(data.message || 'Unknown error');
                        });
                    }
                })
                .catch(error => {
                    console.error('Error updating vehicle:', error);
                    alert('Error updating vehicle: ' + error.message);
                });
            })
            .catch(error => {
                console.error('Error fetching brand data:', error);
                alert('Error fetching brand data: ' + error.message);
            });
    });

    document.getElementById('backButton').addEventListener('click', function() {
        window.history.back(); // Go back to the previous page
    });
});
