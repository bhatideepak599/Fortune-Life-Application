import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { claimAmount } from '../../../../services/withdrawalService';
import { toast } from 'react-toastify';

const WithDrawAmount = ({ agent, onClose }) => {
    const [formData, setFormData] = useState({
        bankName: agent.bankName !== "N/A" ? agent.bankName : '',
        accountNumber: agent.accountNumber !== "N/A" ? agent.accountNumber : '',
        ifscCode: agent.ifscCode !== "N/A" ? agent.ifscCode : '',
        amount: '',
    });

    const [errors, setErrors] = useState({});
    const [showError, setShowError] = useState(false);

    const validate = () => {
        let errors = {};
        let isValid = true;

        // Bank Name Validation (Alphabetic only)
        if (!formData.bankName) {
            isValid = false;
            errors['bankName'] = 'Bank Name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.bankName)) {
            isValid = false;
            errors['bankName'] = 'Bank Name should contain alphabetic characters only';
        }

      
        if (!formData.accountNumber) {
            isValid = false;
            errors['accountNumber'] = 'Account Number is required';
        } else if (!/^\d{8,}$/.test(formData.accountNumber)) {
            isValid = false;
            errors['accountNumber'] = 'Account Number should contain numbers only and be at least 8 digits long';
        }

     
        if (!formData.ifscCode) {
            isValid = false;
            errors['ifscCode'] = 'IFSC Code is required';
        } else if (!/^[a-zA-Z0-9]+$/.test(formData.ifscCode)) {
            isValid = false;
            errors['ifscCode'] = 'IFSC Code should be alphanumeric';
        }

     
        if (!formData.amount || formData.amount <= 0) {
            isValid = false;
            errors['amount'] = 'Amount must be greater than 0';
        } else if (formData.amount > agent.totalCommission) {
            isValid = false;
            errors['amount'] = `Amount cannot exceed total commission of ${agent.totalCommission}`;
        }

        setErrors(errors);
        return isValid;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
          
            const updatedAgent = {
                ...agent,
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode,
            };
            console.log(updatedAgent)

            try {
               const response=await claimAmount(agent.id,formData.amount,updatedAgent);
               console.log(response);
               
               if(response){
                toast.info("Withdrawal Success, It takes 24 to 48 Hours to Process in Your Account.")
                onClose()

               }
            } catch (error) {
                toast.error('Error making the API request:');
            }
       
    }
};

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h2>Withdraw Amount</h2>
            {showError && (
                <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                    <ul>
                        {Object.keys(errors).map((key) => (
                            <li key={key}>{errors[key]}</li>
                        ))}
                    </ul>
                </Alert>
            )}
            <Form onSubmit={handleSubmit} style={{ width: '300px' }}>
                <Form.Group controlId="formBankName">
                    <Form.Label>Bank Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="bankName" 
                        value={formData.bankName} 
                        onChange={handleChange} 
                        placeholder="Enter Bank Name" 
                        isInvalid={!!errors.bankName}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.bankName}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formAccountNumber">
                    <Form.Label>Account Number</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="accountNumber" 
                        value={formData.accountNumber} 
                        onChange={handleChange} 
                        placeholder="Enter Account Number" 
                        isInvalid={!!errors.accountNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.accountNumber}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formIfscCode">
                    <Form.Label>IFSC Code</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="ifscCode" 
                        value={formData.ifscCode} 
                        onChange={handleChange} 
                        placeholder="Enter IFSC Code" 
                        isInvalid={!!errors.ifscCode}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.ifscCode}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formAmount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control 
                        type="number" 
                        name="amount" 
                        value={formData.amount} 
                        onChange={handleChange} 
                        placeholder="Enter Amount" 
                        isInvalid={!!errors.amount}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.amount}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="success" type="submit" style={{ marginTop: '20px', width: '100%' }}>
                    Withdraw
                </Button>
            </Form>
        </div>
    );
};

export default WithDrawAmount;
