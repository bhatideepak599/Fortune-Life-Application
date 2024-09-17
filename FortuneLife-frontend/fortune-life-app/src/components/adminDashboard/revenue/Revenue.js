import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getReportCount } from "../../../services/reportsService";
import { toast } from "react-toastify";
import { getPolociesReport, getRevenueReport } from "../../../services/policyService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./Revenue.module.css"; // Assuming you have some CSS for styling
import { Card } from "react-bootstrap";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const Revenue = () => {
  const [policyData, setPolicyData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [report, setReport] = useState(null);

  // Fetch policy data
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

  // Fetch report counts
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

  // Fetch revenue data
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        const endDate = new Date().toISOString();
        const response = await getRevenueReport(startDate, endDate);

        setRevenueData([
          {
            date: new Date().toLocaleDateString(),
            totalRevenue: response,
          },
        ]);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenueData();
  }, []);

  // Data for policy bought graph
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

  // Data for revenue graph
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

  // Data for revenue graph using revenueData
  const revenueGraphData1 = {
    labels: revenueData.map((data) => data.date),
    datasets: [
      {
        label: "Revenue Generated",
        data: revenueData.map((data) => data.totalRevenue),
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
    <div className="container mt-5">
      {/* Cards to display report counts */}
      <div className="row mb-4">
        <div className="col-md-4">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Number of Customers</Card.Title>
              <Card.Text>{/* Assuming you fetch and display customer count here */}</Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Reports</Card.Title>
              <Card.Text>{report}</Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Graphs for policy and revenue */}
      <div className="row">
        <div className="col-md-6">
          <h2>Policies Bought Over Time</h2>
          <Line data={policyBuyGraphData} options={chartOptions} />
        </div>
        <div className="col-md-6">
          <h2>Revenue Generated Over Time</h2>
          <Line data={revenueGraphData1} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Revenue;
