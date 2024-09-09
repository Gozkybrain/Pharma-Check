const express = require('express'); // Import Express module
const bodyParser = require('body-parser'); // Import body-parser module
const cors = require('cors'); // Import cors module
const fuzzball = require('fuzzball'); // Import fuzzball for fuzzy string matching
const data = require('./list.json'); // Update the path to list.json

// Create an Express application
const app = express();
// Define the port number
const PORT = 3000; 
const localhost = `http://localhost:${PORT}`;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// CORS options
const corsOptions = {
    origin: [
        'http://localhost:3000', 
        'http://localhost:5174',
        'http://localhost:5173', // Vite's default port
        'https://pharmacheck.netlify.app' // Your Netlify URL
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
function findTreatmentMatches(query, data, threshold = 75) {
    const queryTokens = preprocessInput(query);
    const matches = [];

    console.log(`Query tokens: ${queryTokens}`);

    data.forEach((entry, index) => {
        if (entry.treatment) {
            entry.treatment.forEach(treatment => {
                console.log(`Comparing with treatment: ${treatment}`);
                queryTokens.forEach(token => {
                    const score = fuzzball.partial_ratio(token, treatment.toLowerCase());
                    console.log(`Token: ${token}, Treatment: ${treatment}, Score: ${score}`);
                    if (score >= threshold) {
                        matches.push({ id: entry.id, drug: entry.name, treatment, score });
                    }
                });
            });
        }
    });

    return matches;
}

// Find drugs by name
function findDrugByName(name, data) {
    const nameLowerCase = name.toLowerCase();
    return data.filter(entry => entry.name.toLowerCase().includes(nameLowerCase));
}

// Find drugs by category
function findDrugByCategory(category, data) {
    const categoryLowerCase = category.toLowerCase();
    return data.filter(entry => entry.category.toLowerCase() === categoryLowerCase);
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
    return shuffleArray(filtered).slice(0, count);
}

// Find random drugs by category, excluding a specific drug
function findRandomDrugsByCategoryExcept(category, exclude, data, count = 3) {
    const filtered = data.filter(entry => entry.category.toLowerCase() === category.toLowerCase() && entry.name.toLowerCase() !== exclude.toLowerCase());
    return shuffleArray(filtered).slice(0, count);
}

// Find drugs by category and minimum age
function findDrugsByCategoryAndAge(category, minAge, data) {
    return data.filter(entry => entry.category.toLowerCase() === category.toLowerCase() && entry.minAge >= minAge);
}

// Find a drug by ID
function findDrugById(id, data) {
    return data.find(entry => entry.id === id); // Use string ID directly
}

// == Now Let's handle the endpoints

// Route handler for the root path ("/") to display all properties
app.get('/', (req, res) => {
    res.json(data);
});

/* 
  API endpoint for searching treatments using the closest symptoms.
  Complete route: http://localhost:3000/search?q=query
  Example: http://localhost:3000/search?q=heavy+discharge+and+infections
*/
app.get('/search', (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).send({ error: 'Query parameter is required' });
    }

    const matches = findTreatmentMatches(query, data);
    console.log(`Matches found: ${JSON.stringify(matches)}`);
    res.send(matches);
});

/*
  API endpoint for searching drugs by name.
  Complete route: http://localhost:3000/search/name/:name
  Example: http://localhost:3000/search/name/ibuprofen
*/
app.get('/search/name/:name', (req, res) => {
    const name = req.params.name;
    if (!name) {
        return res.status(400).send({ error: 'Name parameter is required' });
    }

    const matches = findDrugByName(name, data);
    console.log(`Matches found: ${JSON.stringify(matches)}`);
    res.send(matches);
});

/*
  API endpoint for searching drugs by category.
  Complete route: http://localhost:3000/category/:categoryName
  Example: http://localhost:3000/category/antibiotic
*/
app.get('/category/:categoryName', (req, res) => {
    const category = req.params.categoryName;
    const matches = findDrugByCategory(category, data);
    console.log(`Matches found for category '${category}': ${JSON.stringify(matches)}`);
    res.send(matches);
});

/*
  API endpoint for searching random drugs by category.
  Complete route: http://localhost:3000/category/:categoryName/random
  Example: http://localhost:3000/category/antibiotic/random
*/
app.get('/category/:categoryName/random', (req, res) => {
    const category = req.params.categoryName;
    const matches = findRandomDrugsByCategory(category, data);
    console.log(`Random matches found for category '${category}': ${JSON.stringify(matches)}`);
    res.send(matches);
});

/*
  API endpoint for searching random drugs by category except a specific drug.
  Complete route: http://localhost:3000/category/:categoryName/random/exclude/:drugName
  Example: http://localhost:3000/category/antibiotic/random/exclude/amoxicillin
*/
app.get('/category/:categoryName/random/exclude/:drugName', (req, res) => {
    const category = req.params.categoryName;
    const exclude = req.params.drugName;
    const matches = findRandomDrugsByCategoryExcept(category, exclude, data);
    console.log(`Random matches found for category '${category}' excluding '${exclude}': ${JSON.stringify(matches)}`);
    res.send(matches);
});

/*
  API endpoint for searching drugs by category and minimum age.
  Complete route: http://localhost:3000/category/:categoryName/age/:minAge
  Example: http://localhost:3000/category/supplement/age/14
*/
app.get('/category/:categoryName/age/:minAge', (req, res) => {
    const category = req.params.categoryName;
    const minAge = parseInt(req.params.minAge, 10);
    if (isNaN(minAge)) {
        return res.status(400).send({ error: 'Invalid age parameter' });
    }

    const matches = findDrugsByCategoryAndAge(category, minAge, data);
    console.log(`Matches found for category '${category}' and minimum age '${minAge}': ${JSON.stringify(matches)}`);
    res.send(matches);
});

/*
  API endpoint for getting a drug by ID.
  Complete route: http://localhost:3000/drug/:id
  Example: http://localhost:3000/drug/1
*/
app.get('/drug/:id', (req, res) => {
    const id = req.params.id;
    const drug = findDrugById(id, data);
    if (drug) {
        console.log(`Drug found with ID '${id}': ${JSON.stringify(drug)}`);
        res.send(drug);
    } else {
        res.status(404).send({ error: 'Drug not found' });
    }
});

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server is running on ${localhost}`);
});
