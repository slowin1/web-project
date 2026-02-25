import { useState, useEffect, useCallback } from 'react';
import { settingsAPI } from '../api/admin';

export function useSettings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await settingsAPI.get();
            setSettings(data.data || data);
        } catch (err) {
            setError(err.message);
            // Fallback to mock data for development
            setSettings({
                siteName: 'MassageSalon',
                adminEmail: 'admin@example.com',
                language: 'en',
                timezone: 'europe/chisinau',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSettings = async (newSettings) => {
        try {
            setSaving(true);
            const updated = await settingsAPI.update(newSettings);
            setSettings(updated.data || updated);
            return updated;
        } catch (err) {
            throw err;
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return {
        settings,
        loading,
        error,
        saving,
        refreshSettings: fetchSettings,
        updateSettings,
    };
}
