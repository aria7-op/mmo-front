/**
 * Articles List Page
 * List all articles with CRUD operations
 */

import React, { useState } from 'react';
import { useArticles } from '../../hooks/useArticles';
import { deleteArticle, getArticleById, createArticle, updateArticle } from '../../services/articles.service';
import { formatMultilingualContent, getImageUrlFromObject, formatDate, stripHtmlTags } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast, showCrudToasts, showLoadingToast, dismissToast } from '../../utils/errorHandler';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminFormModal from '../components/AdminFormModal';
import ArticleFormContent from '../components/forms/ArticleFormContent';

const ArticlesList = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const [filter, setFilter] = useState({ status: 'published', page: 1, limit: 20 });
    const { articles, pagination, loading, error, refetch } = useArticles(filter);
    const [deleting, setDeleting] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleCreate = () => {
        setEditingId(null);
        setModalOpen(true);
    };

    const handleEdit = (id) => {
        setEditingId(id);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setEditingId(null);
    };

    const handleSaveSuccess = () => {
        showCrudToasts[editingId ? 'update' : 'create']('Article');
        refetch();
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.deleteArticleConfirm', 'Are you sure you want to delete this article?'))) {
            return;
        }

        setDeleting(id);
        try {
            const token = localStorage.getItem('authToken');
            await deleteArticle(id, token);
            showCrudToasts.delete('Article');
            refetch();
        } catch (error) {
            showCrudToasts.deleteError('Article', error.message || 'Unknown error');
            console.error('Delete error:', error);
        } finally {
            setDeleting(null);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-articles-list" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <h1 style={{ fontSize: '28px', color: '#2c3e50' }}>{t('admin.articles')} {t('admin.management', 'Management')}</h1>
                    <button
                        onClick={handleCreate}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#0f68bb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'background-color 0.3s',
                            flexDirection: isRTL ? 'row-reverse' : 'row',
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#0d5ba0'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#0f68bb'}
                    >
                        <i className="fas fa-plus"></i>
                        <span>{t('admin.createArticle', 'Create Article')}</span>
                    </button>
                </div>

                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <select
                        value={filter.status || 'all'}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value === 'all' ? '' : e.target.value, page: 1 })}
                        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', textAlign: isRTL ? 'right' : 'left' }}
                    >
                        <option value="all">{t('admin.allStatus', 'All Status')}</option>
                        <option value="published">{t('admin.published', 'Published')}</option>
                        <option value="draft">{t('admin.draft', 'Draft')}</option>
                    </select>
                </div>

                {error && (
                    <div style={{ padding: '15px', backgroundColor: '#fee', color: '#c33', borderRadius: '4px', marginBottom: '20px', textAlign: isRTL ? 'right' : 'left' }}>
                        {t('admin.errorLoadingArticles', 'Error loading articles')}: {error.message}
                    </div>
                )}

                <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                <th style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left', fontWeight: '600' }}>{t('admin.image', 'Image')}</th>
                                <th style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left', fontWeight: '600' }}>{t('admin.title', 'Title')}</th>
                                <th style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left', fontWeight: '600' }}>{t('admin.reportType', 'Report Type')}</th>
                                <th style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left', fontWeight: '600' }}>{t('admin.status', 'Status')}</th>
                                <th style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left', fontWeight: '600' }}>{t('admin.created', 'Created')}</th>
                                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>{t('admin.actions', 'Actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles && articles.length > 0 ? (
                                articles.map((item) => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                        <td style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left' }}>
                                            {item.image ? (
                                                <img
                                                    src={getImageUrlFromObject(item.image)}
                                                    alt={typeof formatMultilingualContent(item.title, i18n.language) === 'string' ? formatMultilingualContent(item.title, i18n.language) : 'Article image'}
                                                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', backgroundColor: '#f0f0f0' }}
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        if (!e.target.nextElementSibling || e.target.nextElementSibling.className !== 'image-placeholder') {
                                                            const placeholder = document.createElement('div');
                                                            placeholder.className = 'image-placeholder';
                                                            placeholder.style.cssText = 'width: 80px; height: 60px; background-color: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 10px;';
                                                            placeholder.textContent = t('admin.noImage', 'No Image');
                                                            e.target.parentNode.insertBefore(placeholder, e.target.nextSibling);
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div style={{ width: '80px', height: '60px', backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '10px' }}>
                                                    {t('admin.noImage', 'No Image')}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left' }}>
                                            <div style={{ fontWeight: '500', marginBottom: '5px' }}>
                                                {typeof formatMultilingualContent(item.title, i18n.language) === 'string' 
                                                    ? formatMultilingualContent(item.title, i18n.language) 
                                                    : 'No title'
                                                }
                                            </div>
                                            {item.content && (
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    {typeof formatMultilingualContent(item.content, i18n.language) === 'string'
                                                        ? stripHtmlTags(formatMultilingualContent(item.content, i18n.language)).substring(0, 80) + '...'
                                                        : 'No content available...'
                                                    }
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left' }}>
                                            {typeof formatMultilingualContent(item.reportType, i18n.language) === 'string'
                                                ? formatMultilingualContent(item.reportType, i18n.language)
                                                : 'No type'
                                            }
                                        </td>
                                        <td style={{ padding: '12px', textAlign: isRTL ? 'right' : 'left' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                backgroundColor: item.status === 'published' ? '#d4edda' : '#fff3cd',
                                                color: item.status === 'published' ? '#155724' : '#856404',
                                            }}>
                                                {t(`admin.${item.status}`, item.status)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', fontSize: '14px', color: '#666', textAlign: isRTL ? 'right' : 'left' }}>
                                            {formatDate(item.createdAt)}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                                <button
                                                    onClick={() => handleEdit(item._id)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: '#3498db',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                    }}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    disabled={deleting === item._id}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: deleting === item._id ? '#95a5a6' : '#e74c3c',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: deleting === item._id ? 'not-allowed' : 'pointer',
                                                        fontSize: '12px',
                                                    }}
                                                >
                                                    {deleting === item._id ? (
                                                        <i className="fas fa-spinner fa-spin"></i>
                                                    ) : (
                                                        <i className="fas fa-trash"></i>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                                        {t('admin.noArticlesFound', 'No articles found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination && pagination.pages > 1 && (
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <button
                            onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
                            disabled={filter.page <= 1}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: filter.page <= 1 ? '#ddd' : '#0f68bb',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: filter.page <= 1 ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {t('admin.previous', 'Previous')}
                        </button>
                        <span style={{ padding: '8px 16px', display: 'flex', alignItems: 'center' }}>
                            {t('admin.page', 'Page')} {pagination.current} {t('admin.of', 'of')} {pagination.pages}
                        </span>
                        <button
                            onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
                            disabled={filter.page >= pagination.pages}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: filter.page >= pagination.pages ? '#ddd' : '#0f68bb',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: filter.page >= pagination.pages ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {t('admin.next', 'Next')}
                        </button>
                    </div>
                )}
            </div>

            <AdminFormModal
                isOpen={modalOpen}
                onClose={handleModalClose}
                title={editingId ? t('admin.editArticle', 'Edit Article') : t('admin.createArticle', 'Create Article')}
                isEdit={!!editingId}
                itemId={editingId}
                loadItem={getArticleById}
                saveItem={async (id, data, file, token, isEditMode) => {
                    return isEditMode ? await updateArticle(id, data, file, token) : await createArticle(data, file, token);
                }}
                FormComponent={ArticleFormContent}
                onSuccess={handleSaveSuccess}
                size="xlarge"
            />
        </AdminLayout>
    );
};

export default ArticlesList;



