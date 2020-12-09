import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';
import AppError from './AppError';

interface ValidationErrors {
  [key: string]: string[];
}

const AppHandleError = (
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'Error',
      message: error.message,
    });
  }

  if (error instanceof ValidationError) {
    const errors: ValidationErrors = {};

    error.inner.forEach(err => {
      errors[String(err.path)] = err.errors;
    });

    return response.status(400).json({
      message: 'Validation fails',
      errors,
    });
  }

  console.log(error);

  return response.status(500).json({
    status: 'Error',
    message: 'Internal Server Error',
  });
};

export default AppHandleError;
