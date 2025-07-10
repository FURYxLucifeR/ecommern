import { Response } from 'express';
import { AuthRequest } from '../types/express';
import User from '../models/User';
import Order from '../models/Order';

export const getProfile = async (req: any, res: Response) => {
  console.log("usserrrrid",req.user.userId)
  try {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const user = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true }).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    console.log("updated",user)
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrderHistory = async (req: any, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const orders = await Order.find({ user: req.user.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTotalExpenses = async (req: any, res: Response) => {
  console.log("req.userrrrr",req.user)
  try {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const orders = await Order.find({ user: req.user.userId });
    const total = orders.reduce((sum, order) => sum + order.total, 0);
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 