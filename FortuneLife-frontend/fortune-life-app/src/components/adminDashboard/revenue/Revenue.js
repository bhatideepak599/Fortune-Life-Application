import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getPolociesReport } from "../../../services/policyService";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { getReportCount } from "../../../services/reportsService";
import { toast } from "react-toastify";
import styles from "./Revenue.module.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const Revenue = () => {
  const [policyData, setPolicyData] = useState([]);
  const [report, setReport] = useState(null);

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
        toast.error(error);
      }
    };

    fetchReportCounts();
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
    <>
      <div className="container mt-5">
        {report && (
          <>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Customers</h5>
                <div className="d-flex justify-content-center align-items-center">
                  <i className="fas fa-user fa-3x"></i>
                  <span className="ml-3 h4">{report.customerCount}</span>
                </div>
              </div>
            </div>

            <div className="card text-center mt-5">
              <div className="card-body">
                <h5 className="card-title">Agents</h5>
                <div className="d-flex justify-content-center align-items-center">
                  <i className="fas fa-user fa-3x"></i>
                  <span className="ml-3 h4">{report.agentCount}</span>
                </div>
              </div>
            </div>

            <div className="card text-center mt-5">
              <div className="card-body">
                <h5 className="card-title">Employees</h5>
                <div className="d-flex justify-content-center align-items-center">
                  <i className="fas fa-user fa-3x"></i>
                  <span className="ml-3 h4">{report.employeeCount}</span>
                </div>
              </div>
            </div>

            <div className="card text-center mt-5">
              <div className="card-body">
                <h5 className="card-title">Policies</h5>
                <div className="d-flex justify-content-center align-items-center">
                  <i className="fas fa-user fa-3x"></i>
                  <span className="ml-3 h4">{report.policyCount}</span>
                </div>
              </div>
            </div>

            <div className="card text-center mt-5">
              <div className="card-body">
                <h5 className="card-title">Policies Per Customer</h5>
                <div className="d-flex justify-content-center align-items-center">
                  <i className="fas fa-user fa-3x"></i>
                  <span className="ml-3 h4">{report.customerPolicyRatio}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", paddingTop: "80px" }}>
              <div style={{ flex: "1", minWidth: "300px", height: "200px" }}>
                <h2>Policies Bought Over Time</h2>
                <Line data={policyBuyGraphData} options={chartOptions} />
              </div>

              <div style={{ flex: "1", minWidth: "300px", height: "200px" }}>
                <h2>Revenue Generated Over Time</h2>
                <Line data={revenueGraphData} options={chartOptions} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Revenue;
