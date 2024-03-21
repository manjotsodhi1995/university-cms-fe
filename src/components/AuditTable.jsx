
import React, { useState, useEffect } from 'react';
import { Table } from '@mantine/core';
import apiClient from '../utils/apiClient';

function AuditTable() {
    const [data, setData] = useState([]);

    useEffect(() => {
        apiClient.get('/university/audit')
            .then(response => setData(response.data.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const tableData = {
        caption: 'Audit Table',
        head: ['ID', 'User', 'Action', 'Timestamp'],
        body: data.map(item => [item.id, item.user, item.action, new Date(item.timestamp).toLocaleString()]),
    };
    return <Table data={tableData} />;
}

export default AuditTable;

