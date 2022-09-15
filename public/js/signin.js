window.addEventListener("DOMContentLoaded", (event) => {
    const signinForm = document.getElementById("sign-in-form");
    const usernameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");
    const warningMessage = document.querySelector(".warning-message");
    function showWarning(content) {
        warningMessage.innerHTML = content;
        warningMessage.classList.add("show");
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
            showWarning(res.error);
        }
    }

    signinForm.addEventListener("submit", signin);
});
