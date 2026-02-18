/**
 * Resources Service
 * Handles success stories, case studies, annual reports, policies, RFQs, gallery, and FAQs
 */

import { get, post, put, del, uploadFile } from "./apiClient";
import { API_ENDPOINTS } from "../config/api.config";
import {
  createFormData,
  createFormDataWithMultipleFiles,
} from "../utils/apiUtils";

/**
 * Get all success stories
 * @param {object} params - Query parameters (page, limit, status, search)
 * @returns {Promise<object>} - Response with success stories array and pagination
 */
export const getSuccessStories = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      ...params,
    };

    const response = await get(API_ENDPOINTS.SUCCESS_STORIES, queryParams);

    if (response.success) {
      return {
        data: response.data || [],
        pagination: response.pagination || {},
      };
    }

    throw new Error(response.message || "Failed to fetch success stories");
  } catch (error) {
    throw error;
  }
};

/**
 * Get single success story by ID
 * @param {string} id - Success story ID
 * @returns {Promise<object>} - Success story data
 */
export const getSuccessStoryById = async (id) => {
  try {
    const response = await get(API_ENDPOINTS.SUCCESS_STORIES_BY_ID(id));

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Success story not found");
  } catch (error) {
    throw error;
  }
};

/**
 * Get single success story by slug or ID
 * @param {string} slugOrId - Success story slug or ID
 * @returns {Promise<object>} - Success story data
 */
export const getSuccessStory = async (slugOrId) => {
  try {
    // First try to get by slug
    let response;
    try {
      response = await get(`${API_ENDPOINTS.SUCCESS_STORIES}/slug/${slugOrId}`);
    } catch (slugError) {
      // If slug fails, try by ID
      response = await get(API_ENDPOINTS.SUCCESS_STORIES_BY_ID(slugOrId));
    }

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Success story not found");
  } catch (error) {
    throw error;
  }
};

/**
 * Create success story (Admin only)
 * @param {object} successStoryData - Success story data
 * @param {File} imageFile - Success story image file
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Created success story data
 */
export const createSuccessStory = async (
  successStoryData,
  imageFile = null,
  token = null
) => {
  try {
    // Only pass file if it's a valid File instance
    const validFile = imageFile instanceof File ? imageFile : null;
    const formData = createFormData(successStoryData, validFile, "image");

    const response = await uploadFile(API_ENDPOINTS.SUCCESS_STORIES, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || "Failed to create success story");
  } catch (error) {
    throw error;
  }
};

/**
 * Update success story (Admin only)
 * @param {string} id - Success story ID
 * @param {object} successStoryData - Updated success story data
 * @param {File} imageFile - New image file (optional)
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Updated success story data
 */
export const updateSuccessStory = async (
  id,
  successStoryData,
  imageFile = null,
  token = null
) => {
  try {
    // Only pass file if it's a valid File instance
    const validFile = imageFile instanceof File ? imageFile : null;
    const formData = createFormData(successStoryData, validFile, "image");

    const response = await uploadFile(
      API_ENDPOINTS.SUCCESS_STORIES_BY_ID(id),
      formData,
      {
        method: "PUT",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || "Failed to update success story");
  } catch (error) {
    throw error;
  }
};

/**
 * Delete success story (Admin only)
 * @param {string} id - Success story ID
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Delete response
 */
export const deleteSuccessStory = async (id, token = null) => {
  try {
    const response = await del(API_ENDPOINTS.SUCCESS_STORIES_BY_ID(id), {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response;
    }

    throw new Error(response.message || "Failed to delete success story");
  } catch (error) {
    throw error;
  }
};

/**
 * Get all case studies
 * @param {object} params - Query parameters
 * @returns {Promise<object>} - Response with case studies array
 */
export const getCaseStudies = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      ...params,
    };

    const response = await get(API_ENDPOINTS.CASE_STUDIES, queryParams);

    if (response.success) {
      return {
        data: response.data || [],
        pagination: response.pagination || {},
      };
    }

    throw new Error(response.message || "Failed to fetch case studies");
  } catch (error) {
    throw error;
  }
};

/**
 * Get single case study by ID
 * @param {string} id - Case study ID
 * @returns {Promise<object>} - Case study data
 */
