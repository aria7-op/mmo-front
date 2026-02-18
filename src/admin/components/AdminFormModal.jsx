/**
 * Admin Form Modal Component
 * Reusable modal wrapper for create/edit forms
 */

import React, { useState, useEffect } from 'react';
import AdminModal from './AdminModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminFormModal = ({
    isOpen,
    onClose,
    title,
    isEdit,
    itemId,
    loadItem,
    saveItem,
    FormComponent,
    onSuccess,
    size = 'large',
}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(null);
    const [initialLoad, setInitialLoad] = useState(false);

    useEffect(() => {
        if (isOpen && isEdit && itemId) {
            loadItemData();
        } else if (isOpen && !isEdit) {
            // Reset form data for create mode
            setFormData(null);
            setInitialLoad(true);
        }
    }, [isOpen, isEdit, itemId]);

    const loadItemData = async () => {
        if (!loadItem || !itemId) return;
        
        setLoading(true);
        try {
            const data = await loadItem(itemId);
            setFormData(data);
            setInitialLoad(true);
        } catch (error) {
            console.error('Failed to load item:', error);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data, file) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            // DEV: log the data being saved to help debug status/value issues
            if (import.meta.env.DEV && typeof console !== 'undefined') {
                console.debug('[AdminFormModal] handleSave - data before saveItem:', data, 'file:', file, 'isEdit:', isEdit);
            }
            // Handle both single file and multiple files (object or array)
            const result = await saveItem(itemId, data, file, token, isEdit);
            
            // Close modal on success
            setFormData(null);
            setInitialLoad(false);
            onClose();
            
            if (onSuccess) {
                onSuccess();
            }
            return result;
        } catch (error) {
            console.error('Failed to save:', error);
            throw error; // Let FormComponent handle the error
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData(null);
            setInitialLoad(false);
            onClose();
        }
    };

    return (
        <AdminModal
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            size={size}
        >
            {loading && !initialLoad ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                    <LoadingSpinner />
                </div>
            ) : (
                <FormComponent
                    formData={formData}
                    isEdit={isEdit}
                    onSave={handleSave}
                    onCancel={handleClose}
                    loading={loading}
                />
            )}
        </AdminModal>
    );
};

export default AdminFormModal;

