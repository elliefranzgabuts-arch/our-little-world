// ==================================================
// LOGIN SYSTEM
// ==================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // ==================================================
        // GET INPUT VALUES
        // ==================================================

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");

        // ==================================================
        // LOGIN ACCOUNT
        // ==================================================

        const correctUsername = "Baby";
        const correctPassword = "12.23";

        // ==================================================
        // CHECK LOGIN
        // ==================================================

        if (username === correctUsername && password === correctPassword) {
            // Save login session
            localStorage.setItem("username", username);

            // Redirect to dashboard
            window.location.href = "dashboard.html";
        } else {
            if (message) {
                message.textContent = "Incorrect username or password.";
            }
        }
    });
}

// ==================================================
// SECRET PAGE
// ==================================================

// ==================================================
// SECRET PASSWORD
// ==================================================

const secretPassword = "our_little_world";

// ==================================================
// GET SECRET PAGE ELEMENTS
// ==================================================

const secretLock = document.getElementById("secretLock");
const secretsContent = document.getElementById("secretsContent");
const passwordInput = document.getElementById("secretPassword");
const unlockBtn = document.getElementById("unlockBtn");
const errorMessage = document.getElementById("errorMessage");

// ==================================================
// CHECK LOGIN BEFORE ACCESSING SECRETS
// ==================================================

if (secretLock) {
    const username = localStorage.getItem("username");

    if (!username) {
        window.location.href = "index.html";
    }
}

// ==================================================
// CHECK IF SECRETS ARE ALREADY UNLOCKED
// ==================================================

if (secretLock && secretsContent) {
    const isUnlocked = sessionStorage.getItem("secretsUnlocked");

    if (isUnlocked === "true") {
        secretLock.style.display = "none";
        secretsContent.style.display = "block";
    }
}

// ==================================================
// UNLOCK SECRET FUNCTION
// ==================================================

function unlockSecret() {
    // Check if all elements exist
    if (!passwordInput || !errorMessage || !secretLock || !secretsContent) {
        console.log("Secret page elements not found.");
        return;
    }

    // Get password entered
    const enteredPassword = passwordInput.value.trim();

    // ==================================================
    // CORRECT PASSWORD
    // ==================================================

    if (enteredPassword === secretPassword) {
        // Clear error message
        errorMessage.textContent = "";

        // Save unlock session
        sessionStorage.setItem("secretsUnlocked", "true");

        // Hide lock screen
        secretLock.style.display = "none";

        // Show secret content
        secretsContent.style.display = "block";

        // Clear input
        passwordInput.value = "";
    }

    // ==================================================
    // WRONG PASSWORD
    // ==================================================

    else {
        errorMessage.textContent = "Incorrect password. Try again.";

        // Clear input
        passwordInput.value = "";

        // Focus input again
        passwordInput.focus();
    }
}

// ==================================================
// UNLOCK BUTTON
// ==================================================

if (unlockBtn) {
    unlockBtn.addEventListener("click", unlockSecret);
}

// ==================================================
// ENTER KEY FOR SECRET PASSWORD
// ==================================================

if (passwordInput) {
    passwordInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            unlockSecret();
        }
    });
}

// ==================================================
// SECRET MODAL ELEMENTS
// ==================================================

const secretModal = document.getElementById("secretModal");
const modalContent = document.getElementById("modalContent");
const closeButton = document.getElementById("closeButton");

// ==================================================
// SECRET BUTTONS
// ==================================================

const secretButtons = document.querySelectorAll(".secret-button");

secretButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const secret = button.dataset.secret;

        // ==================================================
        // BETWEEN US
        // ==================================================

        if (secret === "between-us") {
            const betweenUsSection = document.getElementById("betweenUsSection");

            if (betweenUsSection) {
                betweenUsSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }

            return;
        }

        // Open modal
        openSecret(secret);
    });
});

// ==================================================
// OPEN SECRET MODAL
// ==================================================

function openSecret(type) {
    if (!secretModal || !modalContent) {
        return;
    }

    let content = "";

    // ==================================================
    // A LETTER
    // ==================================================

    if (type === "letter") {
        content = `
            <div class="modal-icon">
                <i class="fa-regular fa-envelope"></i>
            </div>

            <span class="section-label">
                PERSONAL NOTE
            </span>

            <h2>
                A Letter
            </h2>

            <p>
                There are things I'm better
                at showing than saying.
            </p>

            <p>
                This is one of the few times
                I decided to write them down.
            </p>

            <p>
                Thank you for being part
                of the memories that make
                ordinary days feel different.
            </p>
        `;
    }

    // ==================================================
    // ARCHIVE
    // ==================================================

    else if (type === "archive") {
        content = `
            <div class="modal-icon">
                <i class="fa-solid fa-folder-open"></i>
            </div>

            <span class="section-label">
                SAVED MEMORY
            </span>

            <h2>
                Archive
            </h2>

            <img
                src="images/Memory1.jpeg"
                class="secret-image"
                alt="Memory">

            <p>
                Nothing particularly important
                happened that day.
            </p>

            <p>
                That's probably why
                I like remembering it.
            </p>
        `;
    }

    // ==================================================
    // UNSAID
    // ==================================================

    else if (type === "unsaid") {
        content = `
            <div class="modal-icon">
                <i class="fa-regular fa-note-sticky"></i>
            </div>

            <span class="section-label">
                UNSAID
            </span>

            <h2>
                Things Left Unspoken
            </h2>

            <p>
                Some things don't need
                to be said immediately.
            </p>

            <p>
                Some things are better
                understood through moments,
                actions, and memories.
            </p>

            <p>
                Not everything important
                needs an explanation.
            </p>
        `;
    }

    // ==================================================
    // INVALID
    // ==================================================

    else {
        content = `
            <h2>
                Not Found
            </h2>

            <p>
                This section doesn't exist.
            </p>
        `;
    }

    // ==================================================
    // SHOW MODAL
    // ==================================================

    modalContent.innerHTML = content;

    secretModal.style.display = "flex";
    secretModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");
}

// ==================================================
// CLOSE SECRET MODAL
// ==================================================

function closeSecret() {
    if (!secretModal) {
        return;
    }

    secretModal.style.display = "none";
    secretModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");
}

// ==================================================
// CLOSE BUTTON
// ==================================================

if (closeButton) {
    closeButton.addEventListener("click", closeSecret);
}

// ==================================================
// CLICK OUTSIDE MODAL
// ==================================================

if (secretModal) {
    secretModal.addEventListener("click", function (event) {
        if (event.target === secretModal) {
            closeSecret();
        }
    });
}

// ==================================================
// ESCAPE KEY
// ==================================================

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeSecret();
    }
});

// ==================================================
// LOGOUT
// ==================================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        // Remove login session
        localStorage.removeItem("username");

        // Remove secret unlock session
        sessionStorage.removeItem("secretsUnlocked");

        // Redirect to login page
        window.location.href = "index.html";
    });
}