import React from 'react';
import styles from './OrganizationProfile.module.css';

/**
 * DetailItem component - renders a single detail field with label and value
 * @param {Object} props
 * @param {string} props.label - The label text
 * @param {string|React.ReactNode} props.value - The value to display
 * @param {boolean} [props.fullWidth] - Whether to span full width
 */
const DetailItem = ({ label, value, fullWidth = false }) => {
  return (
    <div className={fullWidth ? `${styles.detailItem} ${styles.fullWidthItem}` : styles.detailItem}>
      <div className={styles.detailLabel}>{label}</div>
      <div className={styles.detailValue}>{value}</div>
    </div>
  );
};

export default DetailItem;