export const getCaseStudyById = async (id) => {
  try {
    const response = await get(API_ENDPOINTS.CASE_STUDIES_BY_ID(id));

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Case study not found");
  } catch (error) {
    throw error;
  }
};

/**
 * Create case study (Admin only)
 * @param {object} caseStudyData - Case study data
 * @param {File} imageFile - Case study image file
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Created case study data
 */
export const createCaseStudy = async (
  caseStudyData,
  files = null,
  token = null
) => {
  try {
    console.log('🖼️ createCaseStudy called with:', { caseStudyData, files });
    
    // Support both legacy single image file and new { image, documents[] } payload
    const formData = new FormData();
    formData.append("data", JSON.stringify(caseStudyData || {}));

    if (files) {
      console.log('🖼️ Processing files payload:', files);
      
      // Handle image file
      const imageFile = files instanceof File ? files : files.image;
      if (imageFile && imageFile instanceof File) {
        console.log('🖼️ Adding image to FormData:', imageFile.name, imageFile.size, imageFile.type);
        formData.append("image", imageFile);
      } else {
        console.log('🖼️ No valid image file found. Image:', imageFile);
      }
      
      // Handle documents
      const docs = files && files.documents ? files.documents : [];
      if (Array.isArray(docs)) {
        console.log('🖼️ Adding documents:', docs.length);
        docs.forEach((f, index) => {
          if (f instanceof File) {
            console.log(`🖼️ Adding document ${index}:`, f.name, f.size);
            formData.append("documents", f);
          }
        });
      }
    } else {
      console.log('🖼️ No files payload provided');
    }

    console.log('🖼️ FormData entries before sending:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File - ${value.name} (${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}: ${typeof value === 'object' ? JSON.stringify(value).substring(0, 100) + '...' : value}`);
      }
    }

    const response = await uploadFile(API_ENDPOINTS.CASE_STUDIES, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || "Failed to create case study");
  } catch (error) {
    throw error;
  }
};

/**
 * Update case study (Admin only)
 * @param {string} id - Case study ID
 * @param {object} caseStudyData - Updated case study data
 * @param {File} imageFile - New image file (optional)
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Updated case study data
 */
export const updateCaseStudy = async (
  id,
  caseStudyData,
  files = null,
  token = null
) => {
  try {
    console.log('🖼️ updateCaseStudy called with:', { id, caseStudyData, files });
    
    const formData = new FormData();
    formData.append("data", JSON.stringify(caseStudyData || {}));

    if (files) {
      console.log('🖼️ Processing files payload for update:', files);
      
      // Handle image file
      const imageFile = files instanceof File ? files : files.image;
      if (imageFile && imageFile instanceof File) {
        console.log('🖼️ Adding image to FormData for update:', imageFile.name, imageFile.size, imageFile.type);
        formData.append("image", imageFile);
      } else {
        console.log('🖼️ No valid image file found for update. Image:', imageFile);
      }
      
      // Handle documents
      const docs = files && files.documents ? files.documents : [];
      if (Array.isArray(docs)) {
        console.log('🖼️ Adding documents for update:', docs.length);
        docs.forEach((f, index) => {
          if (f instanceof File) {
            console.log(`🖼️ Adding document ${index} for update:`, f.name, f.size);
            formData.append("documents", f);
          }
        });
      }
    } else {
      console.log('🖼️ No files payload provided for update');
    }

    console.log('🖼️ FormData entries before sending for update:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File - ${value.name} (${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}: ${typeof value === 'object' ? JSON.stringify(value).substring(0, 100) + '...' : value}`);
      }
    }

    const response = await uploadFile(
      API_ENDPOINTS.CASE_STUDIES_BY_ID(id),
      formData,
      {
        method: "PUT",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || "Failed to update case study");
  } catch (error) {
    throw error;
  }
};

/**
 * Delete case study (Admin only)
 * @param {string} id - Case study ID
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Delete response
 */
