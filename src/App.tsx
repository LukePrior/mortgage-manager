import React, { useState, useEffect } from "react";
import { productData, rateData } from "./interfaces";
import { Column } from "@material-table/core";
import Detailed from "./detailed";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const MaterialTable = require("@material-table/core").default;

export default function App() {
  const [store, setStore] = useState([]);
  const [data, setData] = useState([]);
  const [loanPeriod, setLoanPeriod] = React.useState<string | null>(null);
  const [loanPayment, setLoanPayment] = React.useState<string | null>(null);
  const [loanBig, setLoanBig] = React.useState<string | null>(null);

  function sortTable(loanPeriod: string | null, loanPayment: string | null, loanBig: string | null) {
    if (loanPeriod === null && loanPayment === null && loanBig === null) {
      setData(store)
      return
    }

    let newData = store.filter((product: any) => {
      let flag = false;
      product.rate.forEach((rate: rateData, index: number) => {
        if ((loanPeriod === null || (loanPeriod === "0" && rate.lendingRateType === "VARIABLE" && flag === false) || ("period" in rate && rate.period === parseInt(loanPeriod) * 12 && flag === false)) && (loanPayment === null || (loanPayment === "0" && rate.repaymentType === "PRINCIPAL_AND_INTEREST") || (loanPayment === "1" && rate.repaymentType === "INTEREST_ONLY")) && (loanBig === null || (loanBig === "0" && ["000002", "000004", "000006", "000008"].includes(product.brandId)))) {
          product.i = index;
          flag = true;
        }
      });
      return flag;
    });

    setData(newData);
  };

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
      render: (rowData) => {
        const handleChange = (event: SelectChangeEvent) => {
          let newData = [...store];
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
      title: "Type",
      field: "rate[0].lendingRateType",
      render: (rowData) => {
        if (rowData.rate[rowData.i].lendingRateType === "FIXED") {
          return <p>{rowData.rate[rowData.i].period / 12} YEAR</p>;
        }
        return <p>{rowData.rate[rowData.i].lendingRateType}</p>;
      }
    }
  ];

  const detailPanel = (rowData: { rowData: productData }) => {
    const data = rowData.rowData;
    return <Detailed data={data} />;
  };

  useEffect(() => {
    fetch(
      `https://raw.githubusercontent.com/LukePrior/open-banking-tracker/main/aggregate/RESIDENTIAL_MORTGAGES/data.json`
    )
      .then((response) => response.json())
      .then((actualData) => {
        actualData.forEach((o: any, i: number, a: any) => (a[i].i = 0));
        setData(actualData);
        setStore(actualData);
      });
  }, []);

  return (
    <div>
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
      <ToggleButtonGroup
        value={loanPayment}
        exclusive
        onChange={handleLoanPayment}
        color="primary"
      >
        <ToggleButton value="0">Principle & Interest</ToggleButton>
        <ToggleButton value="1">Interest Only</ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup
        value={loanBig}
        exclusive
        onChange={handleLoanBig}
        color="primary"
      >
        <ToggleButton value="0">BIG 4</ToggleButton>
      </ToggleButtonGroup>
      <MaterialTable
        columns={columns}
        data={data}
        detailPanel={detailPanel}
        title="Home Loans"
      />
    </div>
  );
}
