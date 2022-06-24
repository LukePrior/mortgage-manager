import React, { useState, useEffect } from "react";
import { productData, rateData } from "./interfaces";
import { Column } from "@material-table/core";
const MaterialTable = require("@material-table/core").default;
import Detailed from "./detailed";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";

export default function App() {
  const [data, setData] = useState([]);

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

        let disabled = false;
        if (rowData.rate.length === 1) {
          disabled = true;
        }

        const Menu = ({ data }: any) => (
          <FormControl disabled={disabled}>
            <Select
              label="rate"
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
                      {rate.rate}% {period}
                    </ListItemText>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        );

        return (
          <div>
            <Menu data={rowData.rate}></Menu>
          </div>
        );
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
      });
  }, []);

  return (
    <MaterialTable
      columns={columns}
      data={data}
      detailPanel={detailPanel}
      title="Home Loans"
    />
  );
}
