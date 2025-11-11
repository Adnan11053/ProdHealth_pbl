import React, { useState } from 'react';
import { Camera, X, Zap, AlertCircle } from 'lucide-react';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onClose,
  isOpen
}) => {
  const { videoRef, isScanning, error, startScanning, stopScanning } = useBarcodeScanner();
  const [hasStarted, setHasStarted] = useState(false);

  const handleStartScanning = async () => {
    setHasStarted(true);
    await startScanning((barcode) => {
      onScan(barcode);
      onClose();
    });
  };

  const handleClose = () => {
    stopScanning();
    setHasStarted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black bg-opacity-50">
        <h2 className="text-white text-lg font-semibold">Scan Barcode</h2>
        <button
          onClick={handleClose}
          className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        
        {/* Scanning Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Scanning Frame */}
            <div className="w-64 h-40 border-2 border-[#02c39a] rounded-lg relative">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#02c39a] rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#02c39a] rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#02c39a] rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#02c39a] rounded-br-lg"></div>
              
              {/* Scanning Line Animation */}
              {isScanning && (
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div className="w-full h-0.5 bg-[#02c39a] animate-pulse absolute top-1/2 transform -translate-y-1/2"></div>
                </div>
              )}
            </div>
            
            {/* Instructions */}
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
              <p className="text-white text-sm">
                {isScanning ? 'Scanning for barcode...' : 'Position barcode within the frame'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-1/2 left-4 right-4 transform -translate-y-1/2">
          <div className="bg-red-500 text-white p-4 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <div>
              <p className="font-semibold">Camera Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="p-6 bg-black bg-opacity-50">
        <div className="max-w-md mx-auto">
          {!hasStarted ? (
            <button
              onClick={handleStartScanning}
              className="w-full bg-[#02c39a] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#028090] transition-colors flex items-center justify-center"
            >
              <Camera className="w-6 h-6 mr-2" />
              Start Camera
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onScan('8901030895566')} // Demo barcode for testing
                className="flex-1 bg-[#028090] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#00a896] transition-colors flex items-center justify-center"
              >
                <Zap className="w-4 h-4 mr-2" />
                Demo Scan
              </button>
            </div>
          )}
          
          <p className="text-white text-xs text-center mt-3 opacity-75">
            Point your camera at any product barcode to scan
          </p>
        </div>
      </div>
    </div>
  );
};