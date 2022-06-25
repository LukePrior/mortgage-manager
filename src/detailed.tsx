import React, { useState, useEffect } from "react";
import { productData } from "./interfaces";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

export default function App(data: { data: productData }) {
  const [detailed, setDetailed] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  let product = data.data;
  let url =
    "https://raw.githubusercontent.com/LukePrior/open-banking-tracker/main/brands/product/";
  url += product.brandId;
  url += "/";
  url += product.productId;
  url += ".json";

  const Panel = () => (
    <div>
      <Box sx={{ m: 2 }}>
        <h3>Features</h3>
        {detailed.data.hasOwnProperty("features") && (
          <Stack direction="row" spacing={1}>
            {detailed.data.features.map((features: any) => {
              return <Chip label={features.featureType} variant="outlined" />;
            })}
          </Stack>
        )}
        <h3>Eligibility</h3>
        {detailed.data.hasOwnProperty("eligibility") && (
          <Stack direction="row" spacing={1}>
            {detailed.data.eligibility.map((eligibility: any) => {
              return (
                <Chip label={eligibility.eligibilityType} variant="outlined" />
              );
            })}
          </Stack>
        )}
        <h3>Fees</h3>
        {detailed.data.hasOwnProperty("fees") && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {detailed.data.fees.map((fee: any) => {
              return <Chip label={fee.feeType} variant="outlined" />;
            })}
          </Stack>
        )}
        <br></br>
      </Box>
    </div>
  );

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
      {detailed && <Panel></Panel>}
    </div>
  );
}
