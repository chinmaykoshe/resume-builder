// Initialize counters
let experienceCount = 0;
let educationCount = 0;
let projectCount = 0;
let achievementCount = 0;
let languageCount = 0;
let customSectionCount = 0;
let currentTemplate = 'executive';
let currentColor = '#323232ff';
let currentFont = "'Inter', sans-serif";
let skillsArray = [];
let activeLinkFields = new Set();
let draggedElement = null;
let type = null;
// Update the global counter to the highest number
const myItems = document.querySelectorAll('.repeatable-item');
const maxNum = myItems.length;

if (type === 'experience') experienceCount = maxNum;
else if (type === 'education') educationCount = maxNum;
// ... etc for other types

// ADD THESE TWO FUNCTIONS HERE
function toggleCollapse(element) {
    const item = element.closest('.repeatable-item');
    if (item) {
        item.classList.toggle('collapsed');
    }
}

// Place this near the top of your script.js, before any function uses it!
function renumberItems(containerId, prefix) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const items = container.querySelectorAll('.repeatable-item');
    items.forEach((item, index) => {
        const number = index + 1;
        const oldId = item.id;
        // Get section type from id, e.g. 'education-1'
        const type = oldId.split('-')[0];
        const newId = `${type}-${number}`;
        item.id = newId;

        // Update number shown in header
        const headerText = item.querySelector('.item-number');
        if (headerText) headerText.textContent = `${prefix} ${number}`;

        // Update data-id on inner fields
        item.querySelectorAll('[data-id]').forEach(el => el.setAttribute('data-id', number));

        // Update checkbox id and label for="..."
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
            const checkboxId = `${type}-current-${number}`;
            checkbox.id = checkboxId;
            const label = item.querySelector(`label[for^="${type}-current"]`);
            if (label) label.setAttribute('for', checkboxId);
        }

        // Update delete button onclick for new id
        const deleteBtn = item.querySelector('.btn-icon-delete');
        if (deleteBtn) {
            deleteBtn.setAttribute('onclick', `event.stopPropagation(); removeSection('${newId}');`);
        }
    });
}

function collapseAllExcept(containerId, currentId) {
    const container = document.getElementById(containerId);
    if (container) {
        const items = container.querySelectorAll('.repeatable-item');
        items.forEach(item => {
            if (currentId && item.id === currentId) {
                item.classList.remove('collapsed');
            } else {
                item.classList.add('collapsed');
            }
        });
    }
    updateItemHeader()
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    loadDummyData();
    loadFromLocalStorage();
    updatePreview();

    // Add event listeners for real-time updates
    document.querySelectorAll('input, textarea, select').forEach(element => {
        element.addEventListener('input', () => {
            saveToLocalStorage();
            updatePreview();
        });
        element.addEventListener('change', () => {
            saveToLocalStorage();
            updatePreview();
        });
    });

    // Profile picture upload
    document.getElementById('profilePic').addEventListener('change', handleProfilePicture);

    // Summary character count
    document.getElementById('summary').addEventListener('input', updateCharCount);
});

// Load dummy data
function loadDummyData() {
    const hasData = localStorage.getItem('resumeData');
    if (hasData) return; // Don't load dummy data if user already has data

    // Set dummy personal info
    document.getElementById('firstName').value = 'John';
    document.getElementById('lastName').value = 'Doe';
    document.getElementById('email').value = 'john.doe@email.com';
    document.getElementById('phone').value = '+1 (555) 123-4567';
    document.getElementById('jobTitle').value = 'Senior Software Engineer';
    document.getElementById('city').value = 'San Francisco';
    document.getElementById('country').value = 'United States';
    document.getElementById('postalCode').value = '94102';
    document.getElementById('summary').value = 'Results-driven Software Engineer with 5+ years of experience in full-stack development. Specialized in building scalable web applications using modern technologies. Proven track record of delivering high-quality solutions and leading cross-functional teams.';

    // Add dummy skills
    skillsArray = ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'Git'];
    renderSkills();

    // Add dummy experience
    setTimeout(() => {
        addExperience();
        setTimeout(() => {
            document.querySelector('.exp-title').value = 'Senior Software Engineer';
            document.querySelector('.exp-company').value = 'Tech Corp';
            document.querySelector('.exp-location').value = 'San Francisco, CA';
            document.querySelector('.exp-start').value = 'Jan 2021';
            document.querySelector('.exp-end').value = 'Present';
            document.querySelector('.exp-current').checked = true;
            document.querySelector('.exp-desc').value = 'Led development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored team of 5 junior developers.';
        }, 50);
    }, 100);

    setTimeout(() => {
        addExperience();
        setTimeout(() => {
            const inputs = document.querySelectorAll('#experience-2 input, #experience-2 textarea');
            inputs[0].value = 'Software Engineer';
            inputs[1].value = 'StartUp Inc';
            inputs[2].value = 'New York, NY';
            inputs[3].value = 'Jun 2019';
            inputs[4].value = 'Dec 2020';
            inputs[6].value = 'Developed RESTful APIs using Node.js and Express. Built responsive UI components with React. Collaborated with designers to improve user experience.';
        }, 50);
    }, 200);

    // ADD AFTER: let draggedElement = null;

    function toggleCollapse(element) {
        const item = element.closest('.repeatable-item');
        item.classList.toggle('collapsed');
    }

    function collapseAllExcept(containerId, currentId) {
        const container = document.getElementById(containerId);
        if (container) {
            const items = container.querySelectorAll('.repeatable-item');
            items.forEach(item => {
                if (item.id !== currentId) {
                    item.classList.add('collapsed');
                }
            });
        }
    }

    // Replace the addExperience function with this:
    function addExperience() {
        experienceCount++;
        const container = document.getElementById('experienceContainer');
        collapseAllExcept('experienceContainer', null);
        const div = document.createElement('div');
        div.className = 'repeatable-item';
        div.id = `experience-${experienceCount}`;
        div.innerHTML = `
        <div class="item-header" onclick="toggleCollapse(this)">
            <div class="item-controls-left">
                <span class="drag-handle" title="Drag to reorder" onclick="event.stopPropagation()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </span>
                <span class="item-number">Experience ${experienceCount}</span>
            </div>
            <div class="item-controls-right">
                <span class="collapse-toggle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
                <button class="btn-icon-delete" onclick="event.stopPropagation(); removeSection('experience-${experienceCount}')" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
        <div class="item-content">
            <div class="form-grid">
                <div class="form-field">
                    <label class="form-label">Job Title *</label>
                    <input type="text" class="exp-title" data-id="${experienceCount}" placeholder="Software Engineer">
                </div>
                <div class="form-field">
                    <label class="form-label">Company *</label>
                    <input type="text" class="exp-company" data-id="${experienceCount}" placeholder="Tech Company Inc.">
                </div>
                <div class="form-field">
                    <label class="form-label">Location</label>
                    <input type="text" class="exp-location" data-id="${experienceCount}" placeholder="San Francisco, CA">
                </div>
                <div class="form-field">
                    <label class="form-label">Start Date</label>
                    <input type="text" class="exp-start" data-id="${experienceCount}" placeholder="Jan 2020">
                </div>
                <div class="form-field">
                    <label class="form-label">End Date</label>
                    <input type="text" class="exp-end" data-id="${experienceCount}" placeholder="Present">
                </div>
                <div class="form-field">
                    <div class="checkbox-field">
                        <input type="checkbox" class="exp-current" data-id="${experienceCount}" id="current-${experienceCount}">
                        <label for="current-${experienceCount}">I currently work here</label>
                    </div>
                </div>
                <div class="form-field full-width">
                    <label class="form-label">Description</label>
                    <textarea class="exp-desc" data-id="${experienceCount}" placeholder="Describe your key responsibilities..." rows="4"></textarea>
                </div>
            </div>
        </div>
    `;
        container.appendChild(div);
        makeDraggable(div);

        // Add event listeners with header update
        div.querySelectorAll('input, textarea').forEach(el => {
            el.addEventListener('input', () => {
                updateItemHeader(div.id); // UPDATE HEADER ON INPUT
                saveToLocalStorage();
                updatePreview();
            });
            el.addEventListener('change', () => {
                updateItemHeader(div.id); // UPDATE HEADER ON CHANGE
                saveToLocalStorage();
                updatePreview();
            });
        });

        div.querySelector('.exp-current').addEventListener('change', function () {
            const endDateInput = div.querySelector('.exp-end');
            if (this.checked) {
                endDateInput.value = 'Present';
                endDateInput.disabled = true;
            } else {
                endDateInput.disabled = false;
            }
            saveToLocalStorage();
            updatePreview();
        });

        renumberItems('experienceContainer', 'Experience'); // RENUMBER AFTER ADDING
    }

    function addEducation() {
        educationCount++;
        const container = document.getElementById('educationContainer');
        collapseAllExcept('educationContainer', null);
        const div = document.createElement('div');
        div.className = 'repeatable-item';
        div.id = `education-${educationCount}`;
        div.innerHTML = `
        <div class="item-header" onclick="toggleCollapse(this)">
            <div class="item-controls-left">
                <span class="drag-handle" title="Drag to reorder" onclick="event.stopPropagation()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </span>
                <span class="item-number">Education ${educationCount}</span>
            </div>
            <div class="item-controls-right">
                <span class="collapse-toggle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
                <button class="btn-icon-delete" onclick="event.stopPropagation(); removeSection('education-${educationCount}')" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
        <div class="item-content">
            <div class="form-grid">
                <div class="form-field full-width">
                    <label class="form-label">Degree/Certification *</label>
                    <input type="text" class="edu-degree" data-id="${educationCount}" placeholder="Bachelor of Science in Computer Science">
                </div>
                <div class="form-field">
                    <label class="form-label">Institution *</label>
                    <input type="text" class="edu-institution" data-id="${educationCount}" placeholder="University Name">
                </div>
                <div class="form-field">
                    <label class="form-label">Location</label>
                    <input type="text" class="edu-location" data-id="${educationCount}" placeholder="City, State">
                </div>
                <div class="form-field">
                    <label class="form-label">Start Year</label>
                    <input type="text" class="edu-start" data-id="${educationCount}" placeholder="2016">
                </div>
                <div class="form-field">
                    <label class="form-label">End Year</label>
                    <input type="text" class="edu-end" data-id="${educationCount}" placeholder="2020">
                </div>
                <div class="form-field full-width">
                    <label class="form-label">Additional Details <span class="optional-tag">(optional)</span></label>
                    <input type="text" class="edu-details" data-id="${educationCount}" placeholder="GPA: 3.8/4.0, Honors, Awards, etc.">
                </div>
            </div>
        </div>
    `;
        container.appendChild(div);
        makeDraggable(div);
        div.querySelectorAll('input').forEach(el => {
            el.addEventListener('input', () => { saveToLocalStorage(); updatePreview(); });
        });
    }

    function addProject() {
        projectCount++;
        const container = document.getElementById('projectsContainer');
        collapseAllExcept('projectsContainer', null);
        const div = document.createElement('div');
        div.className = 'repeatable-item';
        div.id = `project-${projectCount}`;
        div.innerHTML = `
        <div class="item-header" onclick="toggleCollapse(this)">
            <div class="item-controls-left">
                <span class="drag-handle" title="Drag to reorder" onclick="event.stopPropagation()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </span>
                <span class="item-number">Project ${projectCount}</span>
            </div>
            <div class="item-controls-right">
                <span class="collapse-toggle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
                <button class="btn-icon-delete" onclick="event.stopPropagation(); removeSection('project-${projectCount}')" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
        <div class="item-content">
            <div class="form-grid">
                <div class="form-field full-width">
                    <label class="form-label">Project Title *</label>
                    <input type="text" class="proj-title" data-id="${projectCount}" placeholder="E-commerce Platform">
                </div>
                <div class="form-field full-width">
                    <label class="form-label">Description</label>
                    <textarea class="proj-desc" data-id="${projectCount}" placeholder="Brief description of the project and your role..." rows="3"></textarea>
                </div>
                <div class="form-field">
                    <label class="form-label">Technologies Used</label>
                    <input type="text" class="proj-tech" data-id="${projectCount}" placeholder="React, Node.js, MongoDB">
                </div>
                <div class="form-field">
                    <label class="form-label">Project Link</label>
                    <input type="url" class="proj-link" data-id="${projectCount}" placeholder="https://project-demo.com">
                </div>
            </div>
        </div>
    `;
        container.appendChild(div);
        makeDraggable(div);
        div.querySelectorAll('input, textarea').forEach(el => {
            el.addEventListener('input', () => { saveToLocalStorage(); updatePreview(); });
        });
    }
    function addAchievement() {
        achievementCount++;
        const container = document.getElementById('achievementsContainer');
        collapseAllExcept('achievementsContainer', null);
        const div = document.createElement('div');
        div.className = 'repeatable-item';
        div.id = `achievement-${achievementCount}`;
        div.innerHTML = `
        <div class="item-header" onclick="toggleCollapse(this)">
            <div class="item-controls-left">
                <span class="drag-handle" title="Drag to reorder" onclick="event.stopPropagation()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </span>
                <span class="item-number">Achievement ${achievementCount}</span>
            </div>
            <div class="item-controls-right">
                <span class="collapse-toggle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
                <button class="btn-icon-delete" onclick="event.stopPropagation(); removeSection('achievement-${achievementCount}')" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
        <div class="item-content">
            <div class="form-grid">
                <div class="form-field">
                    <label class="form-label">Title *</label>
                    <input type="text" class="ach-title" data-id="${achievementCount}" placeholder="Best Developer Award">
                </div>
                <div class="form-field">
                    <label class="form-label">Issuer</label>
                    <input type="text" class="ach-issuer" data-id="${achievementCount}" placeholder="Organization Name">
                </div>
                <div class="form-field">
                    <label class="form-label">Date</label>
                    <input type="text" class="ach-date" data-id="${achievementCount}" placeholder="June 2023">
                </div>
                <div class="form-field full-width">
                    <label class="form-label">Description</label>
                    <textarea class="ach-desc" data-id="${achievementCount}" placeholder="Brief description of the achievement..." rows="2"></textarea>
                </div>
            </div>
        </div>
    `;
        container.appendChild(div);
        makeDraggable(div);
        div.querySelectorAll('input, textarea').forEach(el => {
            el.addEventListener('input', () => { saveToLocalStorage(); updatePreview(); });
        });
    }

    function addLanguage() {
        languageCount++;
        const container = document.getElementById('languagesContainer');
        collapseAllExcept('languagesContainer', null);
        const div = document.createElement('div');
        div.className = 'repeatable-item';
        div.id = `language-${languageCount}`;
        div.innerHTML = `
        <div class="item-header" onclick="toggleCollapse(this)">
            <div class="item-controls-left">
                <span class="drag-handle" title="Drag to reorder" onclick="event.stopPropagation()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </span>
                <span class="item-number">Language ${languageCount}</span>
            </div>
            <div class="item-controls-right">
                <span class="collapse-toggle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
                <button class="btn-icon-delete" onclick="event.stopPropagation(); removeSection('language-${languageCount}')" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
        <div class="item-content">
            <div class="form-grid">
                <div class="form-field">
                    <label class="form-label">Language *</label>
                    <input type="text" class="lang-name" data-id="${languageCount}" placeholder="English">
                </div>
                <div class="form-field">
                    <label class="form-label">Proficiency</label>
                    <select class="lang-proficiency" data-id="${languageCount}">
                        <option value="Basic">Basic</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Native">Native</option>
                    </select>
                </div>
            </div>
        </div>
    `;
        container.appendChild(div);
        makeDraggable(div);
        div.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('input', () => { saveToLocalStorage(); updatePreview(); });
            el.addEventListener('change', () => { saveToLocalStorage(); updatePreview(); });
        });
    }

    function addCustomSection() {
        customSectionCount++;
        const container = document.getElementById('customSectionsContainer');
        collapseAllExcept('customSectionsContainer', null);
        const div = document.createElement('div');
        div.className = 'repeatable-item';
        div.id = `custom-${customSectionCount}`;
        div.innerHTML = `
        <div class="item-header" onclick="toggleCollapse(this)">
            <div class="item-controls-left">
                <span class="drag-handle" title="Drag to reorder" onclick="event.stopPropagation()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </span>
                <span class="item-number">Custom Section ${customSectionCount}</span>
            </div>
            <div class="item-controls-right">
                <span class="collapse-toggle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
                <button class="btn-icon-delete" onclick="event.stopPropagation(); removeSection('custom-${customSectionCount}')" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
        <div class="item-content">
            <div class="form-grid">
                <div class="form-field full-width">
                    <label class="form-label">Section Title *</label>
                    <input type="text" class="custom-title" data-id="${customSectionCount}" placeholder="Volunteer Work, Publications, etc.">
                </div>
                <div class="form-field full-width">
                    <label class="form-label">Content</label>
                    <textarea class="custom-content" data-id="${customSectionCount}" placeholder="Details about this section..." rows="4"></textarea>
                </div>
            </div>
        </div>
    `;
        container.appendChild(div);
        makeDraggable(div);
        div.querySelectorAll('input, textarea').forEach(el => {
            el.addEventListener('input', () => { saveToLocalStorage(); updatePreview(); });
        });
    }


    // Add dummy education
    setTimeout(() => {
        addEducation();
        setTimeout(() => {
            const inputs = document.querySelectorAll('#education-1 input');
            inputs[0].value = 'Bachelor of Science in Computer Science';
            inputs[1].value = 'Stanford University';
            inputs[2].value = 'Stanford, CA';
            inputs[3].value = '2015';
            inputs[4].value = '2019';
            inputs[5].value = 'GPA: 3.8/4.0, Dean\'s List';
        }, 50);
    }, 300);

    // Add dummy project
    setTimeout(() => {
        addProject();
        setTimeout(() => {
            const inputs = document.querySelectorAll('#project-1 input, #project-1 textarea');
            inputs[0].value = 'E-commerce Platform';
            inputs[1].value = 'Built a full-stack e-commerce platform with payment integration, inventory management, and admin dashboard.';
            inputs[2].value = 'React, Node.js, MongoDB, Stripe API';
            inputs[3].value = 'https://github.com/johndoe/ecommerce';
        }, 50);
    }, 400);

    updateCharCount();
    saveToLocalStorage();
    updatePreview();
}

