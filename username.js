// Get the button and the input field from the HTML
const button = document.querySelector('button');
const inputField = document.getElementById('username');

// Listen for a click on the button
button.addEventListener('click', async () => {
    const username = inputField.value.trim();

    // Make sure they actually typed something
    if (username === "") {
        alert("Please enter a username!");
        return;
    }

    // Change button text to show it's working
    button.textContent = "Saving...";
    button.disabled = true;

    try {
        // Send the data to your server using a POST request
        // NOTE: '/save-username' is a placeholder URL. 
        // You will need a backend server running to actually receive this.
        const response = await fetch('/save-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username })
        });

        if (response.ok) {
            alert(`Success! Username "${username}" was sent to the server.`);
            inputField.value = ""; // Clear the input
        } else {
            alert("Oops! Something went wrong on the server.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Could not connect to the server.");
    } finally {
        // Reset the button
        button.textContent = "Continue";
        button.disabled = false;
    }
});