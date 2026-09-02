document.addEventListener('DOMContentLoaded', function () {


var STORAGE = {
    bucket: 'ourBucketList',
    memories: 'ourBucketMemories',
    custom: 'customBucketAdventures'
};

/* ==================================================
   LOGIN
================================================== */

var loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var usernameInput = document.getElementById('username');
        var passwordInput = document.getElementById('password');
        var message = document.getElementById('message');

        var username = usernameInput
            ? usernameInput.value.trim()
            : '';

        var password = passwordInput
            ? passwordInput.value
            : '';

        if (username === 'Baby' && password === '12.23') {
            localStorage.setItem('username', username);
            window.location.href = 'dashboard.html';
        } else {
            if (message) {
                message.textContent = 'Incorrect username or password.';
            }
        }
    });
}


/* ==================================================
   LOGOUT
================================================== */

var logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('username');
        sessionStorage.removeItem('secretsUnlocked');

        window.location.href = 'index.html';
    });
}


/* ==================================================
   SECRET PAGE
================================================== */

var secretLock = document.getElementById('secretLock');
var secretsContent = document.getElementById('secretsContent');
var secretPassword = document.getElementById('secretPassword');
var unlockBtn = document.getElementById('unlockBtn');
var errorMessage = document.getElementById('errorMessage');

if (secretLock && !localStorage.getItem('username')) {
    window.location.href = 'index.html';
    return;
}

function unlockSecret() {
    if (!secretLock || !secretsContent || !secretPassword) {
        return;
    }

    if (secretPassword.value === 'our_little_world') {
        sessionStorage.setItem('secretsUnlocked', 'true');

        secretLock.style.display = 'none';
        secretsContent.style.display = 'block';

        if (errorMessage) {
            errorMessage.textContent = '';
        }
    } else {
        if (errorMessage) {
            errorMessage.textContent = 'Incorrect password.';
        }
    }
}

if (
    secretLock &&
    secretsContent &&
    sessionStorage.getItem('secretsUnlocked') === 'true'
) {
    secretLock.style.display = 'none';
    secretsContent.style.display = 'block';
}

if (unlockBtn) {
    unlockBtn.addEventListener('click', unlockSecret);
}

if (secretPassword) {
    secretPassword.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            unlockSecret();
        }
    });
}


/* ==================================================
   SECRET MODAL
================================================== */

var secretModal = document.getElementById('secretModal');
var modalContent = document.getElementById('modalContent');
var closeButton = document.getElementById('closeButton');

function openSecretModal(type) {
    if (!secretModal || !modalContent) {
        return;
    }

    var content = '';

    if (type === 'letter') {
        content =
            '<h2>A Letter For Us</h2>' +
            '<p>Some memories are too special to be forgotten.</p>' +
            '<p>Thank you for every moment, every laugh, and every little adventure we share.</p>';
    } else if (type === 'archive') {
        content =
            '<h2>Our Memory Archive</h2>' +
            '<img src="images/Memory1.jpeg" alt="Our memory" style="max-width:100%;border-radius:12px;">';
    } else if (type === 'unsaid') {
        content =
            '<h2>Things Left Unspoken</h2>' +
            '<p>Some things do not need to be said immediately.</p>' +
            '<p>Some things are better understood through moments, actions, and memories.</p>';
    } else {
        content =
            '<h2>Not Found</h2>' +
            '<p>This section does not exist.</p>';
    }

    modalContent.innerHTML = content;
    secretModal.style.display = 'flex';

    document.body.classList.add('modal-open');
}