document.getElementById('profilePic').addEventListener('change', handleProfilePicture);

function handleProfilePicture(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Image size must be less than 5MB', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            const base64 = e.target.result;
            localStorage.setItem('profilePicture', base64);

            const preview = document.getElementById('photoPreview');
            preview.innerHTML = `<img src="${base64}" alt="Profile">`;

            updatePreview();
        };
        reader.readAsDataURL(file);
    }
}

// Load profile picture on page load
window.addEventListener('DOMContentLoaded', function () {
    const savedImage = localStorage.getItem('profilePicture');
    if (savedImage) {
        const preview = document.getElementById('photoPreview');
        preview.innerHTML = `<img src="${savedImage}" alt="Profile">`;
        updatePreview();
    }
});

// Character count for summary
function updateCharCount() {
    const summary = document.getElementById('summary');
    const count = document.getElementById('summaryCount');
    const length = summary.value.length;
    count.textContent = length;

    if (length > 500) {
        count.style.color = '#dc2626';
    } else {
        count.style.color = 'var(--text-tertiary)';
    }
}

// Toggle link field
function toggleLinkField(type) {
    const container = document.getElementById('linkFieldsContainer');
    const buttons = document.querySelectorAll('.link-btn');
    let button = null;

    buttons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(type)) {
            button = btn;
        }
    });

    if (activeLinkFields.has(type)) {
        activeLinkFields.delete(type);
        if (button) button.classList.remove('active');
        document.getElementById(`link-${type}`)?.remove();
    } else {
        activeLinkFields.add(type);
        if (button) button.classList.add('active');

        const field = document.createElement('div');
        field.className = 'form-field';
        field.id = `link-${type}`;
        field.innerHTML = `
            <label class="form-label">${type.charAt(0).toUpperCase() + type.slice(1)} URL</label>
            <input type="url" id="${type}" placeholder="https://${type}.com/username">
        `;
        container.appendChild(field);

        field.querySelector('input').addEventListener('input', () => {
            saveToLocalStorage();
            updatePreview();
        });
    }

    saveToLocalStorage();
}

// Skills management
function handleSkillInput(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addSkill();
    }
}

function addSkill() {
    const input = document.getElementById('skillInput');
    const skill = input.value.trim();

    if (skill && !skillsArray.includes(skill)) {
        skillsArray.push(skill);
        renderSkills();
        input.value = '';
        saveToLocalStorage();
        updatePreview();
    }
}

function removeSkill(index) {
    skillsArray.splice(index, 1);
    renderSkills();
    saveToLocalStorage();
    updatePreview();
}

function renderSkills() {
    const container = document.getElementById('skillsTagsContainer');
    if (!Array.isArray(skillsArray)) skillsArray = [];
    container.innerHTML = skillsArray.map((skill, index) => `
        <div class="skill-tag">
            ${skill}
            <span class="remove-skill" onclick="removeSkill(${index})">×</span>
        </div>
    `).join('');
}


