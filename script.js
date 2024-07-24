function validateForm() {
    const q4 = document.getElementById('q4').value;
    const q5 = document.getElementById('q5').value;

    if (q4 < 1 || q4 > 5) {
        alert('Q4 must be between 1 and 5');
        return false;
    }

    if (q5 < 1 || q5 > 11) {
        alert('Q5 must be between 1 and 11');
        return false;
    }

    return true;
}

function submitForm(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
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
