import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import cryptoRandomString from "crypto-random-string";
import Cryptr from "cryptr";
import { render } from "@react-email/render";
import ResetPass from "@/components/email/ResetPass";
import { sendMail } from "@/config/mail";

export default async function handler(req, res) {
  const { email } = req.body;
  await mongooseConnect();

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "No user found" });
  }

  const randomString = cryptoRandomString({ length: 64, type: "alphanumeric" });

  user.password_reset_token = randomString;
  await user.save();

  const cryptr = new Cryptr(process.env.NEXTAUTH_SECRET);
  const encryptedEmail = cryptr.encrypt(email);

  const url = `${process.env.APP_URL}/password/reset/${encryptedEmail}?signature=${randomString}`;

  try {
    const html = render(<ResetPass name={user.name} url={url} />);
    await sendMail(email, "Reset Password", html);
    return res.json("Email sent successfully.");
  } catch (error) {
    throw new Error("Something went wrong");
  }
}
