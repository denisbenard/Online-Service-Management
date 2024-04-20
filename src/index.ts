import { $query, $update, Record, StableBTreeMap, Vec, Result, nat64, Opt } from 'azle';
import { v4 as uuidv4 } from "uuid";

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

type ReviewRecord = Record<{
  id: string;
  serviceId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: nat64;
}>;

type ReviewPayload = Record<{
  serviceId: string;
  userId: string;
  rating: number;
  comment: string;
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

type User = Record<{
  id: string;
  username: string;
  email: string;
  createdAt: nat64;
  updatedAt: Opt<nat64>;
}>;

type UserPayload = Record<{
  username: string;
  email: string;
}>;

const serviceStorage = new StableBTreeMap<string, ServiceRecord>(0, 44, 1024);
const reviewStorage = new StableBTreeMap<string, ReviewRecord>(1, 44, 1024);
const userStorage = new StableBTreeMap<string, User>(2, 44, 1024);

$update;
export function addService(payload: ServicePayload): Result<ServiceRecord, string> {
  const record: ServiceRecord = { id: uuidv4(), createdAt: ic.time(), updatedAt: Opt.None, ...payload };
  serviceStorage.insert(record.id, record);
  return Result.Ok(record);
}

$query;
export function getServiceReviews(serviceId: string): Result<Vec<ReviewRecord>, string> {
    const reviews = reviewStorage.values().filter(review => review.serviceId === serviceId);
    return Result.Ok(reviews);
}

$query;
export function getServiceAverageRating(serviceId: string): Result<number, string> {
    const reviews = reviewStorage.values().filter(review => review.serviceId === serviceId);
    if (reviews.length === 0) {
        return Result.Err("No reviews found for the service");
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    return Result.Ok(averageRating);
}

$update;
export function updateService(id: string, payload: ServicePayload): Result<ServiceRecord, string> {
  return match(serviceStorage.get(id), {
      Some: (record) => {
          const updatedRecord: ServiceRecord = {...record, ...payload, updatedAt: Opt.Some(ic.time())};
          serviceStorage.insert(record.id, updatedRecord);
          return Result.Ok<ServiceRecord, string>(updatedRecord);
      },
      None: () => Result.Err<ServiceRecord, string>(`Service with id=${id} not found`)
  });
}

$update;
export function deleteService(id: string): Result<ServiceRecord, string> {
  return match(serviceStorage.remove(id), {
      Some: (deletedRecord) => Result.Ok<ServiceRecord, string>(deletedRecord),
      None: () => Result.Err<ServiceRecord, string>(`Service with id=${id} not found`)
  });
}

$query;
export function getService(id: string): Result<ServiceRecord, string> {
  return match(serviceStorage.get(id), {
      Some: (record) => Result.Ok<ServiceRecord, string>(record),
      None: () => Result.Err<ServiceRecord, string>(`Service with id=${id} not found`)
  });
}

$query;
export function getServices(): Result<Vec<ServiceRecord>, string> {
  return Result.Ok(serviceStorage.values());
}

$update;
export function searchServicesByCategory(category: string): Result<Vec<ServiceRecord>, string> {
    const records = serviceStorage.values();
    const filteredServices = records.filter(service => service.category.toLowerCase() === category.toLowerCase());
    return Result.Ok(filteredServices);
}

$update;
export function filterServicesByProvider(provider: string): Result<Vec<ServiceRecord>, string> {
    const records = serviceStorage.values();
    const filteredServices = records.filter(service => service.provider.toLowerCase() === provider.toLowerCase());
    return Result.Ok(filteredServices);
}

$update;
export function filterServicesByDateRange(startDate: string, endDate: string): Result<Vec<ServiceRecord>, string> {
    const records = serviceStorage.values();
    const filteredServices = records.filter(service => service.date >= startDate && service.date <= endDate);
    return Result.Ok(filteredServices);
}

$update;
export function updateServiceLocation(id: string, location: string): Result<ServiceRecord, string> {
    return match(serviceStorage.get(id), {
        Some: (record) => {
            const updatedRecord: ServiceRecord = {...record, location, updatedAt: Opt.Some(ic.time())};
            serviceStorage.insert(record.id, updatedRecord);
            return Result.Ok<ServiceRecord, string>(updatedRecord);
        },
        None: () => Result.Err<ServiceRecord, string>(`Service with id=${id} not found`)
    });
}

$update;
export function updateServiceDescription(id: string, description: string): Result<ServiceRecord, string> {
    return match(serviceStorage.get(id), {
        Some: (record) => {
            const updatedRecord: ServiceRecord = {...record, description, updatedAt: Opt.Some(ic.time())};
            serviceStorage.insert(record.id, updatedRecord);
            return Result.Ok<ServiceRecord, string>(updatedRecord);
        },
        None: () => Result.Err<ServiceRecord, string>(`Service with id=${id} not found`)
    });
}

$update;
export function addReview(payload: ReviewPayload): Result<ReviewRecord, string> {
    const review: ReviewRecord = { id: uuidv4(), createdAt: ic.time(), ...payload };
    reviewStorage.insert(review.id, review);
    return Result.Ok(review);
}

$update;
export function deleteReview(id: string): Result<ReviewRecord, string> {
    return match(reviewStorage.remove(id), {
        Some: (deletedReview) => Result.Ok<ReviewRecord, string>(deletedReview),
        None: () => Result.Err<ReviewRecord, string>(`Review with id=${id} not found`)
    });
}

$query;
export function getReview(id: string): Result<ReviewRecord, string> {
    return match(reviewStorage.get(id), {
        Some: (review) => Result.Ok<ReviewRecord, string>(review),
        None: () => Result.Err<ReviewRecord, string>(`Review with id=${id} not found`)
    });
}

$query;
export function getAllReviews(): Result<Vec<ReviewRecord>, string> {
    return Result.Ok(reviewStorage.values());
}

$update;
export function createUser(payload: UserPayload): Result<User, string> {
    const id = uuidv4();
    const user: User = { id, ...payload, createdAt: ic.time(), updatedAt: Opt.None };
    userStorage.insert(id, user);
    return Result.Ok(user);
}

$update;
export function deleteUser(id: string): Result<User, string> {
    return match(userStorage.remove(id), {
        Some: (deletedUser) => Result.Ok<User, string>(deletedUser),
        None: () => Result.Err<User, string>(`User with id=${id} not found`)
    });
}

$query;
export function getUser(id: string): Result<User, string> {
    return match(userStorage.get(id), {
        Some: (user) => Result.Ok<User, string>(user),
        None: () => Result.Err<User, string>(`User with id=${id} not found`)
    });
}

$query;
export function getAllUsers(): Result<Vec<User>, string> {
    return Result.Ok(userStorage.values());
}


$update;
export function updateUser(id: string, payload: UserPayload): Result<User, string> {
    return match(userStorage.get(id), {
        Some: (user) => {
            const updatedUser: User = { ...user, ...payload, updatedAt: Opt.Some(ic.time()) };
            userStorage.insert(user.id, updatedUser);
            return Result.Ok<User, string>(updatedUser);
        },
        None: () => Result.Err<User, string>(`User with id=${id} not found`)
    });
}

$query;
export function searchUsersByUsername(username: string): Result<Vec<User>, string> {
    const users = userStorage.values().filter(user => user.username.toLowerCase().includes(username.toLowerCase()));
    return Result.Ok(users);
}

$query;
export function searchUsersByEmail(email: string): Result<Vec<User>, string> {
    const users = userStorage.values().filter(user => user.email.toLowerCase().includes(email.toLowerCase()));
    return Result.Ok(users);
}


globalThis.crypto = {
  getRandomValues: () => {
    let array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};
