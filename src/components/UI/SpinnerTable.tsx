import React from 'react';

const SpinnerTable: React.FC = () => {
    return (
      <div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-none">
        <div className="bg-white w-32 h-32 flex justify-center items-center rounded-md shadow-md">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  };
  
  export default SpinnerTable;
  