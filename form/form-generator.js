const urlParams = new URLSearchParams(window.location.search);
const formName = urlParams.get('formName');
const googleScriptURL = 'https://script.google.com/macros/s/AKfycbwv5PwhnWg7G8zDQaV5ONl7SdpPN5r7gkpxfJ0sYbn_AHmkjLwNkwqg9yqoVQA4w20K7Q/exec';
let formConfig = [];

function generateDynamicForm() {
    const form = document.getElementById('dynamic-form');
    formConfig.forEach((question, index) => {
        const div = document.createElement('div');
        div.classList.add('form-row');

        const label = document.createElement('label');
        label.setAttribute('for', `q${index + 1}`);
        label.textContent = question.label;

        const input = document.createElement('input');
        input.setAttribute('id', `q${index + 1}`);
        input.setAttribute('name', `q${index + 1}`);
        input.setAttribute('required', true);

        if (question.type === 'number') {
            input.setAttribute('type', 'number');
            input.setAttribute('data-validation', question.validation);

            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === 'Tab') {
                    event.preventDefault();
                    const error = validateNumberInput(event.target.value, question.validation);
                    if (error) {
                        event.target.setCustomValidity(error);
                        event.target.reportValidity();
                    } else {
                        event.target.setCustomValidity('');
                        handleConditionalJump(event, question.conditionalJump);
                    }
                }
            });
        } else {
            input.setAttribute('type', question.type === 'id' ? 'text' : question.type);
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === 'Tab') {
                    event.preventDefault();
                    handleConditionalJump(event, question.conditionalJump);
                }
            });
        }

        div.appendChild(label);
        div.appendChild(input);
        form.appendChild(div);
    });

    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Submit';
    form.appendChild(submitButton);
}

function validateNumberInput(value, validation) {
    if (!validation) return '';
    const rules = validation.split(',').map(rule => rule.trim());

    const errors = rules.map(rule => {
        if (rule.includes('-')) {
            const [min, max] = rule.split('-').map(Number);
            if (value >= min && value <= max) {
                return null;
            }
            return `Value must be between ${min} and ${max}`;
        } else {
            const exactValue = Number(rule);
            if (value == exactValue) {
                return null;
            }
            return `Value must be ${exactValue}`;
        }
    }).filter(error => error !== null);

    return errors.length === rules.length ? errors.join(' or ') : '';
}

function handleConditionalJump(event, conditionalJump) {
    const form = document.getElementById('dynamic-form');
    const inputs = Array.from(form.querySelectorAll('input'));
    const currentIndex = inputs.indexOf(event.target);

    // Re-enable all inputs before checking conditions
    inputs.forEach(input => input.disabled = false);

    if (conditionalJump) {
        const conditions = conditionalJump.split(',').map(cond => cond.trim());
        for (const condition of conditions) {
            const [value, targetLabel] = condition.split(':');
            if (event.target.value == value) {
                const targetIndex = formConfig.findIndex(q => q.label === targetLabel);
                if (targetIndex !== -1) {
                    const targetInput = inputs[targetIndex];
                    if (targetInput) {
                        // Disable all fields in between
                        for (let i = currentIndex + 1; i < targetIndex; i++) {
                            inputs[i].disabled = true;
                        }
                        targetInput.focus();
                        return;
                    }
                }
            }
        }
    }

    if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
    }
}

function loadFormConfig(formName) {
    fetch(`${googleScriptURL}?action=loadFormConfig&formName=${formName}`)
        .then(response => response.json())
        .then(config => {
            formConfig = config;
            generateDynamicForm();
        });
}

document.addEventListener('DOMContentLoaded', (event) => {
    if (formName) {
        loadFormConfig(formName);
    }
});
