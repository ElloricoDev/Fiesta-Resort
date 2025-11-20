// Dummy Data Seed Script for Testing
// This file initializes localStorage with test data

(function () {
  "use strict";

  // Check if dummy data is already initialized
  if (localStorage.getItem("dummyDataInitialized") === "true") {
    return; // Already initialized
  }

  console.log("Initializing dummy data for testing...");

  // Initialize dummy users
  const dummyUsers = [
    {
      email: "admin@fiesta.com",
      password: "admin123",
      name: "Admin User",
      role: "admin",
    },
    {
      email: "user@fiesta.com",
      password: "user123",
      name: "John Doe",
      role: "user",
    },
  ];
  localStorage.setItem("dummyUsers", JSON.stringify(dummyUsers));

  // Initialize admin profile
  const adminProfile = {
    fullName: "Admin User",
    email: "admin@fiesta.com",
    phoneNumber: "09123456789",
    countryCode: "+63",
    address: "Fiesta Resort, Surigao City, Philippines",
  };
  localStorage.setItem("adminProfile", JSON.stringify(adminProfile));

  // Initialize user profile
  const userProfile = {
    firstName: "John",
    lastName: "Doe",
    email: "user@fiesta.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-01-15",
    address: "123 Main Street",
    city: "New York",
    country: "United States",
  };
  localStorage.setItem("userProfile", JSON.stringify(userProfile));

  // Initialize dummy bookings
  const dummyBookings = [
    {
      id: "BK001",
      hotel: "Blue Origin Farms",
      room: {
        title: "Single Room",
        type: "single",
        price: 200,
      },
      checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      checkOut: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      guests: 2,
      days: 2,
      totalPrice: "400",
      status: "upcoming",
      bookingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "BK002",
      hotel: "Ocean Land",
      room: {
        title: "Double Room",
        type: "double",
        price: 350,
      },
      checkIn: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      checkOut: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      guests: 2,
      days: 2,
      totalPrice: "700",
      status: "completed",
      bookingDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "BK003",
      hotel: "Stark House",
      room: {
        title: "Deluxe Room",
        type: "deluxe",
        price: 500,
      },
      checkIn: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      checkOut: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(),
      guests: 4,
      days: 3,
      totalPrice: "1500",
      status: "confirmed",
      bookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  localStorage.setItem("userBookings", JSON.stringify(dummyBookings));

  // Initialize user preferences
  const userPreferences = {
    emailNotifications: true,
    promotionalEmails: true,
    bookingReminders: true,
    currency: "USD",
    language: "en",
  };
  localStorage.setItem("userPreferences", JSON.stringify(userPreferences));

  // Initialize admin dashboard data
  const adminDashboardData = {
    totalGuests: 1250,
    totalReservations: 342,
    totalRooms: 45,
    totalRevenue: 125000,
    recentReservations: [
      {
        id: "RES001",
        guestName: "John Doe",
        room: "Single Room",
        checkIn: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        checkOut: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: "confirmed",
      },
      {
        id: "RES002",
        guestName: "Jane Smith",
        room: "Double Room",
        checkIn: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
      },
    ],
  };
  localStorage.setItem("adminDashboardData", JSON.stringify(adminDashboardData));

  // Initialize admin guests data
  const adminGuestsData = [
    {
      id: "G001",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      totalBookings: 3,
      lastVisit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    },
    {
      id: "G002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 234-5678",
      totalBookings: 5,
      lastVisit: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    },
    {
      id: "G003",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      phone: "+1 (555) 345-6789",
      totalBookings: 1,
      lastVisit: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: "inactive",
    },
  ];
  localStorage.setItem("adminGuestsData", JSON.stringify(adminGuestsData));

  // Initialize admin reservations data
  const adminReservationsData = [
    {
      id: "RES001",
      guestName: "John Doe",
      email: "john.doe@example.com",
      room: "Single Room",
      hotel: "Blue Origin Farms",
      checkIn: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      checkOut: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      guests: 2,
      totalPrice: "400",
      status: "confirmed",
      bookingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "RES002",
      guestName: "Jane Smith",
      email: "jane.smith@example.com",
      room: "Double Room",
      hotel: "Ocean Land",
      checkIn: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      guests: 2,
      totalPrice: "700",
      status: "pending",
      bookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "RES003",
      guestName: "Bob Johnson",
      email: "bob.johnson@example.com",
      room: "Deluxe Room",
      hotel: "Stark House",
      checkIn: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      checkOut: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      guests: 4,
      totalPrice: "1500",
      status: "completed",
      bookingDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  localStorage.setItem("adminReservationsData", JSON.stringify(adminReservationsData));

  // Initialize admin rooms data
  const adminRoomsData = [
    {
      id: "R001",
      name: "Single Room",
      type: "single",
      hotel: "Blue Origin Farms",
      price: 200,
      capacity: 2,
      status: "available",
      amenities: ["WiFi", "TV", "AC"],
    },
    {
      id: "R002",
      name: "Double Room",
      type: "double",
      hotel: "Ocean Land",
      price: 350,
      capacity: 4,
      status: "available",
      amenities: ["WiFi", "TV", "AC", "Balcony"],
    },
    {
      id: "R003",
      name: "Deluxe Room",
      type: "deluxe",
      hotel: "Stark House",
      price: 500,
      capacity: 4,
      status: "occupied",
      amenities: ["WiFi", "TV", "AC", "Balcony", "Mini Bar"],
    },
    {
      id: "R004",
      name: "Presidential Suite",
      type: "suite",
      hotel: "Vinna Vill",
      price: 850,
      capacity: 6,
      status: "available",
      amenities: ["WiFi", "TV", "AC", "Balcony", "Mini Bar", "Jacuzzi"],
    },
  ];
  localStorage.setItem("adminRoomsData", JSON.stringify(adminRoomsData));

  // Initialize admin users data
  const adminUsersData = [
    {
      id: "U001",
      name: "Admin User",
      email: "admin@fiesta.com",
      role: "admin",
      status: "active",
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "U002",
      name: "John Doe",
      email: "user@fiesta.com",
      role: "user",
      status: "active",
      lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "U003",
      name: "Jane Smith",
      email: "jane@fiesta.com",
      role: "user",
      status: "active",
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  localStorage.setItem("adminUsersData", JSON.stringify(adminUsersData));

  // Mark as initialized
  localStorage.setItem("dummyDataInitialized", "true");

  console.log("Dummy data initialized successfully!");
  console.log("Test Users:");
  console.log("  Admin: admin@fiesta.com / admin123");
  console.log("  User: user@fiesta.com / user123");
})();

