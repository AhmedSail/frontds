import logo from "./logo.svg";
import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import SummaryApi from "./common";
import Context from "./context";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./store/userSlice";
import axios from "axios";

function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);
  const [isLogin, setIsLogin] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(SummaryApi.current_user.url, {
        withCredentials: true,
      });

      if (response.data.success) {
        dispatch(setUserDetails(response.data.data));
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const fetchUserAddToCart = async () => {
    try {
      const response = await axios.get(SummaryApi.addToCartProductCount.url, {
        withCredentials: true,
      });

      setCartProductCount(response.data?.data?.count);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    // Fetch user details
    fetchUserDetails();
    // Fetch user cart product count
    fetchUserAddToCart();
  }, [fetchUserDetails]);

  return (
    <>
      <Context.Provider
        value={{
          fetchUserDetails, // user detail fetch
          cartProductCount, // current user add to cart product count,
          fetchUserAddToCart,
          isLogin,
          setIsLogin,
        }}
      >
        <ToastContainer position="top-center" />
        <Header />
        <main className="min-h-[calc(100vh-120px)] pt-16">
          <Outlet />
        </main>
        <Footer />
      </Context.Provider>
    </>
  );
}

export default App;
