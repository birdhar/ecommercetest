import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  const queryParams = req.query;

  if (method === "GET") {
    if (req?.query?.id) {
      res.json(await Product.findOne({ _id: req?.query?.id }));
    } else if (req.query?.page && req.query?.page) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const products = await Product.find().skip(skip).limit(limit).exec();
      res.json(products);
    } else {
      res.json(await Product.find());
    }
  }
}
