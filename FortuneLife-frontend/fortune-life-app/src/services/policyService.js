import axios from "axios";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../assets/images/fortunelife-high-resolution-logo-black.png';
const API_BASE_URL = `http://localhost:8082`;
const accessToken = `Bearer ${localStorage.getItem("accessToken")}`;

export const getAllPolicies = async (pageSize, pageNumber, searchParams) => {
  try {
    const params = {
      id: searchParams.id || undefined,
      customerId: searchParams.customerId || undefined,
      agentId: searchParams.agentId || undefined,
      schemeId: searchParams.schemeId || undefined,
      schemeName: searchParams.schemeName || undefined,
      customerName: searchParams.customerName || undefined,
      policyStatus: searchParams.policyStatus || undefined,
      page: pageNumber,
      size: pageSize,
    };

    const response = await axios.get(`${API_BASE_URL}/fortuneLife/policy`, {
      headers: {
        Authorization: accessToken,
      },
      params,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCommissions = async (pageSize, pageNumber, searchParams) => {
  const accessToken = `Bearer ${localStorage.getItem("accessToken")}`;
  try {
    const params = {
      id: searchParams.id || undefined,
      policyId: searchParams.policyId || undefined,
      agentId: searchParams.agentId || undefined,
      commissionType: searchParams.commissionType || undefined,
      customerName: searchParams.agentName || undefined,
      page: pageNumber,
      size: pageSize,
    };

    const response = await axios.get(`${API_BASE_URL}/fortuneLife/policy/commission`, {
      headers: {
        Authorization: accessToken,
      },
      params,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCommissionsOfLoggedAdmin = async (pageSize, pageNumber, searchParams) => {
  try {
    const params = {
      id: searchParams.id || undefined,
      policyId: searchParams.policyId || undefined,
      commissionType: searchParams.commissionType || undefined,
      page: pageNumber,
      size: pageSize,
    };

    const response = await axios.get(`${API_BASE_URL}/fortuneLife/policy/all-commission`, {
      headers: {
        Authorization: accessToken,
      },
      params,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllClient = async (pageSize, pageNumber, searchParams) => {
  try {
    const accessToken1 = `Bearer ${localStorage.getItem("accessToken")}`;
    const params = {
      id: searchParams.id || undefined,
      customerId: searchParams.customerId || undefined,
      name: searchParams.name || undefined,
      policyStatus: searchParams.policyStatus || undefined,
      page: pageNumber,
      size: pageSize,
    };

    const response = await axios.get(`${API_BASE_URL}/fortuneLife/policy/all-clients`, {
      headers: {
        Authorization: accessToken1,
      },
      params,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPolociesReport = async () => {
  try {
    const accessToken1 = `Bearer ${localStorage.getItem("accessToken")}`;

    const response = await axios.get(`${API_BASE_URL}/fortuneLife/policy/policy-report`, {
      headers: {
        Authorization: accessToken1,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getRevenueReports = async (startDate, endDate) => {
  try {
    const accessToken = `Bearer ${localStorage.getItem("accessToken")}`;
    
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/payments/revenue`, {
      headers: {
        Authorization: accessToken,
      },
      params: {
        startDate: startDate,
        endDate: endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching revenue report:", error);
    throw new Error(error);
  }
};


export const verifyPolicy = async (policyId, documentDtos) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/fortuneLife/policy/${policyId}/verify-policy`, documentDtos, {
      headers: {
        Authorization: accessToken,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllPoliciesByEmployee = async (pageSize, pageNumber, searchParams) => {
  try {
    const params = {
      id: searchParams.policyId || undefined,
      customerId: searchParams.customerId || undefined,
      agentId: searchParams.agentId || undefined,
      schemeName: searchParams.schemeName || undefined,
      policyStatus: searchParams.policyStatus || undefined,
      verified: searchParams.verificationStatus || undefined,
      page: pageNumber,
      size: pageSize,
    };

    const response = await axios.get(`${API_BASE_URL}/fortuneLife/policy`, {
      headers: {
        Authorization: accessToken,
      },
      params,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};



export const downloadReciet = (installmentNumber, policy) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5', // A5 page size for a smaller receipt-like document
  });

  // Add the company logo
  doc.addImage(logo, 'PNG', 0, 0, 150, 50); // (imagePath, type, x, y, width, height)

  // Add a colored header background for the title
  doc.setFillColor(220, 220, 220); // Light grey background
  doc.rect(10, 35, 130, 15, 'F'); // Draw rectangle for header

  // Set the receipt title in the header (centered)
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0); // Black text color
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Receipt', 75, 45, { align: 'center' });

  // Add a line below the header
  doc.setLineWidth(0.2);
  doc.line(20, 55, 130, 55);

  // Reset text color for regular content
  doc.setTextColor(0, 0, 0);

  // Add policy and holder details
  doc.setFontSize(12);
  
  // Make the label text bold
  doc.setFont('helvetica', 'bold');
  doc.text('Installment Number: ', 20, 65);
  doc.text('Policy ID: ', 20, 75);
  doc.text('Policy Holder: ', 20, 85);
  
  // Set font to bold for the values
  doc.setFont('helvetica', 'bold');
  doc.text(`${installmentNumber}`, 80, 65);
  doc.text(`${policy.policyId}`, 80, 75);
  doc.text(`${policy.policyHolderName}`, 80, 85);

  // Add payment details using a table
  doc.autoTable({
    startY: 95,
    theme: 'grid',
    head: [['Description', 'Amount']],
    body: [
      ['Premium Amount', `INR ${policy.amount}`],
      ['Tax', `INR ${policy.tax}`],
      ['Total Payment', `INR ${policy.totalPayment}`],
      ['Payment Method', policy.paymentType.replace(/_/g, ' ')],
      ['Payment Status', policy.paymentStatus],
      ['Payment Date', new Date(policy.dateOfPayment).toLocaleDateString()],
    ],
    didParseCell: function (data) {
      if (data.section === 'body' && data.column.index === 1) {
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });
  

  // Highlight the "Total Payment" and "Payment Status" with colored text
  const finalY = doc.lastAutoTable.finalY + 10; // Position after the table
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 153, 51); // Green for total payment
  doc.text(`Total Payment: INR ${policy.totalPayment}`, 20, finalY);
  
  // Change color for payment status depending on whether it's paid
  doc.setTextColor(policy.paymentStatus === 'PAID' ? 0 : 255, 0, 0); // Green if paid, red if not
  doc.text(`Payment Status: ${policy.paymentStatus}`, 20, finalY + 10);

  // Add footer with thank you message and date
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(0, 0, 0); // Reset to black
  doc.text('Thank you for your payment!', 70, finalY + 30, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Receipt generated on: ${new Date().toLocaleDateString()}`, 70, finalY + 40, { align: 'center' });

  // Save the PDF
  doc.save(`Receipt_Installment_${installmentNumber}_${policy.policyId}.pdf`);
};
