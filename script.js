/* =========================================================
   OUR LITTLE WORLD
   MAIN SCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       STORAGE
       ===================================================== */

    const STORAGE = {
        bucket: "ourBucketList",
        memories: "ourBucketMemories",
        custom: "customBucketAdventures"
    };


    /* =====================================================
       GENERAL HELPERS
       ===================================================== */

    function readStorage(key, fallback) {
        try {
            const data = localStorage.getItem(key);

            if (!data) {
                return fallback;
            }

            return JSON.parse(data);

        } catch (error) {
            console.error(`Failed to read ${key}:`, error);
            return fallback;
        }
    }


    function writeStorage(key, value) {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    }


    function escapeHTML(value) {
        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function generateId(prefix = "id") {
        return `${prefix}_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 9)}`;
    }


    /* =====================================================
       SESSION
       ===================================================== */

    function setSession(username) {

        localStorage.setItem(
            "loggedInUser",
            username
        );

        localStorage.setItem(
            "username",
            username
        );
    }


    function getSessionUsername() {

        return (
            localStorage.getItem("username") ||
            localStorage.getItem("loggedInUser")
        );
    }


    function clearSession() {

        localStorage.removeItem(
            "loggedInUser"
        );

        localStorage.removeItem(
            "username"
        );

        localStorage.removeItem(
            "secretsUnlocked"
        );
    }


    /* =====================================================
       LOGIN / SIGN UP ELEMENTS
       ===================================================== */

    const loginSection =
        document.getElementById("loginSection");

    const signupSection =
        document.getElementById("signupSection");

    const loginForm =
        document.getElementById("loginForm");

    const signupForm =
        document.getElementById("signupForm");

    const showSignupBtn =
        document.getElementById("showSignupBtn");

    const showLoginBtn =
        document.getElementById("showLoginBtn");

    const message =
        document.getElementById("message");

    const signupMessage =
        document.getElementById("signupMessage");


    /* =====================================================
       AUTH MESSAGE
       ===================================================== */

    function showAuthMessage(
        element,
        text,
        type = "error"
    ) {

        if (!element) {
            return;
        }

        element.textContent = text;

        element.className =
            `auth-message ${type}`;
    }


    /* =====================================================
       SHOW LOGIN
       ===================================================== */

    function showLogin() {

        if (loginSection) {
            loginSection.style.display = "block";
        }

        if (signupSection) {
            signupSection.style.display = "none";
        }

        if (message) {
            message.textContent = "";
        }

        if (signupMessage) {
            signupMessage.textContent = "";
        }

        if (signupForm) {
            signupForm.reset();
        }
    }


    /* =====================================================
       SHOW SIGN UP
       ===================================================== */

    function showSignup() {

        if (loginSection) {
            loginSection.style.display = "none";
        }

        if (signupSection) {
            signupSection.style.display = "block";
        }

        if (message) {
            message.textContent = "";
        }

        if (signupMessage) {
            signupMessage.textContent = "";
        }
    }


    /* =====================================================
       SWITCH AUTH FORMS
       ===================================================== */

    if (showSignupBtn) {

        showSignupBtn.addEventListener(
            "click",
            showSignup
        );

    }


    if (showLoginBtn) {

        showLoginBtn.addEventListener(
            "click",
            showLogin
        );

    }


    /* =====================================================
       SIGN UP
       ===================================================== */

    if (signupForm) {

        signupForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const username =
                    document
                        .getElementById(
                            "signupUsername"
                        )
                        ?.value
                        .trim();


                const email =
                    document
                        .getElementById(
                            "signupEmail"
                        )
                        ?.value
                        .trim()
                        .toLowerCase();


                const password =
                    document
                        .getElementById(
                            "signupPassword"
                        )
                        ?.value;


                const confirmPassword =
                    document
                        .getElementById(
                            "signupConfirmPassword"
                        )
                        ?.value;


                /* =========================================
                   VALIDATION
                   ========================================= */

                if (
                    !username ||
                    !email ||
                    !password ||
                    !confirmPassword
                ) {

                    showAuthMessage(
                        signupMessage,
                        "Please complete all fields.",
                        "error"
                    );

                    return;
                }


                if (username.length < 3) {

                    showAuthMessage(
                        signupMessage,
                        "Call Sign must be at least 3 characters.",
                        "error"
                    );

                    return;
                }


                if (password.length < 6) {

                    showAuthMessage(
                        signupMessage,
                        "Password must be at least 6 characters.",
                        "error"
                    );

                    return;
                }


                if (
                    password !==
                    confirmPassword
                ) {

                    showAuthMessage(
                        signupMessage,
                        "Passwords do not match.",
                        "error"
                    );

                    return;
                }


                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(email)
                ) {

                    showAuthMessage(
                        signupMessage,
                        "Please enter a valid email address.",
                        "error"
                    );

                    return;
                }


                /* =========================================
                   SEND REGISTER REQUEST
                   ========================================= */

                try {

                    showAuthMessage(
                        signupMessage,
                        "Creating your account...",
                        "success"
                    );


                    const response =
                        await fetch(
                            "/api/register",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        username,
                                        email,
                                        password
                                    })
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        showAuthMessage(
                            signupMessage,
                            data.message ||
                                "Unable to create account.",
                            "error"
                        );

                        return;
                    }


                    /* =====================================
                       REGISTER SUCCESS
                       ===================================== */

                    signupForm.reset();

                    showLogin();


                    const loginUsername =
                        document.getElementById(
                            "username"
                        );


                    if (loginUsername) {

                        loginUsername.value =
                            username;

                        loginUsername.focus();

                    }


                    showAuthMessage(
                        message,
                        "Account created successfully. You can now log in.",
                        "success"
                    );

                } catch (error) {

                    console.error(
                        "Registration error:",
                        error
                    );


                    showAuthMessage(
                        signupMessage,
                        "Unable to connect to the server.",
                        "error"
                    );

                }

            }
        );

    }


    /* =====================================================
       LOGIN
       ===================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const username =
                    document
                        .getElementById(
                            "username"
                        )
                        ?.value
                        .trim();


                const password =
                    document
                        .getElementById(
                            "password"
                        )
                        ?.value;


                if (
                    !username ||
                    !password
                ) {

                    showAuthMessage(
                        message,
                        "Please enter your Call Sign and password.",
                        "error"
                    );

                    return;
                }


                /* =========================================
                   SEND LOGIN REQUEST
                   ========================================= */

                try {

                    showAuthMessage(
                        message,
                        "Logging in...",
                        "success"
                    );


                    const response =
                        await fetch(
                            "/api/login",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        username,
                                        password
                                    })
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        showAuthMessage(
                            message,
                            data.message ||
                                "Incorrect username or password.",
                            "error"
                        );

                        return;
                    }


                    /* =====================================
                       LOGIN SUCCESS
                       ===================================== */

                    if (
                        !data.user ||
                        !data.user.username
                    ) {

                        showAuthMessage(
                            message,
                            "Login response is invalid.",
                            "error"
                        );

                        return;
                    }


                    setSession(
                        data.user.username
                    );


                    window.location.href =
                        "dashboard.html";

                } catch (error) {

                    console.error(
                        "Login error:",
                        error
                    );


                    showAuthMessage(
                        message,
                        "Unable to connect to the server.",
                        "error"
                    );

                }

            }
        );

    }


    /* =====================================================
       LOGOUT
       ===================================================== */

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

                clearSession();

                window.location.href =
                    "index.html";

            }
        );

    }


    /* =====================================================
       SECRETS LINK
       ===================================================== */

    const secretsLink =
        document.querySelector(
            'a[href="oursecret.html"]'
        );


    if (secretsLink) {

        secretsLink.addEventListener(
            "click",
            (event) => {

                const loggedIn =
                    getSessionUsername();


                if (!loggedIn) {

                    event.preventDefault();

                    window.location.href =
                        "index.html";

                }

            }
        );

    }


    /* =====================================================
       SECRETS PAGE
       ===================================================== */

    const secretPasswordForm =
        document.getElementById(
            "secretPasswordForm"
        );


    if (secretPasswordForm) {

        secretPasswordForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const password =
                    document
                        .getElementById(
                            "secretPassword"
                        )
                        ?.value;


                if (
                    password ===
                    "our_little_world"
                ) {

                    localStorage.setItem(
                        "secretsUnlocked",
                        "true"
                    );

                    location.reload();

                } else {

                    alert(
                        "Wrong password."
                    );

                }

            }
        );

    }


    /* =====================================================
       BUCKET LIST ELEMENTS
       ===================================================== */

    const bucketList =
        document.getElementById(
            "bucketList"
        );

    const emptyBucketMessage =
        document.getElementById(
            "emptyBucketMessage"
        );

    const progressText =
        document.getElementById(
            "progressText"
        );

    const percentageText =
        document.getElementById(
            "percentageText"
        );

    const progressFill =
        document.getElementById(
            "progressFill"
        );

    const progressMessage =
        document.getElementById(
            "progressMessage"
        );

    const adventureForm =
        document.getElementById(
            "adventureForm"
        );


    /* =====================================================
       MEMORY ELEMENTS
       ===================================================== */

    const memoryModal =
        document.getElementById(
            "memoryModal"
        );

    const closeModal =
        document.getElementById(
            "closeModal"
        );

    const memoryFormContainer =
        document.getElementById(
            "memoryFormContainer"
        );

    const memoryViewContainer =
        document.getElementById(
            "memoryViewContainer"
        );

    const memoryForm =
        document.getElementById(
            "memoryForm"
        );

    const memoryActivityId =
        document.getElementById(
            "memoryActivityId"
        );

    const memoryAdventureTitle =
        document.getElementById(
            "memoryAdventureTitle"
        );

    const memoryDate =
        document.getElementById(
            "memoryDate"
        );

    const memoryLocation =
        document.getElementById(
            "memoryLocation"
        );

    const memoryPhotos =
        document.getElementById(
            "memoryPhotos"
        );

    const memoryVideos =
        document.getElementById(
            "memoryVideos"
        );

    const memoryExperience =
        document.getElementById(
            "memoryExperience"
        );

    const viewAdventureTitle =
        document.getElementById(
            "viewAdventureTitle"
        );

    const viewMemoryDate =
        document.getElementById(
            "viewMemoryDate"
        );

    const viewMemoryLocation =
        document.getElementById(
            "viewMemoryLocation"
        );

    const viewMemoryExperience =
        document.getElementById(
            "viewMemoryExperience"
        );

    const memoryGallery =
        document.getElementById(
            "memoryGallery"
        );

    const memoryVideosGallery =
        document.getElementById(
            "memoryVideosGallery"
        );

    const editMemoryBtn =
        document.getElementById(
            "editMemoryBtn"
        );


    /* =====================================================
       STORAGE DATA
       ===================================================== */

    function getBucketData() {

        return readStorage(
            STORAGE.bucket,
            {}
        );

    }


    function getMemories() {

        return readStorage(
            STORAGE.memories,
            {}
        );

    }


    function getAdventures() {

        const custom =
            readStorage(
                STORAGE.custom,
                []
            );


        return Array.isArray(custom)
            ? custom
            : [];

    }


    /* =====================================================
       ICON DETECTION
       ===================================================== */

    function getAdventureIcon(title) {

        const text =
            String(title || "")
                .toLowerCase();


        const iconRules = [

            {
                words: [
                    "beach",
                    "sea",
                    "ocean",
                    "swim"
                ],
                icon: "fa-solid fa-water"
            },

            {
                words: [
                    "travel",
                    "trip",
                    "vacation",
                    "tour"
                ],
                icon: "fa-solid fa-plane"
            },

            {
                words: [
                    "mountain",
                    "hike",
                    "hiking",
                    "camp"
                ],
                icon: "fa-solid fa-mountain-sun"
            },

            {
                words: [
                    "movie",
                    "cinema"
                ],
                icon: "fa-solid fa-film"
            },

            {
                words: [
                    "date",
                    "dinner",
                    "restaurant",
                    "eat"
                ],
                icon: "fa-solid fa-utensils"
            },

            {
                words: [
                    "coffee",
                    "cafe"
                ],
                icon: "fa-solid fa-mug-hot"
            },

            {
                words: [
                    "photo",
                    "picture",
                    "photoshoot"
                ],
                icon: "fa-solid fa-camera"
            },

            {
                words: [
                    "concert",
                    "music"
                ],
                icon: "fa-solid fa-music"
            },

            {
                words: [
                    "road",
                    "drive",
                    "roadtrip"
                ],
                icon: "fa-solid fa-car"
            },

            {
                words: [
                    "sunset",
                    "sunrise"
                ],
                icon: "fa-solid fa-sun"
            },

            {
                words: [
                    "park",
                    "picnic"
                ],
                icon: "fa-solid fa-tree"
            },

            {
                words: [
                    "game",
                    "gaming"
                ],
                icon: "fa-solid fa-gamepad"
            },

            {
                words: [
                    "birthday"
                ],
                icon: "fa-solid fa-cake-candles"
            },

            {
                words: [
                    "christmas"
                ],
                icon: "fa-solid fa-snowflake"
            },

            {
                words: [
                    "love",
                    "romantic"
                ],
                icon: "fa-solid fa-heart"
            }

        ];


        for (
            const rule
            of iconRules
        ) {

            if (
                rule.words.some(
                    word =>
                        text.includes(word)
                )
            ) {

                return rule.icon;

            }

        }


        return "fa-solid fa-heart";

    }


    /* =====================================================
       BUCKET ITEM
       ===================================================== */

    function createBucketItem(
        adventure,
        completed
    ) {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "bucket-item" +
            (
                completed
                    ? " completed"
                    : ""
            );


        item.dataset.id =
            adventure.id;


        const safeTitle =
            escapeHTML(
                adventure.title
            );


        const safeDescription =
            escapeHTML(
                adventure.description || ""
            );


        const icon =
            getAdventureIcon(
                adventure.title
            );


        item.innerHTML = `

            <label
                class="checkbox-container"
                title="Mark as completed">

                <input
                    type="checkbox"
                    class="bucket-checkbox"
                    data-id="${escapeHTML(adventure.id)}"
                    ${completed ? "checked" : ""}
                >

                <span class="checkmark"></span>

            </label>


            <div class="adventure-icon">

                <i class="${icon}"></i>

            </div>


            <div class="bucket-text">

                <h3 class="bucket-title">
                    ${safeTitle}
                </h3>

                ${
                    safeDescription
                        ? `
                            <p class="bucket-description">
                                ${safeDescription}
                            </p>
                        `
                        : ""
                }

            </div>


            <div class="bucket-actions">

                ${
                    completed
                        ? `
                            <button
                                type="button"
                                class="memory-btn add-memory-btn"
                                data-id="${escapeHTML(adventure.id)}">

                                <i class="fa-solid fa-camera-retro"></i>

                                Add Memory

                            </button>
                        `
                        : ""
                }


                <button
                    type="button"
                    class="view-memory-btn"
                    data-id="${escapeHTML(adventure.id)}"
                    ${
                        completed
                            ? ""
                            : 'style="display:none;"'
                    }>

                    <i class="fa-regular fa-images"></i>

                    View Memory

                </button>


                <button
                    type="button"
                    class="delete-bucket-btn"
                    data-id="${escapeHTML(adventure.id)}"
                    title="Delete adventure">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `;


        return item;

    }


    /* =====================================================
       RENDER BUCKET LIST
       ===================================================== */

    function renderBucketList() {

        if (!bucketList) {
            return;
        }


        const adventures =
            getAdventures();


        const bucketData =
            getBucketData();


        bucketList.innerHTML = "";


        if (
            adventures.length === 0
        ) {

            if (emptyBucketMessage) {

                emptyBucketMessage.style.display =
                    "block";

                bucketList.appendChild(
                    emptyBucketMessage
                );

            }


            updateProgress();

            return;

        }


        if (emptyBucketMessage) {

            emptyBucketMessage.style.display =
                "none";

        }


        adventures.forEach(
            adventure => {

                const completed =
                    Boolean(
                        bucketData[
                            adventure.id
                        ]
                    );


                bucketList.appendChild(
                    createBucketItem(
                        adventure,
                        completed
                    )
                );

            }
        );


        updateProgress();

    }


    /* =====================================================
       UPDATE PROGRESS
       ===================================================== */

    function updateProgress() {

        const adventures =
            getAdventures();


        const bucketData =
            getBucketData();


        const total =
            adventures.length;


        const completed =
            adventures.filter(
                adventure =>
                    Boolean(
                        bucketData[
                            adventure.id
                        ]
                    )
            ).length;


        const percentage =
            total === 0
                ? 0
                : Math.round(
                    (
                        completed /
                        total
                    ) * 100
                );


        if (progressText) {

            progressText.textContent =
                `${completed} of ${total} completed`;

        }


        if (percentageText) {

            percentageText.textContent =
                `${percentage}%`;

        }


        if (progressFill) {

            progressFill.style.width =
                `${percentage}%`;

        }


        if (progressMessage) {

            if (
                total === 0 ||
                percentage === 0
            ) {

                progressMessage.textContent =
                    "Every adventure starts with one small step.";

            }

            else if (
                percentage < 50
            ) {

                progressMessage.textContent =
                    "We're just getting started. More memories are waiting.";

            }

            else if (
                percentage < 100
            ) {

                progressMessage.textContent =
                    "Look how far we've come. Keep making memories.";

            }

            else {

                progressMessage.textContent =
                    "We did it. But our next adventure is already waiting.";

            }

        }

    }


    /* =====================================================
       ADD ADVENTURE
       ===================================================== */

    if (adventureForm) {

        adventureForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const titleInput =
                    document.getElementById(
                        "adventureTitle"
                    );


                const descriptionInput =
                    document.getElementById(
                        "adventureDescription"
                    );


                const title =
                    titleInput?.value.trim();


                const description =
                    descriptionInput
                        ?.value
                        .trim();


                if (!title) {

                    alert(
                        "Please enter an adventure title."
                    );

                    return;

                }


                const adventures =
                    getAdventures();


                const bucketData =
                    getBucketData();


                const newAdventure = {

                    id:
                        generateId(
                            "adventure"
                        ),

                    title,

                    description,

                    createdAt:
                        new Date()
                            .toISOString()

                };


                adventures.push(
                    newAdventure
                );


                bucketData[
                    newAdventure.id
                ] = false;


                writeStorage(
                    STORAGE.custom,
                    adventures
                );


                writeStorage(
                    STORAGE.bucket,
                    bucketData
                );


                adventureForm.reset();


                renderBucketList();

            }
        );

    }


    /* =====================================================
       BUCKET LIST ACTIONS
       ===================================================== */

    if (bucketList) {

        bucketList.addEventListener(
            "change",
            (event) => {

                const checkbox =
                    event.target.closest(
                        ".bucket-checkbox"
                    );


                if (!checkbox) {
                    return;
                }


                const id =
                    checkbox.dataset.id;


                const bucketData =
                    getBucketData();


                bucketData[id] =
                    checkbox.checked;


                writeStorage(
                    STORAGE.bucket,
                    bucketData
                );


                renderBucketList();

            }
        );


        bucketList.addEventListener(
            "click",
            (event) => {

                const deleteButton =
                    event.target.closest(
                        ".delete-bucket-btn"
                    );


                const addMemoryButton =
                    event.target.closest(
                        ".add-memory-btn"
                    );


                const viewMemoryButton =
                    event.target.closest(
                        ".view-memory-btn"
                    );


                if (deleteButton) {

                    deleteAdventure(
                        deleteButton.dataset.id
                    );

                    return;

                }


                if (addMemoryButton) {

                    openMemoryForm(
                        addMemoryButton.dataset.id
                    );

                    return;

                }


                if (viewMemoryButton) {

                    openMemoryView(
                        viewMemoryButton.dataset.id
                    );

                }

            }
        );

    }


    /* =====================================================
       DELETE ADVENTURE
       ===================================================== */

    function deleteAdventure(id) {

        const adventures =
            getAdventures();


        const adventure =
            adventures.find(
                item =>
                    item.id === id
            );


        if (!adventure) {
            return;
        }


        const confirmed =
            confirm(
                `Delete "${adventure.title}" from your bucket list?`
            );


        if (!confirmed) {
            return;
        }


        const item =
            bucketList?.querySelector(
                `.bucket-item[data-id="${CSS.escape(id)}"]`
            );


        if (item) {

            item.classList.add(
                "deleting"
            );


            setTimeout(
                () => {

                    finishDeleteAdventure(
                        id
                    );

                },
                300
            );

        } else {

            finishDeleteAdventure(
                id
            );

        }

    }


    function finishDeleteAdventure(id) {

        const adventures =
            getAdventures()
                .filter(
                    adventure =>
                        adventure.id !== id
                );


        const bucketData =
            getBucketData();


        delete bucketData[id];


        const memories =
            getMemories();


        delete memories[id];


        writeStorage(
            STORAGE.custom,
            adventures
        );


        writeStorage(
            STORAGE.bucket,
            bucketData
        );


        writeStorage(
            STORAGE.memories,
            memories
        );


        renderBucketList();

    }


    /* =====================================================
       FILE TO BASE64
       ===================================================== */

    function fileToBase64(file) {

        return new Promise(
            (resolve, reject) => {

                const reader =
                    new FileReader();


                reader.onload =
                    () => resolve(
                        reader.result
                    );


                reader.onerror =
                    () => reject(
                        reader.error
                    );


                reader.readAsDataURL(
                    file
                );

            }
        );

    }


    /* =====================================================
       OPEN MEMORY FORM
       ===================================================== */

    function openMemoryForm(id) {

        const adventures =
            getAdventures();


        const adventure =
            adventures.find(
                item =>
                    item.id === id
            );


        if (!adventure) {
            return;
        }


        const memories =
            getMemories();


        const existing =
            memories[id];


        if (memoryFormContainer) {

            memoryFormContainer.style.display =
                "block";

        }


        if (memoryViewContainer) {

            memoryViewContainer.classList.remove(
                "active"
            );

            memoryViewContainer.style.display =
                "none";

        }


        if (memoryActivityId) {

            memoryActivityId.value =
                id;

        }


        if (memoryAdventureTitle) {

            memoryAdventureTitle.textContent =
                existing
                    ? "Add More to Our Memory"
                    : adventure.title;

        }


        if (memoryDate) {

            memoryDate.value =
                existing?.date || "";

        }


        if (memoryLocation) {

            memoryLocation.value =
                existing?.location || "";

        }


        if (memoryExperience) {

            memoryExperience.value =
                existing?.experience || "";

        }


        if (memoryPhotos) {

            memoryPhotos.value = "";

        }


        if (memoryVideos) {

            memoryVideos.value = "";

        }


        openMemoryModal();

    }


    /* =====================================================
       OPEN MEMORY VIEW
       ===================================================== */

    function openMemoryView(id) {

        const adventures =
            getAdventures();


        const adventure =
            adventures.find(
                item =>
                    item.id === id
            );


        if (!adventure) {
            return;
        }


        const memories =
            getMemories();


        const memory =
            memories[id];


        if (!memory) {

            alert(
                "No memory has been saved for this adventure yet."
            );

            return;

        }


        if (memoryFormContainer) {

            memoryFormContainer.style.display =
                "none";

        }


        if (memoryViewContainer) {

            memoryViewContainer.style.display =
                "block";

            memoryViewContainer.classList.add(
                "active"
            );

        }


        if (viewAdventureTitle) {

            viewAdventureTitle.textContent =
                adventure.title;

        }


        if (viewMemoryDate) {

            viewMemoryDate.textContent =
                formatDate(
                    memory.date
                );

        }


        if (viewMemoryLocation) {

            viewMemoryLocation.textContent =
                memory.location ||
                "Somewhere special";

        }


        if (viewMemoryExperience) {

            viewMemoryExperience.textContent =
                memory.experience ||
                "";

        }


        renderMemoryPhotos(
            memory.photos || []
        );


        renderMemoryVideos(
            memory.videos || []
        );


        if (editMemoryBtn) {

            editMemoryBtn.dataset.id =
                id;

        }


        openMemoryModal();

    }


    /* =====================================================
       FORMAT DATE
       ===================================================== */

    function formatDate(dateString) {

        if (!dateString) {
            return "";
        }


        const date =
            new Date(
                `${dateString}T00:00:00`
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return dateString;

        }


        return date.toLocaleDateString(
            undefined,
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

    }


    /* =====================================================
       RENDER PHOTOS
       ===================================================== */

    function renderMemoryPhotos(photos) {

        if (!memoryGallery) {
            return;
        }


        memoryGallery.innerHTML = "";


        if (
            !Array.isArray(photos) ||
            photos.length === 0
        ) {

            return;

        }


        photos.forEach(
            (photo, index) => {

                if (!photo) {
                    return;
                }


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "memory-gallery-item";


                item.dataset.index =
                    index;


                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    photo;


                image.alt =
                    `Memory photo ${index + 1}`;


                image.loading =
                    "lazy";


                image.decoding =
                    "async";


                item.appendChild(
                    image
                );


                item.addEventListener(
                    "click",
                    () => {

                        openLightbox(
                            photo
                        );

                    }
                );


                memoryGallery.appendChild(
                    item
                );

            }
        );


        const existingCount =
            document.querySelector(
                ".memory-photo-count"
            );


        if (existingCount) {
            existingCount.remove();
        }


        const count =
            document.createElement(
                "div"
            );


        count.className =
            "memory-photo-count";


        count.innerHTML = `

            <i class="fa-regular fa-images"></i>

            ${photos.length}

            ${
                photos.length === 1
                    ? "photo"
                    : "photos"
            }

        `;


        if (
            memoryGallery.parentNode
        ) {

            memoryGallery.parentNode.insertBefore(
                count,
                memoryGallery
            );

        }

    }


    /* =====================================================
       RENDER VIDEOS
       ===================================================== */

    function renderMemoryVideos(videos) {

        if (!memoryVideosGallery) {
            return;
        }


        memoryVideosGallery.innerHTML =
            "";


        if (
            !Array.isArray(videos) ||
            videos.length === 0
        ) {

            return;

        }


        videos.forEach(
            (video, index) => {

                if (!video) {
                    return;
                }


                const wrapper =
                    document.createElement(
                        "div"
                    );


                wrapper.className =
                    "memory-video-item";


                const videoElement =
                    document.createElement(
                        "video"
                    );


                videoElement.controls =
                    true;


                videoElement.preload =
                    "metadata";


                videoElement.playsInline =
                    true;


                videoElement.src =
                    video;


                videoElement.setAttribute(
                    "aria-label",
                    `Memory video ${index + 1}`
                );


                wrapper.appendChild(
                    videoElement
                );


                memoryVideosGallery.appendChild(
                    wrapper
                );

            }
        );

    }


    /* =====================================================
       SAVE MEMORY
       ===================================================== */

    if (memoryForm) {

        memoryForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const id =
                    memoryActivityId?.value;


                if (!id) {
                    return;
                }


                const date =
                    memoryDate?.value;


                const location =
                    memoryLocation
                        ?.value
                        .trim() || "";


                const experience =
                    memoryExperience
                        ?.value
                        .trim();


                if (!date) {

                    alert(
                        "Please select the date."
                    );

                    return;

                }


                if (!experience) {

                    alert(
                        "Please write about your experience."
                    );

                    return;

                }


                const memories =
                    getMemories();


                const oldMemory =
                    memories[id] || {};


                const photos =
                    Array.isArray(
                        oldMemory.photos
                    )
                        ? [
                            ...oldMemory.photos
                        ]
                        : [];


                const videos =
                    Array.isArray(
                        oldMemory.videos
                    )
                        ? [
                            ...oldMemory.videos
                        ]
                        : [];


                /* =========================================
                   PHOTOS
                   ========================================= */

                const selectedPhotos =
                    memoryPhotos?.files
                        ? Array.from(
                            memoryPhotos.files
                        )
                        : [];


                if (
                    selectedPhotos.length > 0
                ) {

                    for (
                        const file
                        of selectedPhotos
                    ) {

                        if (
                            !file.type.startsWith(
                                "image/"
                            )
                        ) {
                            continue;
                        }


                        try {

                            const base64 =
                                await fileToBase64(
                                    file
                                );


                            photos.push(
                                base64
                            );

                        } catch (error) {

                            console.error(
                                "Failed to read photo:",
                                error
                            );

                        }

                    }

                }


                /* =========================================
                   VIDEOS
                   ========================================= */

                const selectedVideos =
                    memoryVideos?.files
                        ? Array.from(
                            memoryVideos.files
                        )
                        : [];


                if (
                    selectedVideos.length > 0
                ) {

                    for (
                        const file
                        of selectedVideos
                    ) {

                        if (
                            !file.type.startsWith(
                                "video/"
                            )
                        ) {
                            continue;
                        }


                        if (
                            file.size >
                            10 *
                            1024 *
                            1024
                        ) {

                            alert(
                                `"${file.name}" is larger than 10 MB and was skipped.`
                            );

                            continue;

                        }


                        try {

                            const base64 =
                                await fileToBase64(
                                    file
                                );


                            videos.push(
                                base64
                            );

                        } catch (error) {

                            console.error(
                                "Failed to read video:",
                                error
                            );

                        }

                    }

                }


                /* =========================================
                   MEMORY OBJECT
                   ========================================= */

                const memory = {

                    date,

                    location,

                    experience,

                    photos,

                    videos,

                    updatedAt:
                        new Date()
                            .toISOString()

                };


                try {

                    memories[id] =
                        memory;


                    writeStorage(
                        STORAGE.memories,
                        memories
                    );


                    if (memoryPhotos) {
                        memoryPhotos.value = "";
                    }


                    if (memoryVideos) {
                        memoryVideos.value = "";
                    }


                    openMemoryView(
                        id
                    );

                } catch (error) {

                    console.error(
                        "Memory storage error:",
                        error
                    );


                    alert(
                        "The memory could not be saved because the browser storage is full. Try using smaller photos or move to cloud storage."
                    );

                }

            }
        );

    }


    /* =====================================================
       EDIT MEMORY
       ===================================================== */

    if (editMemoryBtn) {

        editMemoryBtn.addEventListener(
            "click",
            () => {

                const id =
                    editMemoryBtn.dataset.id;


                if (!id) {
                    return;
                }


                openMemoryForm(
                    id
                );

            }
        );

    }


    /* =====================================================
       MEMORY MODAL
       ===================================================== */

    function openMemoryModal() {

        if (!memoryModal) {
            return;
        }


        memoryModal.classList.add(
            "active"
        );


        document.body.style.overflow =
            "hidden";

    }


    function closeMemoryModal() {

        if (!memoryModal) {
            return;
        }


        memoryModal.classList.remove(
            "active"
        );


        document.body.style.overflow =
            "";

    }


    if (closeModal) {

        closeModal.addEventListener(
            "click",
            closeMemoryModal
        );

    }


    if (memoryModal) {

        memoryModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    memoryModal
                ) {

                    closeMemoryModal();

                }

            }
        );

    }


    /* =====================================================
       IMAGE LIGHTBOX
       ===================================================== */

    let lightbox =
        document.getElementById(
            "memoryLightbox"
        );


    if (!lightbox) {

        lightbox =
            document.createElement(
                "div"
            );


        lightbox.id =
            "memoryLightbox";


        lightbox.className =
            "memory-lightbox";


        lightbox.innerHTML = `

            <button
                type="button"
                class="memory-lightbox-close"
                aria-label="Close image">

                <i class="fa-solid fa-xmark"></i>

            </button>


            <img
                class="memory-lightbox-image"
                src=""
                alt="Memory photo">

        `;


        document.body.appendChild(
            lightbox
        );

    }


    const lightboxImage =
        lightbox.querySelector(
            ".memory-lightbox-image"
        );


    const lightboxClose =
        lightbox.querySelector(
            ".memory-lightbox-close"
        );


    function openLightbox(src) {

        if (
            !lightbox ||
            !lightboxImage
        ) {
            return;
        }


        lightboxImage.src =
            src;


        lightbox.classList.add(
            "active"
        );


        document.body.style.overflow =
            "hidden";

    }


    function closeLightbox() {

        if (!lightbox) {
            return;
        }


        lightbox.classList.remove(
            "active"
        );


        if (lightboxImage) {

            lightboxImage.src =
                "";

        }


        if (
            !memoryModal ||
            !memoryModal.classList.contains(
                "active"
            )
        ) {

            document.body.style.overflow =
                "";

        }

    }


    if (lightboxClose) {

        lightboxClose.addEventListener(
            "click",
            closeLightbox
        );

    }


    if (lightbox) {

        lightbox.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    lightbox
                ) {

                    closeLightbox();

                }

            }
        );

    }


    /* =====================================================
       KEYBOARD CONTROLS
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Escape"
            ) {

                if (
                    lightbox &&
                    lightbox.classList.contains(
                        "active"
                    )
                ) {

                    closeLightbox();

                    return;

                }


                if (
                    memoryModal &&
                    memoryModal.classList.contains(
                        "active"
                    )
                ) {

                    closeMemoryModal();

                }

            }

        }
    );


    /* =====================================================
       INITIALIZE BUCKET LIST
       ===================================================== */

    if (bucketList) {
        renderBucketList();
    }

});