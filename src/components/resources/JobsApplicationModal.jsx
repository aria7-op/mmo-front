import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { sanitizeByType } from '../../utils/inputSanitizer';
import { submitEnhancedJobApplication } from '../../services/jobs.service';

const JobsApplicationModal = ({ open, onClose, positionTitle }) => {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    position: positionTitle || '',
    firstName: '',
    lastName: '',
    education: '',
    dateOfBirth: '',
    gender: '',
    cv: null,
    coverLetterFile: null,
  });

  useEffect(() => {
    setForm((prev) => ({ ...prev, position: positionTitle || '' }));
  }, [positionTitle]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (name === 'cv' || name === 'coverLetterFile') {
      const file = files && files[0];
      if (!file) {
        setForm((prev) => ({ ...prev, [name]: null }));
        return;
      }
      const maxSize = 10 * 1024 * 1024; // 10MB safety cap
      const allowedTypes = ['application/pdf'];
      const isPdfExt = /\.pdf$/i.test(file.name);
      if (file.size > maxSize) {
        toast.error(t('jobs.fileTooLarge', 'File is too large (max 10MB).'));
        return;
      }
      if (!allowedTypes.includes(file.type) && !isPdfExt) {
        toast.error(t('jobs.invalidFileType', 'Invalid file type. Only PDF is allowed.'));
        return;
      }
      setForm((prev) => ({ ...prev, [name]: file }));
    } else {
      let inputType = 'text';
      if (type === 'date') inputType = 'date';
      const sanitizedValue = sanitizeByType(value, inputType);
      setForm((prev) => ({ ...prev, [name]: sanitizedValue }));
    }
  };

  const validate = () => {
    if (!form.firstName?.trim()) return t('jobs.validation.firstName', 'First name is required');
    if (!form.lastName?.trim()) return t('jobs.validation.lastName', 'Last name is required');
    if (!form.education) return t('jobs.validation.education', 'Education is required');
    if (!form.dateOfBirth) return t('jobs.validation.dob', 'Date of birth is required');
    if (!form.gender) return t('jobs.validation.gender', 'Gender is required');
    if (!form.cv) return t('jobs.validation.cv', 'CV (PDF) is required');
    if (!form.coverLetterFile) return t('jobs.validation.coverLetter', 'Cover letter (PDF) is required');
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    try {
      setSubmitting(true);
      await submitEnhancedJobApplication(form);
      toast.success(t('jobs.applicationSubmitted', 'Application submitted successfully!'));
      setForm({
        position: positionTitle || '',
        firstName: '',
        lastName: '',
        education: '',
        dateOfBirth: '',
        gender: '',
        cv: null,
        coverLetterFile: null,
      });
      onClose?.();
    } catch (error) {
      // Error toast handled in service as well; double-safety here
      toast.error(error?.message || t('jobs.applicationFailed', 'Failed to submit application'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} role="dialog" aria-modal="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t('jobs.applyNow', 'Apply Now')}{positionTitle ? ` - ${positionTitle}` : ''}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">{t('jobs.firstName', 'First Name')} *</label>
                  <input type="text" className="form-control" name="firstName" value={form.firstName} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">{t('jobs.lastName', 'Last Name')} *</label>
                  <input type="text" className="form-control" name="lastName" value={form.lastName} onChange={handleChange} required />
                </div>

                <div className="col-md-6">
                  <label className="form-label">{t('jobs.education', 'Education')} *</label>
                  <select className="form-select" name="education" value={form.education} onChange={handleChange} required>
                    <option value="">{t('jobs.selectEducation', 'Select Education')}</option>
                    <option value="high_school">{t('jobs.educationHighSchool', 'High School')}</option>
                    <option value="bachelor">{t('jobs.educationBachelor', "Bachelor's Degree")}</option>
                    <option value="master">{t('jobs.educationMaster', "Master's Degree")}</option>
                    <option value="phd">{t('jobs.educationPhD', 'PhD')}</option>
                    <option value="other">{t('jobs.educationOther', 'Other')}</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">{t('jobs.dateOfBirth', 'Date of Birth')} *</label>
                  <input type="date" className="form-control" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required />
                </div>

                <div className="col-md-6">
                  <label className="form-label">{t('jobs.gender', 'Gender')} *</label>
                  <select className="form-select" name="gender" value={form.gender} onChange={handleChange} required>
                    <option value="">{t('jobs.selectGender', 'Select Gender')}</option>
                    <option value="male">{t('jobs.genderMale', 'Male')}</option>
                    <option value="female">{t('jobs.genderFemale', 'Female')}</option>
                    <option value="other">{t('jobs.genderOther', 'Other')}</option>
                    <option value="na">{t('jobs.genderNA', 'Prefer not to say')}</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">{t('jobs.cv', 'Attach CV (PDF)')} *</label>
                  <input type="file" className="form-control" name="cv" accept=".pdf" onChange={handleChange} required />
                  <small className="text-muted">{t('jobs.onlyPdf', 'Only PDF is allowed.')}</small>
                </div>

                <div className="col-md-6">
                  <label className="form-label">{t('jobs.coverLetterFile', 'Attach Cover Letter (PDF)')} *</label>
                  <input type="file" className="form-control" name="coverLetterFile" accept=".pdf" onChange={handleChange} required />
                  <small className="text-muted">{t('jobs.onlyPdf', 'Only PDF is allowed.')}</small>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                {t('common.cancel', 'Cancel')}
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? t('common.submitting', 'Submitting...') : t('jobs.applyNow', 'Apply Now')}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* backdrop */}
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </div>
  );
};

export default JobsApplicationModal;
