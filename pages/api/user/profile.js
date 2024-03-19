import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import { authproviders } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handle(req, res) {
  const { method } = req;
  const session = await getServerSession(req, res, authproviders);
  await mongooseConnect();

  if (method === "GET") {
    try {
      const user = await User.findOne({ email: session?.user?.email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //   if (method === "POST") {
  //     const { address } = req.body;
  //     const user = await User.findOne({ email: session?.user?.email });

  //     user.address = address;
  //     await user.save();
  //     res.json(user);

  //     // try {
  //     //   const user = await User.findOne({ email: session?.user?.email });

  //     //   if (!user) {
  //     //     return res.status(404).json({ message: "User not found" });
  //     //   }
  //     //   user.address = address;
  //     //   await user.save();
  //     //   res.status(200).json(user);
  //     // } catch (error) {
  //     //   res.status(500).json({ message: error.message });
  //     // }
  //   }

  //   if (method === "PATCH") {
  //     const { address } = req.body;
  //     try {
  //       const updatedUser = await User.findByIdAndUpdate(
  //         req?.query?.userId,
  //         { address: body.address },
  //         { new: true }
  //       );
  //       res.status(200).json(updatedUser);
  //     } catch (error) {
  //       res.status(500).json({ message: error.message });
  //     }
  //   }
}
