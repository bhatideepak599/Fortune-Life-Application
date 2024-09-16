import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getPolociesReport } from "../../../services/policyService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const Revenue = () => {
  const [policyData, setPolicyData] = useState([]);

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const response = await getPolociesReport();
        setPolicyData(response);
      } catch (error) {
        console.error("Error fetching policy data:", error);
      }
    };

    fetchPolicyData();
  }, []);

  const policyBuyGraphData = {
    labels: policyData.map((data) => data.date),
    datasets: [
      {
        label: "Policies Bought",
        data: policyData.map((data) => data.policiesBought),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const revenueGraphData = {
    labels: policyData.map((data) => data.date),
    datasets: [
      {
        label: "Revenue Generated",
        data: policyData.map((data) => data.totalRevenue),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.1,
      },
      point: {
        radius: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', paddingTop: '80px' }}>
      <div style={{ flex: '1', minWidth: '300px', height: '200px' }}>
        <h2>Policies Bought Over Time</h2>
        <Line data={policyBuyGraphData} options={chartOptions} />
      </div>

      <div style={{ flex: '1', minWidth: '300px', height: '200px' }}>
        <h2>Revenue Generated Over Time</h2>
        <Line data={revenueGraphData} options={chartOptions} />
      </div>
    </div>
  );
};
