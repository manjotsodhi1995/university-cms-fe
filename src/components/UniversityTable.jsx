import React, { useEffect, useState } from 'react';
import { Table, Paper, Button, Modal, TextInput } from '@mantine/core';
import apiClient from '../utils/apiClient';


function UniversitiesTable() {
    const [data, setData] = useState();
    const [modalOpened, setModalOpened] = useState(false);
    const [selectedUniversity, setSelectedUniversity] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get('/university');
                setData(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleAdd = () => {
        setSelectedUniversity({
            university: {
                name: ''
            },
            locations: [{
                name: '',
                address: ''
            }],
            contactInformation: [{
                name: '',
                phone: '',
                email: '',
                address: ''
            }]
        });
        setModalOpened(true);
    };

    const handleEdit = (university) => {
        setSelectedUniversity(university);
        setModalOpened(true);
    };

    const handleDelete = (universityId) => {
        setData(data.filter(university => university.university.id !== universityId));
    };

    const handleSave = () => {
        // Validate inputs and handle save logic
        const newData = {
            university: selectedUniversity.university,
            locations: selectedUniversity.locations.filter(location => location.name !== '' && location.address !== ''),
            contactInformation: selectedUniversity.contactInformation.filter(contact => contact.name !== '' && contact.phone !== '' && contact.email !== '')
        };

        if (selectedUniversity) {
            setData(data.map(item => item.university.id === selectedUniversity.university.id ? newData : item));
        } else {
            setData([...data, newData]);
        }
        setModalOpened(false);
        setSelectedUniversity(null);
    };

    const handleLocationChange = (index, field, value) => {
        const newLocations = [...selectedUniversity.locations];
        newLocations[index][field] = value;
        setSelectedUniversity({ ...selectedUniversity, locations: newLocations });
    };

    const handleContactChange = (index, field, value) => {
        const newContacts = [...selectedUniversity.contactInformation];
        newContacts[index][field] = value;
        setSelectedUniversity({ ...selectedUniversity, contactInformation: newContacts });
    };

    const handleAddLocation = () => {
        setSelectedUniversity({ ...selectedUniversity, locations: [...selectedUniversity.locations, { name: '', address: '' }] });
    };

    const handleAddContact = () => {
        setSelectedUniversity({
            ...selectedUniversity, contactInformation: [...selectedUniversity.contactInformation, {
                name: '',
                phone: '',
                email: '',
                address: ''
            }]
        });
    }

    return (
        <>
            {data && data.length > 0 ? <>  <Table withBorder withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Locations</Table.Th>
                        <Table.Th>Contact Information</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {data?.map((university, index) => (
                        <Table.Tr key={index}>
                            <Table.Td>{university.university.id}</Table.Td>
                            <Table.Td>{university.university.name}</Table.Td>
                            <Table.Td>
                                <ul>
                                    {university.locations.map((location, index) => (
                                        <li key={index}>
                                            {location.name}: {location.address}
                                        </li>
                                    ))}
                                </ul>
                            </Table.Td>
                            <Table.Td>
                                <ul>
                                    {university.contactInformation.map((contact, index) => (
                                        <li key={index}>
                                            {contact.name}: {contact.phone}, {contact.email}
                                        </li>
                                    ))}
                                </ul>
                            </Table.Td>
                            <Table.Td>
                                <Button onClick={() => handleEdit(university)}>Edit</Button>
                                <Button onClick={() => handleDelete(university.university.id)}>Delete</Button>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
                <br />
            </> : <h2>No data found</h2>}
            <Button onClick={handleAdd}>Add University</Button>


            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title={selectedUniversity ? 'Edit University' : 'Add University'}
                className="custom-modal"
            >
                <Paper span={6}>
                    <TextInput
                        label="Name"
                        placeholder="Enter university name"
                        value={selectedUniversity ? selectedUniversity.university.name : ''}
                        onChange={(e) => setSelectedUniversity({ ...selectedUniversity, university: { ...selectedUniversity.university, name: e.currentTarget.value } })}
                    />
                    <br />
                    <h3>Locations:</h3>
                    {selectedUniversity && selectedUniversity.locations.map((location, index) => (
                        <div key={index}>
                            <TextInput
                                label={`Location ${index + 1}`}
                                placeholder="Enter location name"
                                value={location.name}
                                onChange={(e) => handleLocationChange(index, 'name', e.currentTarget.value)}
                            />
                            <TextInput
                                label={`Address ${index + 1}`}
                                placeholder="Enter location address"
                                value={location.address}
                                onChange={(e) => handleLocationChange(index, 'address', e.currentTarget.value)}
                            />
                            <br />
                        </div>
                    ))}

                    <Button onClick={handleAddLocation}>Add Location</Button>
                    <br />
                    <h3>Contact Information:</h3>
                    {selectedUniversity && selectedUniversity.contactInformation.map((contact, index) => (
                        <div key={index}>
                            <TextInput
                                label={`Contact Name ${index + 1}`}
                                placeholder="Enter contact name"
                                value={contact.name}
                                onChange={(e) => handleContactChange(index, 'name', e.currentTarget.value)}
                            />
                            <TextInput
                                label={`Phone ${index + 1}`}
                                placeholder="Enter phone number"
                                value={contact.phone}
                                onChange={(e) => handleContactChange(index, 'phone', e.currentTarget.value)}
                            />
                            <TextInput
                                label={`Email ${index + 1}`}
                                placeholder="Enter email address"
                                value={contact.email}
                                onChange={(e) => handleContactChange(index, 'email', e.currentTarget.value)}
                            />
                            <TextInput
                                label={`Adress ${index + 1}`}
                                placeholder="Enter address"
                                value={contact.address}
                                onChange={(e) => handleContactChange(index, 'address', e.currentTarget.value)}
                            />

                            <br />

                        </div>
                    ))}
                    <Button onClick={handleAddContact}>Add Contact</Button>
                    <br />

                    <Button onClick={() => handleSave(selectedUniversity)}>Save</Button>
                </Paper>
            </Modal>
        </>
    );
}

export default UniversitiesTable;
