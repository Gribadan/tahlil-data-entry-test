const googleScriptURL = 'https://script.google.com/macros/s/AKfycbwv5PwhnWg7G8zDQaV5ONl7SdpPN5r7gkpxfJ0sYbn_AHmkjLwNkwqg9yqoVQA4w20K7Q/exec';

// Function to get list of forms from Google Sheets
async function getFormList() {
  const response = await fetch(googleScriptURL, {
    method: 'POST',
    body: new URLSearchParams({
      action: 'list'
    })
  });
  return response.json();
}

// Function to create a new form
async function createForm(formName) {
  const response = await fetch(googleScriptURL, {
    method: 'POST',
    body: new URLSearchParams({
      action: 'save',
      formName: formName,
      formConfig: '[]'
    })
  });
  return response.json();
}

// Load form list on page load
document.addEventListener('DOMContentLoaded', async () => {
  const formList = await getFormList();
  const formContainer = document.getElementById('form-list');
  formList.forEach(formName => {
    const div = document.createElement('div');
    div.classList.add('form-item');
    div.innerHTML = `<a href="form-builder.html?formName=${encodeURIComponent(formName)}">${formName}</a>`;
    formContainer.appendChild(div);
  });
});

// Handle create form
document.getElementById('create-form').addEventListener('click', async () => {
  const formName = prompt('Enter new form name:');
  if (formName) {
    await createForm(formName);
    location.reload();
  }
});
