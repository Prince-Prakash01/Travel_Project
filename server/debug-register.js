// Built-in fetch is used

async function debugRegister() {
    const testEmail = `debug${Date.now()}@example.com`;
    const registerData = {
        name: 'Debug User',
        email: testEmail,
        password: 'password123'
    };

    console.log('Attempting to register with:', registerData);

    try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
        });

        const data = await response.json();

        console.log('Status:', response.status);
        console.log('Response:', data);

        if (!response.ok) {
            console.error('Registration Failed!');
        } else {
            console.log('Registration Successful!');
        }

    } catch (error) {
        console.error('Network Error:', error.message);
    }
}

debugRegister();
