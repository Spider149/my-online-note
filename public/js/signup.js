import { debounce } from "./utils.js";

window.addEventListener("DOMContentLoaded", (event) => {
    const signupForm = document.getElementById("sign-up-form");
    const usernameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");
    const passwordConfirmInput = document.getElementById(
        "confirm-password-input"
    );
    const nameInput = document.getElementById("name-input");
    const warningMessage = document.querySelector(".warning-message");
    function showWarning(content) {
        warningMessage.innerHTML = content;
        warningMessage.classList.add("show");
    }

    function hideWarning() {
        warningMessage.classList.remove("show");
    }

    function checkSamePassword() {
        if (passwordInput.value != passwordConfirmInput.value) {
            showWarning("Password does not match, please check again!");
            return false;
        } else {
            hideWarning();
            return true;
        }
    }

    passwordConfirmInput.addEventListener(
        "input",
        debounce(checkSamePassword, 200)
    );
    passwordInput.addEventListener("blur", checkSamePassword);
    passwordConfirmInput.addEventListener("focus", checkSamePassword);

    async function signup(e) {
        e.preventDefault();

        if (!checkSamePassword()) return;
        let captchaToken = grecaptcha.getResponse();
        if (!captchaToken) {
            showWarning("Please complete captcha first");
            return;
        }
        let res = await fetch("./signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: nameInput.value,
                username: usernameInput.value,
                password: passwordInput.value,
                captchaToken,
            }),
        });
        if (res.status === 200) window.location.href = "../signin";
        else {
            res = await res.json();
            showWarning(res.error);
            grecaptcha.reset();
        }
    }

    signupForm.addEventListener("submit", signup);
});
