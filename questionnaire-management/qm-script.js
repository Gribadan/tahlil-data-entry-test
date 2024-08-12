document.getElementById('createQuestionnaire').addEventListener('click', function() {
    const questionnaireName = document.getElementById('questionnaireName').value.trim();
    
    if (questionnaireName) {
        // Here, you would add the functionality to create a Google Sheets document using Google Sheets API.
        // For now, we'll simulate it by adding the name to the list of created questionnaires.

        const listItem = document.createElement('li');
        listItem.textContent = questionnaireName;
        document.getElementById('questionnaireList').appendChild(listItem);
        
        // Clear the input field
        document.getElementById('questionnaireName').value = '';
    } else {
        alert('Please enter a name for the questionnaire.');
    }
});
