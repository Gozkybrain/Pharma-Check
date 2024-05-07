# Real Estate Properties API Documentation

Welcome to the Real Estate Properties API documentation. This comprehensive guide will help you understand how to interact with the API to retrieve information about various real estate properties.

## Base URL

The base URL for accessing the API is `http://localhost:3000/`.

## Endpoints

### Get All Properties

- **Endpoint**: `/`
- **Method**: `GET`
- **Description**: This endpoint allows you to retrieve a list of all available real estate properties.
- **Example Request**: `GET http://localhost:3000/`
- **Response**: An array containing JSON objects representing each property.

### Search Properties by Type

- **Endpoint**: `/properties/type/:type`
- **Method**: `GET`
- **Description**: This endpoint allows you to search for properties of a specific type (e.g., Ranch, Condominium, Mansion).
- **Parameters**:
  - `:type` (string): The type of property to filter by.
- **Example Request**: `GET http://localhost:3000/properties/type/Condominium`
- **Response**: An array containing JSON objects representing properties of the specified type.


### Search Properties by Location

- **Endpoint**: `/properties/location/:location`
- **Method**: `GET`
- **Description**: This endpoint allows you to search for properties of a specific location (e.g., Texas).
- **Parameters**:
  - `:location` (string): The type of property to filter by.
- **Example Request**: `GET http://localhost:3000 /properties/location/Texas`
- **Response**: An array containing JSON objects representing properties of the specified Location.


### Search Properties by Type and Location

- **Endpoint**: `/properties/:type/:location`
- **Method**: `GET`
- **Description**: This endpoint allows you to search for properties of a specific type located in a specific area.
- **Parameters**:
  - `:type` (string): The type of property to filter by.
  - `:location` (string): The location of property to filter by.
- **Example Request**: `GET http://localhost:3000/properties/Mansion/Texas/`
- **Response**: An array containing JSON objects representing properties of the specified type and location.

### Get Properties by Price Range

- **Endpoint**: `/properties/price-below-500k`
- **Method**: `GET`
- **Description**: Use this endpoint to find properties within that predefined and specified price range.
- **Example Request**: `GET http://localhost:3000/properties/price-below-500k`
- **Response**: An array containing JSON objects representing properties within the specified 500k price range.


## Error Handling

- If a requested property ID, type, price range, or amenity does not match any records, the API returns a 404 (Not Found) response with an appropriate error message.
- In case of an internal server error during processing, the API returns a 500 (Internal Server Error) response with an error message.

## Authentication

No authentication is required to access the API endpoints.

## Rate Limiting

There are currently no rate limits imposed on API requests.

## Support

For any questions, feedback, or issues related to the API, please contact our support team at gozkybrain@gmail.com.

This documentation provides detailed information on each endpoint available in the Real Estate Properties API, including examples of requests and responses, parameters, and error handling. It aims to assist developers in efficiently utilizing the API to retrieve real estate property data for various purposes.

The API is hosted on Render.com with express server, here is a [Simple YouTube Guide to this regard](https://www.youtube.com/watch?v=wN0n2gj0z9o)
