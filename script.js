function submitForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('custom-form');
    const formData = new FormData(form);

    fetch('https://script.google.com/macros/s/1363jWrUT3rEWiCnQXn6bGDGyBs5koSv5b8AQbrksqK8/exec', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            alert('Form submitted successfully!');
            form.reset();
        } else {
            alert('Form submission failed.');
        }
    }).catch(error => {
        console.error('Error submitting form:', error);
    });
}
