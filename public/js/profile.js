window.addEventListener("DOMContentLoaded", (event) => {
    const logoutBtn = document.getElementById("log-out-btn");

    async function logout() {
        if (confirm("Do you really want to log out?") === true) {
            let response = await fetch("../signOut", {
                method: "DELETE",
            });
            if (response.status === 200) window.location.href = "../signIn";
        }
    }

    logoutBtn.addEventListener("click", logout);
});
