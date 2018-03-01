const auth = require('../middleware/auth');
const _ = require('lodash');
const { User, validateUser } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', validate(validateUser), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = await User.create(req.body);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token)
     .send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;