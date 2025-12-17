import { useApi } from "@/lib/api";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useProducts = () => {
  const api = useApi();

  const result = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const { data } = await api.get<Product[]>("/products");

        return data;
      } catch (error) {
        console.error("Failed to fetch products", error);
        throw new Error("Failed to fetch products");
      }
    },
  });

  return result;
};

export default useProducts;
