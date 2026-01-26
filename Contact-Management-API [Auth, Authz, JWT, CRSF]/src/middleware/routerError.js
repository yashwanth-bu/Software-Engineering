import sendResponse from "../utils/sendResponse.js";

function routerError(req, res) {
    sendResponse(res, 404, {message: `The route '${req.originalUrl}' does not exist on this server.`})
}

export default routerError;