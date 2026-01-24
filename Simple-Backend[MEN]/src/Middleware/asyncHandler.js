/**
 * asyncHandler
 * ------------------------
 * A higher-order function (wrapper) for handling asynchronous route/controller functions in Express.
 * 
 * What it does:
 * - Takes an async function `fn` (like an async route handler).
 * - Returns a new function that executes `fn` and automatically catches any rejected promises.
 * - If `fn` throws an error or a promise is rejected, the error is passed to `next()`.
 * 
 * Why it’s used:
 * - In Express, if an async function throws an error or a promise is rejected,
 *   it will NOT automatically reach the global error handler.
 * - Without this wrapper, you would have to wrap every async route in try/catch.
 * - Using `asyncHandler` avoids repetitive try/catch blocks and ensures all async errors
 *   are properly passed to your global error middleware (`errorHandler`).
 *
 * Example usage:
 * 
 * import asyncHandler from "./middleware/asyncHandler.js";
 * 
 * app.get("/notes/:id", asyncHandler(async (req, res, next) => {
 *     const note = await Note.findById(req.params.id);
 *     if (!note) throw new Error("Note not found");
 *     res.json(note);
 * }));
 */


function asyncHandler(fn) {
  return function (req, res, next) {
    Promise
      .resolve(fn(req, res, next))
      .catch(next);
  }
}

export default asyncHandler;
// Working process : 
// When the app starts, asyncHandler wraps the async controller and returns a new function.
//   Express later calls that returned function (getAllNotes) when a request comes in;
// it executes the async logic inside a Promise, and if the Promise resolves the request completes,
//   and if it rejects the error is caught and passed to the error-handling middleware.


// the way this async handler works [another way to write the code]

// const fn = async (req, res) => {
//   const notes = await Note.find({});
//   res.json(notes);
// };

// export const getAllNotes = (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };

