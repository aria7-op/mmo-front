import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import EventTicketWidget from "../widgets/EventTicketWidget";
import { submitContactForm } from "../../services/contact.service";
import { sanitizeEmail, sanitizeTextInput, sanitizeTextarea, sanitizePhone, sanitizeByType } from "../../utils/inputSanitizer";

const ContactUsContent = () => {
  const { t, i18n } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const isRTL = i18n.language === 'dr' || i18n.language === 'ps';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Bypass sanitization for email to allow typing
    if (name === 'email') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      const inputType = type === 'tel' ? 'phone' : name === 'message' ? 'textarea' : 'text';
      const sanitizedValue = sanitizeByType(value, inputType);
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    }
  };

  // Set localized values for the event widget based on the current language
  const getLocalizedEventValues = () => {
    switch (i18n.language) {
      case 'dr': // Dari
        return {
          location: t('contact.widget.location', 'کابل، افغانستان'),
          date: t('contact.widget.date', '۱۰ دسمبر ۲۰۲۴'),
          time: t('contact.widget.time', '۱۰:۰۰ ق ظ')
        };
      case 'ps': // Pashto
        return {
          location: t('contact.widget.location', 'کابل، افغانستان'),
          date: t('contact.widget.date', '۱۰ دسمبر ۲۰۲۴'),
          time: t('contact.widget.time', '۱۰:۰۰ ق ظ')
        };
      default: // English
        return {
          location: t('contact.widget.location', 'Kabul, Afghanistan'),
          date: t('contact.widget.date', '10 Dec 2024'),
          time: t('contact.widget.time', '10:00 AM')
        };
    }
  };

  const localizedEventValues = getLocalizedEventValues();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Data is already sanitized and in state
    const contactData = {
      ...formData,
      subject: formData.subject || t('contact.page.form.fields.defaultSubject', 'General Inquiry'),
    };

    setSubmitting(true);
    try {
      await submitContactForm(contactData);
      // Reset form state after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: ''
      });
    } catch (error) {
      // Error is already handled in service with toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .contact-info {
          padding: 40px 0;
          margin-top: -35px;
        }
        .how-to-help-box {
          background: #f8f9fa;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          border: none;
          height: 310px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .help-box-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          padding: 8px 12px;
          background: white;
          border-radius: 6px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
          transition: all 0.2s ease;
        }
        .help-box-item:hover {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
        }
        .help-box-item:last-child {
          margin-bottom: 0;
        }
        .help-box-icon {
          flex-shrink: 0;
        }
        .help-box-icon i {
          color: #667eea;
          font-size: 18px;
        }
        .help-box-text {
          flex: 1;
          line-height: 1.2;
          display: flex;
          align-items: center;
          gap: 0;
        }
        .help-box-text h2 {
          font-size: 14px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
          white-space: nowrap;
        }
        .help-box-text p {
          font-size: 13px;
          color: #6c757d;
          margin: 0;
          white-space: nowrap;
        }
        .help-box-text a {
          color: #0A4F9D;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .help-box-text a:hover {
          color: #0864d4;
          text-decoration: underline;
        }
        .contact-page-map {
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }
        .contact-page-map iframe {
          border-radius: 15px;
        }
        .contact-field form h2 {
          font-size: 28px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 30px;
        }
        .single-input-fieldsbtn {
         margin-top: 30px;
         display: flex;
        }
        .single-input-fieldsbtn input[type="submit"] {
         background: linear-gradient(135deg, #0A4F9D 0%, #0864d4 100%);
         border: none;
         color: #fff;
         font-size: 16px;
         font-weight: 600;
         padding: 14px 45px;
         border-radius: 8px;
         cursor: pointer;
         transition: all 0.3s ease;
         text-transform: uppercase;
         letter-spacing: 0.5px;
         box-shadow: 0 4px 15px rgba(10, 79, 157, 0.4);
         width: auto;
        }
        .single-input-fieldsbtn input[type="submit"]:hover {
         background: linear-gradient(135deg, #0864d4 0%, #0A4F9D 100%);
         transform: translateY(-2px);
         box-shadow: 0 6px 20px rgba(10, 79, 157, 0.6);
        }
        .single-input-fieldsbtn input[type="submit"]:active {
         transform: translateY(0);
         box-shadow: 0 2px 10px rgba(10, 79, 157, 0.4);
        }
        .single-input-fieldsbtn input[type="submit"]:disabled {
         opacity: 0.6;
         cursor: not-allowed;
         transform: none;
        }
        @media (max-width: 768px) {
          .help-box-item {
            flex-direction: column;
            text-align: center;
            padding: 15px;
          }
          .help-box-icon {
            margin-right: 0;
            margin-bottom: 15px;
          }
          .single-input-fieldsbtn input[type="submit"] {
            padding: 12px 35px;
            font-size: 14px;
            width: 100%;
          }
        }
      `}</style>
      
      <div className="contact-page-sec pt-120 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="contact-info">
                <div className={`how-to-help-box ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                  <div className={`help-box-item ${isRTL ? 'rtl-direction' : ''}`}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#667eea', fontSize: '18px' }}></i>
                    <p style={{ margin: 0, display: 'inline', marginLeft: '2px' }}>{t("contact.page.content.sections.office.address")}</p>
                  </div>
                  <div className={`help-box-item ${isRTL ? 'rtl-direction' : ''}`}>
                    <i className="fas fa-phone" style={{ color: '#667eea', fontSize: '18px' }}></i>
                    <p style={{ margin: 0, display: 'inline', marginLeft: '2px' }}>
                        <a href={`tel:${t('contact.page.content.sections.phone.numberPrimary', '+93779752121')}`}>
                          {t('contact.page.content.sections.phone.numberPrimaryDisplay', '+93 77 975 2121')}
                        </a>
                        {" "}<br/>
                        <a href={`tel:${t('contact.page.content.sections.phone.numberSecondary', '+93788438438')}`}>
                          {t('contact.page.content.sections.phone.numberSecondaryDisplay', '+93 788 438 438')}
                        </a>
                    </p>
                  </div>
                  <div className={`help-box-item ${isRTL ? 'rtl-direction' : ''}`}>
                    <i className="fas fa-envelope" style={{ color: '#667eea', fontSize: '18px' }}></i>
                    <p style={{ margin: 0, display: 'inline', marginLeft: '2px' }}>
                        <a href={`mailto:${t('contact.page.content.sections.email.email', 'contact@mmo.org.af')}`}>
                          {t('contact.page.content.sections.email.email', 'contact@mmo.org.af')}
                        </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="contact-page-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52043.85029634065!2d69.11120238564057!3d34.55683024266449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d1697c1b5d9a5d%3A0x3d6e2e4f3e3e3e3e!2sKabul%2C%20Afghanistan!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                  width="100%"
                  height="310"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            <div className="contact-page-form">
              <div className="row">
                <div className="col-lg-8">
                  <div className="contact-field">
                    <form onSubmit={handleSubmit}>
                      <h2>{t("contact.page.form.formTitle")}</h2>
                      <div className="row">
                        <div className="col-md-12 message-input">
                          <div className="single-input-field">
                            <textarea
                              placeholder={t(
                                "contact.page.form.fields.message"
                              )}
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              required
                            ></textarea>
                          </div>
                        </div>
                        <div className="col-sm-6 col-12">
                          <div className="single-input-field">
                            <input
                              type="text"
                              placeholder={t(
                                "contact.page.form.fields.fullName"
                              )}
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              autoComplete="off"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-sm-6 col-12">
                          <div className="single-input-field">
                            <input
                              type="email"
                              placeholder={t("contact.page.form.fields.email")}
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              autoComplete="off"
                              required
                              maxLength="50"
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="single-input-field">
                            <input
                              type="text"
                              placeholder={t(
                                "contact.page.form.fields.subject"
                              )}
                              name="subject"
                              value={formData.subject}
                              onChange={handleChange}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="single-input-field">
                            <input
                              type="tel"
                              placeholder={t("contact.page.form.fields.phone")}
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              autoComplete="off"
                              maxLength="15"
                              pattern="[+]?[0-9]{1,4}?[-.\s]?[(]?[0-9]{1,3}?[)]?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}"
                              title="Please enter a valid phone number (e.g., +93 77 975 2121 or 0779752121)"
                              style={{ direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}
                            />
                          </div>
                        </div>
                        <div className="single-input-fieldsbtn">
                          <input
                            type="submit"
                            value={
                              submitting
                                ? t('common.loading', 'Loading...')
                                : t('contact.page.form.fields.submit')
                            }
                            disabled={submitting}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-lg-4">
                  <EventTicketWidget
                    location={localizedEventValues.location}
                    date={localizedEventValues.date}
                    time={localizedEventValues.time}
                    showWidget={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUsContent;
