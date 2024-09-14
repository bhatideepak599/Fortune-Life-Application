import React, { useEffect, useState } from "react";
import { errorToast, successToast, warnToast } from "../../../../utils/Toast";
import { getTax, setTaxGlobally } from "../../../../services/adminService";
import { verifyUser } from "../../../../services/authService";
import { useNavigate } from "react-router-dom";

const ManageTaxAndDeductions = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [tax, setTax] = useState({
    deductionRate: "",
    taxRate: "",
  });
  const navigate = useNavigate();
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (!accessToken || !verifyUser(accessToken, "admin")) {
      warnToast("Unauthorized Access! Login First");
      navigate("/");
    } else {
      fetchTax();
    }
  }, [accessToken, navigate]);

  const fetchTax = async () => {
    try {
      const response = await getTax();
      setTax(response);
    } catch (error) {
      errorToast(error.response?.data?.message || "Error fetching tax details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTax((prevTax) => ({
      ...prevTax,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    setIsEditable(true);
  };

  const handleSaveChanges = async () => {
    try {
      await setTaxGlobally(tax);
      successToast("Tax updated successfully");
      setIsEditable(false);
    } catch (error) {
      errorToast(error.response?.data?.message || "Error updating tax");
    }
  };

  const handleBack = () => {
    setIsEditable(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh", maxWidth: "900px" }}>
      <div className="row w-100">
        <div className="col">
          <h4 className="text-center mb-4">Manage Tax and Deductions</h4>
          <form>
            <div className="mb-3">
              <label htmlFor="deductionRate" className="form-label" style={{ fontWeight: "bold" }}>
                Deduction Rate
              </label>
              <input type="number" name="deductionRate" id="deductionRate" value={tax.deductionRate} onChange={handleChange} placeholder="0.00" className="form-control form-control-sm" disabled={!isEditable} style={{ fontSize: "0.8rem" }} />
            </div>
            <div className="mb-3">
              <label htmlFor="taxRate" className="form-label" style={{ fontWeight: "bold" }}>
                Tax Rate
              </label>
              <input type="number" name="taxRate" id="taxRate" value={tax.taxRate} onChange={handleChange} placeholder="0.00" className="form-control form-control-sm" disabled={!isEditable} style={{ fontSize: "0.8rem" }} />
            </div>
            <div className="text-center">
              {!isEditable ? (
                <button type="button" className="btn btn-info" onClick={handleUpdate} style={{ backgroundColor: "#1abc9c", color: "white" }}>
                  Update Tax
                </button>
              ) : (
                <>
                  <button type="button" className="btn me-2" onClick={handleSaveChanges} style={{ backgroundColor: "#1abc9c", color: "white" }}> 
                    Save Changes
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleBack}>
                    Back
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageTaxAndDeductions;
