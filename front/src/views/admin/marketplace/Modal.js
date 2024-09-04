// File: src/views/admin/marketplace/Modal.js
import React from 'react';

const Modal = ({ title, children, onClose, onConfirm, confirmText, cancelText }) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl mb-4">{title}</h2>
                {children}
                <div className="flex justify-end mt-4">
                    <button onClick={onConfirm} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                        {confirmText}
                    </button>
                    <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
