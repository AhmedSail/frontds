import axios from "axios";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const addToCart = async (e, id) => {
  e?.stopPropagation();
  e?.preventDefault();

  try {
    const token = Cookies.get("token"); // الحصول على التوكن من الكوكيز باستخدام js-cookie

    if (!token) {
      throw new Error("Token is missing");
    }

    console.log("Token:", token); // سجل التوكن للتحقق منه
    console.log("Product ID:", id); // سجل معرف المنتج للتحقق منه

    if (!id) {
      throw new Error("Product ID is missing");
    }

    const response = await axios({
      url: SummaryApi.addToCartProduct.url,
      method: SummaryApi.addToCartProduct.method,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`, // إرسال التوكن في الهيدر
      },
      data: {
        productId: id,
      },
      withCredentials: true, // تأكد من إرسال الكوكيز مع الطلبات
    });

    const responseData = response.data;

    if (responseData.success) {
      toast.success(responseData.message);
    } else if (responseData.error) {
      toast.error(responseData.message);
    }

    return responseData;
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast.error(`Failed to add product to cart: ${error.message}`);
  }
};

export default addToCart;
