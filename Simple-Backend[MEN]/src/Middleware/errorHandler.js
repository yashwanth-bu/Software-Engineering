function errorHandler(err, req, res, next) {

  console.error(err)

  let statusCode = err.status || 500
  let message = err.message || "Internal Server Error"

  /* Mongoose Validation Error - required field, 
   * wrong data types, schema validation failures */

  if (err.name === "ValidationError") {
    statusCode = 422
    message = Object.values(err.errors).map(e => e.message).join(", ");
  }

  /* CastError (Invalid MongoDB ObjectId)
   * - e.g. /notes/123 */
   
  if (err.name === "CastError") {
    statusCode = 400
    message = `Invalid ${err.path}`
  }

  res.status(statusCode).json({
    success: false,
    message
  })
}

export default errorHandler