function databaseErrors(err) {
  let statusCode = null;
  let errorMessage = null;

  switch (err.name) {
    case "ValidationError":
      errorMessage = Object.values(err.errors).map(e => e.message).join(", ");
      statusCode = 422;
      break;

    case "CastError":
      errorMessage = `Invalid ${err.path}`;
      statusCode = 400;
      break;

    case "DocumentNotFoundError":
      errorMessage = "Resource not found";
      statusCode = 404;
      break;

    case "MongooseError":
      if (err.message.toLowerCase().includes("already")) {
        errorMessage = err.message;
        statusCode = 409;
      }
      break;

    case "MongoServerError":
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        errorMessage = `${field} already exists`;
        statusCode = 409;
      } else if (err.code === 50) {
        errorMessage = "Database operation timed out";
        statusCode = 503;
      } else {
        errorMessage = "Database error";
        statusCode = 500;
      }
      break;

    default:
      if (err.kind === "ObjectId") {
        errorMessage = "Invalid ID format";
        statusCode = 400;
      }
      break;
  }

  return { statusCode, errorMessage };
}

export default databaseErrors;
