import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import certificateService from '../../services/certificate.service';

const CertificateSearch = ({ onClose }) => {
    const { t } = useTranslation();
    const [searchName, setSearchName] = useState(window.certificateSearchName || '');
    const [searching, setSearching] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    // Clear the window object when component unmounts
    React.useEffect(() => {
        return () => {
            window.certificateSearchName = '';
        };
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchName.trim()) {
            setError('Please enter a name to search');
            return;
        }

        setSearching(true);
        setError('');
        setResult(null);

        try {
            const response = await certificateService.getAllCertificates({
                search: searchName.trim(),
                status: 'active'
            });

            if (response.success && response.data.certificates.length > 0) {
                const foundCertificate = response.data.certificates.find(
                    cert => cert.recipientName.toLowerCase().includes(searchName.trim().toLowerCase())
                );
                
                if (foundCertificate) {
                    setResult({
                        valid: true,
                        certificate: foundCertificate
                    });
                } else {
                    setResult({
                        valid: false,
                        message: 'No certificate found for this name'
                    });
                }
            } else {
                setResult({
                    valid: false,
                    message: 'No certificate found for this name'
                });
            }
        } catch (err) {
            setError('Failed to search certificate. Please try again.');
        } finally {
            setSearching(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '500px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
                        Search Certificate
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#666'
                        }}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSearch}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Enter Your Name:
                        </label>
                        <input
                            type="text"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            placeholder="Enter your full name"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    {error && (
                        <div style={{
                            color: '#dc3545',
                            fontSize: '14px',
                            marginBottom: '15px',
                            padding: '10px',
                            backgroundColor: '#f8d7da',
                            border: '1px solid #f5c6cb',
                            borderRadius: '4px'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={searching}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#0f68bb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: searching ? 'not-allowed' : 'pointer',
                            opacity: searching ? 0.7 : 1
                        }}
                    >
                        {searching ? 'Searching...' : 'Search Certificate'}
                    </button>
                </form>

                {result && (
                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        borderRadius: '6px',
                        backgroundColor: result.valid ? '#d4edda' : '#f8d7da',
                        border: `1px solid ${result.valid ? '#c3e6cb' : '#f5c6cb'}`
                    }}>
                        {result.valid ? (
                            <div>
                                <h4 style={{ 
                                    margin: '0 0 10px 0', 
                                    color: '#155724',
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }}>
                                    ✓ Certificate is Valid
                                </h4>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                                    <strong>Certificate ID:</strong> {result.certificate.certificateId}
                                </p>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                                    <strong>Recipient:</strong> {result.certificate.recipientName}
                                </p>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                                    <strong>Course:</strong> {result.certificate.courseTitle}
                                </p>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                                    <strong>Completion Date:</strong> {new Date(result.certificate.completionDate).toLocaleDateString()}
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h4 style={{ 
                                    margin: '0 0 10px 0', 
                                    color: '#721c24',
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }}>
                                    ✗ Certificate Not Found
                                </h4>
                                <p style={{ margin: 0, fontSize: '14px' }}>
                                    {result.message}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CertificateSearch;
