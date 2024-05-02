// Import necessary modules
import {
    $query,
    $update,
    Record,
    StableBTreeMap,
    Vec,
    match,
    Result,
    nat64,
    ic,
    Opt,
    Principal
} from 'azle';
import { v4 as uuidv4 } from 'uuid';

// Define types for ServiceRecord and ServicePayload
type ServiceRecord = Record<{
    id: string;
    name: string;
    category: string;
    provider: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
    createdAt: nat64;
    updatedAt: Opt<nat64>;
}>;

type ServicePayload = Record<{
    name: string;
    category: string;
    provider: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
}>;

// Create a map to store service records
const serviceStorage = new StableBTreeMap<string, ServiceRecord>(0, 44, 1024);

// Add a new service
$update
export function addService(payload: ServicePayload, caller: Principal): Result<ServiceRecord, string> {
    // Validate input data
    if (!payload.name || !payload.category || !payload.provider || !payload.date || !payload.startTime || !payload.endTime || !payload.location || !payload.description) {
        return Result.Err<ServiceRecord, string>('Missing or invalid input data');
    }

    // Create a new service record
    const record: ServiceRecord = {
        id: uuidv4(),
        createdAt: ic.time(),
        updatedAt: Opt.None,
        ...payload
    };

    // Insert the record into the storage
    serviceStorage.insert(record.id, record);

    return Result.Ok(record);
}

// Update an existing service
$update
export function updateService(id: string, payload: ServicePayload, caller: Principal): Result<ServiceRecord, string> {
    // Retrieve the service record
    const existingRecord = serviceStorage.get(id);
    if (!existingRecord) {
        return Result.Err<ServiceRecord, string>(`Service with id=${id} not found`);
    }

    // Validate caller authorization
    if (existingRecord.provider !== caller.toString()) {
        return Result.Err<ServiceRecord, string>('You are not authorized to update this service');
    }

    // Update the service record
    const updatedRecord: ServiceRecord = {
        ...existingRecord,
        ...payload,
        updatedAt: Opt.Some(ic.time())
    };
    serviceStorage.insert(id, updatedRecord);

    return Result.Ok(updatedRecord);
}

// Delete an existing service
$update
export function deleteService(id: string, caller: Principal): Result<ServiceRecord, string> {
    // Retrieve the service record
    const existingRecord = serviceStorage.get(id);
    if (!existingRecord) {
        return Result.Err<ServiceRecord, string>(`Service with id=${id} not found`);
    }

    // Validate caller authorization
    if (existingRecord.provider !== caller.toString()) {
        return Result.Err<ServiceRecord, string>('You are not authorized to delete this service');
    }

    // Remove the service record
    serviceStorage.remove(id);

    return Result.Ok(existingRecord);
}

// Retrieve a service by its ID
$query
export function getService(id: string): Result<ServiceRecord, string> {
    // Retrieve the service record
    const existingRecord = serviceStorage.get(id);
    if (!existingRecord) {
        return Result.Err<ServiceRecord, string>(`Service with id=${id} not found`);
    }

    return Result.Ok(existingRecord);
}

// Retrieve all services
$query
export function getServices(): Result<Vec<ServiceRecord>, string> {
    return Result.Ok(serviceStorage.values());
}

// Search services by category
$query
export function searchServicesByCategory(category: string): Result<Vec<ServiceRecord>, string> {
    // Filter services by category
    const filteredServices = serviceStorage.values().filter(service => service.category.toLowerCase() === category.toLowerCase());
    return Result.Ok(filteredServices);
}

// Filter services by provider
$query
export function filterServicesByProvider(provider: string): Result<Vec<ServiceRecord>, string> {
    // Filter services by provider
    const filteredServices = serviceStorage.values().filter(service => service.provider.toLowerCase() === provider.toLowerCase());
    return Result.Ok(filteredServices);
}

// Filter services by date range
$query
export function filterServicesByDateRange(startDate: string, endDate: string): Result<Vec<ServiceRecord>, string> {
    // Filter services by date range
    const filteredServices = serviceStorage.values().filter(service => service.date >= startDate && service.date <= endDate);
    return Result.Ok(filteredServices);
}

// Update service location
$update
export function updateServiceLocation(id: string, location: string, caller: Principal): Result<ServiceRecord, string> {
    // Retrieve the service record
    const existingRecord = serviceStorage.get(id);
    if (!existingRecord) {
        return Result.Err<ServiceRecord, string>(`Service with id=${id} not found`);
    }

    // Validate caller authorization
    if (existingRecord.provider !== caller.toString()) {
        return Result.Err<ServiceRecord, string>('You are not authorized to update this service');
    }

    // Update the service location
    const updatedRecord: ServiceRecord = {
        ...existingRecord,
        location,
        updatedAt: Opt.Some(ic.time())
    };
    serviceStorage.insert(id, updatedRecord);

    return Result.Ok(updatedRecord);
}

