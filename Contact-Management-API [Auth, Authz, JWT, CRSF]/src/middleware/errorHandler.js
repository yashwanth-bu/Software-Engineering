import databaseErrors from "../utils/databaseErrors.js";
import sendResponse from "../utils/sendResponse.js";

function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  } else {
    console.error(err.message);
  }

  const controllerStatus =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : null;

  const { statusCode: dbStatus, errorMessage: dbMessage } =
    databaseErrors(err);
    
  const finalStatus = controllerStatus ?? dbStatus ?? 500;
  const finalMessage =
    controllerStatus ? err.message : dbMessage ?? err.message ?? "Internal Server Error";

  sendResponse(res, finalStatus, { message: finalMessage });
}

export default errorHandler;