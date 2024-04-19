# Service Management Module

## Overview

This module provides functionality for managing services, reviews, and users within a system. It includes operations for adding, updating, and deleting services, retrieving service reviews, managing user information, and more.

### Entities

The module defines several key entity types:

1. **ServiceRecord**: Represents a service offered within the system. It includes properties such as ID, name, category, provider, date, start time, end time, location, description, creation date, and last update date.
   
2. **ReviewRecord**: Represents a review submitted for a service. It includes properties like ID, service ID, user ID, rating, comment, and creation date.

3. **User**: Represents a user of the system. It includes properties like ID, username, email, creation date, and last update date.

### Functions

#### Service Management

1. **addService(payload: ServicePayload): Result<ServiceRecord, string>**: Adds a new service to the system with the provided details. It generates a unique ID for the service and stores it in the service storage.

2. **getServiceReviews(serviceId: string): Result<Vec<ReviewRecord>, string>**: Retrieves all reviews for a specific service identified by its ID.

3. **getServiceAverageRating(serviceId: string): Result<number, string>**: Calculates and retrieves the average rating for a specific service based on its reviews.

4. **updateService(id: string, payload: ServicePayload): Result<ServiceRecord, string>**: Updates information for a service specified by its ID with the provided payload.

5. **deleteService(id: string): Result<ServiceRecord, string>**: Deletes a service specified by its ID.

6. **getService(id: string): Result<ServiceRecord, string>**: Retrieves a service specified by its ID.

7. **getServices(): Result<Vec<ServiceRecord>, string>**: Retrieves all services stored in the system.

8. **searchServicesByCategory(category: string): Result<Vec<ServiceRecord>, string>**: Searches for services by category.

9. **filterServicesByProvider(provider: string): Result<Vec<ServiceRecord>, string>**: Filters services by provider.

10. **filterServicesByDateRange(startDate: string, endDate: string): Result<Vec<ServiceRecord>, string>**: Filters services by date range.

11. **updateServiceLocation(id: string, location: string): Result<ServiceRecord, string>**: Updates the location of a service specified by its ID.

12. **updateServiceDescription(id: string, description: string): Result<ServiceRecord, string>**: Updates the description of a service specified by its ID.

#### Review Management

1. **addReview(payload: ReviewPayload): Result<ReviewRecord, string>**: Adds a new review for a service with the provided payload.

2. **deleteReview(id: string): Result<ReviewRecord, string>**: Deletes a review specified by its ID.

3. **getReview(id: string): Result<ReviewRecord, string>**: Retrieves a review specified by its ID.

4. **getAllReviews(): Result<Vec<ReviewRecord>, string>**: Retrieves all reviews stored in the system.

#### User Management

1. **createUser(payload: UserPayload): Result<User, string>**: Creates a new user with the provided payload.

2. **deleteUser(id: string): Result<User, string>**: Deletes a user specified by its ID.

3. **getUser(id: string): Result<User, string>**: Retrieves a user specified by its ID.

4. **getAllUsers(): Result<Vec<User>, string>**: Retrieves all users stored in the system.

### Storage

The module uses stable B-tree maps to store service records, review records, and user records. These maps ensure efficient storage and retrieval of data.

### Testing

The module includes a mock implementation for the 'crypto' object, which is used for testing purposes.

