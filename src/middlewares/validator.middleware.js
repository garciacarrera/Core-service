export const validatorDTO = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        ok: false,
        message: error.details[0].message
      });
    }
    
    next();
  };
};