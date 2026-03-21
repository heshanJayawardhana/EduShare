const { body, validationResult } = require('express-validator');

/**
 * Validation rules for user registration
 */
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .escape(),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['student', 'admin'])
    .withMessage('Role must be either student or admin')
];

/**
 * Validation rules for user login
 */
const validateUserLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Validation rules for resource creation
 */
const validateResourceCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters')
    .escape(),
  
  body('description')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Description must be between 1 and 2000 characters')
    .escape(),
  
  body('fileUrl')
    .trim()
    .isURL()
    .withMessage('Please provide a valid file URL'),
  
  body('fileName')
    .trim()
    .notEmpty()
    .withMessage('File name is required'),
  
  body('fileSize')
    .isNumeric()
    .withMessage('File size must be a number')
    .isFloat({ min: 0 })
    .withMessage('File size must be positive'),
  
  body('fileType')
    .isIn(['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'zip'])
    .withMessage('Invalid file type'),
  
  body('category')
    .isIn([
      'Mathematics', 'Physics', 'Chemistry', 'Biology',
      'Computer Science', 'Engineering', 'Medicine',
      'Business', 'Economics', 'Arts', 'History',
      'Literature', 'Psychology', 'Sociology', 'Other'
    ])
    .withMessage('Invalid category'),
  
  body('faculty')
    .isIn([
      'Science', 'Engineering', 'Medicine', 'Business',
      'Arts', 'Humanities', 'Social Sciences', 'Other'
    ])
    .withMessage('Invalid faculty'),
  
  body('academicYear')
    .isIn(['2020', '2021', '2022', '2023', '2024', '2025', '2026'])
    .withMessage('Invalid academic year'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag must be at most 30 characters')
    .escape()
];

/**
 * Validation rules for rating creation
 */
const validateRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  
  body('resourceId')
    .isMongoId()
    .withMessage('Invalid resource ID')
];

/**
 * Validation rules for comment creation
 */
const validateComment = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
    .escape(),
  
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  
  body('resourceId')
    .isMongoId()
    .withMessage('Invalid resource ID'),
  
  body('parentCommentId')
    .optional()
    .isMongoId()
    .withMessage('Invalid parent comment ID')
];

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      error: 'Validation Error',
      details: errorMessages
    });
  }
  
  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateResourceCreation,
  validateRating,
  validateComment,
  handleValidationErrors
};
