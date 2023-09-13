# FeedMe - Meal Recommendation App

## Project Overview
 
Welcome to FeedMe, a web application designed to simplify meal planning and provide quick meal recommendations. With FeedMe, you can find meal suggestions based on meal types or search for specific meals by name.

### API Usage

FeedMe utilizes a custom API to provide meal recommendations and search functionality. The API offers the following endpoints: 

- `/meals/random/:type`: Get a random meal of a specific type, where `:type` can be `breakfast`, `lunch`, `dinner`, `dessert`, or `snack`.
- `/meals/search/:query`: Search for meals by name, using `:query` as the search term.

To learn more about how to use these API endpoints and the expected response formats, please refer to our [API Documentation](./documentation.md).

## Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies-used)
- [Project Overview](#project-overview)

## Project Structure

- `public/`: Static assets (e.g., CSS files).
- `data/`: JSON data files containing meal information.
- `views/`: EJS templates for rendering HTML pages.
- `index.js`: Main application file.

## Installation

To run FeedMe locally, follow these steps:

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/your-username/FeedMe.git

2. Navigate to the project directory:

    ```bash
    cd feedME

 3. Install the project dependencies:
    ```bash
    npm install i

4. Start the application
    ```bash
    node index

Open your web browser and access the application at http://localhost:3000.


## Usage

FeedMe is a user-friendly web application designed to help you find meal recommendations and plan your meals effortlessly. Here's how to use FeedMe effectively:

### Finding a Random Meal

1. On the homepage, you will see a "Find Meal" button. You can use this option to get a random meal recommendation.

2. Select a meal type from the dropdown menu. You can choose from options like "Breakfast," "Lunch," "Dinner," "Dessert," or "Snack."

3. Click the "Find Meal" button. FeedMe will generate a random meal recommendation for the selected meal type.

### Searching for Specific Meals

1. In the search bar, enter the name of a specific meal you're looking for.

2. Click the "Search" button. FeedMe will display a list of meals that match your search query.

3. Each meal in the search results is displayed in a separate box with a border. You can review the meal's name and type.

4. Click on a meal box to view more details or information about the selected meal.

## Technologies Used

FeedMe is built using the following technologies:

- Node.js
- Nodemon
- Axios for API
- Vanilla.js
- Express.js
- EJS (Embedded JavaScript) for rendering web pages
- CSS for personalized styling
- Bootstrap for styling and responsive design

Start using FeedMe today to discover new meal ideas and simplify your meal planning process!



