const googleScriptURL = 'https://script.google.com/macros/s/AKfycbwv5PwhnWg7G8zDQaV5ONl7SdpPN5r7gkpxfJ0sYbn_AHmkjLwNkwqg9yqoVQA4w20K7Q/exec';

document.addEventListener('DOMContentLoaded', () => {
    loadForms();
});

function loadForms() {
    fetch(`${googleScriptURL}?action=getForms`)
        .then(response => response.json())
        .then(forms => {
            const formList = document.getElementById('form-list');
            formList.innerHTML = '';
            forms.forEach(form => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = `../builder/builder.html?formName=${form}`;
                link.textContent = form;
                listItem.appendChild(link);
                formList.appendChild(listItem);
            });
        });
}

function createForm() {
    const formName = document.getElementById('new-form-name').value;
    if (!formName) {
        alert('Please enter a form name');
        return;
    }

    fetch(`${googleScriptURL}?action=createSheet&formName=${formName}`)
        .then(response => response.text())
        .then(result => {
            alert(result);
            loadForms();
        });
}
