const formConfig = JSON.parse(localStorage.getItem('formConfig')) || [];

function generateDynamicForm() {
    const form = document.getElementById('dynamic-form');
    const blocks = {};

    // Group questions by block
    formConfig.forEach((question, index) => {
        if (!blocks[question.block]) {
            blocks[question.block] = [];
        }
        blocks[question.block].push(question);
    });

    // Create form sections for each block
    Object.keys(blocks).forEach((block) => {
        const blockDiv = document.createElement('div');
        blockDiv.classList.add('form-block');

        const blockTitle = document.createElement('h2');
        blockTitle.textContent = `Block ${block}`;
        blockDiv.appendChild(blockTitle);

        blocks[block].forEach((question, index) => {
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

                input.addEventListener('input', (event) => {
                    const error = validateNumberInput(event.target.value, question.validation);
                    if (error) {
                        event.target.setCustomValidity(error);
                    } else {
                        event.target.setCustomValidity('');
                    }
                });
            } else if (question.type === 'id') {
                input.setAttribute('type', 'text');
            } else {
                input.setAttribute('type', 'text');
            }

            div.appendChild(label);
            div.appendChild(input);
            blockDiv.appendChild(div);
        });

        form.appendChild(blockDiv);
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

document.addEventListener('DOMContentLoaded', (event) => {
    generateDynamicForm();
});
