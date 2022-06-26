import React, { useState, useEffect } from "react";
import { productData } from "./interfaces";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function App(data: { data: productData }) {
  const [detailed, setDetailed] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <div>{children}</div>
          </Box>
        )}
      </div>
    );
  }

  let product = data.data;
  let url =
    "https://raw.githubusercontent.com/LukePrior/open-banking-tracker/main/brands/product/";
  url += product.brandId;
  url += "/";
  url += product.productId;
  url += ".json";

  function printData(data: any) {
    console.log(data);
  }

  const Panel = () => (
    <div>
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
          >
            <Tab label="Details" {...a11yProps(0)} sx={{ width: 150 }} />
            <Tab label="Features" {...a11yProps(1)} sx={{ width: 150 }} />
            <Tab label="Requirements" {...a11yProps(2)} sx={{ width: 150 }} />
            <Tab label="Rates" {...a11yProps(3)} sx={{ width: 150 }} />
            <Tab label="Fees" {...a11yProps(4)} sx={{ width: 150 }} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <h3>Description</h3>
          <p>{detailed.data.description}</p>
          <h3>Sign Up</h3>
          <p>{detailed.data.additionalInformation.overviewUri}</p>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <h3>Features</h3>
          {detailed.data.hasOwnProperty("features") && (
            <Box>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                {detailed.data.features.map((feature: any) => {
                  return (
                    <Chip
                      label={feature.featureType}
                      variant="outlined"
                      onClick={(event) => printData(JSON.stringify(feature))}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <h3>Eligibility</h3>
          {detailed.data.hasOwnProperty("eligibility") && (
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {detailed.data.eligibility.map((eligibility: any) => {
                return (
                  <Chip
                    label={eligibility.eligibilityType}
                    variant="outlined"
                    onClick={(event) => printData(JSON.stringify(eligibility))}
                  />
                );
              })}
            </Stack>
          )}
        </TabPanel>
        <TabPanel value={value} index={3}>
          <h3>Rates</h3>
          {detailed.data.hasOwnProperty("lendingRates") && (
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {detailed.data.lendingRates.map((rate: any) => {
                return (
                  <Chip
                    label={
                      Math.round(rate.rate * 10000) / 100 +
                      "% - " +
                      rate.lendingRateType
                    }
                    variant="outlined"
                    onClick={(event) => printData(JSON.stringify(rate))}
                  />
                );
              })}
            </Stack>
          )}
        </TabPanel>
        <TabPanel value={value} index={4}>
          <h3>Fees</h3>
          {detailed.data.hasOwnProperty("fees") && (
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {detailed.data.fees.map((fee: any) => {
                return (
                  <Chip
                    label={fee.name}
                    variant="outlined"
                    onClick={(event) => printData(JSON.stringify(fee))}
                  />
                );
              })}
            </Stack>
          )}
        </TabPanel>
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
