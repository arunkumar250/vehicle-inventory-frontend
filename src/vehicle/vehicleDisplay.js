document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const brandName = urlParams.get('brand');
    const vehicleId = urlParams.get('brandId');
    const customerId = sessionStorage.getItem('customerId');
    const maintainBrandName = sessionStorage.setItem('brandName',brandName);
    let cart = [];
    let totalAmount = 0;

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keyup', function(event) {
        const searchTerm = event.target.value.trim();
        if (searchTerm.length > 0) {
            fetchSearchResults(searchTerm);
        } else {
            fetchBrandVehicles(brandName);
        }
    });

    if (brandName) {
        localStorage.setItem('brandName', brandName); // Save the brand name in local storage
        fetchBrandVehicles(brandName);
    } else if (vehicleId) {
        fetch(`http://localhost:8090/vehicleinventory/vehicles/${vehicleId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    populateVehicleDetails(data.data);
                } else {
                    alert("Failed to fetch vehicle details: " + data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('Error fetching data. Please try again later.');
            });
    } else {
        console.error('Brand name or Vehicle ID not specified in URL');
        alert('Brand name or Vehicle ID not specified in URL');
    }

    function fetchSearchResults(searchTerm) {
        fetch(`http://localhost:8090/vehicleinventory/vehicles/search?searchTerm=${searchTerm}`)
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
    }

    function fetchBrandVehicles(brandName) {
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
                <td><input type="number" class="vehicle-count" data-vehicle-id="${item.vehicleId}" max="${item.availableCount}"></td>
                <td><button class="action-button" data-vehicle-id="${item.vehicleId}">Add to Cart</button></td>
            `;
            tableBody.appendChild(row);
        });
        attachButtonListeners();
    }

    function populateVehicleDetails(vehicle) {
        const tableBody = document.getElementById('vehicleTableBody');
        tableBody.innerHTML = '';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vehicle.brand.brandName}</td>
            <td>${vehicle.model}</td>
            <td>${vehicle.engineCapacity} cc</td>
            <td>${vehicle.price}</td>
            <td>${vehicle.availableCount}</td>
            <td><input type="number" class="vehicle-count" data-vehicle-id="${vehicle.vehicleId}" max="${vehicle.availableCount}"></td>
            <td><button class="action-button" data-vehicle-id="${vehicle.vehicleId}">Add to Cart</button></td>
        `;
        tableBody.appendChild(row);
        attachButtonListeners();
    }

    function attachButtonListeners() {
        const buttons = document.querySelectorAll('.action-button');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const vehicleId = parseInt(this.getAttribute('data-vehicle-id'), 10);
                const input = this.closest('tr').querySelector('.vehicle-count');
                const count = parseInt(input.value, 10);

                if (!isNaN(vehicleId) && !isNaN(count) && count > 0) {
                    addToCart(vehicleId, count, this);
                } else {
                    alert('Invalid vehicleId or count:', vehicleId, count);
                }
            });
        });
    }

    function addToCart(vehicleId, count, button) {
        const input = button.closest('tr').querySelector('.vehicle-count');
        const availableCount = parseInt(input.max, 10);
        const price = parseFloat(button.closest('tr').querySelector('td:nth-child(4)').textContent);

        // if (count > availableCount) {
        //     alert(`Cannot add more than ${availableCount} vehicles`);
        //     return;
        // }

        const cartItem = cart.find(item => item.vehicleId === vehicleId);
        if (!cartItem) {
            cart.push({ vehicleId, count, price, brand: button.closest('tr').querySelector('td:nth-child(1)').textContent, model: button.closest('tr').querySelector('td:nth-child(2)').textContent });
            totalAmount += price * count;
            document.getElementById('cartTotal').textContent = totalAmount.toFixed(2);
            document.getElementById('cartSummaryButton').style.display = 'block';
            alert('Vehicle added to cart');
            updateButtonState(button, true);
        } else {
            alert('Vehicle is already in the cart');
        }
    }

    function updateButtonState(button, added) {
        if (added) {
            button.textContent = 'Added';
            button.style.backgroundColor = 'green';
            button.style.color = 'white';
            button.disabled = true;
        } else {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = '';
            button.style.color = '';
            button.disabled = false;
        }
    }

    document.getElementById('backButton').addEventListener('click', function() {
        if (customerId) {
            window.location.href = `../user/customer/customerPage.html?id=${customerId}`;
        } else {
            window.location.href = '../user/customer/customerPage.html';
        }
    });

    document.getElementById('buyButton').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('No vehicles in the cart');
            return;
        }

        // Store cart data in local storage
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('totalAmount', totalAmount.toFixed(2));
        window.location.href = '../order/purchaseSummary.html';
    });

    document.getElementById('cartSummaryButton').addEventListener('click', function() {
        alert('Cart Items:\n' + JSON.stringify(cart, null, 2));
    });

    function resetTable() {
        fetchBrandVehicles(brandName);
    }
});
``
