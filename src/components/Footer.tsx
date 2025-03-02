import React from 'react';
import { Info } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    // <footer className="bg-primary-dark text-white py-6">
    //   <div className="container mx-auto px-4">
    //     <div className="flex flex-col md:flex-row justify-between items-center">
    //       <div className="mb-4 md:mb-0 text-center md:text-left">
    //         <h3 className="text-lg font-semibold mb-2">Tentang THR</h3>
    //         <p className="text-sm text-gray-300 max-w-md">
    //           THR (Tunjangan Hari Raya) adalah bonus yang diberikan kepada karyawan 
    //           atau keluarga menjelang hari raya keagamaan, khususnya Idul Fitri.
    //         </p>
    //       </div>
          
    //       <div className="text-center md:text-right">
    //         <div className="flex items-center justify-center md:justify-end mb-2">
    //           <Info size={16} className="mr-1 text-primary-light" />
    //           <span className="text-sm text-primary-light">Info</span>
    //         </div>
    //         <p className="text-xs text-gray-400">
    //           THR Gacha App © {new Date().getFullYear()}
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </footer>
    <footer className="bg-primary-dark text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs">
          THR Gacha © {new Date().getFullYear()} - Arifjagad
        </p>
      </div>
    </footer>
  );
};

export default Footer;