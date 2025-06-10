import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const updateUser = async (req, res, next) => {
  try {
    if (!req.user || req.user.id !== req.params.id) {
      return next(errorHandler(401, 'You can only update your own account'));
    }

    const updateFields = {
      username: req.body.username,
      email: req.body.email,
    };

    if (req.body.password) {
      updateFields.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.avatar) {
      updateFields.avatar = req.body.avatar;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, 'User not found'));
    }

    const { password, ...userData } = updatedUser._doc;

    res.status(200).json({ success: true, user: userData });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete only your own account'));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_toknen');
    res.status(200).json({ success: true, message: 'User has been deleted' });
  } catch (error) {
    next(error);
  }
};
