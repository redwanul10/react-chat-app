import React from 'react';

const Spinner = () => {
    return (
        <div className="text-center">
            <div class="spinner-border text-dark " role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default Spinner;