export const deleteCaseStudy = async (id, token = null) => {
  try {
    const response = await del(API_ENDPOINTS.CASE_STUDIES_BY_ID(id), {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response;
    }

    throw new Error(response.message || "Failed to delete case study");
  } catch (error) {
    throw error;
  }
};

/**
 * Get all annual reports
 * @returns {Promise<Array>} - Annual reports array
 */
export const getAnnualReports = async () => {
  try {
    const response = await get(API_ENDPOINTS.ANNUAL_REPORTS);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch annual reports");
  } catch (error) {
    throw error;
  }
};

/**
 * Get single annual report by ID
 * @param {string} id - Annual report ID
 * @returns {Promise<object>} - Annual report data
 */
export const getAnnualReportById = async (id) => {
  try {
    const response = await get(API_ENDPOINTS.ANNUAL_REPORTS_BY_ID(id));

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Annual report not found");
  } catch (error) {
    throw error;
  }
};

/**
 * Create annual report (Admin only)
 * @param {object} reportData - Annual report data
 * @param {File} pdfFile - PDF file (required)
 * @param {File} coverImageFile - Cover image file (optional)
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Created annual report data
 */
export const createAnnualReport = async (
  reportData,
  pdfFile = null,
  coverImageFile = null,
  token = null
) => {
  try {
    const fileFields = {};
    if (pdfFile instanceof File) fileFields.file = pdfFile;
    if (coverImageFile instanceof File) fileFields.coverImage = coverImageFile;

    if (import.meta.env.DEV && typeof console !== "undefined") {
      console.debug(
        "[resources.service] createAnnualReport - pdfFile instanceof File:",
        pdfFile instanceof File,
        "pdfFile:",
        pdfFile && pdfFile.name,
        "coverImageFile instanceof File:",
        coverImageFile instanceof File
      );
    }

    const formData = createFormDataWithMultipleFiles(reportData, fileFields);

    const response = await uploadFile(API_ENDPOINTS.ANNUAL_REPORTS, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || "Failed to create annual report");
  } catch (error) {
    throw error;
  }
};

/**
 * Update annual report (Admin only)
 * @param {string} id - Annual report ID
 * @param {object} reportData - Updated annual report data
 * @param {File} pdfFile - New PDF file (optional)
 * @param {File} coverImageFile - New cover image file (optional)
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Updated annual report data
 */
export const updateAnnualReport = async (
  id,
  reportData,
  pdfFile = null,
  coverImageFile = null,
  token = null
) => {
  try {
    const fileFields = {};
    if (pdfFile instanceof File) fileFields.file = pdfFile;
    if (coverImageFile instanceof File) fileFields.coverImage = coverImageFile;

    const formData = createFormDataWithMultipleFiles(reportData, fileFields);

    const response = await uploadFile(
      API_ENDPOINTS.ANNUAL_REPORTS_BY_ID(id),
      formData,
      {
        method: "PUT",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || "Failed to update annual report");
  } catch (error) {
    throw error;
  }
};

/**
 * Delete annual report (Admin only)
 * @param {string} id - Annual report ID
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Delete response
 */
export const deleteAnnualReport = async (id, token = null) => {
  try {
    const response = await del(API_ENDPOINTS.ANNUAL_REPORTS_BY_ID(id), {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response;
    }

    throw new Error(response.message || "Failed to delete annual report");
  } catch (error) {
    throw error;
  }
};

/**
 * Get all policies
 * @param {object} params - Query parameters
 * @returns {Promise<object>} - Response with policies array
 */
export const getPolicies = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      ...params,
    };

    const response = await get(API_ENDPOINTS.POLICIES, queryParams);

    if (response.success) {
      return {
        data: response.data || [],
        pagination: response.pagination || {},
      };
    }

    throw new Error(response.message || "Failed to fetch policies");
  } catch (error) {
    throw error;
  }
};

/**
 * Get single policy by ID
 * @param {string} id - Policy ID
 * @returns {Promise<object>} - Policy data
 */
export const getPolicyById = async (id) => {
  try {
    const response = await get(API_ENDPOINTS.POLICIES_BY_ID(id));

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Policy not found");
  } catch (error) {
    throw error;
  }
};

/**
 * Create policy (Admin only)
 * @param {object} policyData - Policy data
 * @param {File} pdfFile - PDF file (optional)
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Created policy data
 */
