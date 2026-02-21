const FOLDER_ID = '15opHbX_z0iSyUL0XR0XF8H9owpKRA_u-';
const API_KEY = 'AIzaSyD1pUOeZCHHTlUeNmriN8OZ1C3RvJCN6JE'.trim();

let galleryCache = null;
let lastFetch = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const fetchDriveGallery = async () => {
    const now = Date.now();
    if (galleryCache && (now - lastFetch < CACHE_DURATION)) {
        return galleryCache;
    }

    try {
        // Fetch more items to ensure "full folder" is covered
        const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+trashed=false&key=${API_KEY}&fields=files(id,name,mimeType,webContentLink,thumbnailLink,createdTime,size)&pageSize=200&orderBy=createdTime desc`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch from Google Drive');

        const data = await response.json();

        const processed = data.files.map(file => {
            const isVideo = file.mimeType.startsWith('video/');
            const isImage = file.mimeType.startsWith('image/');
            const name = file.name.split('.')[0];
            const size = parseInt(file.size || '0');
            const isLargeFile = size > 100 * 1024 * 1024; // > 100MB check for Drive limit

            // Optimized URLs for Cross-Origin browser display - Reduced size for faster loading
            const imageSrc = `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`;

            // Priority Logic
            let priority = 0;
            if (name.includes('WA0272')) priority = 100;
            else if (name.toLowerCase().includes('pongal')) priority = 90;
            else if (name.toLowerCase().includes('spark')) priority = 80;
            else if (isVideo) priority = 30;

            return {
                id: file.id,
                name: name,
                category: name.toLowerCase().includes('spark') ? 'SPARK 25' :
                    name.toLowerCase().includes('pongal') ? 'Pongal' :
                        isVideo ? 'Motion' : 'Threads Glimpse',
                src: isImage ? imageSrc : videoSrc,
                thumbnail: imageSrc, // Large thumbnail as poster
                isVideo,
                isImage,
                mimeType: file.mimeType,
                priority: priority,
                createdTime: file.createdTime,
                isLargeFile // New property for UI handling
            };
        }).filter(file => file.isImage || file.isVideo);

        // Custom Sort: Priority first, then by date
        const sorted = processed.sort((a, b) => {
            if (b.priority !== a.priority) return b.priority - a.priority;
            return new Date(b.createdTime) - new Date(a.createdTime);
        });

        galleryCache = sorted;
        lastFetch = Date.now();
        return sorted;
    } catch (error) {
        console.error('Error fetching drive gallery:', error);
        return [];
    }
};
