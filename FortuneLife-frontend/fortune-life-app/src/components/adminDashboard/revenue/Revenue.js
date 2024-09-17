import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { getReportCount } from "../../../services/reportsService";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card } from "react-bootstrap";
import styles from "./Revenue.module.css";
import RevenueCards from "./revenueCards/RevenueCards";
import { getPolociesReport, getRevenueReports } from "../../../services/policyService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const Revenue = () => {
  const [policyData, setPolicyData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [report, setReport] = useState({
    agentCount: 0,
    customerCount: 0,
    customerPolicyRatio: 0,
    employeeCount: 0,
    policyCount: 0,
  });

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

  useEffect(() => {
    const fetchReportCounts = async () => {
      try {
        const response = await getReportCount();
        setReport(response);
      } catch (error) {
        toast.error("Failed to fetch report counts");
      }
    };

    fetchReportCounts();
  }, []);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const startDate = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        ).toISOString();
        const endDate = new Date().toISOString();
        
        const totalRevenue = await getRevenueReports(startDate, endDate);
        
        setRevenueData([{
          date: new Date().toLocaleDateString(),
          totalRevenue: totalRevenue,
        }]);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenueData();
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
        labels: {
          font: {
            weight: 'bold',
          },
        },
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
        title: {
          display: true,
          text: 'Date',
          font: {
            weight: 'bold',
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount',
          font: {
            weight: 'bold',
          },
        },
        // ticks: {
        //   stepSize: 50000, // Adjust this value to increase or decrease the step size
        // },
      },
    },
  };

  return (
    <div className="container mt-5">
      <RevenueCards report={report} />
      <div className={`d-flex flex-wrap justify-content-between gap-3 pt-3 ${styles.chartContainer}`}>
        <div className={`${styles.chartBox} ${styles.lineChart}`}>
          <h2>Policies Bought Over Time</h2>
          <Line data={policyBuyGraphData} options={chartOptions} />
        </div>

        <div className={`${styles.chartBox} ${styles.lineChart}`}>
          <h2>Revenue  Over Time</h2>
          <Line data={revenueGraphData} options={chartOptions} />
        </div>

        <div className={`${styles.chartBox} ${styles.barChart} mt-5`}>
          <h2>Policies Bought (Bar Graph)</h2>
          <Bar data={policyBuyGraphData} options={chartOptions} />
        </div>

        <div className={`${styles.chartBox} ${styles.barChart} mt-5`}>
          <h2>Revenue Generated</h2>
          <Bar data={revenueGraphData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Revenue;
