import React, { useState } from "react";
import { useDonationConfig } from "../../hooks/useDonations";
import { submitDonation } from "../../services/donations.service";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../common/LoadingSpinner";
import { toast } from "react-toastify";
import { sanitizeByType } from "../../utils/inputSanitizer";
import { IMAGE_BASE_URL } from "../../config/api.config";

const DonationContent = () => {
  const { t } = useTranslation();
  const { config, loading: configLoading } = useDonationConfig();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    amount: "",
    city: "",
    zipCode: "",
    paymentMethod: "",
    period: "one_time",
  });
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Default preset amounts if config doesn't provide them
  const presetAmounts = config?.presetAmounts || [20, 30, 60, 80];
  const paymentMethods = config?.paymentMethods || [
    {
      id: "dbt",
      label: t("donation.directBankTransfer", "Direct Bank Transfer"),
    },
    { id: "cp", label: t("donation.chequePayment", "Cheque Payment") },
    { id: "stripe", label: t("donation.stripePayment", "Stripe Payment") },
    { id: "paypal", label: t("donation.paypalPayment", "PayPal Payment") },
  ];
  const donationPeriods = config?.donationPeriods || [
    { id: "one_time", label: t("donation.oneTime", "One Time") },
    { id: "monthly", label: t("donation.monthly", "Monthly") },
    { id: "yearly", label: t("donation.yearly", "Yearly") },
  ];
  const cities = config?.cities || [
    "Kabul",
    "Herat",
    "Nangarhar",
    "Balkh",
    "Kandahar",
    "Kunduz",
    "Jalalabad",
    "Mazar-i-Sharif",
    "Baghlan",
    "Badakhshan",
    "Khost",
    "Parwan",
    "Kapisa",
    "Logar",
    "Wardak",
    "Takhar",
    "Paktia",
    "Paktika",
    "Ghor",
    "Farah",
  ];

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
    setFormData({ ...formData, amount: amount });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let inputType = "text";
    if (type === "email") {
      inputType = "email";
    } else if (type === "number") {
      inputType = "number";
    }

    const sanitizedValue = sanitizeByType(value, inputType);

    setFormData({ ...formData, [name]: sanitizedValue });
    if (name === "amount") {
      setSelectedAmount(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || formData.amount <= 0) {
      toast.error(
        t("donation.errorAmountRequired", "Please enter a valid amount"),
      );
      return;
    }

    if (!formData.paymentMethod) {
      toast.error(
        t("donation.errorPaymentMethod", "Please select a payment method"),
      );
      return;
    }

    setSubmitting(true);
    try {
      // Data is already sanitized from state
      const response = await submitDonation({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        amount: parseFloat(formData.amount) || 0,
        city: formData.city,
        zipCode: formData.zipCode.trim(),
        paymentMethod: formData.paymentMethod,
        period: formData.period,
      });

      toast.success(
        t("donation.successSubmitted", "Donation submitted successfully!"),
      );

      // Update donation stats in localStorage
      const currentStats = localStorage.getItem("donationStats");
      const stats = currentStats
        ? JSON.parse(currentStats)
        : { totalAmount: 0, donationCount: 0 };
      stats.totalAmount =
        (stats.totalAmount || 0) + parseFloat(formData.amount);
      stats.donationCount = (stats.donationCount || 0) + 1;
      stats.lastDonation = new Date().toISOString();
      localStorage.setItem("donationStats", JSON.stringify(stats));

      // Trigger update in header
      window.dispatchEvent(new Event("donationUpdated"));

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        amount: "",
        city: "",
        zipCode: "",
        paymentMethod: "",
        period: "one_time",
      });
      setSelectedAmount(null);
    } catch (error) {
      toast.error(
        error.message || t("donation.errorSubmit", "Failed to submit donation"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (configLoading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 60,
          paddingBottom: 60,
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="donation-sec pt-120 pb-90">
      <div className="container">
        {/* Header Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h1
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  marginBottom: 15,
                  color: "#1a1a1a",
                }}
              >
                {config?.title || t("donation.title", "Make a Difference")}
              </h1>
              <p
                style={{
                  fontSize: 16,
                  color: "#666",
                  maxWidth: 600,
                  margin: "0 auto",
                }}
              >
                {config?.subtitle ||
                  t(
                    "donation.subtitle",
                    "Your generous donation helps us continue our mission to serve communities.",
                  )}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Donation Amount Selection */}
          <div className="row" style={{ marginBottom: 40 }}>
            <div className="col-12">
              <div
                style={{
                  background: "#fff",
                  padding: 30,
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    marginBottom: 20,
                    color: "#1a1a1a",
                  }}
                >
                  {config?.amountQuestion ||
                    t(
                      "donation.amountQuestion",
                      "How much would you like to donate?",
                    )}
                </h2>

                {/* Preset Amounts */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountClick(amount)}
                      style={{
                        background:
                          selectedAmount === amount ? "#0f68bb" : "#f8f9fa",
                        color: selectedAmount === amount ? "#fff" : "#333",
                        border: `2px solid ${selectedAmount === amount ? "#0f68bb" : "#e0e0e0"}`,
                        padding: 16,
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 600,
                        transition: "all 0.3s ease",
                        fontSize: 16,
                        boxShadow:
                          selectedAmount === amount
                            ? "0 4px 12px rgba(15, 104, 187, 0.2)"
                            : "none",
                      }}
                      aria-label={`Donate $${amount}`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div style={{ marginTop: 20 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 14,
                      fontWeight: 500,
                      marginBottom: 8,
                      color: "#666",
                    }}
                  >
                    {t("donation.customAmount", "Or enter a custom amount")}
                  </label>
                  <div
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <span
                      style={{ fontSize: 18, fontWeight: 600, color: "#666" }}
                    >
                      $
                    </span>
                    <input
                      className="no-arrows"
                      type="number"
                      placeholder="0.00"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      autoComplete="off"
                      min="1"
                      step="0.01"
                      style={{
                        flex: 1,
                        padding: "12px 15px",
                        borderRadius: 8,
                        border: "2px solid #e0e0e0",
                        fontSize: 16,
                        transition: "border-color 0.3s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#0f68bb")}
                      onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Period Selection */}
          <div className="row" style={{ marginBottom: 40 }}>
            <div className="col-12">
              <div
                style={{
                  background: "#fff",
                  padding: 30,
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    marginBottom: 15,
                    color: "#1a1a1a",
                  }}
                >
                  {config?.recurringQuestion || "Donation Type"}
                </h2>
                <p style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>
                  {config?.recurringDescription ||
                    "Choose how often you'd like to donate."}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: 12,
                  }}
                >
                  {donationPeriods.map((period) => (
                    <label
                      key={period.id}
                      style={{
                        padding: 15,
                        border: `2px solid ${formData.period === period.id ? "#0f68bb" : "#e0e0e0"}`,
                        borderRadius: 8,
                        cursor: "pointer",
                        transition: "all 0.3s",
                        background:
                          formData.period === period.id ? "#f0f6ff" : "#fff",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <input
                        type="radio"
                        name="period"
                        value={period.id}
                        checked={formData.period === period.id}
                        onChange={handleInputChange}
                        style={{ cursor: "pointer" }}
                      />
                      <span style={{ fontWeight: 500, color: "#333" }}>
                        {period.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="row" style={{ marginBottom: 40 }}>
            <div className="col-12">
              <div
                style={{
                  background: "#fff",
                  padding: 30,
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    marginBottom: 20,
                    color: "#1a1a1a",
                  }}
                >
                  {t("donation.personalInfo", "Personal Information")}
                </h2>
                <div className="row">
                  <div className="col-md-6" style={{ marginBottom: 15 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 500,
                        marginBottom: 8,
                        color: "#666",
                      }}
                    >
                      {t("donation.firstName", "First Name")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("donation.firstNamePlaceholder", "John")}
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      autoComplete="off"
                      required
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                        fontSize: 14,
                        transition: "border-color 0.3s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#0f68bb")}
                      onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                    />
                  </div>
                  <div className="col-md-6" style={{ marginBottom: 15 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 500,
                        marginBottom: 8,
                        color: "#666",
                      }}
                    >
                      {t("donation.lastName", "Last Name")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("donation.lastNamePlaceholder", "Doe")}
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      autoComplete="off"
                      required
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                        fontSize: 14,
                        transition: "border-color 0.3s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#0f68bb")}
                      onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                    />
                  </div>
                  <div className="col-md-6">
                    <label
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 500,
                        marginBottom: 8,
                        color: "#666",
                      }}
                    >
                      {t("donation.email", "E-mail")}
                    </label>
                    <input
                      type="email"
                      placeholder={t(
                        "donation.emailPlaceholder",
                        "john@example.com",
                      )}
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="off"
                      required
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                        fontSize: 14,
                        transition: "border-color 0.3s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#0f68bb")}
                      onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                    />
                  </div>
                  <div className="col-md-6" style={{ marginBottom: 15 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 500,
                        marginBottom: 8,
                        color: "#666",
                      }}
                    >
                      {t("donation.selectCity", "City")}
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                        fontSize: 14,
                        color: "#333",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                        transition: "border-color 0.3s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#0f68bb")}
                      onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                    >
                      <option value="" style={{ color: "#999" }}>
                        {t("donation.selectCity", "Select City")}
                      </option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address & Payment Information */}
          <div className="row" style={{ marginBottom: 40 }}>
            <div className="col-12">
              <div
                style={{
                  background: "#fff",
                  padding: 30,
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    marginBottom: 20,
                    color: "#1a1a1a",
                  }}
                >
                  {t("donation.paymentInfo", "Payment Information")}
                </h2>
                <div className="row">
                  <div className="col-md-6" style={{ marginBottom: 15 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 500,
                        marginBottom: 8,
                        color: "#666",
                      }}
                    >
                      {t("donation.zipCode", "Zip Code")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("donation.zipCodePlaceholder", "12345")}
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      autoComplete="off"
                      required
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                        fontSize: 14,
                        transition: "border-color 0.3s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#0f68bb")}
                      onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                    />
                  </div>
                  <div className="col-md-6" style={{ marginBottom: 15 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 500,
                        marginBottom: 8,
                        color: "#666",
                      }}
                    >
                      {t("donation.selectPaymentMethod", "Payment Method")}
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                        fontSize: 14,
                        color: "#333",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                        transition: "border-color 0.3s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#0f68bb")}
                      onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                    >
                      <option value="" style={{ color: "#999" }}>
                        {t("donation.selectPaymentMethod", "Payment Method")}
                      </option>
                      {paymentMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment Gateway */}
                {/* <div
                  style={{
                    marginTop: 30,
                    paddingTop: 20,
                    borderTop: "1px solid #e0e0e0",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={`${IMAGE_BASE_URL}/payment/payment-gateway.png`}
                    alt="payment"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div> */}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="row" style={{ marginBottom: 40 }}>
            <div className="col-12">
              <input
                type="submit"
                value={
                  submitting
                    ? t("donation.submitting", "Submitting...")
                    : t("donation.submitNow", "Donate Now")
                }
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "16px 30px",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#fff",
                  background: "#0f68bb",
                  border: "none",
                  borderRadius: 8,
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.6 : 1,
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(15, 104, 187, 0.3)",
                }}
                onMouseEnter={(e) =>
                  !submitting && (e.target.style.background = "#0d5aa3")
                }
                onMouseLeave={(e) =>
                  !submitting && (e.target.style.background = "#0f68bb")
                }
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationContent;
