window.addEventListener("DOMContentLoaded", (event) => {
    const forgotPasswordForm = document.getElementById("forgot-password-form");
    const emailInput = document.getElementById("email-input");
    const alertMessage = document.querySelector(".alert-message");
    function showAlert(content, color) {
        alertMessage.innerHTML = content;
        alertMessage.classList.add("show");
        alertMessage.style.color = color;
    }

    async function forgotPassword(e) {
        e.preventDefault();

        let captchaToken = grecaptcha.getResponse();
        if (!captchaToken) {
            showAlert("Please complete captcha first", "red");
            return;
        }
        showAlert("Please wait for response...", "green");
        let res = await fetch("./forgotPassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: emailInput.value,
                captchaToken,
            }),
        });
        if (res.status === 200) {
            res = await res.json();
            showAlert(res.msg, "green");
        } else {
            res = await res.json();
            showAlert(res.error, "red");
            grecaptcha.reset();
        }
    }

    forgotPasswordForm.addEventListener("submit", forgotPassword);
});
