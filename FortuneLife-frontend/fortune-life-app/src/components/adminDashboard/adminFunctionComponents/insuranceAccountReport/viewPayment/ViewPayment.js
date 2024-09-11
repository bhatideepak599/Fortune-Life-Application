import React from 'react';
import { Table, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const ViewPayment = ({ payments }) => {

  const downloadPDF = () => {
    const input = document.getElementById('payments-table');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('payments.pdf');
    });
  };

  return (
    <div>
  <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>All Payments</h2>
  <Button variant="success" onClick={downloadPDF} style={{ marginBottom: '20px' }}>
    Download PDF
  </Button>
  <Table
    id="payments-table"
    striped
    bordered
    hover
    responsive
    style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
  >
    <thead style={{ backgroundColor: '#f8f9fa' }}>
      <tr>
        <th>Policy Holder Name</th>
        <th>Policy ID</th>
        <th>Payment ID</th>
        <th style={{ width: '110px' }}>Date of Payment</th>
        <th style={{ width: '110px' }}>Payment Type</th>
        <th>Amount</th>
        <th>Tax</th>
        <th>Total Payment</th>
        <th>Payment Status</th>
      </tr>
    </thead>
    <tbody>
      {payments.map((payment, index) => (
        <tr key={index}>
          <td>{payment.policyHolderName}</td>
          <td>{payment.policyId}</td>
          <td>{payment.paymentId}</td>
          <td>{new Date(payment.dateOfPayment).toLocaleDateString()}</td>
          <td>{payment.paymentType}</td>
          <td>{payment.amount}</td>
          <td>{payment.tax}</td>
          <td>{payment.totalPayment}</td>
          <td
            style={{
              color: payment.paymentStatus === 'PAID' ? 'green' : 'red',
              fontWeight: 'bold',
            }}
          >
            {payment.paymentStatus}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
</div>

  );
};
