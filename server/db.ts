// This file is here for backward compatibility but we're using Firebase
// All database operations are now handled through Firebase Realtime Database
console.log("PostgreSQL connection is disabled - using Firebase instead");

// Export empty objects to avoid breaking imports
export const pool = {};
export const db = {};
