/**
 * routerError
 * ------------------------
 * A middleware function for handling requests to unknown routes in Express.
 * 
 * What it does:
 * - This function runs when a request does not match any defined route.
 * - It sends a HTTP 404 status code (Not Found) along with a JSON response.
 * - The response includes:
 *     - `success: false` → indicates the request was unsuccessful
 *     - `message` → a friendly message showing the route that was attempted (`req.originalUrl`)
 * 
 * Why it’s used:
 * - Without this middleware, unknown routes would return the default Express HTML response
 *   ("Cannot GET /unknown") which is not API-friendly.
 * - Provides a consistent JSON response format for frontend apps or API clients.
 * - Helps with debugging and improves user experience by clearly indicating
 *   which route is invalid.
 * 
 * Example usage:
 * 
 * import routerError from "./middleware/routerError.js";
 * 
 * // Mount after all routes
 * app.use(routerError);
 */


function routerError(req, res) {
    res.status(404).json({
        success: false,
        message: `The route '${req.originalUrl}' does not exist on this server.`
    });
}

export default routerError;