// Update the loadFromLocalStorage function - find this section and replace:
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('resumeData');
    if (!savedData) return;

    const data = JSON.parse(savedData);

    if (document.getElementById('firstName')) document.getElementById('firstName').value = data.firstName || '';
    if (document.getElementById('lastName')) document.getElementById('lastName').value = data.lastName || '';
    if (document.getElementById('jobTitle')) document.getElementById('jobTitle').value = data.jobTitle || '';
    if (document.getElementById('city')) document.getElementById('city').value = data.city || '';
    if (document.getElementById('country')) document.getElementById('country').value = data.country || '';
    if (document.getElementById('postalCode')) document.getElementById('postalCode').value = data.postalCode || '';
    if (document.getElementById('phone')) document.getElementById('phone').value = data.phone || '';
    if (document.getElementById('email')) document.getElementById('email').value = data.email || '';
    if (document.getElementById('summary')) document.getElementById('summary').value = data.summary || '';
    if (document.getElementById('hobbies')) document.getElementById('hobbies').value = data.hobbies || '';

    // FIX: Ensure skills is always an array
    if (data.skills) {
        if (Array.isArray(data.skills)) {
            skillsArray = data.skills;
        } else if (typeof data.skills === 'string') {
            // If it's a string, split by comma
            skillsArray = data.skills.split(',').map(s => s.trim()).filter(s => s);
        } else {
            skillsArray = [];
        }
    } else {
        skillsArray = [];
    }
    renderSkills();

    const profilePic = localStorage.getItem('profilePicture');
    if (profilePic) {
        const preview = document.getElementById('photoPreview');
        preview.innerHTML = `<img src="${profilePic}" alt="Profile">`;
    }

    if (data.template) currentTemplate = data.template;
    if (data.color) currentColor = data.color;
    if (data.font) currentFont = data.font;

    if (data.activeLinkFields) {
        data.activeLinkFields.forEach(type => {
            toggleLinkField(type);
            if (data[type]) {
                setTimeout(() => {
                    const input = document.getElementById(type);
                    if (input) input.value = data[type];
                }, 10);
            }
        });
    }

    experienceCount = data.experienceCount || 0;
    educationCount = data.educationCount || 0;
    projectCount = data.projectCount || 0;
    achievementCount = data.achievementCount || 0;
    languageCount = data.languageCount || 0;
    customSectionCount = data.customSectionCount || 0;

    // Load experiences
    if (data.experiences && Array.isArray(data.experiences)) {
        data.experiences.forEach((exp, i) => {
            addExperience();
            setTimeout(() => {
                const inputs = document.querySelectorAll(`#experience-${i + 1} input, #experience-${i + 1} textarea`);
                if (inputs[0]) inputs[0].value = exp.title || '';
                if (inputs[1]) inputs[1].value = exp.company || '';
                if (inputs[2]) inputs[2].value = exp.location || '';
                if (inputs[3]) inputs[3].value = exp.start || '';
                if (inputs[4]) inputs[4].value = exp.end || '';
                if (inputs[5]) inputs[5].checked = exp.current || false;
                if (inputs[6]) inputs[6].value = exp.description || '';
            }, 10);
        });
    }

    // Load education
    if (data.education && Array.isArray(data.education)) {
        data.education.forEach((edu, i) => {
            addEducation();
            setTimeout(() => {
                const inputs = document.querySelectorAll(`#education-${i + 1} input`);
                if (inputs[0]) inputs[0].value = edu.degree || '';
                if (inputs[1]) inputs[1].value = edu.institution || '';
                if (inputs[2]) inputs[2].value = edu.location || '';
                if (inputs[3]) inputs[3].value = edu.start || '';
                if (inputs[4]) inputs[4].value = edu.end || '';
                if (inputs[5]) inputs[5].value = edu.details || '';
            }, 10);
        });
    }

    // Load projects
    if (data.projects && Array.isArray(data.projects)) {
        data.projects.forEach((proj, i) => {
            addProject();
            setTimeout(() => {
                const inputs = document.querySelectorAll(`#project-${i + 1} input, #project-${i + 1} textarea`);
                if (inputs[0]) inputs[0].value = proj.title || '';
                if (inputs[1]) inputs[1].value = proj.description || '';
                if (inputs[2]) inputs[2].value = proj.technologies || '';
                if (inputs[3]) inputs[3].value = proj.link || '';
            }, 10);
        });
    }

    // Load achievements
    if (data.achievements && Array.isArray(data.achievements)) {
        data.achievements.forEach((ach, i) => {
            addAchievement();
            setTimeout(() => {
                const inputs = document.querySelectorAll(`#achievement-${i + 1} input, #achievement-${i + 1} textarea`);
                if (inputs[0]) inputs[0].value = ach.title || '';
                if (inputs[1]) inputs[1].value = ach.issuer || '';
                if (inputs[2]) inputs[2].value = ach.date || '';
                if (inputs[3]) inputs[3].value = ach.description || '';
            }, 10);
        });
    }

    // Load languages
    if (data.languages && Array.isArray(data.languages)) {
        data.languages.forEach((lang, i) => {
            addLanguage();
            setTimeout(() => {
                const inputs = document.querySelectorAll(`#language-${i + 1} input, #language-${i + 1} select`);
                if (inputs[0]) inputs[0].value = lang.name || '';
                if (inputs[1]) inputs[1].value = lang.proficiency || 'Basic';
            }, 10);
        });
    }

    // Load custom sections
    if (data.customSections && Array.isArray(data.customSections)) {
        data.customSections.forEach((custom, i) => {
            addCustomSection();
            setTimeout(() => {
                const inputs = document.querySelectorAll(`#custom-${i + 1} input, #custom-${i + 1} textarea`);
                if (inputs[0]) inputs[0].value = custom.title || '';
                if (inputs[1]) inputs[1].value = custom.content || '';
            }, 10);
        });
    }

    updateCharCount();
}

// Also update the collectData function to ensure skills is always an array:
function collectData() {
    const firstName = document.getElementById('firstName')?.value || '';
    const lastName = document.getElementById('lastName')?.value || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Your Name';

    const city = document.getElementById('city')?.value || '';
    const country = document.getElementById('country')?.value || '';
    const location = [city, country].filter(x => x).join(', ');

    // Ensure skillsArray is an array
    const skills = Array.isArray(skillsArray) ? skillsArray : [];

    return {
        fullName,
        jobTitle: document.getElementById('jobTitle')?.value || '',
        location,
        postalCode: document.getElementById('postalCode')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        email: document.getElementById('email')?.value || '',
        linkedin: document.getElementById('linkedin')?.value || '',
        github: document.getElementById('github')?.value || '',
        website: document.getElementById('website')?.value || '',
        twitter: document.getElementById('twitter')?.value || '',
        summary: document.getElementById('summary')?.value || '',
        skills: skills,
        hobbies: document.getElementById('hobbies')?.value || '',
        profilePic: localStorage.getItem('profilePicture'),

        experiences: Array.from(document.querySelectorAll('.exp-title')).map((el, i) => ({
            title: el.value,
            company: document.querySelectorAll('.exp-company')[i]?.value || '',
            location: document.querySelectorAll('.exp-location')[i]?.value || '',
            start: document.querySelectorAll('.exp-start')[i]?.value || '',
            end: document.querySelectorAll('.exp-end')[i]?.value || '',
            description: document.querySelectorAll('.exp-desc')[i]?.value || ''
        })).filter(exp => exp.title),

        education: Array.from(document.querySelectorAll('.edu-degree')).map((el, i) => ({
            degree: el.value,
            institution: document.querySelectorAll('.edu-institution')[i]?.value || '',
            location: document.querySelectorAll('.edu-location')[i]?.value || '',
            start: document.querySelectorAll('.edu-start')[i]?.value || '',
            end: document.querySelectorAll('.edu-end')[i]?.value || '',
            details: document.querySelectorAll('.edu-details')[i]?.value || ''
        })).filter(edu => edu.degree),

        projects: Array.from(document.querySelectorAll('.proj-title')).map((el, i) => ({
            title: el.value,
            description: document.querySelectorAll('.proj-desc')[i]?.value || '',
            technologies: document.querySelectorAll('.proj-tech')[i]?.value || '',
            link: document.querySelectorAll('.proj-link')[i]?.value || ''
        })).filter(proj => proj.title),

        achievements: Array.from(document.querySelectorAll('.ach-title')).map((el, i) => ({
            title: el.value,
            issuer: document.querySelectorAll('.ach-issuer')[i]?.value || '',
            date: document.querySelectorAll('.ach-date')[i]?.value || '',
            description: document.querySelectorAll('.ach-desc')[i]?.value || ''
        })).filter(ach => ach.title),

        languages: Array.from(document.querySelectorAll('.lang-name')).map((el, i) => ({
            name: el.value,
            proficiency: document.querySelectorAll('.lang-proficiency')[i]?.value || 'Basic'
        })).filter(lang => lang.name),

        customSections: Array.from(document.querySelectorAll('.custom-title')).map((el, i) => ({
            title: el.value,
            content: document.querySelectorAll('.custom-content')[i]?.value || ''
        })).filter(custom => custom.title)
    };
}

