window.addEventListener("DOMContentLoaded", (event) => {
    const signinForm = document.getElementById("sign-in-form");
    const usernameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");

    async function signin(e) {
        e.preventDefault();
        console.log(window.location.href);
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
            alert(res.error);
        }
    }

    signinForm.addEventListener("submit", signin);
});
