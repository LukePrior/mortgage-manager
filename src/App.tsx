import React, { useState, useEffect } from "react";
import { productData, rateData } from "./interfaces";
import MaterialTable, { Column } from "@material-table/core";
import Detailed from "./detailed";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import OutlinedInput from "@mui/material/OutlinedInput";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import useMediaQuery from "@mui/material/useMediaQuery";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Stack from "@mui/material/Stack";
import ReactGA from "react-ga4";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ButtonGroup from "@mui/material/ButtonGroup";

ReactGA.initialize("G-4GC23VSQE8");
ReactGA.send("pageview");

export default function App() {
  const [store, setStore] = useState([]);
  const [data, setData] = useState([]);
  const [images, setImages] = React.useState<any>({});

  const savedPeriod = window.localStorage.getItem("savedPeriod");
  const savedType = window.localStorage.getItem("savedType");
  const savedBig = window.localStorage.getItem("savedBig");
  const savedAmount = window.localStorage.getItem("savedAmount");
  const savedLVR = window.localStorage.getItem("savedLVR");
  const savedOffset = window.localStorage.getItem("savedOffset");
  const savedRedraw = window.localStorage.getItem("savedRedraw");
  const savedPurpose = window.localStorage.getItem("savedPurpose");
  const savedRepayments = window.localStorage.getItem("savedRepayments");

  const [loanPeriod, setLoanPeriod] = React.useState<string | null>(
    savedPeriod || "1"
  );
  const [loanPayment, setLoanPayment] = React.useState<string | null>(
    savedType || "0"
  );
  const [loanBig, setLoanBig] = React.useState<string | null>(savedBig || "0");
  const [value, setValue] = React.useState<number | string | null>(
    savedAmount || 600000
  );
  const [loanOffset, setLoanOffset] = React.useState<string | null>(
    savedOffset || null
  );
  const [loanRedraw, setLoanRedraw] = React.useState<string | null>(
    savedRedraw || null
  );
  const [loanLVR, setLoanLVR] = React.useState<string | undefined>(
    savedLVR || "80"
  );
  const [loanPurpose, setLoanPurpose] = React.useState<string | undefined>(
    savedPurpose || "0"
  );
  const [loanRepayments, setLoanRepayments] = React.useState<string | undefined>(
    savedRepayments || "0"
  );

  const savedDarkMode = window.localStorage.getItem("darkState");
  const defaultDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const prefersDarkMode = savedDarkMode || defaultDarkMode;
  const [darkMode, setDarkMode] = React.useState(prefersDarkMode);

  const defaultTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light"
    }
  });

  function sortTable(
    loanPeriod: string | null,
    loanPayment: string | null,
    loanBig: string | null,
    loanOffset: string | null,
    loanRedraw: string | null,
    loanLVR: string | undefined,
    loanPurpose: string | undefined,
    allData?: any
  ) {
    let localStore = store;
    if (allData !== undefined) {
      localStore = allData;
    }

    if (loanPeriod === "null") loanPeriod = null;
    if (loanPayment === "null") loanPayment = null;
    if (loanBig === "null") loanBig = null;
    if (loanOffset === "null") loanOffset = null;
    if (loanRedraw === "null") loanRedraw = null;

    if (
      loanPeriod === null &&
      loanPayment === null &&
      loanBig === null &&
      loanOffset === null &&
      loanRedraw === null &&
      loanLVR === undefined &&
      loanPurpose === undefined
    ) {
      setData(localStore);
      return;
    }

    let newData = localStore.filter((product: any) => {
      let flag = false;
      product.rate.forEach((rate: rateData, index: number, object: any) => {
        if (
          (loanPeriod === null ||
            (loanPeriod === "0" &&
              rate.lendingRateType === "VARIABLE" &&
              flag === false) ||
            ("period" in rate &&
              rate.period === parseInt(loanPeriod) * 12 &&
              flag === false)) &&
          (loanPayment === null ||
            (loanPayment === "0" &&
              rate.repaymentType === "PRINCIPAL_AND_INTEREST") ||
            (loanPayment === "1" && rate.repaymentType === "INTEREST_ONLY")) &&
          (loanBig === null ||
            (loanBig === "0" &&
              ["000002", "000004", "000006", "000008"].includes(
                product.brandId
              ) &&
              product.productId !== "afc433d8-947a-46b5-9f51-d15d4fb8ba3b")) &&
          (loanOffset === null ||
            (loanOffset === "0" && product.offset === true)) &&
          (loanRedraw === null ||
            (loanRedraw === "0" && product.redraw === true)) &&
          (loanLVR === undefined ||
            (!("minLVR" in rate) && !("maxLVR" in rate)) ||
            ((rate["minLVR"] === undefined ||
              rate["minLVR"] <= parseFloat(loanLVR)) &&
              (rate["maxLVR"] === undefined ||
                rate["maxLVR"] >= parseFloat(loanLVR)))) &&
          (loanPurpose === undefined ||
            (parseFloat(loanPurpose) === 0 && rate.purpose !== "INVESTMENT") ||
            (parseFloat(loanPurpose) === 1 && rate.purpose === "INVESTMENT"))
        ) {
          product.i = index;
          flag = true;
        }
      });
      if (
        product.brandId === "000031" ||
        product.brandId === "000133" ||
        product.brandId === "000138" ||
        product.brandId === "000187" ||
        product.brandId === "000198" ||
        product.brandId === "000202" ||
        product.brandId === "000238" ||
        product.productName.includes("BROKER HOME LOAN") ||
        product.productName.includes("The Works Package 2 year introductory")
      ) {
        return false;
      }
      return flag;
    });

    setData(newData);
  }

  const handleLoanPeriod = (
    event: React.MouseEvent<HTMLElement>,
    newLoanPeriod: string | null
  ) => {
    setLoanPeriod(newLoanPeriod);
    if (typeof newLoanPeriod === "string") {
      localStorage.setItem("savedPeriod", newLoanPeriod);
    } else {
      localStorage.setItem("savedPeriod", "null");
    }
    sortTable(
      newLoanPeriod,
      loanPayment,
      loanBig,
      loanOffset,
      loanRedraw,
      loanLVR,
      loanPurpose
    );
  };

  const handleLoanPayment = (
    event: React.MouseEvent<HTMLElement>,
    newLoanPayment: string | null
  ) => {
    setLoanPayment(newLoanPayment);
    if (typeof newLoanPayment === "string") {
      localStorage.setItem("savedType", newLoanPayment);
    } else {
      localStorage.setItem("savedType", "null");
    }
    sortTable(
      loanPeriod,
      newLoanPayment,
      loanBig,
      loanOffset,
      loanRedraw,
      loanLVR,
      loanPurpose
    );
  };

  const handleLoanBig = (
    event: React.MouseEvent<HTMLElement>,
    newLoanBig: string | null
  ) => {
    setLoanBig(newLoanBig);
    if (typeof newLoanBig === "string") {
      localStorage.setItem("savedBig", newLoanBig);
    } else {
      localStorage.setItem("savedBig", "null");
    }
    sortTable(
      loanPeriod,
      loanPayment,
      newLoanBig,
      loanOffset,
      loanRedraw,
      loanLVR,
      loanPurpose
    );
  };

  const handleLoanOffset = (
    event: React.MouseEvent<HTMLElement>,
    newLoanOffset: string | null
  ) => {
    setLoanOffset(newLoanOffset);
    if (typeof newLoanOffset === "string") {
      localStorage.setItem("savedOffset", newLoanOffset);
    } else {
      localStorage.setItem("savedOffset", "null");
    }
    sortTable(
      loanPeriod,
      loanPayment,
      loanBig,
      newLoanOffset,
      loanRedraw,
      loanLVR,
      loanPurpose
    );
  };

  const handleLoanRedraw = (
    event: React.MouseEvent<HTMLElement>,
    newLoanRedraw: string | null
  ) => {
    setLoanRedraw(newLoanRedraw);
    if (typeof newLoanRedraw === "string") {
      localStorage.setItem("savedRedraw", newLoanRedraw);
    } else {
      localStorage.setItem("savedRedraw", "null");
    }
    sortTable(
      loanPeriod,
      loanPayment,
      loanBig,
      loanOffset,
      newLoanRedraw,
      loanLVR,
      loanPurpose
    );
  };

  const handleLoanAmount = (amount: any) => {
    setValue(amount.target.value);
    localStorage.setItem("savedAmount", amount.target.value);
  };

  const handleLoanLVR = (event: SelectChangeEvent) => {
    let lvr = event.target.value;
    setLoanLVR(lvr);
    localStorage.setItem("savedLVR", lvr);
    sortTable(
      loanPeriod,
      loanPayment,
      loanBig,
      loanOffset,
      loanRedraw,
      lvr,
      loanPurpose
    );
  };

  const handleLoanPurpose = (event: SelectChangeEvent) => {
    let purpose = event.target.value;
    setLoanPurpose(purpose);
    localStorage.setItem("savedPurpose", purpose);
    sortTable(
      loanPeriod,
      loanPayment,
      loanBig,
      loanOffset,
      loanRedraw,
      loanLVR,
      purpose
    );
  };

  const handleLoanRepayments = (event: SelectChangeEvent) => {
    let repayments = event.target.value;
    setLoanRepayments(repayments);
    localStorage.setItem("savedRepayments", repayments);
    sortTable(
      loanPeriod,
      loanPayment,
      loanBig,
      loanOffset,
      loanRedraw,
      loanLVR,
      loanPurpose
    );
  };  

  const handleReset = (amount: any) => {
    setLoanPeriod("1");
    localStorage.setItem("savedPeriod", "1");
    setLoanPayment("0");
    localStorage.setItem("savedType", "0");
    setLoanBig("0");
    localStorage.setItem("savedBig", "0");
    setLoanOffset(null);
    localStorage.removeItem("savedOffset");
    setLoanRedraw(null);
    localStorage.removeItem("savedRedraw");
    setValue(600000);
    localStorage.setItem("savedAmount", "600000");
    setLoanLVR("80");
    localStorage.setItem("savedLVR", "80");
    setLoanPurpose("0");
    localStorage.setItem("savedPurpose", "0");
    setLoanRepayments("0");
    localStorage.setItem("savedRepayments", "0");
    sortTable("1", "0", "0", null, null, "80", "0");
  };

  const columns: Array<Column<productData>> = [
    {
      title: "Company",
      field: "brandName",
      render: (rowData) => {
        let brand = rowData.brandId;
        let imgUrl;
        if (brand in images && "logoUrl" in images[brand]) {
          imgUrl = images[brand].logoUrl;
        }
        return (
          <Stack
            direction="column"
            spacing={1}
            justifyContent="center"
            alignItems="center"
          >
            <b>{rowData.brandName}</b>
            <div style={{ height: "5vh" }}>
              <img
                src={imgUrl}
                alt="brand logo"
                style={{
                  height: "100%",
                  maxWidth: "100%",
                  objectFit: "contain"
                }}
              ></img>
            </div>
          </Stack>
        );
      }
    },
    { title: "Product", field: "productName" },
    {
      title: "Rate",
      field: "rate[0].rate",
      defaultSort: "asc",
      customFilterAndSearch: (term, rowData) =>
        term === rowData.rate[rowData.i].rate + "%",
      customSort: (a, b) => a.rate[a.i].rate - b.rate[b.i].rate,
      render: (rowData) => {
        const handleChange = (event: SelectChangeEvent) => {
          let newData = [...data];
          let match: any = newData.find(function (row: any) {
            if (
              row.brandId === rowData.brandId &&
              row.productId === rowData.productId
            ) {
              return row;
            }
          });
          if (match !== undefined) {
            match.i = event.target.value;
          }
          setData(newData);
        };

        const Menu = ({ data }: any) => (
          <FormControl>
            <Select
              label="rate"
              variant="standard"
              value={rowData.i.toString()}
              onChange={handleChange}
              renderValue={function () {
                return rowData.rate[rowData.i].rate + "%";
              }}
            >
              {data.map((rate: rateData, index: number) => {
                let period = rate.lendingRateType
                  .toLowerCase()
                  .replace(/_/g, " ")
                  .replace(/(?: |\b)(\w)/g, function (key: string) {
                    return key.toUpperCase();
                  });
                if (period === "Fixed") {
                  period = rate.period / 12 + " Year";
                }
                if (
                  (rate.purpose === "INVESTMENT" &&
                    loanPurpose !== undefined &&
                    parseInt(loanPurpose) === 0) ||
                  (rate.purpose === "OWNER_OCCUPIED" &&
                    loanPurpose !== undefined &&
                    parseInt(loanPurpose) === 1)
                ) {
                  return null;
                }
                return (
                  <MenuItem value={index}>
                    <ListItemText>
                      {rate.rate}% {period}{" "}
                      {rate.repaymentType &&
                        rate.repaymentType
                          .toLowerCase()
                          .replace(/_/g, " ")
                          .replace(/(?: |\b)(\w)/g, function (key: string) {
                            return key.toUpperCase();
                          })}
                    </ListItemText>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        );

        if (rowData.rate.length !== 1) {
          return (
            <div>
              <Menu data={rowData.rate}></Menu>
            </div>
          );
        } else {
          return <p>{rowData.rate[0].rate}%</p>;
        }
      }
    },
    {
      title: "Amount",
      field: "amount",
      render: (rowData) => {
        let i = rowData.rate[rowData.i].rate / 12 / 100;         
        let n = 300;
        let p;
        if (value === null) {
          p = 0;
        } else if (typeof value === "string") {
          p = parseFloat(value);
        } else {
          p = value;
        }
        let r = Math.round((p * (i * (1 + i) ** n)) / ((1 + i) ** n - 1));
        switch (loanRepayments) {
          case "1":
            r = Math.round(r * 12 / 365 * 14);
            break;            
          case "2":
            r = Math.round(r * 12 / 365 * 7);
            break;            
        }        
        return <p>${r.toLocaleString()}</p>;
      },
      customSort: (a, b) => {
        return a.rate[a.i].rate - b.rate[b.i].rate;
      }
    },
    {
      title: "Type",
      field: "rate[0].lendingRateType",
      customSort: (a, b) => {
        if (!a.rate[a.i].hasOwnProperty("period")) a.rate[a.i].period = 0;
        if (!b.rate[b.i].hasOwnProperty("period")) b.rate[b.i].period = 0;
        return a.rate[a.i].period - b.rate[b.i].period;
      },
      render: (rowData) => {
        if (rowData.rate[rowData.i].lendingRateType === "FIXED") {
          return <p>{rowData.rate[rowData.i].period / 12} Year</p>;
        }
        return (
          <p>
            {rowData.rate[rowData.i].lendingRateType
              .toLowerCase()
              .replace(/_/g, " ")
              .replace(/(?: |\b)(\w)/g, function (key: string) {
                return key.toUpperCase();
              })}
          </p>
        );
      }
    },
    {
      title: "Repayment",
      field: "rate[0].repaymentType",
      hidden: true,
      customSort: (a, b) => {
        if (!a.rate[a.i].hasOwnProperty("repaymentType"))
          a.rate[a.i].repaymentType = "";
        if (!b.rate[b.i].hasOwnProperty("repaymentType"))
          b.rate[b.i].repaymentType = "";
        return a.rate[a.i].repaymentType.localeCompare(
          b.rate[b.i].repaymentType
        );
      },
      render: (rowData) => {
        return (
          <p>
            {rowData.rate[rowData.i].repaymentType
              .toLowerCase()
              .replace(/_/g, " ")
              .replace(/(?: |\b)(\w)/g, function (key: string) {
                return key.toUpperCase();
              })}
          </p>
        );
      }
    }
  ];

  const options = {
    columnsButton: true,
    minBodyHeight: window.matchMedia("(orientation: portrait)").matches
      ? "90vh"
      : "55vh",
    maxBodyHeight: window.matchMedia("(orientation: portrait)").matches
      ? "90vh"
      : "55vh"
  };

  const detailPanel = (rowData: { rowData: productData }) => {
    const data = rowData.rowData;
    return <Detailed data={data} />;
  };

  useEffect(() => {
    const existingPreference = localStorage.getItem("darkState");
    if (existingPreference === "true") {
      setDarkMode(true);
    } else if (existingPreference === "false") {
      setDarkMode(false);
    } else {
      setDarkMode(prefersDarkMode);
    }
  }, [prefersDarkMode]);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      localStorage.setItem("darkState", "false");
    } else {
      localStorage.setItem("darkState", "true");
    }
  };

  useEffect(() => {
    fetch(
      `https://raw.githubusercontent.com/LukePrior/open-banking-tracker/main/aggregate/RESIDENTIAL_MORTGAGES/data.json`
    )
      .then((response) => response.json())
      .then((actualData) => {
        actualData.forEach((o: any, i: number, a: any) => {
          a[i].i = 0;
        });
        setStore(actualData);
        sortTable(
          loanPeriod,
          loanPayment,
          loanBig,
          loanOffset,
          loanRedraw,
          loanLVR,
          loanPurpose,
          actualData
        );
      });
  }, []);

  useEffect(() => {
    fetch(
      `https://raw.githubusercontent.com/LukePrior/open-banking-tracker/main/brands/brands.json`
    )
      .then((response) => response.json())
      .then((actualData) => setImages(actualData));
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth={false} sx={{ p: 0.5 }}>
        <Paper elevation={1} sx={{ p: 1, mb: 1, mt: 1 }}>
          <h1>Mortgage Manager</h1>
          <p>
            A tool to compare home loans from a wide range of Australian lenders
            to help find the perfect mortgage to suit your needs.
          </p>
        </Paper>
        <Paper elevation={1} sx={{ p: 1 }}>
          <Grid container justifyContent="center" spacing={1} sx={{ p: 1 }}>
            <Grid item style={{ display: "flex" }}>
              <ToggleButtonGroup
                value={loanPeriod}
                exclusive
                onChange={handleLoanPeriod}
                color="primary"
              >
                <ToggleButton value="0">Variable</ToggleButton>
                <ToggleButton value="1">1 YR</ToggleButton>
                <ToggleButton value="2">2 YR</ToggleButton>
                <ToggleButton value="3">3 YR</ToggleButton>
                <ToggleButton value="4">4 YR</ToggleButton>
                <ToggleButton value="5">5 YR</ToggleButton>
                <ToggleButton value="10">10 YR</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item style={{ display: "flex" }}>
              <ToggleButtonGroup
                value={loanPayment}
                exclusive
                onChange={handleLoanPayment}
                color="primary"
              >
                <ToggleButton value="0">Principal & Interest</ToggleButton>
                <ToggleButton value="1">Interest Only</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item style={{ display: "flex" }}>
              <ToggleButtonGroup
                value={loanBig}
                exclusive
                onChange={handleLoanBig}
                color="primary"
              >
                <ToggleButton value="0">BIG 4</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item style={{ display: "flex" }}>
              <ToggleButtonGroup
                value={loanOffset}
                exclusive
                onChange={handleLoanOffset}
                color="primary"
              >
                <ToggleButton value="0">OFFSET</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item style={{ display: "flex" }}>
              <ToggleButtonGroup
                value={loanRedraw}
                exclusive
                onChange={handleLoanRedraw}
                color="primary"
              >
                <ToggleButton value="0">REDRAW</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item style={{ display: "flex" }}>
              <FormControl>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Amount
                </InputLabel>
                <OutlinedInput
                  type="number"
                  id="outlined-adornment-amount"
                  sx={{ width: "150px" }}
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  value={value}
                  onChange={handleLoanAmount}
                  label="Amount"
                />
              </FormControl>
            </Grid>
            <Grid item style={{ display: "flex" }}>
              <FormControl>
                <InputLabel htmlFor="outlined-lvr-percent">LVR</InputLabel>
                <Select
                  id="outlined-lvr-percent"
                  label="LVR"
                  value={loanLVR}
                  onChange={handleLoanLVR}
                >
                  <MenuItem value={60}>60%</MenuItem>
                  <MenuItem value={70}>70%</MenuItem>
                  <MenuItem value={80}>80%</MenuItem>
                  <MenuItem value={85}>85%</MenuItem>
                  <MenuItem value={90}>90%</MenuItem>
                  <MenuItem value={95}>95%</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item style={{ display: "flex" }}>
              <FormControl>
                <InputLabel htmlFor="outlined-purpose">Purpose</InputLabel>
                <Select
                  id="outlined-purpose"
                  label="Purpose"
                  value={loanPurpose}
                  onChange={handleLoanPurpose}
                >
                  <MenuItem value={"0"}>Owner Occupier</MenuItem>
                  <MenuItem value={"1"}>Investment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item style={{ display: "flex" }}>
              <FormControl>
                <InputLabel htmlFor="outlined-repayments">Repayments</InputLabel>
                <Select
                  id="outlined-repayments"
                  label="Repayments"
                  value={loanRepayments}
                  onChange={handleLoanRepayments}
                >
                  <MenuItem value={"0"}>Monthly</MenuItem>
                  <MenuItem value={"1"}>Fortnightly</MenuItem>
                  <MenuItem value={"2"}>Weekly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item style={{ display: "flex" }}>
              <ButtonGroup color="primary">
                <ToggleButton onClick={handleReset} value="">
                  <RestartAltIcon />
                </ToggleButton>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Paper>
        <Grid sx={{ mt: 1 }}>
          <MaterialTable
            columns={columns}
            data={data}
            detailPanel={detailPanel}
            options={options}
            title="Home Loans"
          />
        </Grid>
        <Paper elevation={1} sx={{ p: 1, mt: 1 }}>
          <Grid container>
            <Grid container item xs={12} justifyContent="flex-start">
              <p>
                The information provided on this site may be outdated or
                incorrect and should not be considered as financial advice.
              </p>
            </Grid>
          </Grid>
          <Grid container>
            <Grid container item xs={10} justifyContent="flex-start">
              <p>
                Mortgage Manager was created by{" "}
                <a
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    fontWeight: "bold"
                  }}
                  href="https://github.com/LukePrior"
                  target="_blank"
                  rel="noreferrer"
                >
                  Luke Prior
                </a>{" "}
                for the CSESoc x Pearler Competition.
              </p>
            </Grid>
            <Grid container item xs={2} justifyContent="flex-end">
              <IconButton
                sx={{ ml: 1 }}
                onClick={handleDarkModeToggle}
                color="inherit"
              >
                {defaultTheme.palette.mode === "dark" ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
