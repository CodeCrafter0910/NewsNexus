const authenticate = (req, res, next) => {
  const key = req.headers['x-api-key'];

  if (!key) {
    return res.status(401).json({ error: 'You need an API key' });
  }

  if (key !== process.env.API_SECRET_KEY) {
    return res.status(403).json({ error: 'Wrong API key' });
  }

  next();
};

module.exports = authenticate;
