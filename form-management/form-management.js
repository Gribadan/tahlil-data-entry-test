const SHEET_ID = '1wHX7cDuQcHsqQo8cLz5F8TrHoOabfBwBgcT0ka_fWfk';
const API_URL = 'https://script.google.com/macros/s/AKfycbwv5PwhnWg7G8zDQaV5ONl7SdpPN5r7gkpxfJ0sYbn_AHmkjLwNkwqg9yqoVQA4w20K7Q/exec';

document.addEventListener('DOMContentLoaded', (event) => {
    fetchForms();
});

function fetchForms() {
    fetch(`${API_URL}?action=fetchForms`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const forms = data.forms || []; // Ensure forms is an array
            const formList = document.getElementById('form-list');
            formList.innerHTML = '';

            forms.forEach(form => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = `builder.html?form=${form.name}`;
                link.textContent = form.name;
                li.appendChild(link);
                formList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching forms:', error);
        });
}

function createForm() {
    const formName = document.getElementById('new-form-name').value.trim();
    if (!formName) {
        alert('Form name cannot be empty.');
        return;
    }

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'createForm', formName: formName }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchForms();
            } else {
                alert('Error creating form: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error creating form:', error);
        });
}
