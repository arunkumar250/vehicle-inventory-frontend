document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalAmount = 0.00;
    const brandName = localStorage.getItem('brandName') || '';

    function populateSummaryTable() {
        const tableBody = document.getElementById('summaryTableBody');
        tableBody.innerHTML = '';
        cart.forEach(item => {
            const row = document.createElement('tr');
            const gstRate = calculateGstRate(item.vehicleId);
            const gstAmount = (item.price * item.count * gstRate).toFixed(2);
            const subtotal = (item.price * item.count).toFixed(2);
            // alert( (item.price * item.count));
            totalAmount += parseFloat(subtotal) + parseFloat(gstAmount); // Update total amount correctly

            row.innerHTML = `
                <td>${item.brand}</td>
                <td>${item.model}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>${item.count}</td>
                <td>₹${subtotal}</td>
                <td>${(gstRate * 100).toFixed(2)}%</td>
                <td>₹${gstAmount}</td>
            `;
            tableBody.appendChild(row);
        });
        document.getElementById('totalAmount').textContent = `${totalAmount.toFixed(2)}`; // Display total amount correctly
    }

    function calculateGstRate(vehicleId) {
        let engineCapacity;
        const item = cart.find(item => item.vehicleId === vehicleId);
        if (item) {
            engineCapacity = item.engineCapacity;
        } else {
            engineCapacity = 100; // Default value if engine capacity is not found
        }

        if (engineCapacity <= 100) {
            return 0.18; // 18% GST for engine capacity <= 100cc
        } else if (engineCapacity <= 150) {
            return 0.28; // 28% GST for engine capacity > 100cc and <= 150cc
        } else {
            return 0.43; // 43% GST for engine capacity > 150cc
        }
    }

    document.getElementById('confirmButton').addEventListener('click', function() {
        const payload = {
            userId: parseInt(sessionStorage.getItem('userId')), // Replace with actual logic to get user ID
            vehicles: cart
        };
        alert(JSON.stringify(payload))
        fetch('http://localhost:8090/sales/addsales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then(response => {
            if (response.ok) {
                alert('Purchase successful');
                localStorage.removeItem('cart');
                localStorage.removeItem('totalAmount');
                window.location.href = `../vehicle/vehicleDisplay.html?brand=${encodeURIComponent(brandName)}`;
            } else {
                return response.json().then(data => {
                    throw new Error(data.message || 'Unknown error');
                });
            }
        })
        .catch(error => {
            console.error('Error during purchase:', error);
            alert('Error during purchase: ' + error.message);
        });
    });

    const cancel = document.getElementById("cancelButton");
    cancel.addEventListener('click',function() {
        const brandName = sessionStorage.getItem('brandName');
        window.location.href = `../vehicle/vehicleDisplay.html?brand=${brandName}`;
    })

    populateSummaryTable();
});
