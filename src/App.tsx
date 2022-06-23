import React, { useState, useEffect } from "react";
import { productData } from "./interfaces";
import { Column } from "@material-table/core";
const MaterialTable = require("@material-table/core").default;
import Detailed from "./detailed";

const columns: Array<Column<productData>> = [
  { title: "Company", field: "brandName" },
  { title: "Product", field: "productName" },
  {
    title: "Rate",
    field: "rate[0].rate",
    render: (rowData) => {
      return <p>{rowData.rate[0].rate} %</p>;
    }
  },
  {
    title: "Type",
    field: "rate[0].lendingRateType",
    render: (rowData) => {
      if (rowData.rate[0].lendingRateType === "FIXED") {
        return <p>{rowData.rate[0].period / 12} YEAR</p>;
      }
      return <p>{rowData.rate[0].lendingRateType}</p>;
    }
  }
];

const detailPanel = (rowData: { rowData: productData }) => {
  const data = rowData.rowData;
  return <Detailed data={data} />;
};

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(
      `https://raw.githubusercontent.com/LukePrior/open-banking-tracker/main/aggregate/RESIDENTIAL_MORTGAGES/data.json`
    )
      .then((response) => response.json())
      .then((actualData) => setData(actualData));
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
