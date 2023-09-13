// JavaScript code for handling form submissions and displaying content
const mealType = document.getElementById("mealType");
const mealResult = document.getElementById("mealResult");
const searchQuery = document.getElementById("searchQuery");
const searchResults = document.getElementById("searchResults");

// Add an event listener for the "Find Meal" button
document.getElementById("findMealButton").addEventListener("click", async () => {
    const selectedMealType = mealType.value;
// on click, a request is sent tot the HTTP end point
    try {
        const response = await fetch(`/meals/random/${selectedMealType}`);
        const data = await response.json();

        if (response.ok) {
            mealResult.innerHTML = `<p>Hello, we recommend <b>${data.name}</b> for ${selectedMealType}.<br><br> You would need ${data.ingredients}.</p>`;
        } else {
            mealResult.innerHTML = `<p class="tag-error">No Recommendations for You Today, Eat a Real Meal</p>`;
        }
    } catch (error) {
        mealResult.innerHTML = `<p class="tag-error">No Recommendations for You.</p>`;
    }
});

// Add an event listener for the "Search" button
document.getElementById("searchButton").addEventListener("click", async () => {
    const query = searchQuery.value.trim().toLowerCase();
// also a request is sent to the end point on click
    try {
        const response = await fetch(`/meals/search/${query}`);
        const data = await response.json();

        if (response.ok) {
            // Clear previous search results
            searchResults.innerHTML = "";

            // Create a Bootstrap row div to hold the results
            const row = document.createElement("div");
            row.classList.add("row");

            data.forEach((meal) => {
                // Create a Bootstrap column div for each result
                const col = document.createElement("div");
                col.classList.add("col-md-4", "col-6");

                // Create the result box inside the column
                const resultBox = document.createElement("div");
                resultBox.classList.add("result-box");
                resultBox.innerHTML = `<b>${meal.name}</b><p>Type: ${meal.type}</p> <b>Ingredients:</b> ${meal.ingredients}`;

                // Append the result box to the column, and the column to the row
                col.appendChild(resultBox);
                row.appendChild(col);
            });

            // Append the row to the searchResults div
            searchResults.appendChild(row);
        } else {
            searchResults.innerHTML = `<p class="tag-error">No Recipe for ${query}, Eat Something else</p>`;
        }
    } catch (error) {
        searchResults.innerHTML = `<p class="tag-error">Oops No Recipe found, Eat Something else.</p>`;
    }
});