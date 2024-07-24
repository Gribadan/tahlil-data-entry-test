const formConfig = JSON.parse(localStorage.getItem('formConfig')) || [];

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
                if (event.key === 'Enter') {
                    const error = validateNumberInput(event.target.value, question.validation);
                    if (error) {
                        event.target.setCustomValidity(error);
                        event.target.reportValidity();
                    } else {
                        event.target.setCustomValidity('');
                        moveToNextInput(event);
                    }
                } else if (event.key === 'Tab') {
                    event.preventDefault();
                }
            });
        } else if (question.type === 'id') {
            input.setAttribute('type', 'text');
            input.addEventListener('keydown', handleKeyDown);
        } else {
            input.setAttribute('type', 'text');
            input.addEventListener('keydown', handleKeyDown);
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

function handleKeyDown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        moveToNextInput(event);
    } else if (event.key === 'Tab') {
        event.preventDefault();
    }
}

function moveToNextInput(event) {
    const form = document.getElementById('dynamic-form');
    const inputs = Array.from(form.querySelectorAll('input'));
    const currentIndex = inputs.indexOf(event.target);
    if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    generateDynamicForm();
});
