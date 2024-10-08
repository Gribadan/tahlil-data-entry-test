let questionCount = 0;
const urlParams = new URLSearchParams(window.location.search);
const formName = urlParams.get('formName');
const googleScriptURL = 'https://script.google.com/macros/s/AKfycbwv5PwhnWg7G8zDQaV5ONl7SdpPN5r7gkpxfJ0sYbn_AHmkjLwNkwqg9yqoVQA4w20K7Q/exec';

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('form-name').textContent = formName;
    loadFormConfig();
});

function addQuestion(label = '', type = 'text', validation = '', conditionalJump = '') {
    questionCount++;
    const container = document.getElementById('questions-container');
    
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    questionDiv.setAttribute('id', `question-${questionCount}`);

    questionDiv.innerHTML = `
        <div class="question-row">
            <div class="arrows">
                <button type="button" class="arrow-btn" onclick="moveQuestion(${questionCount}, -1)">&#9650;</button>
                <button type="button" class="arrow-btn" onclick="moveQuestion(${questionCount}, 1)">&#9660;</button>
            </div>
            <label>Label:</label>
            <input type="text" class="question-label" value="${label}" required>
            <label>Type:</label>
            <select class="question-type" onchange="toggleValidationOptions(${questionCount})" style="width: 70px;">
                <option value="text" ${type === 'text' ? 'selected' : ''}>Text</option>
                <option value="number" ${type === 'number' ? 'selected' : ''}>Number</option>
                <option value="id" ${type === 'id' ? 'selected' : ''}>ID</option>
            </select>
            <div class="validation-options" style="display: ${type === 'number' ? 'block' : 'none'};">
                <label>Validation (e.g., 1-5,10,15-20):</label>
                <input type="text" class="question-validation" value="${validation}">
            </div>
            <div class="conditional-jump">
                <label>Conditional Jump (e.g., 5:B7):</label>
                <input type="text" class="conditional-jump-value" value="${conditionalJump}">
            </div>
            <button type="button" class="action-btn" onclick="deleteQuestion(${questionCount})">Delete</button>
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
        const tempConditionalJump = questionDiv.querySelector('.conditional-jump-value').value;
        
        questionDiv.querySelector('.question-label').value = sibling.querySelector('.question-label').value;
        questionDiv.querySelector('.question-type').value = sibling.querySelector('.question-type').value;
        questionDiv.querySelector('.question-validation').value = sibling.querySelector('.question-validation').value;
        questionDiv.querySelector('.conditional-jump-value').value = sibling.querySelector('.conditional-jump-value').value;
        
        sibling.querySelector('.question-label').value = tempLabel;
        sibling.querySelector('.question-type').value = tempType;
        sibling.querySelector('.question-validation').value = tempValidation;
        sibling.querySelector('.conditional-jump-value').value = tempConditionalJump;
        
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
        const conditionalJumpInput = question.querySelector('.conditional-jump-value');
        const conditionalJump = conditionalJumpInput ? conditionalJumpInput.value : '';

        const questionConfig = { label, type, validation, conditionalJump };
        formConfig.push(questionConfig);
    });

    fetch(googleScriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `formName=${formName}&formConfig=${JSON.stringify(formConfig)}`,
    })
    .then(response => response.text())
    .then(result => {
        console.log(result);
        const successMessage = document.getElementById('success-message');
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    });
}

function loadFormConfig() {
    fetch(`${googleScriptURL}?action=loadFormConfig&formName=${formName}`)
        .then(response => response.json())
        .then(config => {
            config.forEach((question) => {
                addQuestion(question.label, question.type, question.validation, question.conditionalJump);
            });
        });
}
