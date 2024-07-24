let questionCount = 0;

document.addEventListener('DOMContentLoaded', (event) => {
    loadFormConfig();
});

function addQuestion(label = '', type = 'text', min = '', max = '') {
    questionCount++;
    const container = document.getElementById('questions-container');
    
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');

    questionDiv.innerHTML = `
        <label for="q${questionCount}-label">Question ${questionCount} Label:</label>
        <input type="text" id="q${questionCount}-label" name="q${questionCount}-label" value="${label}" required>
        <label for="q${questionCount}-type">Type:</label>
        <select id="q${questionCount}-type" name="q${questionCount}-type" onchange="toggleValidationOptions(${questionCount})">
            <option value="text" ${type === 'text' ? 'selected' : ''}>Text</option>
            <option value="number" ${type === 'number' ? 'selected' : ''}>Number</option>
        </select>
        <div id="q${questionCount}-validation" class="validation-options" style="display: ${type === 'number' ? 'block' : 'none'};">
            <label for="q${questionCount}-min">Min:</label>
            <input type="number" id="q${questionCount}-min" name="q${questionCount}-min" value="${min}">
            <label for="q${questionCount}-max">Max:</label>
            <input type="number" id="q${questionCount}-max" name="q${questionCount}-max" value="${max}">
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

function generateForm() {
    const formConfig = [];
    const questions = document.querySelectorAll('.question');

    questions.forEach((question, index) => {
        const label = question.querySelector(`#q${index + 1}-label`).value;
        const type = question.querySelector(`#q${index + 1}-type`).value;
        const min = question.querySelector(`#q${index + 1}-min`).value;
        const max = question.querySelector(`#q${index + 1}-max`).value;

        const questionConfig = { label, type };
        
        if (type === 'number') {
            questionConfig.min = min ? parseInt(min, 10) : null;
            questionConfig.max = max ? parseInt(max, 10) : null;
        }

        formConfig.push(questionConfig);
    });

    const formOutput = document.getElementById('form-output');
    formOutput.value = JSON.stringify(formConfig, null, 2);
    
    localStorage.setItem('formConfig', formOutput.value);
}

function loadFormConfig() {
    const savedConfig = localStorage.getItem('formConfig');
    if (savedConfig) {
        const formConfig = JSON.parse(savedConfig);
        formConfig.forEach((question) => {
            addQuestion(question.label, question.type, question.min, question.max);
        });
    }
}
