document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); 

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.redirected) {
            this.reset();
            window.location.href = response.url; 
        } else {
            const result = await response.json();
            console.log("Server Response:", result);
        }
    } catch (error) {
        console.error("Registration Error:", error);
    }
});