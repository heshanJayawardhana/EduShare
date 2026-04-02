/**
 * Express middleware factory: validates req.body with a Zod schema.
 * On success, replaces req.body with parsed (coerced) data.
 */
const validateBody =
  (schema) =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: result.error.flatten(),
      });
    }
    req.body = result.data;
    return next();
  };

module.exports = {
  validateBody,
};