function makeDraggable(element) {
    const dragHandle = element.querySelector('.drag-handle');
    if (!dragHandle) return;

    let isDragging = false;
    let startY = 0;
    let currentY = 0;

    // ========== MOUSE EVENTS ==========

    dragHandle.addEventListener('mousedown', function (e) {
        isDragging = true;
        draggedElement = element;
        element.classList.add('dragging');
        startY = e.clientY;
        e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging || !draggedElement) return;

        currentY = e.clientY;
        const container = draggedElement.parentElement;
        const afterElement = getDragAfterElement(container, currentY);

        if (afterElement == null) {
            container.appendChild(draggedElement);
        } else {
            container.insertBefore(draggedElement, afterElement);
        }
    });

    document.addEventListener('mouseup', function (e) {
        if (isDragging && draggedElement) {
            finalizeDrag();
        }
    });

    // ========== TOUCH EVENTS (mobile/tablets) ==========

    dragHandle.addEventListener('touchstart', function (e) {
        isDragging = true;
        draggedElement = element;
        element.classList.add('dragging');
        startY = e.touches[0].clientY;
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', function (e) {
        if (!isDragging || !draggedElement) return;

        currentY = e.touches[0].clientY;
        const container = draggedElement.parentElement;
        const afterElement = getDragAfterElement(container, currentY);

        if (afterElement == null) {
            container.appendChild(draggedElement);
        } else {
            container.insertBefore(draggedElement, afterElement);
        }

        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', function (e) {
        if (isDragging && draggedElement) {
            finalizeDrag();
        }
    });

    // ========== CLEANUP FUNCTION ==========

    function finalizeDrag() {
        draggedElement.classList.remove('dragging');

        const container = draggedElement.parentElement;
        const containerId = container.id;

        if (containerId === 'experienceContainer') {
            renumberItems('experienceContainer', 'Experience');
        } else if (containerId === 'educationContainer') {
            renumberItems('educationContainer', 'Education');
        } else if (containerId === 'projectsContainer') {
            renumberItems('projectsContainer', 'Project');
        } else if (containerId === 'achievementsContainer') {
            renumberItems('achievementsContainer', 'Achievement');
        } else if (containerId === 'languagesContainer') {
            renumberItems('languagesContainer', 'Language');
        } else if (containerId === 'customSectionsContainer') {
            renumberItems('customSectionsContainer', 'Custom Section');
        }

        saveToLocalStorage();
        updatePreview();

        draggedElement = null;
        isDragging = false;
    }

    // Prevent inputs from triggering drag
    element.querySelectorAll('input, textarea, select, button').forEach(input => {
        input.addEventListener('mousedown', function (e) {
            e.stopPropagation();
        });
        input.addEventListener('touchstart', function (e) {
            e.stopPropagation();
        }, { passive: true });
    });
}
function handleDragOver(e) {
    e.preventDefault();
    const container = e.currentTarget;
    const afterElement = getDragAfterElement(container, e.clientY);
    const dragging = document.querySelector('.dragging');
    if (!dragging) return;
    if (afterElement && afterElement instanceof Node) {
        container.insertBefore(dragging, afterElement);
    } else if (dragging instanceof Node) {
        container.appendChild(dragging);
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.repeatable-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

document.addEventListener('mouseup', function () {
    const dragging = document.querySelector('.dragging');
    if (dragging) {
        dragging.classList.remove('dragging');
        draggedElement = null;
        saveToLocalStorage();
        updatePreview();
    }
});
function addExperience() {
    experienceCount++;
    const container = document.getElementById('experienceContainer');
    collapseAllExcept('experienceContainer', null);
    const div = document.createElement('div');
    div.className = 'repeatable-item';
    div.id = `experience-${experienceCount}`;
    div.innerHTML = `
        <div class="item-header" onclick="toggleCollapse(this)">
            <div class="item-controls-left">
                <span class="drag-handle" title="Drag to reorder" onclick="event.stopPropagation()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </span>
                <span class="item-number">Experience ${experienceCount}</span>
            </div>
            <div class="item-controls-right">
                <span class="collapse-toggle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
                <button class="btn-icon-delete" onclick="event.stopPropagation(); removeSection('experience-${experienceCount}')" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
        <div class="item-content">
            <div class="form-grid">
                <div class="form-field">
                    <label class="form-label">Job Title *</label>
                    <input type="text" class="exp-title" data-id="${experienceCount}" placeholder="Software Engineer">
                </div>
                <div class="form-field">
                    <label class="form-label">Company *</label>
                    <input type="text" class="exp-company" data-id="${experienceCount}" placeholder="Tech Company Inc.">
                </div>
                <div class="form-field">
                    <label class="form-label">Location</label>
                    <input type="text" class="exp-location" data-id="${experienceCount}" placeholder="San Francisco, CA">
                </div>
                <div class="form-field">
                    <label class="form-label">Start Date</label>
                    <input type="text" class="exp-start" data-id="${experienceCount}" placeholder="Jan 2020">
                </div>
                <div class="form-field">
                    <label class="form-label">End Date</label>
                    <input type="text" class="exp-end" data-id="${experienceCount}" placeholder="Present">
                </div>
                <div class="form-field">
                    <div class="checkbox-field">
                        <input type="checkbox" class="exp-current" data-id="${experienceCount}" id="current-${experienceCount}">
                        <label for="current-${experienceCount}">I currently work here</label>
                    </div>
                </div>
                <div class="form-field full-width">
                    <label class="form-label">Description</label>
                    <textarea class="exp-desc" data-id="${experienceCount}" placeholder="Describe your key responsibilities..." rows="4"></textarea>
                </div>
            </div>
        </div>
    `;
    container.appendChild(div);
    makeDraggable(div);
    div.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', () => { saveToLocalStorage(); updatePreview(); });
        el.addEventListener('change', () => { saveToLocalStorage(); updatePreview(); });
    });
    div.querySelector('.exp-current').addEventListener('change', function () {
        const endDateInput = div.querySelector('.exp-end');
        if (this.checked) {
            endDateInput.value = 'Present';
            endDateInput.disabled = true;
        } else {
            endDateInput.disabled = false;
        }
        saveToLocalStorage();
        updatePreview();
    });
}
function addEducation() {
    educationCount++;
    const container = document.getElementById('educationContainer');
    collapseAllExcept('educationContainer', null);
    const div = document.createElement('div');
    div.className = 'repeatable-item';
    div.id = `education-${educationCount}`;
    div.innerHTML = `
        <div class="item-header" onclick="toggleCollapse(this)">
            <div class="item-controls-left">
                <span class="drag-handle" title="Drag to reorder" onclick="event.stopPropagation()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </span>
                <span class="item-number">Education ${educationCount}</span>
            </div>
            <div class="item-controls-right">
                <span class="collapse-toggle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
                <button class="btn-icon-delete" onclick="event.stopPropagation(); removeSection('education-${educationCount}')" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
        <div class="item-content">
            <div class="form-grid">
                <div class="form-field full-width">
                    <label class="form-label">Degree/Certification *</label>
                    <input type="text" class="edu-degree" data-id="${educationCount}" placeholder="Bachelor of Science in Computer Science">
                </div>
                <div class="form-field">
                    <label class="form-label">Institution *</label>
                    <input type="text" class="edu-institution" data-id="${educationCount}" placeholder="University Name">
                </div>
                <div class="form-field">
                    <label class="form-label">Location</label>
                    <input type="text" class="edu-location" data-id="${educationCount}" placeholder="City, State">
                </div>
                <div class="form-field">
                    <label class="form-label">Start Year</label>
                    <input type="text" class="edu-start" data-id="${educationCount}" placeholder="2016">
                </div>
                <div class="form-field">
                    <label class="form-label">End Year</label>
                    <input type="text" class="edu-end" data-id="${educationCount}" placeholder="2020">
                </div>
                <div class="form-field full-width">
                    <label class="form-label">Additional Details <span class="optional-tag">(optional)</span></label>
                    <input type="text" class="edu-details" data-id="${educationCount}" placeholder="GPA: 3.8/4.0, Honors, Awards, etc.">
                </div>
            </div>
        </div>
    `;
    container.appendChild(div);
    makeDraggable(div);

    div.querySelectorAll('input').forEach(el => {
        el.addEventListener('input', () => {
            updateItemHeader(div.id);
            saveToLocalStorage();
            updatePreview();
        });
    });

    renumberItems('educationContainer', 'Education');
}


