const validate = (schema) => (req, res, next) => {
  try {
    const validData = schema.parse(req.body);

    req.body = validData;

    next();
  } catch (err) {
    const errors = err.errors.map((error) => ({
      field: error.path.join("."),
      message: error.message,
    }));

    return res.status(400).json({
      error: "Erro de validação",
      details: errors,
    });
  }
};

module.exports = validate;
