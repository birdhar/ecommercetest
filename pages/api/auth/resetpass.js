import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import Cryptr from "cryptr";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const { email, signature, password, password_confirmation } = req.body;
  await mongooseConnect();
  const cryptr = new Cryptr(process.env.NEXTAUTH_SECRET);
  const decryptedEmail = cryptr.decrypt(email);
  const user = await User.findOne({
    email: decryptedEmail,
    password_reset_token: signature,
  });
  if (!user) {
    return res
      .status(400)
      .json({ message: "Incorrect reset request! Please try again" });
  }

  user.password = await bcrypt.hash(password, 10);
  user.password_reset_token = null;
  await user.save();
  return res.json("Password changed successfully.");
}
