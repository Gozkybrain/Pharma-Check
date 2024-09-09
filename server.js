const express = require('express'); // Import Express module
const bodyParser = require('body-parser'); // Import body-parser module
const cors = require('cors'); // Import cors module
const fuzzball = require('fuzzball'); // Import fuzzball for fuzzy string matching
const data = require('./list.json'); // Update the path to list.json

// Create an Express application
const app = express();
// Define the port number
const PORT = 3000; 
const localhost = 'http://localhost:' + PORT;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// CORS options, including your Netlify URL
const corsOptions = {
    origin: [
        'http://localhost:3000', 
        'http://localhost:5174',
        'http://localhost:5173', // Vite's default port
        'https://pharmacheck.netlify.app' // Your Netlify URL (omit specific paths)
    ], 
    methods: 'GET,POST', // Allow specific HTTP methods
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Use CORS middleware with the specified options
app.use(cors(corsOptions));

// Preprocess the input query by converting to lowercase and splitting into words
function preprocessInput(input) {
    return input.toLowerCase().split(/\s+/);
}


// Find treatment matches based on fuzzy matching
function findTreatmentMatches(query, data, threshold = 75) { // Increased threshold to 75
    const queryTokens = preprocessInput(query); // Preprocess the input query
    const matches = [];

    console.log(`Query tokens: ${queryTokens}`); // Log query tokens

    data.forEach((entry, index) => { // Add index to use as an ID for each result
        if (entry.treatment) { // Ensure treatment is defined
            entry.treatment.forEach(treatment => {
                console.log(`Comparing with treatment: ${treatment}`); // Log each treatment
                queryTokens.forEach(token => {
                    const score = fuzzball.partial_ratio(token, treatment.toLowerCase()); // Calculate fuzzy match score
                    console.log(`Token: ${token}, Treatment: ${treatment}, Score: ${score}`); // Log token, treatment, and score
                    if (score >= threshold) {
                        matches.push({ id: index + 1, drug: entry.name, treatment, score }); // Add to matches if score is above threshold with unique id
                    }
                });
            });
        }
    });

    return matches; // Return the list of matches
}

// Find drugs by name
function findDrugByName(name, data) {
    const nameLowerCase = name.toLowerCase();
    const matches = data.filter(entry => entry.name.toLowerCase().includes(nameLowerCase));
    return matches;
}

// Find drugs by category
function findDrugByCategory(category, data) {
    const categoryLowerCase = category.toLowerCase();
    const matches = data.filter(entry => entry.category.toLowerCase() === categoryLowerCase);
    return matches;
}

// Shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Find random drugs by category
function findRandomDrugsByCategory(category, data, count = 3) {
    const filtered = data.filter(entry => entry.category.toLowerCase() === category.toLowerCase());
    const shuffled = shuffleArray(filtered);
    return shuffled.slice(0, count);
}

// Find random drugs by category, excluding a specific drug
function findRandomDrugsByCategoryExcept(category, exclude, data, count = 3) {
    const filtered = data.filter(entry => entry.category.toLowerCase() === category.toLowerCase() && entry.name.toLowerCase() !== exclude.toLowerCase());
    const shuffled = shuffleArray(filtered);
    return shuffled.slice(0, count);
}

// Find drugs by category and minimum age
function findDrugsByCategoryAndAge(category, minAge, data) {
    const matches = data.filter(entry => entry.category.toLowerCase() === category.toLowerCase() && entry.minAge >= minAge);
    return matches;
}

// == Now Let's handle the endpoints

// Route handler for the root path ("/") to display all properties
app.get('/', (req, res) => {
    res.json(data); // Send the JSON data as response
});

/* 
  API endpoint for searching treatments using the closest symptoms.
  Complete route: http://localhost:3000/search?q=query
  Example: http://localhost:3000/search?q=heavy+discharge+and+infections
*/
app.get('/search', (req, res) => {
    const query = req.query.q; // Get the query parameter from the request
    if (!query) {
        return res.status(400).send({ error: 'Query parameter is required' }); // Return an error if query is missing
    }

    const matches = findTreatmentMatches(query, data); // Find matches using the fuzzy matching function
    console.log(`Matches found: ${JSON.stringify(matches)}`); // Log the matches found
    res.send(matches); // Send the matches as response
});

/*
  API endpoint for searching drugs by name.
  Complete route: http://localhost:3000/search/name/:name
  Example: http://localhost:3000/search/name/ibuprofen
*/
app.get('/search/name/:name', (req, res) => {
    const name = req.params.name; // Get the name of the drug from the request parameters
    if (!name) {
        return res.status(400).send({ error: 'Name parameter is required' }); // Return an error if name is missing
    }

    const matches = findDrugByName(name, data); // Find drugs by name
    console.log(`Matches found: ${JSON.stringify(matches)}`); // Log the matches found
    res.send(matches); // Send the matches as response
});

/*
  API endpoint for searching drugs by category.
  Complete route: http://localhost:3000/category/:categoryName
  Example: http://localhost:3000/category/antibiotic
*/
app.get('/category/:categoryName', (req, res) => {
    const category = req.params.categoryName; // Get the category name from the request parameters
    const matches = findDrugByCategory(category, data); // Find drugs by category
    console.log(`Matches found for category '${category}': ${JSON.stringify(matches)}`); // Log the matches found
    res.send(matches); // Send the matches as response
});

/*
  API endpoint for searching random drugs by category.
  Complete route: http://localhost:3000/category/:categoryName/random
  Example: http://localhost:3000/category/antibiotic/random
*/
app.get('/category/:categoryName/random', (req, res) => {
    const category = req.params.categoryName; // Get the category name from the request parameters
    const matches = findRandomDrugsByCategory(category, data); // Find random drugs by category
    console.log(`Random matches found for category '${category}': ${JSON.stringify(matches)}`); // Log the matches found
    res.send(matches); // Send the matches as response
});

/*
  API endpoint for searching random drugs by category except a specific drug.
  Complete route: http://localhost:3000/category/:categoryName/random/exclude/:drugName
  Example: http://localhost:3000/category/antibiotic/random/exclude/amoxicillin
*/
app.get('/category/:categoryName/random/exclude/:drugName', (req, res) => {
    const category = req.params.categoryName; // Get the category name from the request parameters
    const exclude = req.params.drugName; // Get the drug name to exclude from the request parameters
    const matches = findRandomDrugsByCategoryExcept(category, exclude, data); // Find random drugs by category except the specified drug
    console.log(`Random matches found for category '${category}' excluding '${exclude}': ${JSON.stringify(matches)}`); // Log the matches found
    res.send(matches); // Send the matches as response
});

/*
  API endpoint for searching drugs by category and minimum age.
  Complete route: http://localhost:3000/category/:categoryName/age/:minAge
  Example: http://localhost:3000/category/supplement/age/14
*/
app.get('/category/:categoryName/age/:minAge', (req, res) => {
    const category = req.params.categoryName; // Get the category name from the request parameters
    const minAge = parseInt(req.params.minAge, 10); // Get the minimum age from the request parameters
    if (isNaN(minAge)) {
        return res.status(400).send({ error: 'Invalid age parameter' }); // Return an error if age is invalid
    }

    const matches = findDrugsByCategoryAndAge(category, minAge, data); // Find drugs by category and minimum age
    console.log(`Matches found for category '${category}' with minAge '${minAge}': ${JSON.stringify(matches)}`); // Log the matches found
    res.send(matches); // Send the matches as response
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on ${localhost}`); // Log the server's URL
});
