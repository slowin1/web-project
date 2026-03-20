import { useState, useEffect, useCallback } from 'react';

// Mock data for development (no backend server)
const MOCK_DATA = {
    stats: {
        totalVisitors: 32847,
        uniqueVisitors: 24392,
        avgSession: '4m 32s',
        revenue: 12847,
    },
    visitorData: [
        { name: 'Mon', visitors: 2400, unique: 1800 },
        { name: 'Tue', visitors: 3200, unique: 2400 },
        { name: 'Wed', visitors: 4100, unique: 3100 },
        { name: 'Thu', visitors: 3800, unique: 2900 },
        { name: 'Fri', visitors: 5200, unique: 4100 },
        { name: 'Sat', visitors: 6800, unique: 5400 },
        { name: 'Sun', visitors: 5900, unique: 4600 },
    ],
    hourlyData: [
        { time: '00:00', visitors: 120 },
        { time: '03:00', visitors: 80 },
        { time: '06:00', visitors: 200 },
        { time: '09:00', visitors: 850 },
        { time: '12:00', visitors: 1200 },
        { time: '15:00', visitors: 1400 },
        { time: '18:00', visitors: 1600 },
        { time: '21:00', visitors: 900 },
    ],
    deviceData: [
        { name: 'Desktop', value: 45 },
        { name: 'Mobile', value: 38 },
        { name: 'Tablet', value: 17 },
    ],
    trafficSources: [
        { name: 'Direct', value: 35 },
        { name: 'Social', value: 28 },
        { name: 'Organic', value: 22 },
        { name: 'Referral', value: 15 },
    ],
};

export function useDashboardData() {
    const [stats, setStats] = useState(null);
    const [visitorData, setVisitorData] = useState([]);
    const [hourlyData, setHourlyData] = useState([]);
    const [deviceData, setDeviceData] = useState([]);
    const [trafficSources, setTrafficSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (period = '7d') => {
        try {
            setLoading(true);
            setError(null);

            // Use mock data for development (no backend server)
            console.log('Using mock data for development');
            
            setStats(MOCK_DATA.stats);
            setVisitorData(MOCK_DATA.visitorData);
            setHourlyData(MOCK_DATA.hourlyData);
            setDeviceData(MOCK_DATA.deviceData);
            setTrafficSources(MOCK_DATA.trafficSources);
        } catch (err) {
            console.error('Dashboard data error:', err.message);
            setError(err.message);
            
            // Fallback to mock data
            setStats(MOCK_DATA.stats);
            setVisitorData(MOCK_DATA.visitorData);
            setHourlyData(MOCK_DATA.hourlyData);
            setDeviceData(MOCK_DATA.deviceData);
            setTrafficSources(MOCK_DATA.trafficSources);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        stats,
        visitorData,
        hourlyData,
        deviceData,
        trafficSources,
        loading,
        error,
        refreshData: fetchData,
    };
}
