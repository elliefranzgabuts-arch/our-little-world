// ==================================================
// LOGIN
// ==================================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // ==================================================
            // GET INPUT
            // ==================================================

            const username =
                document.getElementById(
                    "username"
                ).value.trim();


            const password =
                document.getElementById(
                    "password"
                ).value;


            const message =
                document.getElementById(
                    "message"
                );


            // ==================================================
            // LOGIN ACCOUNT
            // ==================================================

            const correctUsername =
                "Baby";


            const correctPassword =
                "12.23";


            // ==================================================
            // CHECK LOGIN
            // ==================================================

            if (
                username === correctUsername &&
                password === correctPassword
            ) {

                // Save username
                localStorage.setItem(
                    "username",
                    username
                );


                // Go to dashboard
                window.location.href =
                    "dashboard.html";

            }

            else {

                message.textContent =
                    "Incorrect username or password.";

            }

        }
    );

}



// ==================================================
// SECRET PASSWORD
// ==================================================

const secretPassword =
    "41406";



// ==================================================
// SECRET UNLOCK FUNCTION
// ==================================================

function unlockSecret() {

    const input =
        document.getElementById(
            "secretPassword"
        );


    const error =
        document.getElementById(
            "wrongPassword"
        );


    const lockScreen =
        document.getElementById(
            "lockScreen"
        );


    const secretContent =
        document.getElementById(
            "secretContent"
        );


    // ==================================================
    // CHECK ELEMENTS
    // ==================================================

    if (
        !input ||
        !error ||
        !lockScreen ||
        !secretContent
    ) {

        return;

    }


    // ==================================================
    // CHECK PASSWORD
    // ==================================================

    if (
        input.value.trim() ===
        secretPassword
    ) {

        // Hide lock screen
        lockScreen.style.display =
            "none";


        secretContent.style.display =
            "block";


        error.textContent = "";

    }

    else {

        error.textContent =
            "Wrong password... try again ❤️";


        input.value = "";


        input.focus();

    }

}



// ==================================================
// LOGOUT
// ==================================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            // Remove login session
            localStorage.removeItem(
                "username"
            );


            // Return to login page
            window.location.href =
                "index.html";

        }
    );

}