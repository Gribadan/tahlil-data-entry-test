let questionCount = 0;

document.addEventListener('DOMContentLoaded', (event) => {
    loadFormConfig();
});

function addQuestion(label = '', type = 'text', validation = '') {
    questionCount++;
    const container = document.getElementById('questions-container');
    
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    questionDiv.setAttribute('id', `question-${questionCount}`);

    questionDiv.innerHTML = `
        <div class="question-row">
            <label for="q${questionCount}-label">Question ${questionCount} Label:</label>
            <input type="text" id="q${questionCount}-label" name="q${questionCount}-label" value="${label}" required>
            <label for="q${questionCount}-type">Type:</label>
            <select id="q${questionCount}-type" name="q${questionCount}-type" onchange="toggleValidationOptions(${questionCount})">
                <option value="text" ${type === 'text' ? 'selected' : ''}>Text</option>
                <option value="number" ${type === 'number' ? 'selected' : ''}>Number</option>
                <option value="id" ${type === 'id' ? 'selected' : ''}>ID</option>
            </select>
            <div id="q${questionCount}-validation" class="validation-options" style="display: ${type === 'number' ? 'block' : 'none'};">
                <label for="q${questionCount}-validation-input">Validation (e.g., 1-5,10,15-20):</label>
                <input type="text" id="q${questionCount}-validation-input" name="q${questionCount}-validation" value="${validation}">
            </div>
            <button type="button" class="action-btn" onclick="deleteQuestion(${questionCount})">Delete</button>
            <button type="button" class="action-btn" onclick="moveQuestion(${questionCount}, -1)">Up</button>
            <button type="button" class="action-btn" onclick="moveQuestion(${questionCount}, 1)">Down</button>
        </div>
    `;

    container.appendChild(questionDiv);
}

function toggleValidationOptions(questionId) {
    const typeSelect = document.getElementById(`q${questionId}-type`);
    const validationOptions = document.getElementById(`q${questionId}-validation`);
    
    if (typeSelect.value === 'number') {
        validationOptions.style.display = 'block';
    } else {
        validationOptions.style.display = 'none';
    }
}

function deleteQuestion(questionId) {
    const questionDiv = document.getElementById(`question-${questionId}`);
    questionDiv.remove();
    saveFormConfig();
}

function moveQuestion(questionId, direction) {
    const container = document.getElementById('questions-container');
    const questionDiv = document.getElementById(`question-${questionId}`);
    const sibling = direction === -1 ? questionDiv.previousElementSibling : questionDiv.nextElementSibling;
    
    if (sibling && sibling.classList.contains('question')) {
        container.insertBefore(questionDiv, direction === -1 ? sibling : sibling.nextElementSibling);
    }
    saveFormConfig();
}

function updateForm() {
    saveFormConfig();
}

function saveFormConfig() {
    const formConfig = [];
    const questions = document.querySelectorAll('.question');

    questions.forEach((question, index) => {
        const label = question.querySelector(`[name^="q"][name$="-label"]`).value;
        const type = question.querySelector(`[name^="q"][name$="-type"]`).value;
        const validationInput = question.querySelector(`[name^="q"][name$="-validation"]`);
        const validation = validationInput ? validationInput.value : '';

        const questionConfig = { label, type, validation };
        formConfig.push(questionConfig);
    });

    localStorage.setItem('formConfig', JSON.stringify(formConfig));
}

function loadFormConfig() {
    const savedConfig = localStorage.getItem('formConfig');
    if (savedConfig) {
        const formConfig = JSON.parse(savedConfig);
        formConfig.forEach((question) => {
            addQuestion(question.label, question.type, question.validation);
        });
    }
}