export const createPolicy = async (
  policyData,
  pdfFile = null,
  token = null
) => {
  try {
    const validFile = pdfFile instanceof File ? pdfFile : null;
    const formData = createFormData(policyData, validFile, "file");

    const response = await uploadFile(API_ENDPOINTS.POLICIES, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || "Failed to create policy");
  } catch (error) {
    throw error;
  }
};

/**
 * Update policy (Admin only)
 * @param {string} id - Policy ID
 * @param {object} policyData - Updated policy data
 * @param {File} pdfFile - New PDF file (optional)
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Updated policy data
 */
export const updatePolicy = async (
  id,
  policyData,
  pdfFile = null,
  token = null
) => {
  try {
    const validFile = pdfFile instanceof File ? pdfFile : null;
    const formData = createFormData(policyData, validFile, "file");

    const response = await uploadFile(
      API_ENDPOINTS.POLICIES_BY_ID(id),
      formData,
      {
        method: "PUT",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || "Failed to update policy");
  } catch (error) {
    throw error;
  }
};

/**
 * Delete policy (Admin only)
 * @param {string} id - Policy ID
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Delete response
 */
export const deletePolicy = async (id, token = null) => {
  try {
    const response = await del(API_ENDPOINTS.POLICIES_BY_ID(id), {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response;
    }

    throw new Error(response.message || "Failed to delete policy");
  } catch (error) {
    throw error;
  }
};

/**
 * Get all RFQs/RFPs
 * @param {object} params - Query parameters
 * @returns {Promise<object>} - Response with RFQs array
 */
export const getRFQs = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      ...params,
    };

    const response = await get(API_ENDPOINTS.RFQS, queryParams);

    if (response.success) {
      return {
        data: response.data || [],
        pagination: response.pagination || {},
      };
    }

    throw new Error(response.message || "Failed to fetch RFQs");
  } catch (error) {
    throw error;
  }
};

/**
 * Get single RFQ by ID
 * @param {string} id - RFQ ID
 * @returns {Promise<object>} - RFQ data
 */
export const getRFQById = async (id) => {
  try {
    const response = await get(API_ENDPOINTS.RFQS_BY_ID(id));

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "RFQ not found");
  } catch (error) {
    throw error;
  }
};

/**
 * Create RFQ (Admin only)
 * @param {object} rfqData - RFQ data
 * @param {File} pdfFile - PDF file (optional)
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Created RFQ data
 */
export const createRFQ = async (rfqData, pdfFile = null, token = null) => {
  try {
    const validFile = pdfFile instanceof File ? pdfFile : null;
    const formData = createFormData(rfqData, validFile, "file");

    const response = await uploadFile(API_ENDPOINTS.RFQS, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || "Failed to create RFQ");
  } catch (error) {
    throw error;
  }
};

/**
 * Update RFQ (Admin only)
 * @param {string} id - RFQ ID
 * @param {object} rfqData - Updated RFQ data
 * @param {File} pdfFile - New PDF file (optional)
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Updated RFQ data
 */
export const updateRFQ = async (id, rfqData, pdfFile = null, token = null) => {
  try {
    const validFile = pdfFile instanceof File ? pdfFile : null;
    const formData = createFormData(rfqData, validFile, "file");

    const response = await uploadFile(API_ENDPOINTS.RFQS_BY_ID(id), formData, {
      method: "PUT",
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || "Failed to update RFQ");
  } catch (error) {
    throw error;
  }
};

/**
 * Delete RFQ (Admin only)
 * @param {string} id - RFQ ID
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Delete response
 */
export const deleteRFQ = async (id, token = null) => {
  try {
    const response = await del(API_ENDPOINTS.RFQS_BY_ID(id), {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response;
    }

    throw new Error(response.message || "Failed to delete RFQ");
  } catch (error) {
    throw error;
  }
};

/**
 * Get all gallery items
 * @param {object} params - Query parameters
 * @returns {Promise<object>} - Response with gallery items array
 */
export const getGallery = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      ...params,
    };

    const response = await get(API_ENDPOINTS.GALLERY, queryParams);

    if (response.success) {
      return {
        data: response.data || [],
        pagination: response.pagination || {},
      };
    }

    throw new Error(response.message || "Failed to fetch gallery items");
  } catch (error) {
    throw error;
  }
};

