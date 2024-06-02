# Pharm Check API Documentation

The Pharm Check API contains a total of 50 Pharmaceutical drugs. The experimental phase of the Pharm Check Project aims at sorting out drugs as recommendation based on various criteria while still providing information about the drug. The API will be able to integrate and solve solutions based on home services for Pharmaceutical drugs, and quizzes in that department.

## Base URL

The base URL for accessing the API is `http://localhost:3000/`.

To start the server locally, run `nodemon` in your terminal, be sure to already have nodemon installed: 

- npm: `npm install -g nodemon`
- yarn: `yarn global add nodemon`

## Featured Properties
The data for each drug will come with the following information, and which will help developers utilize the full aspect of this API.
- **id**: This will be used to calculate the particular number on the sequence in which the drug falls on.
- **name**: This is simply the drug's name.
- **description**: A little note about the drug.
- **sideEffect**: Known side effect of the drug.
- **category**: The category of drug selected eg. antibiotics.
- **treatment**: This will be used to explain what the drug can be used to treat or manage.
- **minAge**: The minimum age to use this drug.

## Endpoints

### Get All Properties

- **Endpoint**: `/`
- **Method**: `GET`
- **Example Request**: `GET http://localhost:3000/`

### Search Drugs based on closest symptoms

- **Endpoint**: `/search?q=query`
- **Method**: `GET`
- **Example Request**: `GET http://localhost:3000/search?q=heavy+discharge+and+infections`


### Search Drugs by name

- **Endpoint**: `/search/name/:name`
- **Method**: `GET`
- **Example Request**: `GET http://localhost:3000/search/name/ibuprofen`


### Search Drug by category

- **Endpoint**: `/category/:categoryName`
- **Method**: `GET`
- **Example Request**: `GET http://localhost:3000/category/antibiotic`

### Search for drugs by category

- **Endpoint**: `/category/:categoryName`
- **Method**: `GET`
- **Example Request**: `GET http://localhost:3000/category/antibiotic`

### Get random drugs by category

- **Endpoint**: `/category/:categoryName/random`
- **Method**: `GET`
- **Example Request**: `GET http://localhost:3000/category/antibiotic/random`


### Search drugs by category for an age

- **Endpoint**: `/category/:categoryName/age/:minAge`
- **Method**: `GET`
- **Example Request**: `GET http://localhost:3000/category/supplement/age/14`

### Search random drugs by category excluding a specific drug

- **Endpoint**: `/category/:categoryName/random/exclude/:drugName`
- **Method**: `GET`
- **Example Request**: `GET http://localhost:3000/category/antibiotic/random/exclude/amoxicillin`


## Error Handling

The errors can be handled individually by developers, this will help create a robust usage of the API.

## Example of Fetch Function

```

// Function to fetch drugs by category from the API

const fetchDrugsByCategory = async (category) => {
    try {
        // Fetch data from the API endpoint for the specified category
        const response = await fetch(`http://localhost:3000/category/${category}`);

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response as JSON
        const data = await response.json();

        // Log the fetched drugs
        console.log(data);

        // Handle the fetched data as needed, for example, updating the UI or state
    } catch (error) {
      
        // Handle errors if any occur during fetching
        console.error('Error fetching drugs by category:', error);
    }
};

// Example usage of the function
fetchDrugsByCategory('antibiotic');

```


### Example using React JS
```
import React, { useState, useEffect } from 'react';

const DrugList = ({ category }) => {
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDrugs = async () => {
            try {
                const response = await fetch(`http://localhost:3000/category/${category}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setDrugs(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching drugs by category:', error);
                setLoading(false);
            }
        };

        fetchDrugs();
    }, [category]);

    return (
        <div>
            {loading ? (
                <p>Loading drugs...</p>
            ) : (
                <ul>
                    {drugs.map((drug) => (
                        <li key={drug.name}>{drug.name} - {drug.category}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DrugList;

```

## Authentication

No authentication is required to access the API endpoints.

## Rate Limiting

There are currently no rate limits imposed on API requests.

## Support

The API is open to suggestions, recommendation, and enquiries. Feel free to reach out in ways that we can improve the quality of the server.

The API is hosted on Render.com with express server, here is a [Simple YouTube Guide to this regard](https://www.youtube.com/watch?v=wN0n2gj0z9o)