function closeSecretModal() {
    if (!secretModal) {
        return;
    }

    secretModal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

document.querySelectorAll('.secret-button').forEach(function (button) {
    button.addEventListener('click', function () {
        var type =
            button.dataset.secret ||
            button.dataset.section ||
            '';

        openSecretModal(type);
    });
});

if (closeButton) {
    closeButton.addEventListener('click', closeSecretModal);
}

if (secretModal) {
    secretModal.addEventListener('click', function (event) {
        if (event.target === secretModal) {
            closeSecretModal();
        }
    });
}


/* ==================================================
   BUCKET LIST ELEMENTS
================================================== */

var bucketList = document.getElementById('bucketList');
var emptyBucketMessage = document.getElementById('emptyBucketMessage');

var progressText = document.getElementById('progressText');
var percentageText = document.getElementById('percentageText');
var progressFill = document.getElementById('progressFill');
var progressMessage = document.getElementById('progressMessage');

var adventureForm = document.getElementById('adventureForm');
var adventureTitle = document.getElementById('adventureTitle');
var adventureDescription = document.getElementById('adventureDescription');


/* ==================================================
   MEMORY ELEMENTS
================================================== */

var memoryModal = document.getElementById('memoryModal');
var closeModal = document.getElementById('closeModal');

var memoryFormContainer =
    document.getElementById('memoryFormContainer');

var memoryViewContainer =
    document.getElementById('memoryViewContainer');

var memoryForm =
    document.getElementById('memoryForm');

var memoryActivityId =
    document.getElementById('memoryActivityId');

var memoryAdventureTitle =
    document.getElementById('memoryAdventureTitle');

var memoryDate =
    document.getElementById('memoryDate');

var memoryLocation =
    document.getElementById('memoryLocation');

var memoryPhotos =
    document.getElementById('memoryPhotos');

var memoryVideos =
    document.getElementById('memoryVideos');

var memoryExperience =
    document.getElementById('memoryExperience');

var viewAdventureTitle =
    document.getElementById('viewAdventureTitle');

var viewMemoryDate =
    document.getElementById('viewMemoryDate');

var viewMemoryLocation =
    document.getElementById('viewMemoryLocation');

var viewMemoryExperience =
    document.getElementById('viewMemoryExperience');

var memoryGallery =
    document.getElementById('memoryGallery');

var memoryVideosGallery =
    document.getElementById('memoryVideosGallery');

var editMemoryBtn =
    document.getElementById('editMemoryBtn');


/* ==================================================
   STORAGE
================================================== */

function readStorage(key, fallback) {
    try {
        var value = localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        var parsed = JSON.parse(value);

        return parsed === null ? fallback : parsed;

    } catch (error) {
        console.error('Storage read error:', error);
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {
        console.error('Storage write error:', error);
        return false;
    }
}

function getBucketData() {
    var data = readStorage(STORAGE.bucket, {});

    if (
        !data ||
        typeof data !== 'object' ||
        Array.isArray(data)
    ) {
        return {};
    }

    return data;
}

function getMemories() {
    var data = readStorage(STORAGE.memories, {});

    if (
        !data ||
        typeof data !== 'object' ||
        Array.isArray(data)
    ) {
        return {};
    }

    return data;
}

function getAdventures() {
    var data = readStorage(STORAGE.custom, []);

    return Array.isArray(data) ? data : [];
}

function escapeHTML(value) {
    var div = document.createElement('div');

    div.textContent =
        value === null || value === undefined
            ? ''
            : String(value);

    return div.innerHTML;
}


/* ==================================================
   AUTOMATIC ICON DETECTION
================================================== */

var iconRules = [
    {
        words: [
            'beach',
            'ocean',
            'sea',
            'swim',
            'swimming',
            'island',
            'pool',
            'resort'
        ],
        icon: 'fa-umbrella-beach'
    },

    {
        words: [
            'movie',
            'cinema',
            'film',
            'theater',
            'theatre'
        ],
        icon: 'fa-film'
    },

    {
        words: [
            'restaurant',
            'eat',
            'eating',
            'dinner',
            'lunch',
            'breakfast',
            'food',
            'ramen',
            'japanese',
            'korean',
            'pizza',
            'burger'
        ],
        icon: 'fa-utensils'
    },

    {
        words: [
            'coffee',
            'cafe',
            'café',
            'latte'
        ],
        icon: 'fa-mug-hot'
    },

    {
        words: [
            'travel',
            'trip',
            'vacation',
            'holiday',
            'tour',
            'flight',
            'fly',
            'airplane',
            'airport',
            'cebu',
            'manila',
            'palawan',
            'boracay'
        ],
        icon: 'fa-plane'
    },

    {
        words: [
            'photo',
            'photos',
            'picture',
            'pictures',
            'photobooth',
            'photo booth',
            'photoshoot',
            'selfie'
        ],
        icon: 'fa-camera'
    },

    {
        words: [
            'hike',
            'hiking',
            'mountain',
            'trek',
            'camp',
            'camping',
            'nature'
        ],
        icon: 'fa-person-hiking'
    },

    {
        words: [
            'shop',
            'shopping',
            'mall',
            'buy'
        ],
        icon: 'fa-bag-shopping'
    },

    {
        words: [
            'sunset',
            'sunrise'
        ],
        icon: 'fa-sun'
    },

    {
        words: [
            'birthday',
            'anniversary',
            'celebrate',
            'celebration',
            'party'
        ],
        icon: 'fa-cake-candles'
    },

    {
        words: [
            'concert',
            'music',
            'sing',
            'song',
            'band'
        ],
        icon: 'fa-music'
    },

    {
        words: [
            'road trip',
            'drive',
            'driving',
            'car',
            'motorcycle',
            'motorbike'
        ],
        icon: 'fa-car-side'
    },

    {
        words: [
            'picnic',
            'park',
            'grass'
        ],
        icon: 'fa-basket-shopping'
    },

    {
        words: [
            'museum',
            'gallery',
            'art',
            'painting'
        ],
        icon: 'fa-building-columns'
    },

    {
        words: [
            'hotel',
            'staycation',
            'room',
            'overnight'
        ],
        icon: 'fa-hotel'
    },

    {
        words: [
            'date',
            'romantic',
            'love',
            'together',
            'memory'
        ],
        icon: 'fa-heart'
    }
];

function detectIcon(title, description) {
    var text = (
        String(title || '') +
        ' ' +
        String(description || '')
    ).toLowerCase();

    for (var i = 0; i < iconRules.length; i++) {
        var rule = iconRules[i];

        for (var j = 0; j < rule.words.length; j++) {
            if (text.indexOf(rule.words[j]) !== -1) {
                return rule.icon;
            }
        }
    }

    return 'fa-star';
}


/* ==================================================
   FIND BUCKET ITEM
================================================== */

function getAdventureItem(id) {
    if (!bucketList) {
        return null;
    }

    var items =
        bucketList.querySelectorAll('.bucket-item');

    for (var i = 0; i < items.length; i++) {
        if (
            String(items[i].dataset.id) ===
            String(id)
        ) {
            return items[i];
        }
    }

    return null;
}


/* ==================================================
   EMPTY MESSAGE
================================================== */

function updateEmptyMessage() {
    if (!bucketList || !emptyBucketMessage) {
        return;
    }

    var items =
        bucketList.querySelectorAll('.bucket-item');

    if (items.length === 0) {
        emptyBucketMessage.style.display = 'block';
    } else {
        emptyBucketMessage.style.display = 'none';
    }
}


/* ==================================================
   PROGRESS
================================================== */

function updateProgress() {
    if (!bucketList) {
        return;
    }

    var checkboxes =
        bucketList.querySelectorAll(
            '.bucket-item input[type="checkbox"]'
        );

    var total = checkboxes.length;
    var completed = 0;

    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            completed++;
        }
    });

    var percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );

    if (progressText) {
        progressText.textContent =
            completed +
            ' of ' +
            total +
            ' completed';
    }

    if (percentageText) {
        percentageText.textContent =
            percentage + '%';
    }

    if (progressFill) {
        progressFill.style.width =
            percentage + '%';
    }

    if (progressMessage) {
        if (total === 0) {
            progressMessage.textContent =
                'Start by adding your first adventure together.';
        } else if (completed === 0) {
            progressMessage.textContent =
                'Every adventure starts with one small step.';
        } else if (completed < total) {
            progressMessage.textContent =
                'Look at us slowly turning dreams into memories.';
        } else {
            progressMessage.textContent =
                'Every adventure became a beautiful memory.';
        }
    }
}


