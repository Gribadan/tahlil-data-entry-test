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
            if (question.min !== null) {
                input.setAttribute('min', question.min);
            }
            if (question.max !== null) {
                input.setAttribute('max', question.max);
            }
        } else {
            input.setAttribute('type', 'text');
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

document.addEventListener('DOMContentLoaded', (event) => {
    generateDynamicForm();
});