/**
 * Get single gallery item by ID or slug
 * @param {string} idOrSlug - Gallery item ID or slug
 * @returns {Promise<object>} - Gallery item data
 */
export const getGalleryItemById = async (idOrSlug) => {
  try {
    const val = String(idOrSlug || "").trim();
    const isLikelyObjectId = /^[a-fA-F0-9]{24}$/.test(val);

    // Extract ID from slug format (name-id) for our custom slug format
    let galleryId = val;
    if (!isLikelyObjectId && val.includes("-")) {
      const parts = val.split("-");
      const potentialId = parts[parts.length - 1];
      if (/^[a-fA-F0-9]{24}$/.test(potentialId)) {
        galleryId = potentialId;
      }
    }

    const response = await get(API_ENDPOINTS.GALLERY_BY_ID(galleryId));

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Gallery item not found");
  } catch (error) {
    throw error;
  }
};

/**
 * Create gallery item (Admin only)
 * @param {object} galleryData - Gallery item data
 * @param {File} imageFile - Image file
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Created gallery item data
 */
export const createGalleryItem = async (
  galleryData,
  imageFile = null,
  token = null,
  onProgress = null
) => {
  try {
    const validFile = imageFile instanceof File ? imageFile : null;
    const formData = createFormData(galleryData, validFile, "image");

    // Debug logging in development
    if (import.meta.env.DEV && typeof console !== "undefined") {
      console.log("[createGalleryItem] Creating gallery item with data:", {
        galleryData: galleryData,
        hasCategory: !!galleryData.category,
        category: galleryData.category,
        hasImageFile: !!validFile,
        imageFileName: validFile?.name,
      });

      // Log FormData contents (for debugging)
      if (formData instanceof FormData) {
        console.log("[createGalleryItem] FormData contents:");
        for (const [key, value] of formData.entries()) {
          if (key === "data") {
            console.log(`  ${key}:`, value);
            try {
              const parsed = JSON.parse(value);
              console.log(`  ${key} (parsed):`, parsed);
              console.log(`  ${key}.category:`, parsed.category);
            } catch (e) {
              console.log(`  ${key} (parse error):`, e);
            }
          } else {
            console.log(
              `  ${key}:`,
              value instanceof File
                ? `File: ${value.name} (${value.size} bytes)`
                : value
            );
          }
        }
      }
    }

    const response = await uploadFile(API_ENDPOINTS.GALLERY, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      onUploadProgress: onProgress
        ? (ev) => {
            if (ev.total) {
              const percent = Math.round((ev.loaded * 100) / ev.total);
              try {
                onProgress(percent);
              } catch (e) {
                /* ignore callback errors */
              }
            }
          }
        : undefined,
    });

    // Debug logging for response
    if (import.meta.env.DEV && typeof console !== "undefined") {
      console.log("[createGalleryItem] Response:", {
        success: response.success,
        hasData: !!response.data,
        data: response.data,
        categoryInResponse: response.data?.category,
      });
    }

    if (response.success) {
      const createdItem = response.data || response;

      // If category is missing from response but was sent in request,
      // fetch the full item to get complete data (backend workaround)
      if (!createdItem.category && galleryData.category && createdItem._id) {
        if (import.meta.env.DEV && typeof console !== "undefined") {
          console.warn(
            "[createGalleryItem] Category missing from CREATE response, fetching full item data..."
          );
        }

        try {
          // Fetch the full item to get complete data including category
          const fullItem = await get(
            API_ENDPOINTS.GALLERY_BY_ID(createdItem._id)
          );
          if (fullItem.success && fullItem.data) {
            if (import.meta.env.DEV && typeof console !== "undefined") {
              console.log(
                "[createGalleryItem] Fetched full item with category:",
                fullItem.data.category
              );
            }
            return fullItem.data;
          }
        } catch (fetchError) {
          if (import.meta.env.DEV && typeof console !== "undefined") {
            console.warn(
              "[createGalleryItem] Failed to fetch full item, returning partial data:",
              fetchError
            );
          }
        }
      }

      return createdItem;
    }

    throw new Error(response.message || "Failed to create gallery item");
  } catch (error) {
    if (import.meta.env.DEV && typeof console !== "undefined") {
      console.error("[createGalleryItem] Error:", error);
    }
    throw error;
  }
};