function addProject() {
    projectCount++;
    const container = document.getElementById('projectsContainer');
    collapseAllExcept('projectsContainer', null);
    const div = document.createElement('div');
    div.className = 'repeatable-item';
    div.id = `project-${projectCount}`;
    div.innerHTML = `
        <div class="item-header" onclick="toggleCollapse(this)">
            <div class="item-controls-left">
                <span class="drag-handle" title="Drag to reorder" onclick="event.stopPropagation()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </span>
                <span class="item-number">Project ${projectCount}</span>
            </div>
            <div class="item-controls-right">
                <span class="collapse-toggle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
                <button class="btn-icon-delete" onclick="event.stopPropagation(); removeSection('project-${projectCount}')" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
        <div class="item-content">
            <div class="form-grid">
                <div class="form-field full-width">
                    <label class="form-label">Project Title *</label>
                    <input type="text" class="proj-title" data-id="${projectCount}" placeholder="E-commerce Platform">
                </div>
                <div class="form-field full-width">
                    <label class="form-label">Description</label>
                    <textarea class="proj-desc" data-id="${projectCount}" placeholder="Brief description of the project and your role..." rows="3"></textarea>
                </div>
                <div class="form-field">
                    <label class="form-label">Technologies Used</label>
                    <input type="text" class="proj-tech" data-id="${projectCount}" placeholder="React, Node.js, MongoDB">
                </div>
                <div class="form-field">
                    <label class="form-label">Project Link</label>
                    <input type="url" class="proj-link" data-id="${projectCount}" placeholder="https://project-demo.com">
                </div>
            </div>
        </div>
    `;
    container.appendChild(div);
    makeDraggable(div);

    div.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', () => {
            updateItemHeader(div.id);
            saveToLocalStorage();
            updatePreview();
        });
    });

    renumberItems('projectsContainer', 'Project');
}
function addAchievement() {
    achievementCount++;
    const container = document.getElementById('achievementsContainer');
    collapseAllExcept('achievementsContainer', null);
    const div = document.createElement('div');
    div.className = 'repeatable-item';
    div.id = `achievement-${achievementCount}`;
    div.innerHTML = `
        <div class="item-header" onclick="toggleCollapse(this)">
            <div class="item-controls-left">
                <span class="drag-handle" title="Drag to reorder" onclick="event.stopPropagation()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </span>
                <span class="item-number">Achievement ${achievementCount}</span>
            </div>
            <div class="item-controls-right">
                <span class="collapse-toggle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
                <button class="btn-icon-delete" onclick="event.stopPropagation(); removeSection('achievement-${achievementCount}')" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
        <div class="item-content">
            <div class="form-grid">
                <div class="form-field">
                    <label class="form-label">Title *</label>
                    <input type="text" class="ach-title" data-id="${achievementCount}" placeholder="Best Developer Award">
                </div>
                <div class="form-field">
                    <label class="form-label">Issuer</label>
                    <input type="text" class="ach-issuer" data-id="${achievementCount}" placeholder="Organization Name">
                </div>
                <div class="form-field">
                    <label class="form-label">Date</label>
                    <input type="text" class="ach-date" data-id="${achievementCount}" placeholder="June 2023">
                </div>
                <div class="form-field full-width">
                    <label class="form-label">Description</label>
                    <textarea class="ach-desc" data-id="${achievementCount}" placeholder="Brief description of the achievement..." rows="2"></textarea>
                </div>
            </div>
        </div>
    `;
    container.appendChild(div);
    makeDraggable(div);

    div.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', () => {
            updateItemHeader(div.id);
            saveToLocalStorage();
            updatePreview();
        });
    });

    renumberItems('achievementsContainer', 'Achievement');
}
function addLanguage() {
    languageCount++;
    const container = document.getElementById('languagesContainer');
    collapseAllExcept('languagesContainer', null);
    const div = document.createElement('div');
    div.className = 'repeatable-item';
    div.id = `language-${languageCount}`;
    div.innerHTML = `
        <div class="item-header" onclick="toggleCollapse(this)">
            <div class="item-controls-left">
                <span class="drag-handle" title="Drag to reorder" onclick="event.stopPropagation()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </span>
                <span class="item-number">Language ${languageCount}</span>
            </div>
            <div class="item-controls-right">
                <span class="collapse-toggle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
                <button class="btn-icon-delete" onclick="event.stopPropagation(); removeSection('language-${languageCount}')" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
        <div class="item-content">
            <div class="form-grid">
                <div class="form-field">
                    <label class="form-label">Language *</label>
                    <input type="text" class="lang-name" data-id="${languageCount}" placeholder="English">
                </div>
                <div class="form-field">
                    <label class="form-label">Proficiency</label>
                    <select class="lang-proficiency" data-id="${languageCount}">
                        <option value="Basic">Basic</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Native">Native</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    container.appendChild(div);
    makeDraggable(div);

    div.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', () => {
            updateItemHeader(div.id);
            saveToLocalStorage();
            updatePreview();
        });
        el.addEventListener('change', () => {
            updateItemHeader(div.id);
            saveToLocalStorage();
            updatePreview();
        });
    });

    renumberItems('languagesContainer', 'Language');
}

function addCustomSection() {
    customSectionCount++;
    const container = document.getElementById('customSectionsContainer');
    collapseAllExcept('customSectionsContainer', null);
    const div = document.createElement('div');
    div.className = 'repeatable-item';
    div.id = `custom-${customSectionCount}`;
    div.innerHTML = `
        <div class="item-header" onclick="toggleCollapse(this)">
            <div class="item-controls-left">
                <span class="drag-handle" title="Drag to reorder" onclick="event.stopPropagation()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </span>
                <span class="item-number">Custom Section ${customSectionCount}</span>
            </div>
            <div class="item-controls-right">
                <span class="collapse-toggle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
                <button class="btn-icon-delete" onclick="event.stopPropagation(); removeSection('custom-${customSectionCount}')" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
        <div class="item-content">
            <div class="form-grid">
                <div class="form-field full-width">
                    <label class="form-label">Section Title *</label>
                    <input type="text" class="custom-title" data-id="${customSectionCount}" placeholder="Volunteer Work, Publications, etc.">
                </div>
                <div class="form-field full-width">
                    <label class="form-label">Content</label>
                    <textarea class="custom-content" data-id="${customSectionCount}" placeholder="Details about this section..." rows="4"></textarea>
                </div>
            </div>
        </div>
    `;
    container.appendChild(div);
    makeDraggable(div);

    div.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', () => {
            updateItemHeader(div.id);
            saveToLocalStorage();
            updatePreview();
        });
    });

    renumberItems('customSectionsContainer', 'Custom Section');
}


function removeSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();

        // Renumber based on type
        if (id.startsWith('experience-')) {
            renumberItems('experienceContainer', 'Experience');
        } else if (id.startsWith('education-')) {
            renumberItems('educationContainer', 'Education');
        } else if (id.startsWith('project-')) {
            renumberItems('projectsContainer', 'Project');
        } else if (id.startsWith('achievement-')) {
            renumberItems('achievementsContainer', 'Achievement');
        } else if (id.startsWith('language-')) {
            renumberItems('languagesContainer', 'Language');
        } else if (id.startsWith('custom-')) {
            renumberItems('customSectionsContainer', 'Custom Section');
        }

        saveToLocalStorage();
        updatePreview();
        renumberItems()
    }

}


// Enable drag and drop on containers
['experienceContainer', 'educationContainer', 'projectsContainer', 'achievementsContainer', 'languagesContainer', 'customSectionsContainer'].forEach(containerId => {
    const container = document.getElementById(containerId);
    if (container) {
        container.addEventListener('dragover', handleDragOver);
    }
});

// Due to character limit, I'll provide the key remaining functions:

function saveToLocalStorage() {
    const data = {
        firstName: document.getElementById('firstName')?.value || '',
        lastName: document.getElementById('lastName')?.value || '',
        jobTitle: document.getElementById('jobTitle')?.value || '',
        city: document.getElementById('city')?.value || '',
        country: document.getElementById('country')?.value || '',
        postalCode: document.getElementById('postalCode')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        email: document.getElementById('email')?.value || '',
        summary: document.getElementById('summary')?.value || '',
        skills: skillsArray,
        hobbies: document.getElementById('hobbies')?.value || '',

        experiences: Array.from(document.querySelectorAll('.exp-title')).map((el, i) => ({
            title: el.value,
            company: document.querySelectorAll('.exp-company')[i]?.value || '',
            location: document.querySelectorAll('.exp-location')[i]?.value || '',
            start: document.querySelectorAll('.exp-start')[i]?.value || '',
            end: document.querySelectorAll('.exp-end')[i]?.value || '',
            current: document.querySelectorAll('.exp-current')[i]?.checked || false,
            description: document.querySelectorAll('.exp-desc')[i]?.value || ''
        })),

        education: Array.from(document.querySelectorAll('.edu-degree')).map((el, i) => ({
            degree: el.value,
            institution: document.querySelectorAll('.edu-institution')[i]?.value || '',
            location: document.querySelectorAll('.edu-location')[i]?.value || '',
            start: document.querySelectorAll('.edu-start')[i]?.value || '',
            end: document.querySelectorAll('.edu-end')[i]?.value || '',
            details: document.querySelectorAll('.edu-details')[i]?.value || ''
        })),

        projects: Array.from(document.querySelectorAll('.proj-title')).map((el, i) => ({
            title: el.value,
            description: document.querySelectorAll('.proj-desc')[i]?.value || '',
            technologies: document.querySelectorAll('.proj-tech')[i]?.value || '',
            link: document.querySelectorAll('.proj-link')[i]?.value || ''
        })),

        achievements: Array.from(document.querySelectorAll('.ach-title')).map((el, i) => ({
            title: el.value,
            issuer: document.querySelectorAll('.ach-issuer')[i]?.value || '',
            date: document.querySelectorAll('.ach-date')[i]?.value || '',
            description: document.querySelectorAll('.ach-desc')[i]?.value || ''
        })),

        languages: Array.from(document.querySelectorAll('.lang-name')).map((el, i) => ({
            name: el.value,
            proficiency: document.querySelectorAll('.lang-proficiency')[i]?.value || 'Basic'
        })),

        customSections: Array.from(document.querySelectorAll('.custom-title')).map((el, i) => ({
            title: el.value,
            content: document.querySelectorAll('.custom-content')[i]?.value || ''
        })),

        template: currentTemplate,
        color: currentColor,
        font: currentFont,
        activeLinkFields: Array.from(activeLinkFields),
        experienceCount,
        educationCount,
        projectCount,
        achievementCount,
        languageCount,
        customSectionCount
    };

    activeLinkFields.forEach(type => {
        const input = document.getElementById(type);
        if (input) {
            data[type] = input.value;
        }
    });

    localStorage.setItem('resumeData', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('resumeData');
    if (!savedData) return;

    const data = JSON.parse(savedData);

    if (document.getElementById('firstName')) document.getElementById('firstName').value = data.firstName || '';
    if (document.getElementById('lastName')) document.getElementById('lastName').value = data.lastName || '';
    if (document.getElementById('jobTitle')) document.getElementById('jobTitle').value = data.jobTitle || '';
    if (document.getElementById('city')) document.getElementById('city').value = data.city || '';
    if (document.getElementById('country')) document.getElementById('country').value = data.country || '';
    if (document.getElementById('postalCode')) document.getElementById('postalCode').value = data.postalCode || '';
    if (document.getElementById('phone')) document.getElementById('phone').value = data.phone || '';
    if (document.getElementById('email')) document.getElementById('email').value = data.email || '';
    if (document.getElementById('summary')) document.getElementById('summary').value = data.summary || '';
    if (document.getElementById('hobbies')) document.getElementById('hobbies').value = data.hobbies || '';

    skillsArray = data.skills || [];
    renderSkills();

    const profilePic = localStorage.getItem('profilePicture');
    if (profilePic) {
        const preview = document.getElementById('photoPreview');
        preview.innerHTML = `<img src="${profilePic}" alt="Profile">`;
    }

    if (data.template) currentTemplate = data.template;
    if (data.color) currentColor = data.color;
    if (data.font) currentFont = data.font;

    if (data.activeLinkFields) {
        data.activeLinkFields.forEach(type => {
            toggleLinkField(type);
            if (data[type]) {
                setTimeout(() => {
                    const input = document.getElementById(type);
                    if (input) input.value = data[type];
                }, 10);
            }
        });
    }

    experienceCount = data.experienceCount || 0;
    educationCount = data.educationCount || 0;
    projectCount = data.projectCount || 0;
    achievementCount = data.achievementCount || 0;
    languageCount = data.languageCount || 0;
    customSectionCount = data.customSectionCount || 0;

    if (data.experiences) {
        data.experiences.forEach((exp, i) => {
            addExperience();
            setTimeout(() => {
                const inputs = document.querySelectorAll(`#experience-${i + 1} input, #experience-${i + 1} textarea`);
                if (inputs[0]) inputs[0].value = exp.title || '';
                if (inputs[1]) inputs[1].value = exp.company || '';
                if (inputs[2]) inputs[2].value = exp.location || '';
                if (inputs[3]) inputs[3].value = exp.start || '';
                if (inputs[4]) inputs[4].value = exp.end || '';
                if (inputs[5]) inputs[5].checked = exp.current || false;
                if (inputs[6]) inputs[6].value = exp.description || '';
            }, 10);
        });
    }

    if (data.education) {
        data.education.forEach((edu, i) => {
            addEducation();
            setTimeout(() => {
                const inputs = document.querySelectorAll(`#education-${i + 1} input`);
                if (inputs[0]) inputs[0].value = edu.degree || '';
                if (inputs[1]) inputs[1].value = edu.institution || '';
                if (inputs[2]) inputs[2].value = edu.location || '';
                if (inputs[3]) inputs[3].value = edu.start || '';
                if (inputs[4]) inputs[4].value = edu.end || '';
                if (inputs[5]) inputs[5].value = edu.details || '';
            }, 10);
        });
    }

    if (data.projects) {
        data.projects.forEach((proj, i) => {
            addProject();
            setTimeout(() => {
                const inputs = document.querySelectorAll(`#project-${i + 1} input, #project-${i + 1} textarea`);
                if (inputs[0]) inputs[0].value = proj.title || '';
                if (inputs[1]) inputs[1].value = proj.description || '';
                if (inputs[2]) inputs[2].value = proj.technologies || '';
                if (inputs[3]) inputs[3].value = proj.link || '';
            }, 10);
        });
    }

    if (data.achievements) {
        data.achievements.forEach((ach, i) => {
            addAchievement();
            setTimeout(() => {
                const inputs = document.querySelectorAll(`#achievement-${i + 1} input, #achievement-${i + 1} textarea`);
                if (inputs[0]) inputs[0].value = ach.title || '';
                if (inputs[1]) inputs[1].value = ach.issuer || '';
                if (inputs[2]) inputs[2].value = ach.date || '';
                if (inputs[3]) inputs[3].value = ach.description || '';
            }, 10);
        });
    }

    if (data.languages) {
        data.languages.forEach((lang, i) => {
            addLanguage();
            setTimeout(() => {
                const inputs = document.querySelectorAll(`#language-${i + 1} input, #language-${i + 1} select`);
                if (inputs[0]) inputs[0].value = lang.name || '';
                if (inputs[1]) inputs[1].value = lang.proficiency || 'Basic';
            }, 10);
        });
    }

    if (data.customSections) {
        data.customSections.forEach((custom, i) => {
            addCustomSection();
            setTimeout(() => {
                const inputs = document.querySelectorAll(`#custom-${i + 1} input, #custom-${i + 1} textarea`);
                if (inputs[0]) inputs[0].value = custom.title || '';
                if (inputs[1]) inputs[1].value = custom.content || '';
            }, 10);
        });
    }

    updateCharCount();
}