// Update service description
$update
export function updateServiceDescription(id: string, description: string, caller: Principal): Result<ServiceRecord, string> {
    // Retrieve the service record
    const existingRecord = serviceStorage.get(id);
    if (!existingRecord) {
        return Result.Err<ServiceRecord, string>(`Service with id=${id} not found`);
    }

    // Validate caller authorization
    if (existingRecord.provider !== caller.toString()) {
        return Result.Err<ServiceRecord, string>('You are not authorized to update this service');
    }

    // Update the service description
    const updatedRecord: ServiceRecord = {
        ...existingRecord,
        description,
        updatedAt: Opt.Some(ic.time())
    };
    serviceStorage.insert(id, updatedRecord);

    return Result.Ok(updatedRecord);
}
// Add a review for a service
$update
export function addReview(payload: ReviewPayload, caller: Principal): Result<ReviewRecord, string> {
    // Validate input data
    if (!payload.serviceId || !payload.userId || isNaN(payload.rating) || payload.rating < 0 || payload.rating > 5 || !payload.comment) {
        return Result.Err<ReviewRecord, string>('Invalid review data');
    }

    // Check if the service exists
    const serviceExists = serviceStorage.get(payload.serviceId);
    if (!serviceExists) {
        return Result.Err<ReviewRecord, string>('Service does not exist');
    }

    // Create the review record
    const review: ReviewRecord = {
        id: uuidv4(),
        createdAt: ic.time(),
        ...payload
    };

    // Insert the review into the storage
    reviewStorage.insert(review.id, review);

    return Result.Ok(review);
}

// Delete a review
$update
export function deleteReview(id: string, caller: Principal): Result<ReviewRecord, string> {
    // Retrieve the review record
    const existingReview = reviewStorage.get(id);
    if (!existingReview) {
        return Result.Err<ReviewRecord, string>(`Review with id=${id} not found`);
    }

    // Check if the caller is authorized to delete the review
    if (existingReview.userId !== caller.toString()) {
        return Result.Err<ReviewRecord, string>('You are not authorized to delete this review');
    }

    // Remove the review from storage
    reviewStorage.remove(id);

    return Result.Ok(existingReview);
}

// Get a review by ID
$query
export function getReview(id: string): Result<ReviewRecord, string> {
    // Retrieve the review record
    const existingReview = reviewStorage.get(id);
    if (!existingReview) {
        return Result.Err<ReviewRecord, string>(`Review with id=${id} not found`);
    }

    return Result.Ok(existingReview);
}

// Get all reviews
$query
export function getAllReviews(): Result<Vec<ReviewRecord>, string> {
    // Retrieve all review records
    const reviews = reviewStorage.values();
    return Result.Ok(reviews);
}

// Create a new user
$update
export function createUser(payload: UserPayload): Result<User, string> {
    // Validate input data
    if (!payload.username || !payload.email) {
        return Result.Err<User, string>('Missing username or email');
    }

    // Create the user record
    const user: User = {
        id: uuidv4(),
        createdAt: ic.time(),
        updatedAt: Opt.None,
        ...payload
    };

    // Insert the user into storage
    userStorage.insert(user.id, user);

    return Result.Ok(user);
}

// Delete a user
$update
export function deleteUser(id: string, caller: Principal): Result<User, string> {
    // Retrieve the user record
    const existingUser = userStorage.get(id);
    if (!existingUser) {
        return Result.Err<User, string>(`User with id=${id} not found`);
    }

    // Check if the caller is authorized to delete the user
    if (existingUser.id !== caller.toString()) {
        return Result.Err<User, string>('You are not authorized to delete this user');
    }

    // Remove the user from storage
    userStorage.remove(id);

    return Result.Ok(existingUser);
}

// Get a user by ID
$query
export function getUser(id: string): Result<User, string> {
    // Retrieve the user record
    const existingUser = userStorage.get(id);
    if (!existingUser) {
        return Result.Err<User, string>(`User with id=${id} not found`);
    }

    return Result.Ok(existingUser);
}

// Get all users
$query
export function getAllUsers(): Result<Vec<User>, string> {
    // Retrieve all user records
    const users = userStorage.values();
    return Result.Ok(users);
}

// Mocking the 'crypto' object for testing purposes
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};
