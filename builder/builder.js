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
            <label>Question ${questionCount} Label:</label>
            <input type="text" class="question-label" value="${label}" required>
            <label>Type:</label>
            <select class="question-type" onchange="toggleValidationOptions(${questionCount})">
                <option value="text" ${type === 'text' ? 'selected' : ''}>Text</option>
                <option value="number" ${type === 'number' ? 'selected' : ''}>Number</option>
                <option value="id" ${type === 'id' ? 'selected' : ''}>ID</option>
            </select>
            <div class="validation-options" style="display: ${type === 'number' ? 'block' : 'none'};">
                <label>Validation (e.g., 1-5,10,15-20):</label>
                <input type="text" class="question-validation" value="${validation}">
            </div>
            <button type="button" class="action-btn" onclick="deleteQuestion(${questionCount})">Delete</button>
            <button type="button" class="action-btn" onclick="moveQuestion(${questionCount}, -1)">Up</button>
            <button type="button" class="action-btn" onclick="moveQuestion(${questionCount}, 1)">Down</button>
        </div>
    `;

    container.appendChild(questionDiv);
}

function toggleValidationOptions(questionId) {
    const typeSelect = document.querySelector(`#question-${questionId} .question-type`);
    const validationOptions = document.querySelector(`#question-${questionId} .validation-options`);
    
    if (typeSelect.value === 'number') {
        validationOptions.style.display = 'block';
    } else {
        validationOptions.style.display = 'none';
    }
}

function deleteQuestion(questionId) {
    const questionDiv = document.getElementById(`question-${questionId}`);
    questionDiv.remove();
}

function moveQuestion(questionId, direction) {
    const container = document.getElementById('questions-container');
    const questionDiv = document.getElementById(`question-${questionId}`);
    const sibling = direction === -1 ? questionDiv.previousElementSibling : questionDiv.nextElementSibling;
    
    if (sibling && sibling.classList.contains('question')) {
        const tempLabel = questionDiv.querySelector('.question-label').value;
        const tempType = questionDiv.querySelector('.question-type').value;
        const tempValidation = questionDiv.querySelector('.question-validation').value;
        
        questionDiv.querySelector('.question-label').value = sibling.querySelector('.question-label').value;
        questionDiv.querySelector('.question-type').value = sibling.querySelector('.question-type').value;
        questionDiv.querySelector('.question-validation').value = sibling.querySelector('.question-validation').value;
        
        sibling.querySelector('.question-label').value = tempLabel;
        sibling.querySelector('.question-type').value = tempType;
        sibling.querySelector('.question-validation').value = tempValidation;
        
        toggleValidationOptions(questionId);
        toggleValidationOptions(parseInt(sibling.id.split('-')[1]));
    }
}

function updateForm() {
    saveFormConfig();
    const successMessage = document.getElementById('success-message');
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

function saveFormConfig() {
    const formConfig = [];
    const questions = document.querySelectorAll('.question');

    questions.forEach((question) => {
        const label = question.querySelector('.question-label').value;
        const type = question.querySelector('.question-type').value;
        const validationInput = question.querySelector('.question-validation');
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