/* ==================================================
   CREATE ADVENTURE
================================================== */

function createAdventureElement(adventure) {
    var item = document.createElement('div');

    item.className = 'bucket-item';
    item.dataset.id = adventure.id;

    var icon = detectIcon(
        adventure.title,
        adventure.description
    );

    item.innerHTML =
        '<label class="checkbox-container">' +
            '<input type="checkbox" data-id="' +
                escapeHTML(adventure.id) +
            '">' +
            '<span class="checkmark"></span>' +
        '</label>' +

        '<div class="adventure-icon">' +
            '<i class="fa-solid ' +
                escapeHTML(icon) +
            '"></i>' +
        '</div>' +

        '<div class="bucket-text">' +
            '<h3>' +
                escapeHTML(adventure.title) +
            '</h3>' +

            '<p>' +
                escapeHTML(
                    adventure.description ||
                    'An adventure waiting for us.'
                ) +
            '</p>' +
        '</div>' +

        '<div class="bucket-actions">' +

            '<button type="button" ' +
                'class="memory-btn add-memory-btn" ' +
                'data-id="' +
                escapeHTML(adventure.id) +
            '">' +
                '<i class="fa-solid fa-plus"></i>' +
                ' Add Memory' +
            '</button>' +

            '<button type="button" ' +
                'class="memory-btn view-memory-btn" ' +
                'data-id="' +
                escapeHTML(adventure.id) +
            '">' +
                '<i class="fa-solid fa-images"></i>' +
                ' View Memory' +
            '</button>' +

            '<button type="button" ' +
                'class="delete-bucket-btn" ' +
                'data-id="' +
                escapeHTML(adventure.id) +
                '" title="Delete adventure">' +
                '<i class="fa-solid fa-trash"></i>' +
            '</button>' +

        '</div>';

    return item;
}


