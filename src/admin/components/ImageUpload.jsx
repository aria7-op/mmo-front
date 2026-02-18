import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ImageUpload = ({ 
    currentImage, 
    onUpload, 
    onDelete, 
    uploading = false, 
    folder = 'uploads',
    maxSize = 5 * 1024 * 1024, // 5MB default
    acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}) => {
    const { t } = useTranslation();
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        setError('');

        // Validate file type
        if (!acceptedTypes.includes(file.type)) {
            setError('Invalid file type. Please upload JPEG, PNG, or WebP images.');
            return;
        }

        // Validate file size
        if (file.size > maxSize) {
            setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB.`);
            return;
        }

        onUpload(file);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="image-upload-container">
            {currentImage ? (
                <div className="current-image">
                    <div className="image-preview">
                        <img 
                            src={currentImage.url} 
                            alt="Current" 
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '300px', 
                                borderRadius: '8px',
                                border: '1px solid #ddd'
                            }} 
                        />
                        <div className="image-info">
                            <p><strong>File:</strong> {currentImage.originalName || currentImage.filename}</p>
                            <p><strong>Size:</strong> {currentImage.size ? formatFileSize(currentImage.size) : 'Unknown'}</p>
                            <p><strong>Type:</strong> {currentImage.mimetype || 'Unknown'}</p>
                            {currentImage.url && (
                                <p>
                                    <strong>URL:</strong>{' '}
                                    <a href={currentImage.url} target="_blank" rel="noopener noreferrer">
                                        {currentImage.url}
                                    </a>
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="image-actions">
                        <button
                            type="button"
                            onClick={() => document.getElementById('file-input').click()}
                            disabled={uploading}
                            className="btn btn-secondary me-2"
                        >
                            <i className="fa fa-upload me-2"></i>
                            {uploading ? 'Uploading...' : 'Replace Image'}
                        </button>
                        <button
                            type="button"
                            onClick={onDelete}
                            disabled={uploading}
                            className="btn btn-danger"
                        >
                            <i className="fa fa-trash me-2"></i>
                            Delete Image
                        </button>
                    </div>
                </div>
            ) : (
                <div className="upload-area">
                    <div
                        className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-input').click()}
                        style={{
                            border: '2px dashed #ccc',
                            borderRadius: '8px',
                            padding: '40px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: dragActive ? '#f8f9fa' : '#fafafa',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <i className="fa fa-cloud-upload" style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }}></i>
                        <h4>{t('admin.imageUpload.dragDrop', 'Drag & Drop Image Here')}</h4>
                        <p className="text-muted">{t('admin.imageUpload.or', 'OR')}</p>
                        <button
                            type="button"
                            disabled={uploading}
                            className="btn btn-primary"
                        >
                            <i className="fa fa-folder-open me-2"></i>
                            {uploading ? 'Uploading...' : 'Browse Files'}
                        </button>
                        <p className="text-muted mt-3">
                            {t('admin.imageUpload.allowedTypes', 'Allowed types')}: JPEG, PNG, WebP<br />
                            {t('admin.imageUpload.maxSize', 'Max size')}: {Math.round(maxSize / (1024 * 1024))}MB
                        </p>
                    </div>

                    {error && (
                        <div className="alert alert-danger mt-3">
                            <i className="fa fa-exclamation-triangle me-2"></i>
                            {error}
                        </div>
                    )}
                </div>
            )}

            <input
                id="file-input"
                type="file"
                accept={acceptedTypes.join(',')}
                onChange={handleFileInput}
                style={{ display: 'none' }}
            />

            <style>{`
                .upload-zone:hover {
                    border-color: #007bff;
                    background-color: #f8f9ff;
                }
                
                .drag-active {
                    border-color: #007bff !important;
                    background-color: #e3f2fd !important;
                }

                .current-image {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 20px;
                    background-color: #fafafa;
                }

                .image-preview {
                    display: flex;
                    gap: 20px;
                    align-items: flex-start;
                    margin-bottom: 20px;
                }

                .image-preview img {
                    flex-shrink: 0;
                }

                .image-info {
                    flex: 1;
                }

                .image-info p {
                    margin: 5px 0;
                    font-size: 14px;
                }

                .image-actions {
                    display: flex;
                    gap: 10px;
                }

                @media (max-width: 768px) {
                    .image-preview {
                        flex-direction: column;
                    }
                    
                    .image-actions {
                        flex-direction: column;
                    }
                    
                    .image-actions .btn {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default ImageUpload;
