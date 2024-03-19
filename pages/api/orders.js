import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authproviders } from "./auth/[...nextauth]";
import { User } from "@/models/User";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getServerSession(req, res, authproviders);
  await mongooseConnect();
  const queryParams = req.query;

  if (method === "GET") {
    if (req?.query?.id) {
      res.json(await Order.findOne({ _id: req?.query?.id }));
    } else if (req?.query?.userId) {
      const user = await User.findOne({ email: session?.user?.email });
      res.json(await Order.find({ userId: user?._id }));
    } else if (req.query?.page && req.query?.page) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const orders = await Order.find().skip(skip).limit(limit).exec();
      res.json(orders);
    } else {
      res.json(await Order.find());
    }
  }
  if (method === "DELETE") {
    if (req?.query?.id) {
      await Order.deleteOne({ _id: req?.query?.id });
    }
    res.json(true);
  }
  if (method === "PATCH") {
    const { payment } = req.body;
    try {
      const update = { $set: { payment } };

      const options = { new: true, upsert: true };

      const updatedOrder = await Order.findByIdAndUpdate(
        req?.query?.id,
        update,
        options
      );

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
