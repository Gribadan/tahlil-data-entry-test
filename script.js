function validateForm() {
    const form = document.getElementById('dynamic-form');
    let isValid = true;

    formConfig.forEach((question, index) => {
        const input = form.querySelector(`#q${index + 1}`);
        if (question.type === 'number') {
            const value = parseInt(input.value, 10);
            if ((question.min !== null && value < question.min) || (question.max !== null && value > question.max)) {
                isValid = false;
                alert(`${question.label} must be between ${question.min} and ${question.max}`);
            }
        }
    });

    return isValid;
}

function submitForm(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const form = document.getElementById('dynamic-form');
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
