window.onload = function() {
    fetchRecipes();

    document.getElementById('addRecipeForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addRecipe();
    });
};

function fetchRecipes() {
    fetch("http://localhost:3000/api/recipes")
    .then(response => response.json())
    .then(recipes => {
        const table = document.getElementById('recipesTable').getElementsByTagName('tbody')[0];
        table.innerHTML = ''; // Rensa tidigare rader
        recipes.forEach(recipe => {
            let row = table.insertRow();
            row.insertCell(0).textContent = recipe.title;
            row.insertCell(1).textContent = recipe.ingredients.join(', ');
            row.insertCell(2).textContent = recipe.instructions.join(' | ');
            row.insertCell(3).textContent = recipe.cookingTime;

            // Lägg till uppdatera och radera knappar
            let actionsCell = row.insertCell(4);
            let updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.setAttribute('data-id', recipe._id); // Sätt ID som attribut
            updateButton.onclick = function() {
                updateRecipe(recipe._id); // 
            };
            actionsCell.appendChild(updateButton);

            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.setAttribute('data-id', recipe._id); // Sätt ID som attribut
            deleteButton.onclick = function() {
                deleteRecipe(recipe._id);
            };
            actionsCell.appendChild(deleteButton);
        });
    })
    .catch(error => {
        console.error("Error fetching recipes:", error);
    });
}

function addRecipe() {
    const formData = {
        title: document.getElementById('title').value,
        ingredients: document.getElementById('ingredients').value.split(','),
        instructions: document.getElementById('instructions').value.split('.'),
        cookingTime: parseInt(document.getElementById('cookingTime').value, 10),
    };

    fetch('http://localhost:3000/api/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Recipe added:', data);
        fetchRecipes(); // Uppdatera tabellen med nya data
    })
    .catch((error) => {
        console.error('Error adding recipe:', error);
    });
}

function updateRecipe(id) {
    // Plats för uppdateringslogik
    console.log('Update functionality not implemented for id:', id);
    
}

function deleteRecipe(id) {
    if (confirm('Are you sure you want to delete this recipe?')) {
        fetch(`http://localhost:3000/api/recipes/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                fetchRecipes(); // Uppdatera tabellen efter borttagning
            }
        })
        .catch(error => console.error('Error deleting recipe:', error));
    }
}
