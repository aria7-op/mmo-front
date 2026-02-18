// Program type mapping used when API doesn't provide explicit slugs/types
const programTypes = {
    sitc: {
        ids: [],
        keywords: [
            'sitc',
            'education',
            'community-based education',
            'community based education',
            'cbe',
            'school',
            'learning'
        ]
    },
    tabaan: {
        ids: [],
        keywords: [
            'tabaan',
            'livelihood',
            'livelihoods',
            'agriculture',
            'food security',
            'resilience',
            'community resilience'
        ]
    },
    'stay-in-afghanistan': {
        ids: [],
        keywords: [
            'stayIN afghanistan',
            'stay-in-afghanistan',
            'stay',
            'reintegration',
            'returnee',
            'humanitarian',
            'emergency',
            'response',
            'relief'
        ]
    }
};

export default programTypes;
