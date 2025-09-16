import React from 'react';
import ReactDOM from 'react-dom';

function Home() {
    const handleBack = () => {
        window.location.href = '/';
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">home the place</div>
                        <div className="card-body">
                            <p>Future home page, tbwo</p>
                            <button className="btn btn-primary" onClick={handleBack}>
                                Back to Main App
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

if (document.getElementById('home')) {
    ReactDOM.render(<Home />, document.getElementById('home'));
}

export default Home;