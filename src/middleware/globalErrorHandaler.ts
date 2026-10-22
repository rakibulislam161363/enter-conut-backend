import { type NextFunction, type Request, type Response } from "express";
import httpStatus from "http-status";
import { isStructuredError } from "@prisma/orm-postgres/utils/structured-error";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Error : ", err);

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let errorMessage = err.message || "Internal Server Error";
  let errorName = err.name || "Internal Server Error";

  if (isStructuredError(err)) {
    errorName = err.code;
    if (err.code === "ORM.COLUMN_UNKNOWN" || err.code === "ORM.ARGUMENT_INVALID") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "You have provided incorrect field types, invalid parameters, or missing fields.";
    } 

    else if (err.code === "DRIVER.CONNECTION_FAILED" || err.code === "DRIVER.NOT_CONNECTED") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Can't reach the database server or connection details are invalid.";
    } 
 
    else if (err.code === "ORM.MUTATION_ROW_MISSING" || err.code === "ORM.ROW_IDENTITY_MISSING") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "An operation failed because a required parent or targeting record was not found.";
    } 
  
    else if (err.code === "MIGRATION.EXECUTION_FAILED" || err.code === "CLI.UNEXPECTED") {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = "An unexpected error occurred during database query execution.";
    }
  } 
 
  else if (err.code) {
 
    if (err.code === "23505") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Duplicate Key Error";
    } 

    else if (err.code === "23503") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Foreign key constraint failed";
    }
  }


  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    name: errorName,
    message: errorMessage,
    error: err.stack,
  });
};
