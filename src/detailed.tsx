import React, { useState, useEffect } from "react";
import { productData } from "./interfaces";

export default function App(data: { data: productData }) {
  const [detailed, setDetailed] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  let product = data.data;
  let url =
    "https://raw.githubusercontent.com/LukePrior/open-banking-tracker/main/brands/product/";
  url += product.brandId;
  url += "/";
  url += product.productId;
  url += ".json";

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();

      setDetailed(result);
    } catch (err) {
      setErr("Error loading");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleClick();
  }, []);

  return (
    <div>
      {err && <h2>{err}</h2>}
      {isLoading && <h2>Loading...</h2>}
      {detailed && <h2>Loaded</h2>}
    </div>
  );
}
