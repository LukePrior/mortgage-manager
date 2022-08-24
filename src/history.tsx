// @ts-nocheck
import { productData, rates } from "./interfaces";
import ReactGA from "react-ga4";
import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

export default function App(data: { data: productData }) {
  const [detailed, setDetailed] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  function sendHistoryAnalytics(type: string, id: string) {
    ReactGA.event("select_history", {
      content_type: type,
      item_id: id
    });
  }

  let product = data.data;
  let url =
    "https://raw.githubusercontent.com/LukePrior/open-banking-tracker/main/history/product/";
  url += product.brandId;
  url += "/";
  url += product.productId;
  url += ".json";

  ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "time",
      },
      y: {
        ticks: {
          callback: function (value: number) {
            return value.toFixed(1) + "%";
          }
        }
      }
    },
    parsing: {
      xAxisKey: "time",
      yAxisKey: "rate"
    },
    plugins: {
      legend: {
        position: "top" as const
      },
      title: {
        display: true,
        text: "Interest Rate"
      }
    }
  };

  const [dataset] = useState({
    datasets: []
  });

  const Panel = () => (
    <div>
      <Line options={options} data={dataset} />
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

      let result = await response.json();

      result = result.filter((rate: rates) => {
        if (rate.lendingRateType === "DISCOUNT") {
          return false;
        } else {
          return true;
        }
      });

      dataset.datasets = result.map((rate: rates, index: number) => {
        let letters = "0123456789ABCDEF".split("");
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }

        let rates = rate.rates.map((entry) => {
          entry.time = entry.time * 1000;
          return entry;
        });

        rates.unshift({ time: Date.now(), rate: rate.rates[0].rate });

        let dataset = {
          label: rate.name,
          data: rates,
          borderColor: color,
          backgroundColor: color,
          stepped: "after",
          hidden: index !== 0 ? true : false
        };
        return dataset;
      });

      setDetailed(result);
      sendHistoryAnalytics(
        "product",
        `${data.data.brandId}-${data.data.productId}`
      );
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
