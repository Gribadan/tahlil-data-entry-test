function submitForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('custom-form');
    const formData = new FormData(form);

    fetch('https://script.google.com/macros/s/AKfycbwjUFh7hqMKkuwoqf1f8gIrRDNODfFb_vvGfKrG9A73ciOZyT6T0KAkHL_IoZtERC3T/exec', {
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
