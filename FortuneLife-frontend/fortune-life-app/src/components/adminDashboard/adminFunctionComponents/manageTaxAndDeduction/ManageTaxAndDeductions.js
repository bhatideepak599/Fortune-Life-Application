import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { errorToast, successToast } from '../../../../utils/Toast';
import { getTax, setTaxGlobally } from '../../../../services/adminService';

const ManageTaxAndDeductions = () => {
    const [tax, setTax] = useState({
        deductionRate: '',
        taxRate: ''
    });

    const [isEditable, setIsEditable] = useState(false); // To toggle edit mode

    useEffect(() => {
        fetchTax();
    }, []);

    const fetchTax = async () => {
        try {
            const response = await getTax();
            setTax(response);
        } catch (error) {
            errorToast(error.response?.data?.message || 'Error fetching tax details');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTax(prevTax => ({
            ...prevTax,
            [name]: value
        }));
    };

    const handleUpdate = () => {
        setIsEditable(true); // Enable editing
    };

    const handleSaveChanges = async () => {
        try {
            await setTaxGlobally(tax);
            successToast('Tax updated successfully');
            setIsEditable(false); // Disable editing after saving
        } catch (error) {
            errorToast(error.response?.data?.message || 'Error updating tax');
        }
    };

    const handleBack = () => {
        setIsEditable(false); // Disable editing and go back to initial state
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <Row className="w-50">
                <Col>
                    <h2 className="text-center mb-4">Manage Tax and Deductions</h2>
                    <Form>
                        <Form.Group controlId="deductionRate" className="mb-3">
                            <Form.Label style={{ fontWeight: 'bold' }}>Deduction Rate</Form.Label>
                            <Form.Control
                                type="number"
                                name="deductionRate"
                                value={tax.deductionRate}
                                onChange={handleChange}
                                placeholder="0.00"
                                style={{ fontSize: '0.8rem' }} // Smaller placeholder text
                                disabled={!isEditable} // Disable input if not editable
                            />
                        </Form.Group>
                        <Form.Group controlId="taxRate" className="mb-3">
                            <Form.Label style={{ fontWeight: 'bold' }}>Tax Rate</Form.Label>
                            <Form.Control
                                type="number"
                                name="taxRate"
                                value={tax.taxRate}
                                onChange={handleChange}
                                placeholder="0.00"
                                style={{ fontSize: '0.8rem' }} // Smaller placeholder text
                                disabled={!isEditable} // Disable input if not editable
                            />
                        </Form.Group>
                        <div className="text-center">
                            {!isEditable ? (
                                <Button variant="info" onClick={handleUpdate}>
                                    Update Tax
                                </Button>
                            ) : (
                                <>
                                    <Button variant="success" onClick={handleSaveChanges} className="me-2">
                                        Save Changes
                                    </Button>
                                    <Button variant="secondary" onClick={handleBack}>
                                        Back
                                    </Button>
                                </>
                            )}
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ManageTaxAndDeductions;
