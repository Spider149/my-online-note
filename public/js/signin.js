window.addEventListener("DOMContentLoaded", (event) => {
    const signinForm = document.getElementById("sign-in-form");
    const usernameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");
    const alertMessage = document.querySelector(".alert-message");

    function showAlert(content, color) {
        alertMessage.innerHTML = content;
        alertMessage.classList.add("show");
        alertMessage.style.color = color;
    }

    async function signin(e) {
        e.preventDefault();

        let res = await fetch("./signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value,
            }),
        });
        if (res.status === 200) window.location.href = "../dashboard";
        else {
            res = await res.json();
            showAlert(res.error, "red");
        }
    }

    signinForm.addEventListener("submit", signin);
});