function collectData() {
    const firstName = document.getElementById('firstName')?.value || '';
    const lastName = document.getElementById('lastName')?.value || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Your Name';

    const city = document.getElementById('city')?.value || '';
    const country = document.getElementById('country')?.value || '';
    const location = [city, country].filter(x => x).join(', ');

    return {
        fullName,
        jobTitle: document.getElementById('jobTitle')?.value || '',
        location,
        postalCode: document.getElementById('postalCode')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        email: document.getElementById('email')?.value || '',
        linkedin: document.getElementById('linkedin')?.value || '',
        github: document.getElementById('github')?.value || '',
        website: document.getElementById('website')?.value || '',
        twitter: document.getElementById('twitter')?.value || '',
        summary: document.getElementById('summary')?.value || '',
        skills: skillsArray,
        hobbies: document.getElementById('hobbies')?.value || '',
        profilePic: localStorage.getItem('profilePicture'),

        experiences: Array.from(document.querySelectorAll('.exp-title')).map((el, i) => ({
            title: el.value,
            company: document.querySelectorAll('.exp-company')[i]?.value || '',
            location: document.querySelectorAll('.exp-location')[i]?.value || '',
            start: document.querySelectorAll('.exp-start')[i]?.value || '',
            end: document.querySelectorAll('.exp-end')[i]?.value || '',
            description: document.querySelectorAll('.exp-desc')[i]?.value || ''
        })).filter(exp => exp.title),

        education: Array.from(document.querySelectorAll('.edu-degree')).map((el, i) => ({
            degree: el.value,
            institution: document.querySelectorAll('.edu-institution')[i]?.value || '',
            location: document.querySelectorAll('.edu-location')[i]?.value || '',
            start: document.querySelectorAll('.edu-start')[i]?.value || '',
            end: document.querySelectorAll('.edu-end')[i]?.value || '',
            details: document.querySelectorAll('.edu-details')[i]?.value || ''
        })).filter(edu => edu.degree),

        projects: Array.from(document.querySelectorAll('.proj-title')).map((el, i) => ({
            title: el.value,
            description: document.querySelectorAll('.proj-desc')[i]?.value || '',
            technologies: document.querySelectorAll('.proj-tech')[i]?.value || '',
            link: document.querySelectorAll('.proj-link')[i]?.value || ''
        })).filter(proj => proj.title),

        achievements: Array.from(document.querySelectorAll('.ach-title')).map((el, i) => ({
            title: el.value,
            issuer: document.querySelectorAll('.ach-issuer')[i]?.value || '',
            date: document.querySelectorAll('.ach-date')[i]?.value || '',
            description: document.querySelectorAll('.ach-desc')[i]?.value || ''
        })).filter(ach => ach.title),

        languages: Array.from(document.querySelectorAll('.lang-name')).map((el, i) => ({
            name: el.value,
            proficiency: document.querySelectorAll('.lang-proficiency')[i]?.value || 'Basic'
        })).filter(lang => lang.name),

        customSections: Array.from(document.querySelectorAll('.custom-title')).map((el, i) => ({
            title: el.value,
            content: document.querySelectorAll('.custom-content')[i]?.value || ''
        })).filter(custom => custom.title)
    };
}

function updatePreview() {
    const data = collectData();
    renderResume(document.getElementById('resumePreview'), currentTemplate, data, currentFont);
    renderResume(document.getElementById('sidebarPreview'), currentTemplate, data, currentFont);
}

function renderResume(container, template, data, font) {
    container.style.setProperty('--theme-color', currentColor);
    container.style.fontFamily = font;
    container.className = `resume-preview template-${template}`;

    let contactInfo = [];
    if (data.phone) contactInfo.push(data.phone);
    if (data.email) contactInfo.push(data.email);
    if (data.location) contactInfo.push(data.location);
    if (data.linkedin) contactInfo.push('LinkedIn');
    if (data.github) contactInfo.push('GitHub');
    if (data.website) contactInfo.push('Website');
    if (data.twitter) contactInfo.push('Twitter');

    let html = '';

    if (template === 'executive') {
        html = renderExecutiveTemplate(data, contactInfo);
    } else if (template === 'modern-pro') {
        html = renderModernProTemplate(data, contactInfo);
    } else if (template === 'minimal') {
        html = renderMinimalTemplate(data, contactInfo);
    } else if (template === 'creative') {
        html = renderCreativeTemplate(data, contactInfo);
    } else if (template === 'corporate') {
        html = renderCorporateTemplate(data, contactInfo);
    } else if (template === 'elegant') {
        html = renderElegantTemplate(data, contactInfo);
    }

    container.innerHTML = html;
}


// Template Renderers

