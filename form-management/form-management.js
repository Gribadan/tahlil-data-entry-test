const googleScriptURL = 'https://script.google.com/macros/s/AKfycbwv5PwhnWg7G8zDQaV5ONl7SdpPN5r7gkpxfJ0sYbn_AHmkjLwNkwqg9yqoVQA4w20K7Q/exec';

document.addEventListener('DOMContentLoaded', (event) => {
    loadForms();
});

function loadForms() {
    fetch(`${googleScriptURL}?action=getForms`)
        .then(response => response.json())
        .then(forms => {
            if (Array.isArray(forms)) {
                const formList = document.getElementById('form-list');
                formList.innerHTML = ''; // Clear existing list
                forms.forEach(form => {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = `builder.html?formName=${encodeURIComponent(form)}`;
                    link.textContent = form;
                    listItem.appendChild(link);
                    formList.appendChild(listItem);
                });
            } else {
                console.error('Expected an array but got:', forms);
            }
        })
        .catch(error => {
            console.error('Error loading forms:', error);
        });
}

function createForm() {
    const newFormName = document.getElementById('new-form-name').value.trim();
    if (newFormName) {
        fetch(googleScriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=createForm&formName=${newFormName}`,
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            loadForms();
        })
        .catch(error => {
            console.error('Error creating form:', error);
        });
    } else {
        alert('Please enter a form name.');
    }
}
