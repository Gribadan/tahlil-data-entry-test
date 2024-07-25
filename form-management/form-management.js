const SHEET_ID = '1wHX7cDuQcHsqQo8cLz5F8TrHoOabfBwBgcT0ka_fWfk';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwv5PwhnWg7G8zDQaV5ONl7SdpPN5r7gkpxfJ0sYbn_AHmkjLwNkwqg9yqoVQA4w20K7Q/exec';

document.addEventListener('DOMContentLoaded', (event) => {
    fetchForms();
});

function createForm() {
    const formName = document.getElementById('new-form-name').value;
    if (formName.trim() === '') {
        alert('Please enter a form name.');
        return;
    }

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            action: 'createForm',
            formName: formName
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchForms();
        } else {
            alert('Error creating form.');
        }
    })
    .catch(error => {
        console.error('Error creating form:', error);
    });
}

function fetchForms() {
    fetch(`${SCRIPT_URL}?action=fetchForms`)
        .then(response => response.json())
        .then(data => {
            if (!data.forms) {
                console.error('Error: No forms data found');
                console.log('Response data:', data);
                return;
            }

            const formsContainer = document.getElementById('existing-forms');
            formsContainer.innerHTML = '';

            data.forms.forEach(form => {
                const formDiv = document.createElement('div');
                formDiv.classList.add('form-item');
                formDiv.innerHTML = `
                    <span>${form.name}</span>
                    <button onclick="editForm('${form.name}')">Edit</button>
                `;
                formsContainer.appendChild(formDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching forms:', error);
        });
}

function editForm(formName) {
    localStorage.setItem('currentForm', formName);
    window.location.href = 'builder.html';
}
