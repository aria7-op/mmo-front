/**
 * Draft Manager Utility
 * Manages multiple drafts for different modal instances
 */

export const draftManager = {
    // Save a draft with unique ID
    saveDraft: (modalId, data, isEdit = false) => {
        const draft = {
            data,
            timestamp: new Date().toISOString(),
            isEdit,
            modalId
        };
        localStorage.setItem(`news-draft-${modalId}`, JSON.stringify(draft));
        return draft;
    },

    // Load a specific draft
    loadDraft: (modalId) => {
        try {
            const savedDraft = localStorage.getItem(`news-draft-${modalId}`);
            if (savedDraft) {
                return JSON.parse(savedDraft);
            }
            return null;
        } catch (error) {
            console.error('Error loading draft:', error);
            return null;
        }
    },

    // Delete a specific draft
    deleteDraft: (modalId) => {
        localStorage.removeItem(`news-draft-${modalId}`);
    },

    // Get all drafts
    getAllDrafts: () => {
        const drafts = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('news-draft-')) {
                try {
                    const draft = JSON.parse(localStorage.getItem(key));
                    drafts.push(draft);
                } catch (error) {
                    console.error('Error parsing draft:', error);
                }
            }
        }
        return drafts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    // Clear all drafts
    clearAllDrafts: () => {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('news-draft-')) {
                keys.push(key);
            }
        }
        keys.forEach(key => localStorage.removeItem(key));
    },

    // Get draft summary for display
    getDraftSummary: (draft) => {
        const title = draft.data?.title?.en || draft.data?.title?.per || draft.data?.title?.ps || 'Untitled';
        const summary = draft.data?.summary?.en || draft.data?.summary?.per || draft.data?.summary?.ps || '';
        const date = new Date(draft.timestamp);
        return {
            title: title.substring(0, 50) + (title.length > 50 ? '...' : ''),
            summary: summary.substring(0, 100) + (summary.length > 100 ? '...' : ''),
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString(),
            isEdit: draft.isEdit,
            modalId: draft.modalId
        };
    }
};

export default draftManager;
