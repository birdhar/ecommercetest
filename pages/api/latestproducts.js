import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
  await mongooseConnect();
  const products = await Product.find().sort({ _id: -1 }).limit(10).exec();

  res.json(products);
}
