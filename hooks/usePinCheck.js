import { pincodes } from "@/constatns/constatnt";

const usePinCheck = (pincode) => {
  const isDeliveryAvailable = pincodes.includes(pincode);

  return isDeliveryAvailable;
};

export { usePinCheck };
