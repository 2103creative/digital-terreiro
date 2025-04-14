import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600">Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingScreen; 