/* ==================================================
   LOAD ADVENTURES
================================================== */

function loadAdventures() {
    if (!bucketList) {
        return;
    }

    var adventures = getAdventures();

    adventures.forEach(function (adventure) {
        if (
            !adventure ||
            !adventure.id ||
            !adventure.title
        ) {
            return;
        }

        if (getAdventureItem(adventure.id)) {
            return;
        }

        bucketList.appendChild(
            createAdventureElement(adventure)
        );
    });

    updateEmptyMessage();
}


/* ==================================================
   LOAD CHECKED STATES
================================================== */

function loadBucketStates() {
    if (!bucketList) {
        return;
    }

    var saved = getBucketData();

    bucketList
        .querySelectorAll(
            '.bucket-item input[type="checkbox"]'
        )
        .forEach(function (checkbox) {

            var id = checkbox.dataset.id;

            checkbox.checked =
                saved[id] === true;

            var item =
                checkbox.closest('.bucket-item');

            if (item) {
                item.classList.toggle(
                    'completed',
                    checkbox.checked
                );
            }
        });

    updateProgress();
}


/* ==================================================
   ADD ADVENTURE
================================================== */

if (adventureForm) {
    adventureForm.addEventListener(
        'submit',
        function (event) {
            event.preventDefault();

            var title =
                adventureTitle
                    ? adventureTitle.value.trim()
                    : '';

            var description =
                adventureDescription
                    ? adventureDescription.value.trim()
                    : '';

            if (!title) {
                if (adventureTitle) {
                    adventureTitle.focus();
                }

                return;
            }

            var adventure = {
                id:
                    'custom-' +
                    Date.now() +
                    '-' +
                    Math.random()
                        .toString(36)
                        .substring(2, 8),

                title: title,

                description:
                    description ||
                    'An adventure waiting for us.'
            };

            var adventures = getAdventures();

            adventures.push(adventure);

            if (
                !writeStorage(
                    STORAGE.custom,
                    adventures
                )
            ) {
                alert(
                    'Unable to save this adventure.'
                );

                return;
            }

            if (bucketList) {
                bucketList.appendChild(
                    createAdventureElement(
                        adventure
                    )
                );
            }

            var bucketData = getBucketData();

            bucketData[adventure.id] = false;

            writeStorage(
                STORAGE.bucket,
                bucketData
            );

            adventureForm.reset();

            updateEmptyMessage();
            updateProgress();

            var newItem =
                getAdventureItem(
                    adventure.id
                );

            if (newItem) {
                newItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    );
}


/* ==================================================
   BUCKET LIST EVENTS
================================================== */

if (bucketList) {

    bucketList.addEventListener(
        'change',
        function (event) {

            if (
                !event.target.matches(
                    '.bucket-item input[type="checkbox"]'
                )
            ) {
                return;
            }

            var checkbox = event.target;
            var id = checkbox.dataset.id;

            var bucketData = getBucketData();

            bucketData[id] =
                checkbox.checked;

            writeStorage(
                STORAGE.bucket,
                bucketData
            );

            var item =
                checkbox.closest('.bucket-item');

            if (item) {
                item.classList.toggle(
                    'completed',
                    checkbox.checked
                );
            }

            updateProgress();
        }
    );


    bucketList.addEventListener(
        'click',
        function (event) {

            /* DELETE */

            var deleteButton =
                event.target.closest(
                    '.delete-bucket-btn'
                );

            if (deleteButton) {

                var deleteId =
                    deleteButton.dataset.id;

                var deleteItem =
                    getAdventureItem(
                        deleteId
                    );

                if (!deleteItem) {
                    return;
                }

                var titleElement =
                    deleteItem.querySelector(
                        '.bucket-text h3'
                    );

                var title =
                    titleElement
                        ? titleElement.textContent
                        : 'this adventure';

                if (
                    !confirm(
                        'Delete "' +
                        title +
                        '" from your bucket list?'
                    )
                ) {
                    return;
                }

                var adventures =
                    getAdventures().filter(
                        function (adventure) {
                            return String(
                                adventure.id
                            ) !== String(
                                deleteId
                            );
                        }
                    );

                writeStorage(
                    STORAGE.custom,
                    adventures
                );

                var bucketData =
                    getBucketData();

                delete bucketData[deleteId];

                writeStorage(
                    STORAGE.bucket,
                    bucketData
                );

                var memories =
                    getMemories();

                delete memories[deleteId];

                writeStorage(
                    STORAGE.memories,
                    memories
                );

                deleteItem.remove();

                updateEmptyMessage();
                updateProgress();

                return;
            }


            /* ADD MEMORY */

            var addButton =
                event.target.closest(
                    '.add-memory-btn'
                );

            if (addButton) {

                var addId =
                    addButton.dataset.id;

                var addItem =
                    getAdventureItem(addId);

                if (!addItem) {
                    return;
                }

                var checkbox =
                    addItem.querySelector(
                        'input[type="checkbox"]'
                    );

                if (
                    !checkbox ||
                    !checkbox.checked
                ) {
                    alert(
                        'Complete this adventure first before adding a memory. ❤️'
                    );

                    return;
                }

                openMemoryForm(addId);

                return;
            }


            /* VIEW MEMORY */

            var viewButton =
                event.target.closest(
                    '.view-memory-btn'
                );

            if (viewButton) {
                openMemoryView(
                    viewButton.dataset.id
                );
            }
        }
    );
}


/* ==================================================
   OPEN MEMORY FORM
================================================== */

function openMemoryForm(id) {

    var item =
        getAdventureItem(id);

    if (!item || !memoryModal) {
        return;
    }

    var titleElement =
        item.querySelector(
            '.bucket-text h3'
        );

    var title =
        titleElement
            ? titleElement.textContent.trim()
            : 'Our Memory';

    var memories = getMemories();

    var memory =
        memories[id] || {};

    if (memoryActivityId) {
        memoryActivityId.value = id;
    }

    if (memoryAdventureTitle) {
        memoryAdventureTitle.textContent =
            title;
    }

    if (memoryDate) {
        memoryDate.value =
            memory.date || '';
    }

    if (memoryLocation) {
        memoryLocation.value =
            memory.location || '';
    }

    if (memoryExperience) {
        memoryExperience.value =
            memory.experience || '';
    }

    if (memoryPhotos) {
        memoryPhotos.value = '';
    }

    if (memoryVideos) {
        memoryVideos.value = '';
    }

    if (memoryFormContainer) {
        memoryFormContainer.style.display =
            'block';
    }

    if (memoryViewContainer) {
        memoryViewContainer.style.display =
            'none';
    }

    memoryModal.classList.add('show');
    memoryModal.style.display = 'flex';

    document.body.style.overflow = 'hidden';
}


/* ==================================================
   OPEN MEMORY VIEW
================================================== */

function openMemoryView(id) {

    var item =
        getAdventureItem(id);

    if (!item || !memoryModal) {
        return;
    }

    var memories = getMemories();

    var memory = memories[id];

    if (!memory) {
        alert(
            'No memory has been saved for this adventure yet.'
        );

        return;
    }

    var titleElement =
        item.querySelector(
            '.bucket-text h3'
        );

    var title =
        titleElement
            ? titleElement.textContent.trim()
            : 'Our Memory';

    if (memoryActivityId) {
        memoryActivityId.value = id;
    }

    if (viewAdventureTitle) {
        viewAdventureTitle.textContent =
            title;
    }

    if (viewMemoryDate) {
        viewMemoryDate.textContent =
            memory.date ||
            'No date added';
    }

    if (viewMemoryLocation) {
        viewMemoryLocation.textContent =
            memory.location ||
            'No location added';
    }

    if (viewMemoryExperience) {
        viewMemoryExperience.textContent =
            memory.experience ||
            'No experience added';
    }


    /* PHOTOS */

    if (memoryGallery) {

        memoryGallery.innerHTML = '';

        var photos =
            Array.isArray(memory.photos)
                ? memory.photos
                : [];

        if (photos.length === 0) {

            memoryGallery.innerHTML =
                '<p>No photos added.</p>';

        } else {

            photos.forEach(function (photo) {

                var image =
                    document.createElement('img');

                image.src = photo;
                image.alt = 'Memory photo';
                image.loading = 'lazy';

                memoryGallery.appendChild(
                    image
                );
            });
        }
    }


    /* VIDEOS */

    if (memoryVideosGallery) {

        memoryVideosGallery.innerHTML = '';

        var videos =
            Array.isArray(memory.videos)
                ? memory.videos
                : [];

        if (videos.length === 0) {

            memoryVideosGallery.innerHTML =
                '<p>No videos added.</p>';

        } else {

            videos.forEach(function (video) {

                var videoElement =
                    document.createElement('video');

                videoElement.src = video;
                videoElement.controls = true;
                videoElement.preload = 'metadata';

                memoryVideosGallery.appendChild(
                    videoElement
                );
            });
        }
    }


    if (memoryFormContainer) {
        memoryFormContainer.style.display =
            'none';
    }

    if (memoryViewContainer) {
        memoryViewContainer.style.display =
            'block';
    }

    memoryModal.classList.add('show');
    memoryModal.style.display = 'flex';

    document.body.style.overflow = 'hidden';
}


/* ==================================================
   FILE TO BASE64
================================================== */

function fileToBase64(file) {

    return new Promise(function (resolve, reject) {

        var reader =
            new FileReader();

        reader.onload =
            function () {
                resolve(reader.result);
            };

        reader.onerror =
            function () {
                reject(
                    new Error(
                        'Unable to read file.'
                    )
                );
            };

        reader.readAsDataURL(file);
    });
}


/* ==================================================
   SAVE MEMORY
================================================== */

if (memoryForm) {

    memoryForm.addEventListener(
        'submit',
        async function (event) {

            event.preventDefault();

            var id =
                memoryActivityId
                    ? memoryActivityId.value
                    : '';

            if (!id) {
                return;
            }

            var date =
                memoryDate
                    ? memoryDate.value
                    : '';

            var location =
                memoryLocation
                    ? memoryLocation.value.trim()
                    : '';

            var experience =
                memoryExperience
                    ? memoryExperience.value.trim()
                    : '';

            if (!date || !experience) {

                alert(
                    'Please enter the date and your experience.'
                );

                return;
            }

            var memories = getMemories();

            var oldMemory =
                memories[id] || {};

            var photos =
                Array.isArray(oldMemory.photos)
                    ? oldMemory.photos.slice()
                    : [];

            var videos =
                Array.isArray(oldMemory.videos)
                    ? oldMemory.videos.slice()
                    : [];


            /* PHOTOS */

            if (
                memoryPhotos &&
                memoryPhotos.files.length > 0
            ) {

                for (
                    var i = 0;
                    i < memoryPhotos.files.length;
                    i++
                ) {

                    var photo =
                        memoryPhotos.files[i];

                    if (
                        photo.size >
                        5 * 1024 * 1024
                    ) {

                        alert(
                            'Photo "' +
                            photo.name +
                            '" is larger than 5MB and was skipped.'
                        );

                        continue;
                    }

                    try {

                        var photoData =
                            await fileToBase64(
                                photo
                            );

                        photos.push(
                            photoData
                        );

                    } catch (error) {

                        console.error(
                            'Photo error:',
                            error
                        );
                    }
                }
            }


            /* VIDEOS */

            if (
                memoryVideos &&
                memoryVideos.files.length > 0
            ) {

                for (
                    var j = 0;
                    j < memoryVideos.files.length;
                    j++
                ) {

                    var video =
                        memoryVideos.files[j];

                    if (
                        video.size >
                        10 * 1024 * 1024
                    ) {

                        alert(
                            'Video "' +
                            video.name +
                            '" is larger than 10MB and was skipped.'
                        );

                        continue;
                    }

                    try {

                        var videoData =
                            await fileToBase64(
                                video
                            );

                        videos.push(
                            videoData
                        );

                    } catch (error) {

                        console.error(
                            'Video error:',
                            error
                        );
                    }
                }
            }


            memories[id] = {
                date: date,
                location: location,
                experience: experience,
                photos: photos,
                videos: videos
            };


            if (
                !writeStorage(
                    STORAGE.memories,
                    memories
                )
            ) {

                alert(
                    'The memory is too large to save. Try smaller photos or videos.'
                );

                return;
            }

            alert(
                'Memory saved successfully! ❤️'
            );

            openMemoryView(id);
        }
    );
}


/* ==================================================
   EDIT MEMORY
================================================== */

if (editMemoryBtn) {

    editMemoryBtn.addEventListener(
        'click',
        function () {

            var id =
                memoryActivityId
                    ? memoryActivityId.value
                    : '';

            if (id) {
                openMemoryForm(id);
            }
        }
    );
}


/* ==================================================
   CLOSE MEMORY
================================================== */

function closeMemory() {

    if (!memoryModal) {
        return;
    }

    memoryModal.classList.remove('show');

    memoryModal.style.display = 'none';

    document.body.style.overflow = '';
}

if (closeModal) {
    closeModal.addEventListener(
        'click',
        closeMemory
    );
}

if (memoryModal) {

    memoryModal.addEventListener(
        'click',
        function (event) {

            if (event.target === memoryModal) {
                closeMemory();
            }
        }
    );
}


/* ==================================================
   ESC KEY
================================================== */

document.addEventListener(
    'keydown',
    function (event) {

        if (event.key !== 'Escape') {
            return;
        }

        closeSecretModal();
        closeMemory();
    }
);


/* ==================================================
   START BUCKET LIST
================================================== */

if (bucketList) {
    loadAdventures();
    loadBucketStates();
    updateEmptyMessage();
    updateProgress();
}

});
