import React from 'react';
import { Printer } from 'lucide-react';

const PrintButton = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button className="print-button no-print" onClick={handlePrint}>
      <Printer size={20} />
      <span>چاپکردنی دەفتەری کارەکان</span>
    </button>
  );
};

export default PrintButton;
