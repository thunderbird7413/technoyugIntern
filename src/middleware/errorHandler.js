module.exports = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  // send friendly message
  return res.status(500).json({ message: 'Internal server error' });
};
