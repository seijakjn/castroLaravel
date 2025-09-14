import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function Example() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editId) {
            // Update existing record
            try {
                const response = await fetch(`/api/update-data/${editId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    body: JSON.stringify({ firstName, lastName }),
                });

                if (response.ok) {
                    alert('Data updated successfully!');
                    setFirstName('');
                    setLastName('');
                    setEditId(null);
                    handleFetchData();
                } else {
                    alert('Failed to update data.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred.');
            }
        } else {
            // Create new record
            try {
                const response = await fetch('/api/save-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    body: JSON.stringify({ firstName, lastName }),
                });

                if (response.ok) {
                    alert('Data saved successfully!');
                    setFirstName('');
                    setLastName('');
                    handleFetchData();
                } else {
                    alert('Failed to save data.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred.');
            }
        }
    };

    const handleFetchData = async () => {
        try {
            const response = await fetch('/fetch-data');
            if (response.ok) {
                const result = await response.json();
                setData(result);
            } else {
                alert('Failed to fetch data.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching data.');
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setFirstName(item.first_name);
        setLastName(item.last_name);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        try {
            const response = await fetch(`/api/delete-data/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });
            if (response.ok) {
                alert('Data deleted successfully!');
                handleFetchData();
            } else {
                alert('Failed to delete data.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting data.');
        }
    };

    return (
        <div className="card shadow p-4">
            <h2 className="text-center mb-4">{editId ? 'Edit Data' : 'Submit Your Data'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        className="form-control"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        className="form-control"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success w-100">
                    {editId ? 'Update' : 'Submit'}
                </button>
                {editId && (
                    <button
                        type="button"
                        className="btn btn-secondary w-100 mt-2"
                        onClick={() => {
                            setEditId(null);
                            setFirstName('');
                            setLastName('');
                        }}
                    >
                        Cancel Edit
                    </button>
                )}
            </form>

            <button onClick={handleFetchData} className="btn btn-primary w-100 mt-3">View Data</button>

            {data.length > 0 && (
                <div className="table-responsive mt-4">
                    <table className="table table-bordered table-striped">
                        <thead className="table-success">
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.first_name}</td>
                                    <td>{item.last_name}</td>
                                    <td>{new Date(item.created_at).toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Example;

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}