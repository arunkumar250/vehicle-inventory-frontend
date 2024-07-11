document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const dobInput = document.getElementById('dob');
    
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const dobError = document.getElementById('dobError');

    // Username availability check
    usernameInput.addEventListener('input', function() {
        const username = usernameInput.value.trim();
        if (username) {
            checkUsernameAvailability(username);
        }
    });

    function checkUsernameAvailability(username) {
        fetch(`http://localhost:8090/vehicleinventory/users/name/${username}`)
            .then(response => response.json())
            .then(data => {
                if (data==true) {
                    usernameError.textContent = 'Username is Not available';
                } else {
                    usernameError.textContent = '';
                }
            })
            .catch(error => {
                console.error('Error checking username availability:', error);
            });
    }

    // Password validation
    passwordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        validatePassword(password);
    });

    function validatePassword(password) {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/;
        if (!strongPasswordRegex.test(password)) {
            passwordError.textContent = 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long.';
        } else {
            passwordError.textContent = '';
        }
    }

    // Email format validation
    emailInput.addEventListener('input', function() {
        const email = emailInput.value.trim();
        validateEmail(email);
    });

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailError.textContent = 'Invalid email format';
        } else {
            emailError.textContent = '';
        }
    }

    // Phone number format validation
    phoneInput.addEventListener('input', function() {
        let phoneNumber = phoneInput.value.trim();
        // Restrict input to 10 digits
        if (phoneNumber.length > 10) {
            phoneNumber = phoneNumber.slice(0, 10);
            phoneInput.value = phoneNumber;
        }
        validatePhoneNumber(phoneNumber);
    });

    function validatePhoneNumber(phoneNumber) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            phoneError.textContent = 'Phone number must be exactly 10 digits';
        } else {
            phoneError.textContent = '';
        }
    }

    // Age validation (18 years or older)
    dobInput.addEventListener('input', function() {
        const dob = new Date(dobInput.value);
        if (isValidAge(dob)) {
            dobError.textContent = '';
        } else {
            dobError.textContent = 'Must be 18 years or older';
        }
    });

    function isValidAge(dateOfBirth) {
        const today = new Date();
        const age = today.getFullYear() - dateOfBirth.getFullYear();
        const monthDiff = today.getMonth() - dateOfBirth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
            age--;
        }
        return age >= 18;
    }

    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting initially
    
        if (isFormValid()) {
            // Construct the user data object from the form inputs
            const userData = {
                email: emailInput.value.trim(),
                password: passwordInput.value,
                phone: phoneInput.value.trim(),
                username: usernameInput.value.trim(),
                dateOfBirth: dobInput.value,
                role: {
                    roleId: 2 // Assuming roleId 2 corresponds to the role for new users
                }
            };
    
            // Send a POST request to the API to add the user
            fetch('http://localhost:8090/vehicleinventory/users/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Registration successful
                alert('Successfully registered! Redirecting to login page.');
                // Redirect to login.html after successful registration
                window.location.href = '../login/login.html';
            })
            .catch(error => {
                console.error('Error adding user:', error);
                alert('Failed to register. Please try again later.');
            });
        }
    });

    function isFormValid() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const email = emailInput.value.trim();
        const phoneNumber = phoneInput.value.trim();
        const dob = new Date(dobInput.value);

        let isValid = true;

        // Validate username availability
        if (!username) {
            usernameError.textContent = 'Username is required';
            isValid = false;
        }

        // Validate password strength
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/;
        if (!strongPasswordRegex.test(password)) {
            passwordError.textContent = 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long.';
            isValid = false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailError.textContent = 'Invalid email format';
            isValid = false;
        }

        // Validate phone number format
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            phoneError.textContent = 'Phone number must be exactly 10 digits';
            isValid = false;
        }

        // Validate age (18 years or older)
        if (!isValidAge(dob)) {
            dobError.textContent = 'Must be 18 years or older';
            isValid = false;
        }

        return isValid;
    }

    const login = document.getElementById("loginButton");
    login.addEventListener("click",function() {
        window.location.href = '../login/login.html';
    })
});
