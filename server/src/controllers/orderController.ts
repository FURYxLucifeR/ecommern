import { Response } from 'express';
import { AuthRequest } from '../types/express';
import Order from '../models/Order';
import Product from '../models/Product';
export const createOrder = async (req: any, res: Response) => {
  console.log("req.user", req.user);
  try {
    const { products, address, shipping } = req.body;
    console.log("products", req.body);
    console.log("proxxxxxxxducts", products);
    
    let total = 0; 
    const orderProducts = []; // Array to hold the formatted products

    for (const item of products) {
      console.log("item", item);
      const product = await Product.findById(item.product);
      console.log("proccccc", product);
      
      if (!product || product.isDeleted) {
        res.status(400).json({ message: 'Invalid product in order' });
        return;
      }
      if (product.stock < item.quantity) {
        res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        return; 
      }

      // Calculate total and format the product for the order
      total += item.quantity * product.price; 
      orderProducts.push({
        product: product._id, // Use the product ID
        quantity: item.quantity,
        price: product.price, // Include the price
      });
    }

    if (!req.user || !req.user.userId) {  
      res.status(401).json({ message: 'Unauthorized' });
      return;
    } 

    const order = new Order({ 
      user: req.user.userId,
      products: orderProducts,
      address,            // ✅ User's delivery address
      shipping,           // ✅ Shipping method (e.g., 'Standard', 'Express')
      status: 'Pending',
      total 
    });

    console.log("order", order);
    await order.save();
    res.status(201).json(order);
    console.log("completd"); 
  } catch (err) {
    console.log("errorrr", err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrderHistory = async (req: any, res: any): Promise<void> => {
  console.log("userrr",req.user)
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

export const cancelOrder = async (req: any, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    if (order.status !== 'Pending') {
      res.status(400).json({ message: 'Order cannot be canceled' });
      return;
    }
    order.status = 'Canceled';
    await order.save();
    res.json({ message: 'Order canceled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 