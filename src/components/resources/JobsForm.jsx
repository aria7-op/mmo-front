import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
// Prefer unified jobs service that formats multipart data as backend expects
import { submitGeneralJobApplication } from '../../services/jobs.service';
import { sanitizeByType } from '../../utils/inputSanitizer';

const JobsForm = ({ selectedPosition = '' }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        position: selectedPosition || '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        coverLetter: '',
        resume: null
    });

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;
        if (name === 'resume') {
            const file = files && files[0];
            if (file) {
                const maxSize = 5 * 1024 * 1024; // 5MB
                const allowed = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                if (file.size > maxSize) {
                    toast.error(t('jobs.fileTooLarge', 'File is too large (max 5MB).'));
                    return;
                }
                // Allow based on extension too in case some browsers set generic MIME
                const extOk = /\.(pdf|doc|docx)$/i.test(file.name);
                if (!allowed.includes(file.type) && !extOk) {
                    toast.error(t('jobs.invalidFileType', 'Invalid file type. Please upload PDF, DOC, or DOCX.'));
                    return;
                }
            }
            setFormData({ ...formData, resume: file || null });
        } else {
            let inputType = 'text';
            if (type === 'email') {
                inputType = 'email';
            } else if (type === 'tel') {
                inputType = 'phone';
            } else if (name === 'coverLetter') {
                inputType = 'textarea';
            }
            const sanitizedValue = sanitizeByType(value, inputType);
            setFormData({ ...formData, [name]: sanitizedValue });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await submitGeneralJobApplication(formData, formData.resume);
            if (res && (res.success || res._id || res.id)) {
                toast.success(t('jobs.applicationSubmitted', 'Application submitted successfully!'));
            } else {
                toast.success(t('jobs.applicationSubmitted', 'Application submitted successfully!'));
            }
            setFormData({
                position: '',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                coverLetter: '',
                resume: null
            });
            e.target.reset();
        } catch (err) {
            toast.error(err?.message || t('jobs.applicationFailed', 'Failed to submit application'));
        }
    };

    return (
        <div className="jobs-page-sec pt-120 pb-100">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div className="jobs-form-wrapper">
                            <h1>{t('jobs.applyForNGOJobs', 'Apply for NGO Jobs in Afghanistan')}</h1>
                            <p className="mb-4">
                                {t('jobs.intro', 'Mission Mind Organization is always looking for dedicated professionals to join our team. Please fill out the form below to apply for current job openings.')}
                            </p>

                            <form onSubmit={handleSubmit} className="jobs-application-form">
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="position" className="form-label">{t('jobs.positionApplyingFor', 'Position Applying For')} {t('jobs.required', '*')}</label>
                                        <select 
                                            id="position"
                                            name="position" 
                                            className="form-control" 
                                            required
                                            value={formData.position}
                                            onChange={handleChange}
                                        >
                                            <option value="">{t('jobs.selectPosition', 'Select Position')}</option>
                                            <option value="program-manager">{t('jobs.programManager', 'Program Manager')}</option>
                                            <option value="education-coordinator">{t('jobs.educationCoordinator', 'Education Coordinator')}</option>
                                            <option value="wash-specialist">{t('jobs.washSpecialist', 'WASH Specialist')}</option>
                                            <option value="monitoring-evaluation">{t('jobs.monitoringEvaluation', 'Monitoring & Evaluation Officer')}</option>
                                            <option value="finance-officer">{t('jobs.financeOfficer', 'Finance Officer')}</option>
                                            <option value="admin-officer">{t('jobs.adminOfficer', 'Administrative Officer')}</option>
                                            <option value="other">{t('jobs.other', 'Other')}</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="firstName" className="form-label">{t('jobs.firstName', 'First Name')} {t('jobs.required', '*')}</label>
                                        <input 
                                            type="text" 
                                            id="firstName"
                                            name="firstName" 
                                            className="form-control" 
                                            required
                                            value={formData.firstName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="lastName" className="form-label">{t('jobs.lastName', 'Last Name')} {t('jobs.required', '*')}</label>
                                        <input 
                                            type="text" 
                                            id="lastName"
                                            name="lastName" 
                                            className="form-control" 
                                            required
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="email" className="form-label">{t('jobs.emailAddress', 'Email Address')} {t('jobs.required', '*')}</label>
                                        <input 
                                            type="email" 
                                            id="email"
                                            name="email" 
                                            className="form-control" 
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="phone" className="form-label">{t('jobs.phoneNumber', 'Phone Number')} {t('jobs.required', '*')}</label>
                                        <input 
                                            type="tel" 
                                            id="phone"
                                            name="phone" 
                                            className="form-control" 
                                            required
                                            maxLength="20"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="resume" className="form-label">{t('jobs.resumeCV', 'Upload Resume/CV (PDF, DOC, DOCX)')} {t('jobs.required', '*')}</label>
                                        <input 
                                            type="file" 
                                            id="resume"
                                            name="resume" 
                                            className="form-control" 
                                            accept=".pdf,.doc,.docx"
                                            required
                                            onChange={handleChange}
                                        />
                                        <small className="form-text text-muted">
                                            {t('jobs.maxFileSize', 'Maximum file size: 5MB. Accepted formats: PDF, DOC, DOCX')}
                                        </small>
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="coverLetter" className="form-label">{t('jobs.coverLetter', 'Cover Letter')} {t('jobs.required', '*')}</label>
                                        <textarea 
                                            id="coverLetter"
                                            name="coverLetter" 
                                            className="form-control" 
                                            rows="6"
                                            required
                                            value={formData.coverLetter}
                                            onChange={handleChange}
                                            placeholder={t('jobs.placeholderCoverLetter', 'Please write your cover letter here...')}
                                        ></textarea>
                                    </div>

                                    <div className="col-md-12">
                                        <button type="submit" className="btn btn-primary btn-lg">
                                            {t('jobs.submitApplication', 'Submit Application')}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobsForm;