function renderExecutiveTemplate(data, contactInfo) {
    let html = `
        <div class="resume-header">
            ${data.profilePic ? `<img src="${data.profilePic}" class="profile-pic" alt="Profile">` : ''}
            <div class="resume-name">${data.fullName}</div>
            ${data.jobTitle ? `<div class="resume-title">${data.jobTitle}</div>` : ''}
            ${contactInfo.length > 0 ? `<div class="contact-info">${contactInfo.join(' • ')}</div>` : ''}
        </div>
    `;

    if (data.summary) {
        html += `
            <div class="section">
                <div class="section-title">Professional Summary</div>
                <div class="item-description">${data.summary}</div>
            </div>
        `;
    }

    if (data.experiences.length > 0) {
        html += `<div class="section"><div class="section-title">Experience</div>`;
        data.experiences.forEach(exp => {
            const dateRange = [exp.start, exp.end].filter(x => x).join(' - ');
            html += `
                <div class="experience-item">
                    <div class="item-title">${exp.title}</div>
                    <div class="item-subtitle">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
                    ${dateRange ? `<div class="item-date">${dateRange}</div>` : ''}
                    ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.education.length > 0) {
        html += `<div class="section"><div class="section-title">Education</div>`;
        data.education.forEach(edu => {
            const dateRange = [edu.start, edu.end].filter(x => x).join(' - ');
            html += `
                <div class="education-item">
                    <div class="item-title">${edu.degree}</div>
                    <div class="item-subtitle">${edu.institution}${edu.location ? ` • ${edu.location}` : ''}</div>
                    ${dateRange ? `<div class="item-date">${dateRange}</div>` : ''}
                    ${edu.details ? `<div class="item-description">${edu.details}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.skills.length > 0) {
        html += `
            <div class="section">
                <div class="section-title">Skills</div>
                <div class="skills-list">
                    ${data.skills.map(skill => `<span class="skill-tag-resume">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    }

    if (data.projects.length > 0) {
        html += `<div class="section"><div class="section-title">Projects</div>`;
        data.projects.forEach(proj => {
            html += `
                <div class="project-item">
                    <div class="item-title">${proj.title}</div>
                    ${proj.description ? `<div class="item-description">${proj.description}</div>` : ''}
                    ${proj.technologies ? `<div class="item-subtitle">Technologies: ${proj.technologies}</div>` : ''}
                    ${proj.link ? `<div class="item-subtitle">Link: ${proj.link}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.achievements.length > 0) {
        html += `<div class="section"><div class="section-title">Achievements</div>`;
        data.achievements.forEach(ach => {
            html += `
                <div class="achievement-item">
                    <div class="item-title">${ach.title}</div>
                    <div class="item-subtitle">${ach.issuer}${ach.date ? ` • ${ach.date}` : ''}</div>
                    ${ach.description ? `<div class="item-description">${ach.description}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.languages.length > 0) {
        html += `<div class="section"><div class="section-title">Languages</div>`;
        data.languages.forEach(lang => {
            html += `<div class="language-item"><span>${lang.name}</span><span>${lang.proficiency}</span></div>`;
        });
        html += `</div>`;
    }

    if (data.hobbies) {
        html += `
            <div class="section">
                <div class="section-title">Interests</div>
                <div class="item-description">${data.hobbies}</div>
            </div>
        `;
    }

    data.customSections.forEach(custom => {
        html += `
            <div class="section">
                <div class="section-title">${custom.title}</div>
                <div class="item-description">${custom.content}</div>
            </div>
        `;
    });

    return html;
}

function renderModernProTemplate(data, contactInfo) {
    let sidebarHtml = `
        ${data.profilePic ? `<img src="${data.profilePic}" class="profile-pic" alt="Profile">` : ''}
        <div class="resume-name">${data.fullName}</div>
        ${data.jobTitle ? `<div class="resume-title">${data.jobTitle}</div>` : ''}
    `;

    if (contactInfo.length > 0) {
        sidebarHtml += `
            <div class="section">
                <div class="section-title">Contact</div>
                ${contactInfo.map(info => `<div style="margin-bottom: 10px; font-size: 13px;">${info}</div>`).join('')}
            </div>
        `;
    }

    if (data.skills.length > 0) {
        sidebarHtml += `
            <div class="section">
                <div class="section-title">Skills</div>
                ${data.skills.map(skill => `<div style="margin-bottom: 8px; font-size: 13px;">• ${skill}</div>`).join('')}
            </div>
        `;
    }

    if (data.languages.length > 0) {
        sidebarHtml += `<div class="section"><div class="section-title">Languages</div>`;
        data.languages.forEach(lang => {
            sidebarHtml += `<div class="language-item" style="color: white;"><span>${lang.name}</span><span>${lang.proficiency}</span></div>`;
        });
        sidebarHtml += `</div>`;
    }

    if (data.hobbies) {
        sidebarHtml += `
            <div class="section">
                <div class="section-title">Interests</div>
                <div style="font-size: 13px; line-height: 1.6;">${data.hobbies}</div>
            </div>
        `;
    }

    let mainHtml = '';

    if (data.summary) {
        mainHtml += `
            <div class="section">
                <div class="section-title">Professional Summary</div>
                <div class="item-description">${data.summary}</div>
            </div>
        `;
    }

    if (data.experiences.length > 0) {
        mainHtml += `<div class="section"><div class="section-title">Experience</div>`;
        data.experiences.forEach(exp => {
            const dateRange = [exp.start, exp.end].filter(x => x).join(' - ');
            mainHtml += `
                <div class="experience-item">
                    <div class="item-title">${exp.title}</div>
                    <div class="item-subtitle">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
                    ${dateRange ? `<div class="item-date">${dateRange}</div>` : ''}
                    ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                </div>
            `;
        });
        mainHtml += `</div>`;
    }

    if (data.education.length > 0) {
        mainHtml += `<div class="section"><div class="section-title">Education</div>`;
        data.education.forEach(edu => {
            const dateRange = [edu.start, edu.end].filter(x => x).join(' - ');
            mainHtml += `
                <div class="education-item">
                    <div class="item-title">${edu.degree}</div>
                    <div class="item-subtitle">${edu.institution}${edu.location ? ` • ${edu.location}` : ''}</div>
                    ${dateRange ? `<div class="item-date">${dateRange}</div>` : ''}
                    ${edu.details ? `<div class="item-description">${edu.details}</div>` : ''}
                </div>
            `;
        });
        mainHtml += `</div>`;
    }

    if (data.projects.length > 0) {
        mainHtml += `<div class="section"><div class="section-title">Projects</div>`;
        data.projects.forEach(proj => {
            mainHtml += `
                <div class="project-item">
                    <div class="item-title">${proj.title}</div>
                    ${proj.description ? `<div class="item-description">${proj.description}</div>` : ''}
                    ${proj.technologies ? `<div class="item-subtitle">Technologies: ${proj.technologies}</div>` : ''}
                    ${proj.link ? `<div class="item-subtitle">Link: ${proj.link}</div>` : ''}
                </div>
            `;
        });
        mainHtml += `</div>`;
    }

    if (data.achievements.length > 0) {
        mainHtml += `<div class="section"><div class="section-title">Achievements</div>`;
        data.achievements.forEach(ach => {
            mainHtml += `
                <div class="achievement-item">
                    <div class="item-title">${ach.title}</div>
                    <div class="item-subtitle">${ach.issuer}${ach.date ? ` • ${ach.date}` : ''}</div>
                    ${ach.description ? `<div class="item-description">${ach.description}</div>` : ''}
                </div>
            `;
        });
        mainHtml += `</div>`;
    }

    data.customSections.forEach(custom => {
        mainHtml += `
            <div class="section">
                <div class="section-title">${custom.title}</div>
                <div class="item-description">${custom.content}</div>
            </div>
        `;
    });

    return `<div class="sidebar">${sidebarHtml}</div><div class="main-content">${mainHtml}</div>`;
}

function renderMinimalTemplate(data, contactInfo) {
    let html = `
        <div class="resume-header">
            <div class="resume-name">${data.fullName}</div>
            ${data.jobTitle ? `<div class="resume-title">${data.jobTitle}</div>` : ''}
            ${contactInfo.length > 0 ? `<div class="contact-info">${contactInfo.join(' • ')}</div>` : ''}
        </div>
    `;

    if (data.summary) {
        html += `
            <div class="section">
                <div class="section-title">Summary</div>
                <div class="item-description">${data.summary}</div>
            </div>
        `;
    }

    if (data.experiences.length > 0) {
        html += `<div class="section"><div class="section-title">Experience</div>`;
        data.experiences.forEach(exp => {
            const dateRange = [exp.start, exp.end].filter(x => x).join(' - ');
            html += `
                <div class="experience-item">
                    <div class="item-title">${exp.title}</div>
                    <div class="item-subtitle">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
                    ${dateRange ? `<div class="item-date">${dateRange}</div>` : ''}
                    ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.education.length > 0) {
        html += `<div class="section"><div class="section-title">Education</div>`;
        data.education.forEach(edu => {
            const dateRange = [edu.start, edu.end].filter(x => x).join(' - ');
            html += `
                <div class="education-item">
                    <div class="item-title">${edu.degree}</div>
                    <div class="item-subtitle">${edu.institution}${edu.location ? ` • ${edu.location}` : ''}</div>
                    ${dateRange ? `<div class="item-date">${dateRange}</div>` : ''}
                    ${edu.details ? `<div class="item-description">${edu.details}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.skills.length > 0) {
        html += `
            <div class="section">
                <div class="section-title">Skills</div>
                <div class="item-description">${data.skills.join(' • ')}</div>
            </div>
        `;
    }

    if (data.projects.length > 0) {
        html += `<div class="section"><div class="section-title">Projects</div>`;
        data.projects.forEach(proj => {
            html += `
                <div class="project-item">
                    <div class="item-title">${proj.title}</div>
                    ${proj.description ? `<div class="item-description">${proj.description}</div>` : ''}
                    ${proj.technologies ? `<div class="item-subtitle">Technologies: ${proj.technologies}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.achievements.length > 0) {
        html += `<div class="section"><div class="section-title">Achievements</div>`;
        data.achievements.forEach(ach => {
            html += `
                <div class="achievement-item">
                    <div class="item-title">${ach.title}</div>
                    <div class="item-subtitle">${ach.issuer}${ach.date ? ` • ${ach.date}` : ''}</div>
                    ${ach.description ? `<div class="item-description">${ach.description}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.languages.length > 0) {
        html += `<div class="section"><div class="section-title">Languages</div>`;
        data.languages.forEach(lang => {
            html += `<div class="language-item"><span>${lang.name}</span><span>${lang.proficiency}</span></div>`;
        });
        html += `</div>`;
    }

    if (data.hobbies) {
        html += `
            <div class="section">
                <div class="section-title">Interests</div>
                <div class="item-description">${data.hobbies}</div>
            </div>
        `;
    }

    data.customSections.forEach(custom => {
        html += `
            <div class="section">
                <div class="section-title">${custom.title}</div>
                <div class="item-description">${custom.content}</div>
            </div>
        `;
    });

    return html;
}

function renderCreativeTemplate(data, contactInfo) {
    let html = `
        <div class="header-banner">
            ${data.profilePic ? `<img src="${data.profilePic}" class="profile-pic" alt="Profile">` : ''}
            <div class="resume-name">${data.fullName}</div>
            ${data.jobTitle ? `<div class="resume-title">${data.jobTitle}</div>` : ''}
            ${contactInfo.length > 0 ? `<div class="contact-info">${contactInfo.join(' • ')}</div>` : ''}
        </div>
        <div class="content-area">
    `;

    if (data.summary) {
        html += `
            <div class="section">
                <div class="section-title">About Me</div>
                <div class="item-description">${data.summary}</div>
            </div>
        `;
    }

    if (data.experiences.length > 0) {
        html += `<div class="section"><div class="section-title">Experience</div>`;
        data.experiences.forEach(exp => {
            const dateRange = [exp.start, exp.end].filter(x => x).join(' - ');
            html += `
                <div class="experience-item">
                    <div class="item-title">${exp.title}</div>
                    <div class="item-subtitle">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
                    ${dateRange ? `<div class="item-date">${dateRange}</div>` : ''}
                    ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.education.length > 0) {
        html += `<div class="section"><div class="section-title">Education</div>`;
        data.education.forEach(edu => {
            const dateRange = [edu.start, edu.end].filter(x => x).join(' - ');
            html += `
                <div class="education-item">
                    <div class="item-title">${edu.degree}</div>
                    <div class="item-subtitle">${edu.institution}${edu.location ? ` • ${edu.location}` : ''}</div>
                    ${dateRange ? `<div class="item-date">${dateRange}</div>` : ''}
                    ${edu.details ? `<div class="item-description">${edu.details}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.skills.length > 0) {
        html += `
            <div class="section">
                <div class="section-title">Skills</div>
                <div class="skills-list">
                    ${data.skills.map(skill => `<span class="skill-tag-resume">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    }

    if (data.projects.length > 0) {
        html += `<div class="section"><div class="section-title">Projects</div>`;
        data.projects.forEach(proj => {
            html += `
                <div class="project-item">
                    <div class="item-title">${proj.title}</div>
                    ${proj.description ? `<div class="item-description">${proj.description}</div>` : ''}
                    ${proj.technologies ? `<div class="item-subtitle">Technologies: ${proj.technologies}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.achievements.length > 0) {
        html += `<div class="section"><div class="section-title">Achievements</div>`;
        data.achievements.forEach(ach => {
            html += `
                <div class="achievement-item">
                    <div class="item-title">${ach.title}</div>
                    <div class="item-subtitle">${ach.issuer}${ach.date ? ` • ${ach.date}` : ''}</div>
                    ${ach.description ? `<div class="item-description">${ach.description}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.languages.length > 0) {
        html += `<div class="section"><div class="section-title">Languages</div>`;
        data.languages.forEach(lang => {
            html += `<div class="language-item"><span>${lang.name}</span><span>${lang.proficiency}</span></div>`;
        });
        html += `</div>`;
    }

    if (data.hobbies) {
        html += `
            <div class="section">
                <div class="section-title">Interests</div>
                <div class="item-description">${data.hobbies}</div>
            </div>
        `;
    }

    data.customSections.forEach(custom => {
        html += `
            <div class="section">
                <div class="section-title">${custom.title}</div>
                <div class="item-description">${custom.content}</div>
            </div>
        `;
    });

    html += `</div>`;
    return html;
}

function renderCorporateTemplate(data, contactInfo) {
    let html = `
        <div class="header-section">
            ${data.profilePic ? `<img src="${data.profilePic}" class="profile-pic" alt="Profile">` : ''}
            <div>
                <div class="resume-name">${data.fullName}</div>
                ${data.jobTitle ? `<div class="resume-title">${data.jobTitle}</div>` : ''}
                ${contactInfo.length > 0 ? `<div class="contact-info">${contactInfo.join(' • ')}</div>` : ''}
            </div>
        </div>
        <div class="content-area">
    `;

    if (data.summary) {
        html += `
            <div class="section">
                <div class="section-title">Professional Summary</div>
                <div class="item-description">${data.summary}</div>
            </div>
        `;
    }

    if (data.experiences.length > 0) {
        html += `<div class="section"><div class="section-title">Professional Experience</div>`;
        data.experiences.forEach(exp => {
            const dateRange = [exp.start, exp.end].filter(x => x).join(' - ');
            html += `
                <div class="experience-item">
                    <div class="item-title">${exp.title}</div>
                    <div class="item-subtitle">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
                    ${dateRange ? `<div class="item-date">${dateRange}</div>` : ''}
                    ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.education.length > 0) {
        html += `<div class="section"><div class="section-title">Education</div>`;
        data.education.forEach(edu => {
            const dateRange = [edu.start, edu.end].filter(x => x).join(' - ');
            html += `
                <div class="education-item">
                    <div class="item-title">${edu.degree}</div>
                    <div class="item-subtitle">${edu.institution}${edu.location ? ` • ${edu.location}` : ''}</div>
                    ${dateRange ? `<div class="item-date">${dateRange}</div>` : ''}
                    ${edu.details ? `<div class="item-description">${edu.details}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.skills.length > 0) {
        html += `
            <div class="section">
                <div class="section-title">Core Competencies</div>
                <div class="skills-list">
                    ${data.skills.map(skill => `<span class="skill-tag-resume">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    }

    if (data.projects.length > 0) {
        html += `<div class="section"><div class="section-title">Key Projects</div>`;
        data.projects.forEach(proj => {
            html += `
                <div class="project-item">
                    <div class="item-title">${proj.title}</div>
                    ${proj.description ? `<div class="item-description">${proj.description}</div>` : ''}
                    ${proj.technologies ? `<div class="item-subtitle">Technologies: ${proj.technologies}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.achievements.length > 0) {
        html += `<div class="section"><div class="section-title">Achievements & Recognition</div>`;
        data.achievements.forEach(ach => {
            html += `
                <div class="achievement-item">
                    <div class="item-title">${ach.title}</div>
                    <div class="item-subtitle">${ach.issuer}${ach.date ? ` • ${ach.date}` : ''}</div>
                    ${ach.description ? `<div class="item-description">${ach.description}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.languages.length > 0) {
        html += `<div class="section"><div class="section-title">Languages</div>`;
        data.languages.forEach(lang => {
            html += `<div class="language-item"><span>${lang.name}</span><span>${lang.proficiency}</span></div>`;
        });
        html += `</div>`;
    }

    if (data.hobbies) {
        html += `
            <div class="section">
                <div class="section-title">Personal Interests</div>
                <div class="item-description">${data.hobbies}</div>
            </div>
        `;
    }

    data.customSections.forEach(custom => {
        html += `
            <div class="section">
                <div class="section-title">${custom.title}</div>
                <div class="item-description">${custom.content}</div>
            </div>
        `;
    });

    html += `</div>`;
    return html;
}

function renderElegantTemplate(data, contactInfo) {
    let html = `
        <div class="resume-header">
            ${data.profilePic ? `<img src="${data.profilePic}" class="profile-pic" alt="Profile">` : ''}
            <div class="resume-name">${data.fullName}</div>
            ${data.jobTitle ? `<div class="resume-title">${data.jobTitle}</div>` : ''}
            ${contactInfo.length > 0 ? `<div class="contact-info">${contactInfo.join(' • ')}</div>` : ''}
        </div>
    `;

    if (data.summary) {
        html += `
            <div class="section">
                <div class="section-title">Profile</div>
                <div class="item-description">${data.summary}</div>
            </div>
        `;
    }

    if (data.experiences.length > 0) {
        html += `<div class="section"><div class="section-title">Experience</div>`;
        data.experiences.forEach(exp => {
            const dateRange = [exp.start, exp.end].filter(x => x).join(' - ');
            html += `
                <div class="experience-item">
                    <div class="item-title">${exp.title}</div>
                    <div class="item-subtitle">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
                    ${dateRange ? `<div class="item-date">${dateRange}</div>` : ''}
                    ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.education.length > 0) {
        html += `<div class="section"><div class="section-title">Education</div>`;
        data.education.forEach(edu => {
            const dateRange = [edu.start, edu.end].filter(x => x).join(' - ');
            html += `
                <div class="education-item">
                    <div class="item-title">${edu.degree}</div>
                    <div class="item-subtitle">${edu.institution}${edu.location ? ` • ${edu.location}` : ''}</div>
                    ${dateRange ? `<div class="item-date">${dateRange}</div>` : ''}
                    ${edu.details ? `<div class="item-description">${edu.details}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.skills.length > 0) {
        html += `
            <div class="section">
                <div class="section-title">Expertise</div>
                <div class="skills-list">
                    ${data.skills.map(skill => `<span class="skill-tag-resume">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    }

    if (data.projects.length > 0) {
        html += `<div class="section"><div class="section-title">Portfolio</div>`;
        data.projects.forEach(proj => {
            html += `
                <div class="project-item">
                    <div class="item-title">${proj.title}</div>
                    ${proj.description ? `<div class="item-description">${proj.description}</div>` : ''}
                    ${proj.technologies ? `<div class="item-subtitle">Technologies: ${proj.technologies}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.achievements.length > 0) {
        html += `<div class="section"><div class="section-title">Honors</div>`;
        data.achievements.forEach(ach => {
            html += `
                <div class="achievement-item">
                    <div class="item-title">${ach.title}</div>
                    <div class="item-subtitle">${ach.issuer}${ach.date ? ` • ${ach.date}` : ''}</div>
                    ${ach.description ? `<div class="item-description">${ach.description}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    if (data.languages.length > 0) {
        html += `<div class="section"><div class="section-title">Languages</div>`;
        data.languages.forEach(lang => {
            html += `<div class="language-item"><span>${lang.name}</span><span>${lang.proficiency}</span></div>`;
        });
        html += `</div>`;
    }

    if (data.hobbies) {
        html += `
            <div class="section">
                <div class="section-title">Interests</div>
                <div class="item-description">${data.hobbies}</div>
            </div>
        `;
    }

    data.customSections.forEach(custom => {
        html += `
            <div class="section">
                <div class="section-title">${custom.title}</div>
                <div class="item-description">${custom.content}</div>
            </div>
        `;
    });

    return html;
}

// Modal functions
function openPreview() {
    document.getElementById('previewModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    updatePreview();

    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.template === currentTemplate);
    });
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.color === currentColor);
    });
}

function closePreview() {
    document.getElementById('previewModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function changeTemplate(template) {
    currentTemplate = template;
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.template === template);
    });
    updatePreview();
    saveToLocalStorage();
}

function changeColor(color, element) {
    currentColor = color;
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.remove('active');
    });
    if (element) {
        element.classList.add('active');
    }
    updatePreview();
    saveToLocalStorage();
}

function toggleFontMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('fontMenu');
    menu.classList.toggle('active');
}

function previewFont(element) {
    const font = element.dataset.font;
    document.querySelectorAll('.font-option').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
}

function applyFont(element) {
    const font = element.dataset.font;
    currentFont = font;
    document.getElementById('fontMenu').classList.remove('active');
    updatePreview();
    saveToLocalStorage();
    showNotification('Font applied successfully!', 'success');
}

function toggleExportMenu(event) {
    event.stopPropagation();
    const menu = event.currentTarget.nextElementSibling;
    const allMenus = document.querySelectorAll('.export-menu');

    allMenus.forEach(m => {
        if (m !== menu) {
            m.classList.remove('active');
        }
    });

    menu.classList.toggle('active');
}

async function exportAsPDF() {
    try {
        const resumeElement = document.getElementById('resumePreview');
        const data = collectData();
        const fileName = data.fullName.replace(/\s/g, "_") + "_Resume.pdf";
        const clone = resumeElement.cloneNode(true);
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.style.width = "850px";
        container.appendChild(clone);
        document.body.appendChild(container);

        // Add a compressed style class
        const style = document.createElement('style');
        style.textContent = `
      .pdf-export-compressed * {
        padding: 0.2em 0.4em !important;
        margin: 0.15em 0 !important;
        line-height: 1.3 !important;
      }
      .pdf-export-compressed h1 {
        margin: 0.2em 0 0.25em 0 !important;
        padding: 0 !important;
        font-size: 1.75em !important;
      }
      .pdf-export-compressed h2 {
        margin: 0.3em 0 0.2em 0 !important;
        padding: 0 !important;
        font-size: 1.25em !important;
      }
      .pdf-export-compressed h3 {
        margin: 0.25em 0 0.15em 0 !important;
        padding: 0 !important;
      }
      .pdf-export-compressed p {
        margin: 0.15em 0 !important;
        padding: 0 !important;
      }
      .pdf-export-compressed ul, 
      .pdf-export-compressed ol {
        margin: 0.2em 0 !important;
        padding-left: 1em !important;
      }
      .pdf-export-compressed li {
        margin: 0.1em 0 !important;
      }
      .pdf-export-compressed section,
      .pdf-export-compressed .section,
      .pdf-export-compressed .resume-section {
        margin: 0.3em 0 !important;
        padding: 0.3em 0 !important;
      }
    `;
        clone.appendChild(style);
        clone.classList.add('pdf-export-compressed');

        // Wait for styles to apply
        await new Promise(resolve => setTimeout(resolve, 100));

        const contentHeight = clone.offsetHeight;
        const contentWidth = 850;
        const pdfWidth = 210;
        const pdfHeight = (contentHeight * pdfWidth) / contentWidth;

        const opt = {
            margin: [3, 3, 3, 3],
            filename: fileName,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                windowHeight: contentHeight
            },
            jsPDF: {
                unit: "mm",
                format: [pdfWidth, pdfHeight],
                orientation: "portrait",
                compress: true
            },
            pagebreak: { mode: 'avoid-all' }
        };

        await html2pdf().set(opt).from(clone).save();

        document.body.removeChild(container);
        document.querySelectorAll('.export-menu').forEach(menu => menu.classList.remove('active'));
        showNotification("PDF exported successfully!", "success");
    } catch (error) {
        console.error("Error exporting PDF", error);
        showNotification("Error exporting PDF. Please try again.", "error");
    }
}


async function exportAsDOCX() {
    try {
        const resumeElement = document.getElementById('resumePreview');
        const data = collectData();
        const fileName = data.fullName.replace(/\s/g, "_") + "_Resume.docx";
        // Compose HTML for DOCX
        const htmlContent = "<!DOCTYPE html><html><head>...</head><body>" + resumeElement.outerHTML + "</body></html>";
        const converted = await htmlDocx.asBlob(htmlContent); // async conversion
        const url = URL.createObjectURL(converted);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        document.querySelectorAll('.export-menu').forEach(menu => menu.classList.remove('active'));
        showNotification("DOCX exported successfully!", "success");
    } catch (error) {
        console.error("Error exporting DOCX", error);
        showNotification("Error exporting DOCX. Please try again.", "error");
    }
}

function clearData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        localStorage.clear();
        location.reload();
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.export-dropdown')) {
        document.querySelectorAll('.export-menu').forEach(menu => {
            menu.classList.remove('active');
        });
    }
    if (!e.target.closest('.font-selector-wrapper')) {
        document.getElementById('fontMenu')?.classList.remove('active');
    }
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePreview();
    }
});

// Close modal on outside click
document.getElementById('previewModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'previewModal') {
        closePreview();
    }
});

// Add this function after toggleCollapse
function updateItemHeader(itemId) {
    const item = document.getElementById(itemId);
    if (!item) return;

    const headerText = item.querySelector('.item-number');
    if (!headerText) return;

    if (itemId.startsWith('experience-')) {
        const title = item.querySelector('.exp-title')?.value || '';
        const company = item.querySelector('.exp-company')?.value || '';
        if (title && company) {
            headerText.textContent = `${title} at ${company}`;
        } else if (title) {
            headerText.textContent = title;
        } else if (company) {
            headerText.textContent = company;
        } else {
            const num = itemId.split('-')[1];
            headerText.textContent = `Experience ${num}`;
        }
    } else if (itemId.startsWith('education-')) {
        const degree = item.querySelector('.edu-degree')?.value || '';
        const institution = item.querySelector('.edu-institution')?.value || '';
        if (degree && institution) {
            headerText.textContent = `${degree} - ${institution}`;
        } else if (degree) {
            headerText.textContent = degree;
        } else if (institution) {
            headerText.textContent = institution;
        } else {
            const num = itemId.split('-')[1];
            headerText.textContent = `Education ${num}`;
        }
    } else if (itemId.startsWith('project-')) {
        const title = item.querySelector('.proj-title')?.value || '';
        if (title) {
            headerText.textContent = title;
        } else {
            const num = itemId.split('-')[1];
            headerText.textContent = `Project ${num}`;
        }
    } else if (itemId.startsWith('achievement-')) {
        const title = item.querySelector('.ach-title')?.value || '';
        if (title) {
            headerText.textContent = title;
        } else {
            const num = itemId.split('-')[1];
            headerText.textContent = `Achievement ${num}`;
        }
    } else if (itemId.startsWith('language-')) {
        const name = item.querySelector('.lang-name')?.value || '';
        const proficiency = item.querySelector('.lang-proficiency')?.value || '';
        if (name && proficiency) {
            headerText.textContent = `${name} (${proficiency})`;
        } else if (name) {
            headerText.textContent = name;
        } else {
            const num = itemId.split('-')[1];
            headerText.textContent = `Language ${num}`;
        }
    } else if (itemId.startsWith('custom-')) {
        const title = item.querySelector('.custom-title')?.value || '';
        if (title) {
            headerText.textContent = title;
        } else {
            const num = itemId.split('-')[1];
            headerText.textContent = `Custom Section ${num}`;
        }
    }
}
// Add this function after window.addEventListener('DOMContentLoaded', ...)
function scaleSidebarPreview() {
    const thumbnail = document.querySelector('.preview-thumbnail');
    const content = document.querySelector('.preview-content');

    if (!thumbnail || !content) return;

    const thumbnailWidth = thumbnail.offsetWidth;
    const contentWidth = 850; // Fixed resume width
    const scale = thumbnailWidth / contentWidth;

    content.style.transform = `scale(${scale})`;

    // Adjust height to maintain aspect ratio
    const scaledHeight = 1100 * scale;
    thumbnail.style.height = `${scaledHeight}px`;
}

// Call on load and resize
window.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updatePreview();
    scaleSidebarPreview();
});

window.addEventListener('resize', scaleSidebarPreview);

// Update the updatePreview function to include scaling
function updatePreview() {
    const data = collectData();
    renderResume(document.getElementById('resumePreview'), currentTemplate, data, currentFont);
    renderResume(document.getElementById('sidebarPreview'), currentTemplate, data, currentFont);

    // Scale sidebar preview after render
    setTimeout(scaleSidebarPreview, 100);
}
