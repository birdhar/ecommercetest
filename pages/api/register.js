import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const { method } = req;

  await mongooseConnect();

  if (method === "POST") {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOne({ email }).select("_id");

    if (user) {
      res.json("user already exists");
    } else {
      User.create({ name, email, password: hashedPassword, role: "User" });
      res.json("user created");
    }
  }
}
