import React from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ResourcesList = ({ type = 'success-stories' }) => {
    const [loading, setLoading] = React.useState(false);
    const [resources, setResources] = React.useState([]);

    React.useEffect(() => {
        // TODO: Load resources based on type
        setLoading(false);
    }, [type]);

    const typeLabels = {
        'success-stories': 'Success Stories',
        'case-studies': 'Case Studies',
        'annual-reports': 'Annual Reports',
        'policies': 'Policies',
        'rfqs': 'RFQs/RFPs',
        'gallery': 'Gallery',
        'faqs': 'FAQs',
    };

    if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

    return (
        <AdminLayout>
            <div className="admin-resources-list">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '28px', color: '#2c3e50' }}>{typeLabels[type] || 'Resources'} Management</h1>
                    <button style={{ padding: '10px 20px', backgroundColor: '#0f68bb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        <i className="fas fa-plus"></i> Create {typeLabels[type]}
                    </button>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <p style={{ textAlign: 'center', color: '#666' }}>Resources list for {type} - To be implemented</p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ResourcesList;



