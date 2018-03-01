const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

describe('user.generateAuthToken', () => {
  it('should return a valid JWT', () => {
    const payload = { 
      _id: new mongoose.Types.ObjectId().toHexString(), 
      isAdmin: true 
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    expect(decoded).toMatchObject(payload);
  });
});

describe('user.create', () => {
  it('should return a user with hashed password', async () => {
    const payload = {
      name: '12345',
      email: 'me@email.com',
      password: '12345'
    };
    const user = await User.create(payload);
    const validPassord = await bcrypt.compare(payload.password, user.password);
    expect(validPassord).toBe(true);
  });
});