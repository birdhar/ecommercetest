import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authproviders } from "./auth/[...nextauth]";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { method } = req;
  const session = await getServerSession(req, res, authproviders);
  const user = await User.findOne({ email: session?.user?.email });
  if (method !== "POST") {
    res.json("Not a post request");
    return;
  }

  const { userAddress, productInfos } = req.body;

  let productInfoArr = [];
  let line_items = [];

  for (const productInfo of productInfos) {
    productInfoArr.push({
      quantity: productInfo?.count,
      price_data: {
        currency: "inr",
        product_data: {
          name: productInfo?.name,
          image: productInfo?.image,
          description: productInfo?.description,
        },
        unit_amount: productInfo?.count * productInfo?.price,
      },
    });
    line_items.push({
      quantity: productInfo?.count,
      price_data: {
        currency: "inr",
        product_data: {
          name: productInfo?.name,
        },
        unit_amount: productInfo?.count * productInfo?.price * 100,
      },
    });
  }

  const orderDoc = await Order.create({
    name: userAddress?.name,
    email: session?.user?.email,
    city: userAddress?.locality,
    postalCode: userAddress?.pincode,
    phone: userAddress?.phone,
    streetAddress: userAddress?.address,
    product_info: productInfoArr,
    userId: user?._id,
    payment: "Pending",
    delivery: "Dispatched",
  });

  const sessionn = await stripe.checkout.sessions.create({
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 30 * 100,
            currency: "inr",
          },
          display_name: "Estimated shipping time",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
    ],
    line_items: line_items,
    mode: "payment",
    customer_email: session?.user?.email,
    success_url:
      process.env.NEXTAUTH_URL +
      `/orderresponse?success=1&orderId=${orderDoc?._id?.toString()}`,
    cancel_url:
      process.env.NEXTAUTH_URL +
      `/orderresponse?fail=1&orderId=${orderDoc?._id?.toString()}`,
    metadata: { orderId: orderDoc?._id?.toString() },
  });

  res.json({ url: sessionn.url });

  // res.json(productInfoArr);
}
