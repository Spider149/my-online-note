window.addEventListener("DOMContentLoaded", (event) => {
    const signupForm = document.getElementById("sign-up-form");
    const usernameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");
    const nameInput = document.getElementById("name-input");

    async function signup(e) {
        e.preventDefault();

        let res = await fetch("./signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: nameInput.value,
                username: usernameInput.value,
                password: passwordInput.value,
            }),
        });
        if (res.status === 200) window.location.href = "../signin";
        else {
            res = await res.json();
            alert(res.error);
        }
    }

    signupForm.addEventListener("submit", signup);
});