/**
 * Update gallery item (Admin only)
 * @param {string} id - Gallery item ID
 * @param {object} galleryData - Updated gallery item data
 * @param {File} imageFile - New image file (optional)
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Updated gallery item data
 */
export const updateGalleryItem = async (
  id,
  galleryData,
  imageFile = null,
  token = null,
  onProgress = null
) => {
  try {
    const validFile = imageFile instanceof File ? imageFile : null;
    const formData = createFormData(galleryData, validFile, "image");

    // Debug logging in development
    if (import.meta.env.DEV && typeof console !== "undefined") {
      console.log("[updateGalleryItem] Updating gallery item with data:", {
        id: id,
        galleryData: galleryData,
        hasCategory: !!galleryData.category,
        category: galleryData.category,
        hasImageFile: !!validFile,
        imageFileName: validFile?.name,
      });
    }

    const response = await uploadFile(
      API_ENDPOINTS.GALLERY_BY_ID(id),
      formData,
      {
        method: "PUT",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        onUploadProgress: onProgress
          ? (ev) => {
              if (ev.total) {
                const percent = Math.round((ev.loaded * 100) / ev.total);
                try {
                  onProgress(percent);
                } catch (e) {
                  /* ignore callback errors */
                }
              }
            }
          : undefined,
      }
    );

    // Debug logging for response
    if (import.meta.env.DEV && typeof console !== "undefined") {
      console.log("[updateGalleryItem] Response:", {
        success: response.success,
        hasData: !!response.data,
        categoryInResponse: response.data?.category,
      });
    }

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || "Failed to update gallery item");
  } catch (error) {
    if (import.meta.env.DEV && typeof console !== "undefined") {
      console.error("[updateGalleryItem] Error:", error);
    }
    throw error;
  }
};

/**
 * Delete gallery item (Admin only)
 * @param {string} id - Gallery item ID
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Delete response
 */
export const deleteGalleryItem = async (id, token = null) => {
  try {
    const response = await del(API_ENDPOINTS.GALLERY_BY_ID(id), {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response;
    }

    throw new Error(response.message || "Failed to delete gallery item");
  } catch (error) {
    throw error;
  }
};

/**
 * Get all FAQs
 * @param {object} params - Query parameters
 * @returns {Promise<Array>} - FAQs array
 */
export const getFAQs = async (params = {}) => {
  try {
    const response = await get(API_ENDPOINTS.FAQS, params);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch FAQs");
  } catch (error) {
    throw error;
  }
};

/**
 * Get single FAQ by ID
 * @param {string} id - FAQ ID
 * @returns {Promise<object>} - FAQ data
 */
export const getFAQById = async (id) => {
  try {
    const response = await get(API_ENDPOINTS.FAQS_BY_ID(id));

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "FAQ not found");
  } catch (error) {
    throw error;
  }
};

/**
 * Create FAQ (Admin only)
 * @param {object} faqData - FAQ data
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Created FAQ data
 */
export const createFAQ = async (faqData, token = null) => {
  try {
    const response = await post(API_ENDPOINTS.FAQS, faqData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || "Failed to create FAQ");
  } catch (error) {
    throw error;
  }
};

/**
 * Update FAQ (Admin only)
 * @param {string} id - FAQ ID
 * @param {object} faqData - Updated FAQ data
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Updated FAQ data
 */
export const updateFAQ = async (id, faqData, token = null) => {
  try {
    const response = await put(API_ENDPOINTS.FAQS_BY_ID(id), faqData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response.data || response;
    }

    throw new Error(response.message || "Failed to update FAQ");
  } catch (error) {
    throw error;
  }
};

/**
 * Delete FAQ (Admin only)
 * @param {string} id - FAQ ID
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Delete response
 */
export const deleteFAQ = async (id, token = null) => {
  try {
    const response = await del(API_ENDPOINTS.FAQS_BY_ID(id), {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.success) {
      return response;
    }

    throw new Error(response.message || "Failed to delete FAQ");
  } catch (error) {
    throw error;
  }
};
