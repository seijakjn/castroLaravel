import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function Example() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [data, setData] = useState([]); // State to store fetched data

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            } else {
                alert('Failed to save data.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
        }
    };

    const handleFetchData = async () => {
        try {
            const response = await fetch('/fetch-data');
            if (response.ok) {
                const result = await response.json();
                setData(result); // Update the state with fetched data
            } else {
                alert('Failed to fetch data.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching data.');
        }
    };

    return (
        <div className="card shadow p-4">
            <h2 className="text-center mb-4">Submit Your Data</h2>
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
                <button type="submit" className="btn btn-success w-100">Submit</button>
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
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.first_name}</td>
                                    <td>{item.last_name}</td>
                                    <td>{new Date(item.created_at).toLocaleString()}</td>
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