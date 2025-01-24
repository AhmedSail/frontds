import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import Context from "../context";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const loadingCart = new Array(4).fill(null);

  const fetchData = async () => {
    try {
      const token = Cookies.get("token"); // الحصول على التوكن من الكوكيز
      if (!token) {
        throw new Error("Token is missing");
      }
      const response = await axios({
        url: SummaryApi.addToCartProductView.url,
        method: SummaryApi.addToCartProductView.method,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = response.data;
      console.log("Response Data:", responseData); // تسجيل البيانات المستلمة

      if (responseData.success) {
        setData(responseData.data);
      } else {
        console.error("Error in response data:", responseData.message);
        // Handle the specific error message
        if (responseData.message.includes("Cannot populate path `productId`")) {
          alert("Error: Cannot populate product data. Please contact support.");
        }
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const handleLoading = async () => {
    await fetchData();
  };
  const handledelete = async () => {
    toast.success("Product Deleted");
  };
  const handlepayment = async () => {
    toast.success("Payment success");
    deleteAllCartProduct();
    navigate("/");
  };

  useEffect(() => {
    setLoading(true);
    handleLoading();
    setLoading(false);
  }, []);

  const increaseQty = async (id, qty) => {
    try {
      const token = Cookies.get("token"); // الحصول على التوكن من الكوكيز
      if (!token) {
        throw new Error("Token is missing");
      }

      const response = await axios({
        url: SummaryApi.updateCartProduct.url,
        method: SummaryApi.updateCartProduct.method,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`, // تضمين التوكن في الهيدر
        },
        data: {
          _id: id,
          quantity: qty + 1,
        },
      });

      const responseData = response.data;

      if (responseData.success) {
        fetchData();
      }
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  const decraseQty = async (id, qty) => {
    if (qty >= 2) {
      try {
        const token = Cookies.get("token"); // الحصول على التوكن من الكوكيز
        if (!token) {
          throw new Error("Token is missing");
        }

        const response = await axios({
          url: SummaryApi.updateCartProduct.url,
          method: SummaryApi.updateCartProduct.method,
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`, // تضمين التوكن في الهيدر
          },
          data: {
            _id: id,
            quantity: qty - 1,
          },
        });

        const responseData = response.data;

        if (responseData.success) {
          fetchData();
        }
      } catch (error) {
        console.error("Error decreasing quantity:", error);
      }
    }
  };

  const deleteCartProduct = async (id) => {
    try {
      const token = Cookies.get("token"); // الحصول على التوكن من الكوكيز
      if (!token) {
        throw new Error("Token is missing");
      }

      const response = await axios({
        url: SummaryApi.deleteCartProduct.url,
        method: SummaryApi.deleteCartProduct.method,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`, // تضمين التوكن في الهيدر
        },
        data: {
          _id: id,
        },
      });

      const responseData = response.data;

      if (responseData.success) {
        fetchData();
        context.fetchUserAddToCart();
      }
    } catch (error) {
      console.error("Error deleting cart product:", error);
    }
  };
  const deleteAllCartProduct = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Token is missing");
      }

      const response = await axios({
        url: SummaryApi.deleteAllCartProduct.url,
        method: SummaryApi.deleteAllCartProduct.method,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = response.data;

      if (responseData.success) {
        console.log("All products deleted successfully from the cart");
        fetchData();
        context.fetchUserAddToCart();
      } else {
        console.error("Failed to delete products:", responseData.message);
      }
    } catch (error) {
      if (error.response) {
        // Request made and server responded with a status code outside the range of 2xx
        console.error("Server error:", error.response.data);
      } else if (error.request) {
        // Request made but no response was received
        console.error(
          "Network error or server did not respond:",
          error.request
        );
      } else {
        // Something happened in setting up the request
        console.error("Error setting up the request:", error.message);
      }
    }
  };

  const totalQty = data.reduce(
    (previousValue, currentValue) => previousValue + currentValue.quantity,
    0
  );
  const totalPrice = data.reduce(
    (preve, curr) =>
      preve + curr.quantity * (curr?.productId?.sellingPrice || 0),
    0
  );

  return (
    <div className="container mx-auto">
      <div className="text-center text-lg my-3">
        {data.length === 0 && !loading && (
          <p className="bg-white py-5 rounded shadow-md text-gray-700">
            No Data Available
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:justify-between p-4">
        {/***view product */}
        <div className="w-full max-w-3xl">
          {loading
            ? loadingCart?.map((el, index) => {
                return (
                  <div
                    key={el + "Add To Cart Loading" + index}
                    className="w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded"
                  ></div>
                );
              })
            : data.map((product, index) => {
                if (!product?.productId) {
                  return null; // Skip products without productId
                }
                return (
                  <div
                    key={product?._id + "Add To Cart Loading"}
                    className="w-full bg-white h-32 my-2 border border-slate-300  rounded grid grid-cols-[128px,1fr]"
                  >
                    <div className="w-32 h-32 bg-slate-200">
                      <img
                        src={product?.productId?.productImage?.[0] || ""}
                        className="w-full h-full object-scale-down mix-blend-multiply"
                        alt="product"
                      />
                    </div>
                    <div className="px-4 py-2 relative">
                      {/**delete product */}
                      <div
                        className="absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer"
                        onClick={() => deleteCartProduct(product?._id)}
                      >
                        <MdDelete onClick={handledelete} />
                      </div>

                      <h2 className="text-lg lg:text-xl text-ellipsis line-clamp-1">
                        {product?.productId?.productName || "N/A"}
                      </h2>
                      <p className="capitalize text-slate-500">
                        {product?.productId?.category || "N/A"}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-red-600 font-medium text-lg">
                          {displayINRCurrency(
                            product?.productId?.sellingPrice || 0
                          )}
                        </p>
                        <p className="text-slate-600 font-semibold text-lg">
                          {displayINRCurrency(
                            (product?.productId?.sellingPrice || 0) *
                              product?.quantity
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <button
                          className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded "
                          onClick={() =>
                            decraseQty(product?._id, product?.quantity)
                          }
                        >
                          -
                        </button>
                        <span>{product?.quantity}</span>
                        <button
                          className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded "
                          onClick={() =>
                            increaseQty(product?._id, product?.quantity)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {/***summary  */}
        <div className="mt-5 lg:mt-0 w-full max-w-sm">
          {loading ? (
            <div className="h-36 bg-slate-200 border border-slate-300 animate-pulse"></div>
          ) : (
            <div className="h-36 bg-white">
              <h2 className="text-white bg-red-600 px-4 py-1">Summary</h2>
              <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                <p>Quantity</p>
                <p>{totalQty}</p>
              </div>

              <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                <p>Total Price</p>
                <p>{displayINRCurrency(totalPrice)}</p>
              </div>

              <button
                className="bg-blue-600 p-2 text-white w-full mt-2"
                onClick={handlepayment}
              >
                Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
