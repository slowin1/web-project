import { useState, useEffect, useCallback } from 'react';
import { contentAPI } from '../api/admin';

export function useContent() {
    const [pages, setPages] = useState([]);
    const [posts, setPosts] = useState([]);
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchContent = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [pagesRes, postsRes, mediaRes] = await Promise.all([
                contentAPI.getPages(),
                contentAPI.getPosts(),
                contentAPI.getMedia(),
            ]);

            setPages(pagesRes.data || pagesRes);
            setPosts(postsRes.data || postsRes);
            setMedia(mediaRes.data || mediaRes);
        } catch (err) {
            setError(err.message);
            // Fallback to mock data for development
            setPages([
                { id: 1, title: 'Home', slug: '/', status: 'published', updatedAt: '2024-01-15' },
                { id: 2, title: 'About', slug: '/about', status: 'published', updatedAt: '2024-02-20' },
                { id: 3, title: 'Services', slug: '/services', status: 'draft', updatedAt: '2024-03-10' },
            ]);
            setPosts([
                { id: 1, title: 'New Massage Techniques', slug: 'new-massage-techniques', status: 'published', updatedAt: '2024-01-15' },
                { id: 2, title: 'Relaxation Tips', slug: 'relaxation-tips', status: 'published', updatedAt: '2024-02-20' },
            ]);
            setMedia([
                { id: 1, name: 'hero-image.jpg', type: 'image', size: '2.4 MB', uploadedAt: '2024-01-15' },
                { id: 2, name: 'logo.png', type: 'image', size: '156 KB', uploadedAt: '2024-02-20' },
            ]);
        } finally {
            setLoading(false);
        }
    }, []);

    const updatePage = async (id, data) => {
        try {
            const updated = await contentAPI.updatePage(id, data);
            setPages(prev => prev.map(page => page.id === id ? { ...page, ...updated.data } : page));
            return updated;
        } catch (err) {
            throw err;
        }
    };

    const updatePost = async (id, data) => {
        try {
            const updated = await contentAPI.updatePost(id, data);
            setPosts(prev => prev.map(post => post.id === id ? { ...post, ...updated.data } : post));
            return updated;
        } catch (err) {
            throw err;
        }
    };

    const uploadMedia = async (formData) => {
        try {
            const uploaded = await contentAPI.uploadMedia(formData);
            setMedia(prev => [...prev, uploaded.data || uploaded]);
            return uploaded;
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    return {
        pages,
        posts,
        media,
        loading,
        error,
        refreshContent: fetchContent,
        updatePage,
        updatePost,
        uploadMedia,
    };
}
