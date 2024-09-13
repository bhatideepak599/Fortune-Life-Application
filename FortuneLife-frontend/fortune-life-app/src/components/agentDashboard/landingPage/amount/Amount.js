import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';

const Amount = ({ agent, withdrawAmount, setWithdrawAmount, onClose }) => {
    useEffect(() => {
        console.log(agent);
    }, [agent]);

    const handleWithdraw = () => {
        setWithdrawAmount(true);
        onClose()
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
        <h2>Total Amount</h2>
        <p><strong>Agent ID:</strong> {agent.id}</p>
        <p><strong>Name:</strong> {`${agent.userDto.firstName} ${agent.userDto.lastName}`}</p>
        <p><strong>Total Balance:</strong> {agent.totalCommission}</p>
        <Button variant="success" onClick={handleWithdraw}>Withdraw</Button>
    </div>
    );
};

export default Amount;
