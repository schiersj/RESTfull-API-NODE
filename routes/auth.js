const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');

router.post('/', validate(validateAuth), async (req, res) => {
  let user = await User.findOne({ email: req.body.eamil });
  if (user) return res.status(400).send('Invalid email or password.');

  const validPassord = await bcrypt.compare(req.body.password, user.password);
  if (!validPassord) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  res.send(token);
});

function validateAuth(req) {
  const schema = {
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;