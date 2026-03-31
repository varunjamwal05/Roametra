import * as authService from '../services/auth.service.js';

export const register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.registerUser(req.body);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ success: true, user, accessToken });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.loginUser(req.body);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ success: true, user, accessToken });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });
    const { accessToken } = await authService.refreshAccessToken(token);
    res.json({ success: true, accessToken });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user._id);
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

export const getMe = (req, res) => {
  res.json({ success: true, user: req.user });
};
