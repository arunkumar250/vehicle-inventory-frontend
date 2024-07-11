document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const vehicleTableBody = document.getElementById('vehicleTableBody');
    const customerId = getUserIdFromUrl();

    // Store the customer ID in session storage
    if (customerId) {
        sessionStorage.setItem('customerId', customerId);
    }

    // Event listener for input changes in search box
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchBrands(searchTerm);
        } else {
            fetchAllBrands();
        }
    });

    // Function to fetch all brands
    function fetchAllBrands() {
        fetch('http://localhost:8090/vehicleinventory/brands/getallbrands')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch brands');
                }
                return response.json();
            })
            .then(data => {
                populateTable(data);
            })
            .catch(error => {
                console.error('Error fetching brands:', error);
                alert('Error fetching brands. Please try again later.');
            });
    }

    // Function to search brands by searchTerm
    function searchBrands(searchTerm) {
        fetch(`http://localhost:8090/vehicleinventory/brands/search?searchTerm=${encodeURIComponent(searchTerm)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch brands');
                }
                return response.json();
            })
            .then(data => {
                populateTable(data);
            })
            .catch(error => {
                console.error('Error searching brands:', error);
                alert('Error searching brands. Please try again later.');
            });
    }

    // Function to populate the table with brands
    function populateTable(data) {
        vehicleTableBody.innerHTML = '';
        data.forEach(brand => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${brand.brandName}</td>
                <td>${brand.type}</td>
                <td>${brand.availableModelsCount}</td>
                <td><button class="action-button" data-brand-id="${brand.brandId}">Buy ${brand.brandName}</button></td>
            `;
            vehicleTableBody.appendChild(row);
        });
        attachButtonListeners();
    }

    function attachButtonListeners() {
        const buttons = document.querySelectorAll('.action-button');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const brandId = this.getAttribute('data-brand-id');
                const brandName = this.closest('tr').querySelector('td:first-child').textContent;
                if (brandId && brandName) {
                    window.location.href = `../../vehicle/vehicleDisplay.html?brand=${encodeURIComponent(brandName)}`;
                } else {
                    console.error('Brand ID or Brand Name not found.');
                }
            });
        });
    }

    // Logout button event listener (if applicable in your application)
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            console.log('Logout clicked');
            window.location.href = '../../login/login.html'; // Redirect to login.html on logout
        });
    } else {
        console.error('Logout button not found');
    }

    // Show orders button event listener (if applicable in your application)
    const showOrdersButton = document.getElementById('showOrdersButton');
    if (showOrdersButton) {
        showOrdersButton.addEventListener('click', async function() {
            try {
                const userId = getUserIdFromUrl(); // Get user ID from URL
                if (!userId) {
                    console.error('User ID not found in URL');
                    return;
                }
    
                const username = await getUsernameFromUrl(userId); // Get username from API
                if (!username) {
                    console.error('Username not found');
                    return;
                }
    
                window.location.href = `../../order/customerOrders.html?userId=${userId}&username=${encodeURIComponent(username)}`;
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Function to get user ID from URL parameter (if applicable in your application)
    function getUserIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id'); // Assuming 'id' is used in the URL parameter for user ID
    }

    // Function to fetch username from API based on user ID (if applicable in your application)
    async function getUsernameFromUrl(userId) {
        const apiUrl = `http://localhost:8090/vehicleinventory/users/${userId}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }
            const userData = await response.json();
            return userData.username; // Assuming 'username' is the property containing the username
        } catch (error) {
            console.error('Error fetching user details:', error);
            return null;
        }
    }

    // Greeting message based on user's name (if applicable in your application)
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        const userId = getUserIdFromUrl(); // Get user ID from URL
        if (userId) {
            getUsernameFromUrl(userId)
                .then(username => {
                    greetingElement.textContent = `Hello ${username},`;
                })
                .catch(error => {
                    console.error('Error:', error);
                    greetingElement.textContent = 'Hello';
                });
        } else {
            console.error('User ID not found in URL');
            greetingElement.textContent = 'Hello';
        }
    } else {
        console.error('Greeting element not found');
    }

    // Fetch all brands initially when the page loads
    fetchAllBrands();
});
