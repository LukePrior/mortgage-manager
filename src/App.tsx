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

export default function App() {
  const [store, setStore] = useState([]);
  const [data, setData] = useState([]);
  const [loanPeriod, setLoanPeriod] = React.useState<string | null>("0");
  const [loanPayment, setLoanPayment] = React.useState<string | null>("0");
  const [loanBig, setLoanBig] = React.useState<string | null>("0");
  const [value, setValue] = React.useState<number | string | null>(600000);
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
    allData?: any
  ) {
    let localStore = store;
    if (allData !== undefined) {
      localStore = allData;
    }

    if (loanPeriod === null && loanPayment === null && loanBig === null) {
      setData(localStore);
      return;
    }

    let newData = localStore.filter((product: any) => {
      let flag = false;
      product.rate.forEach((rate: rateData, index: number) => {
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
              )))
        ) {
          product.i = index;
          flag = true;
        }
      });
      return flag;
    });

    setData(newData);
  }

  const handleLoanPeriod = (
    event: React.MouseEvent<HTMLElement>,
    newLoanPeriod: string | null
  ) => {
    setLoanPeriod(newLoanPeriod);
    sortTable(newLoanPeriod, loanPayment, loanBig);
  };

  const handleLoanPayment = (
    event: React.MouseEvent<HTMLElement>,
    newLoanPayment: string | null
  ) => {
    setLoanPayment(newLoanPayment);
    sortTable(loanPeriod, newLoanPayment, loanBig);
  };

  const handleLoanBig = (
    event: React.MouseEvent<HTMLElement>,
    newLoanBig: string | null
  ) => {
    setLoanBig(newLoanBig);
    sortTable(loanPeriod, loanPayment, newLoanBig);
  };

  const columns: Array<Column<productData>> = [
    {
      title: "Company",
      field: "brandName",
      render: (rowData) => {
        return <b>{rowData.brandName}</b>;
      }
    },
    { title: "Product", field: "productName" },
    {
      title: "Rate",
      field: "rate[0].rate",
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
                let period = rate.lendingRateType;
                if (period === "FIXED") {
                  period = rate.period / 12 + " YEAR";
                }
                return (
                  <MenuItem value={index}>
                    <ListItemText>
                      {rate.rate}% {period} {rate.repaymentType}
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
          return <p>{rowData.rate[rowData.i].period / 12} YEAR</p>;
        }
        return <p>{rowData.rate[rowData.i].lendingRateType}</p>;
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
        return <p>{rowData.rate[rowData.i].repaymentType}</p>;
      }
    }
  ];

  const options = {
    columnsButton: true
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
        sortTable(loanPeriod, loanPayment, loanBig, actualData);
      });
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ p: 0.5 }}>
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
                <ToggleButton value="0">Principle & Interest</ToggleButton>
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
              <FormControl>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Amount
                </InputLabel>
                <OutlinedInput
                  type="number"
                  id="outlined-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  label="Amount"
                />
              </FormControl>
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
            <Grid container item xs={10} justifyContent="flex-start">
              <p>
                Mortgage Manager was created by Luke Prior for the CSESoc x
                Pearler Competition.
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