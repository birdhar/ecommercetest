import { initializeCart } from "@/redux/cartSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useCartItems = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector(
    (store) => store.cart
  );

  useEffect(() => {
    // Check if data is available in localStorage
    const { cart } = JSON.parse(localStorage.getItem("store"));
    if (cart) {
      dispatch(initializeCart(cart));
    }
  }, []);

  return { items, totalQuantity, totalAmount };
};
export default useCartItems;
