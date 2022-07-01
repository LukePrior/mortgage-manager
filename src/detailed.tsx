import React, { useState, useEffect } from "react";
import { productData } from "./interfaces";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

export default function App(data: { data: productData }) {
  const [detailed, setDetailed] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const [value, setValue] = React.useState(0);
  const [modal, setModal] = useState<any>({});
  const [featureId, setFeature] = useState<number>(-1);
  const [eligibilityId, setEligibility] = useState<number>(-1);
  const [feeId, setFee] = useState<number>(-1);
  const [rateId, setRate] = useState<number>(-1);

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

  function updateModal(field: string, index: number) {
    let temp = modal;
    temp[field] = index;
    setModal(temp);
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
          {detailed.data.additionalInformation &&
            detailed.data.additionalInformation.overviewUri && (
              <p>{detailed.data.additionalInformation.overviewUri}</p>
            )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <h3>Features</h3>
          {detailed.data.hasOwnProperty("features") && (
            <Box>
              <Grid container spacing={1}>
                {detailed.data.features.map((feature: any, index: number) => {
                  return (
                    <Grid item>
                      <Chip
                        color={featureId === index ? "primary" : "default"}
                        label={feature.featureType
                          .toLowerCase()
                          .replace(/_/g, " ")
                          .replace(/(?: |\b)(\w)/g, function (key: string) {
                            return key.toUpperCase();
                          })}
                        variant={featureId === index ? "filled" : "outlined"}
                        onClick={(event) =>
                          setFeature(featureId === index ? -1 : index)
                        }
                      />
                    </Grid>
                  );
                })}
              </Grid>
              {featureId !== -1 && (
                <Paper elevation={2} sx={{ mt: 1, p: 1 }}>
                  <h3>{detailed.data.features[featureId].featureType}</h3>
                  <p>{detailed.data.features[featureId].additionalValue}</p>
                  <p>{detailed.data.features[featureId].additionalInfo}</p>
                  <p>{detailed.data.features[featureId].additionalInfoUri}</p>
                </Paper>
              )}
            </Box>
          )}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <h3>Eligibility</h3>
          {detailed.data.hasOwnProperty("eligibility") && (
            <Box>
              <Grid container spacing={1}>
                {detailed.data.eligibility.map(
                  (eligibility: any, index: number) => {
                    return (
                      <Grid item>
                        <Chip
                          color={
                            eligibilityId === index ? "primary" : "default"
                          }
                          label={eligibility.eligibilityType
                            .toLowerCase()
                            .replace(/_/g, " ")
                            .replace(/(?: |\b)(\w)/g, function (key: string) {
                              return key.toUpperCase();
                            })}
                          variant={
                            eligibilityId === index ? "filled" : "outlined"
                          }
                          onClick={(event) =>
                            setEligibility(eligibilityId === index ? -1 : index)
                          }
                        />
                      </Grid>
                    );
                  }
                )}
              </Grid>
              {eligibilityId !== -1 && (
                <Paper elevation={2} sx={{ mt: 1, p: 1 }}>
                  <h3>
                    {detailed.data.eligibility[eligibilityId].eligibilityType}
                  </h3>
                  <p>
                    {detailed.data.eligibility[eligibilityId].additionalValue}
                  </p>
                  <p>
                    {detailed.data.eligibility[eligibilityId].additionalInfo}
                  </p>
                  <p>
                    {detailed.data.eligibility[eligibilityId].additionalInfoUri}
                  </p>
                </Paper>
              )}
            </Box>
          )}
        </TabPanel>
        <TabPanel value={value} index={3}>
          <h3>Rates</h3>
          {detailed.data.hasOwnProperty("lendingRates") && (
            <Box>
              <Grid container spacing={1}>
                {detailed.data.lendingRates.map((rate: any, index: number) => {
                  return (
                    <Grid item>
                      <Chip
                        color={rateId === index ? "primary" : "default"}
                        label={
                          Math.round(rate.rate * 10000) / 100 +
                          "% - " +
                          rate.lendingRateType
                            .toLowerCase()
                            .replace(/_/g, " ")
                            .replace(/(?: |\b)(\w)/g, function (key: string) {
                              return key.toUpperCase();
                            }) +
                          (rate.lendingRateType === "FIXED"
                            ? " - " + rate.additionalValue
                            : "")
                        }
                        variant={rateId === index ? "filled" : "outlined"}
                        onClick={(event) =>
                          setRate(rateId === index ? -1 : index)
                        }
                      />
                    </Grid>
                  );
                })}
              </Grid>
              {rateId !== -1 && (
                <Paper elevation={2} sx={{ mt: 1, p: 1 }}>
                  <h3>{detailed.data.lendingRates[rateId].lendingRateType}</h3>
                  <p>
                    Rate:{" "}
                    {Math.round(
                      detailed.data.lendingRates[rateId].rate * 10000
                    ) / 100}
                    %
                  </p>
                  {detailed.data.lendingRates[rateId].comparisonRate && (
                    <p>
                      Comparison Rate:{" "}
                      {Math.round(
                        detailed.data.lendingRates[rateId].comparisonRate *
                          10000
                      ) / 100}
                      %
                    </p>
                  )}
                  <p>{detailed.data.lendingRates[rateId].additionalValue}</p>
                  <p>{detailed.data.lendingRates[rateId].additionalInfo}</p>
                  <p>{detailed.data.lendingRates[rateId].additionalInfoUri}</p>
                  {detailed.data.lendingRates[rateId].tiers &&
                    detailed.data.lendingRates[rateId].tiers.length > 0 && (
                      <h4>Tiers</h4>
                    )}
                  {detailed.data.lendingRates[rateId].tiers &&
                    detailed.data.lendingRates[rateId].tiers.length > 0 &&
                    detailed.data.lendingRates[rateId].tiers.map(
                      (tier: any) => {
                        return (
                          <Paper elevation={3} sx={{ mt: 1, p: 1 }}>
                            <p>{tier.name}</p>
                            <p>{tier.additionalInfo}</p>
                            <p>
                              {tier.unitOfMeasure}: {tier.minimumValue} -{" "}
                              {tier.maximumValue}
                            </p>
                            {tier.applicabilityConditions &&
                              tier.applicabilityConditions.additionalInfo && (
                                <p>
                                  {tier.applicabilityConditions.additionalInfo}
                                </p>
                              )}
                            <p>{tier.additionalInfoUri}</p>
                          </Paper>
                        );
                      }
                    )}
                </Paper>
              )}
            </Box>
          )}
        </TabPanel>
        <TabPanel value={value} index={4}>
          <h3>Fees</h3>
          {detailed.data.hasOwnProperty("fees") && (
            <Box>
              <Grid container spacing={1}>
                {detailed.data.fees.map((fee: any, index: number) => {
                  return (
                    <Grid item>
                      <Chip
                        color={feeId === index ? "primary" : "default"}
                        label={fee.name}
                        variant={feeId === index ? "filled" : "outlined"}
                        onClick={(event) =>
                          setFee(feeId === index ? -1 : index)
                        }
                      />
                    </Grid>
                  );
                })}
              </Grid>
              {feeId !== -1 && (
                <Paper elevation={2} sx={{ mt: 1, p: 1 }}>
                  <h3>{detailed.data.fees[feeId].name}</h3>
                  <p>{detailed.data.fees[feeId].feeType}</p>
                  <p>{detailed.data.fees[feeId].additionalInfo}</p>
                  {detailed.data.fees[feeId].amount && (
                    <p>${detailed.data.fees[feeId].amount}</p>
                  )}
                  <p>{detailed.data.fees[feeId].additionalInfoUri}</p>
                  {detailed.data.fees[feeId].discounts &&
                    detailed.data.fees[feeId].discounts.length > 0 && (
                      <h4>Discounts</h4>
                    )}
                  {detailed.data.fees[feeId].discounts &&
                    detailed.data.fees[feeId].discounts.length > 0 &&
                    detailed.data.fees[feeId].discounts.map((discount: any) => {
                      return (
                        <Paper elevation={3} sx={{ mt: 1, p: 1 }}>
                          <p>Type: {discount.discountType}</p>
                          <p>{discount.description}</p>
                          <p>{discount.additionalInfo}</p>
                          {discount.amount && <p>Save ${discount.amount}</p>}
                          <p>{discount.additionalInfoUri}</p>
                          {discount.eligibility && <h5>Eligability</h5>}
                          {discount.eligibility &&
                            discount.eligibility.map((eligability: any) => {
                              return (
                                <Paper elevation={4} sx={{ mt: 1, p: 1 }}>
                                  <p>
                                    Type: {eligability.discountEligibilityType}
                                  </p>
                                  <p>{eligability.additionalValue}</p>
                                  <p>{eligability.additionalInfo}</p>
                                  <p>{eligability.additionalInfoUri}</p>
                                </Paper>
                              );
                            })}
                        </Paper>
                      );
                    })}
                </Paper>
              )}
            </Box>
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

  useEffect(() => {
    console.log("test");
  }, []);

  return (
    <div>
      {err && <h2>{err}</h2>}
      {isLoading && <h2>Loading...</h2>}
      {detailed && <Panel></Panel>}
    </div>
  );
}
