function validateForm() {
    const form = document.getElementById('dynamic-form');
    let isValid = true;

    formConfig.forEach((question, index) => {
        const input = form.querySelector(`#q${index + 1}`);
        if (question.type === 'number') {
            const value = parseInt(input.value, 10);
            const validation = input.getAttribute('data-validation');
            const error = validateNumberInput(value, validation);
            if (error) {
                isValid = false;
                input.setCustomValidity(error);
            } else {
                input.setCustomValidity('');
            }
        }
    });

    return isValid;
}

function submitForm(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        alert("Please correct the errors before submitting.");
        return;
    }

    const confirmation = confirm("Are you sure you want to submit the form?");
    if (!confirmation) {
        return;
    }
    
    const form = document.getElementById('dynamic-form');
    const formData = new FormData(form);

    fetch('https://script.google.com/macros/s/AKfycbwjUFh7hqMKkuwoqf1f8gIrRDNODfFb_vvGfKrG9A73ciOZyT6T0KAkHL_IoZtERC3T/exec', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            document.getElementById('success-message').style.display = 'block';
            form.reset();
        } else {
            alert('Form submission failed.');
        }
    }).catch(error => {
        console.error('Error submitting form:', error);
    });
}
