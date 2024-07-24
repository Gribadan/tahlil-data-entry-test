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
                        handleConditionalJump(event, question.conditionalJump);
                    }
                } else if (event.key === 'Tab') {
                    event.preventDefault();
                }
            });
        } else {
            input.setAttribute('type', question.type === 'id' ? 'text' : question.type);
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    handleConditionalJump(event, question.conditionalJump);
                } else if (event.key === 'Tab') {
                    event.preventDefault();
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
    console.log(`handleConditionalJump called with value: ${event.target.value} and conditionalJump: ${conditionalJump}`);

    const form = document.getElementById('dynamic-form');
    const inputs = Array.from(form.querySelectorAll('input'));
    const currentIndex = inputs.indexOf(event.target);

    if (conditionalJump) {
        const [value, targetLabel] = conditionalJump.split(':');
        console.log(`Evaluating conditional jump: If value is ${value}, jump to ${targetLabel}`);

        if (event.target.value == value) {
            const targetIndex = formConfig.findIndex(q => q.label === targetLabel);
            if (targetIndex !== -1) {
                const targetInput = inputs[targetIndex];
                console.log(`Jumping to target question with label: ${targetLabel} at index: ${targetIndex}`);
                if (targetInput) {
                    targetInput.focus();
                    return;
                }
            } else {
                console.log(`Target label: ${targetLabel} not found in formConfig`);
            }
        }
    }

    console.log('Moving to the next input field in sequence');
    if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    generateDynamicForm();
});
