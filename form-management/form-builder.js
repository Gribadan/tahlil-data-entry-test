const urlParams = new URLSearchParams(window.location.search);
const formName = urlParams.get('formName');
const googleScriptURL = 'https://script.google.com/macros/s/AKfycbwv5PwhnWg7G8zDQaV5ONl7SdpPN5r7gkpxfJ0sYbn_AHmkjLwNkwqg9yqoVQA4w20K7Q/exec';

if (!formName) {
  alert('No form name specified.');
  window.location.href = 'form-management.html';
}

// Function to save form configuration to Google Sheets
async function saveFormConfig() {
  const formConfig = getFormConfigFromBuilder();
  const response = await fetch(googleScriptURL, {
    method: 'POST',
    body: new URLSearchParams({
      action: 'save',
      formName: formName,
      formConfig: JSON.stringify(formConfig)
    })
  });
  return response.json();
}

// Function to get form configuration from Google Sheets
async function loadFormConfig() {
  const response = await fetch(googleScriptURL, {
    method: 'POST',
    body: new URLSearchParams({
      action: 'get',
      formName: formName
    })
  });
  const formConfig = await response.json();
  updateFormBuilder(JSON.parse(formConfig));
}

// Load form configuration on page load
document.addEventListener('DOMContentLoaded', async () => {
  await loadFormConfig();
});
