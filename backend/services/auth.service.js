import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const SALT_ROUNDS = 12;

const generateAccessToken = (user) =>
  jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

const generateRefreshToken = (user) =>
  jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, password: hashed });
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();
  return { user: { _id: user._id, name: user.name, email: user.email }, accessToken, refreshToken };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();
  return { user: { _id: user._id, name: user.name, email: user.email }, accessToken, refreshToken };
};

export const refreshAccessToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== token) {
      const err = new Error('Invalid refresh token');
      err.status = 401;
      throw err;
    }
    const newAccessToken = generateAccessToken(user);
    return { accessToken: newAccessToken };
  } catch {
    const err = new Error('Invalid refresh token');
    err.status = 401;
    throw err;
  }
};

export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};
