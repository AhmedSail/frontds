import axios from "axios";
import SummaryApi from "../common";

const fetchCategoryWiseProduct = async (category) => {
  try {
    const response = await axios({
      url: SummaryApi.categoryWiseProduct.url,
      method: SummaryApi.categoryWiseProduct.method,
      headers: {
        "content-type": "application/json",
      },
      data: {
        category: category,
      },
    });

    const dataResponse = response.data;
    return dataResponse;
  } catch (error) {
    console.error("Error fetching category-wise product:", error);
    return { error: "Failed to fetch category-wise product" };
  }
};

export default fetchCategoryWiseProduct;
