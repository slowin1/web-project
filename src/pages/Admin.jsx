import { useState } from 'react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { useDashboardData } from '../hooks/useDashboardData';
import { useUsers } from '../hooks/useUsers';
import { useSettings } from '../hooks/useSettings';
import { useContent } from '../hooks/useContent';

export default function AdminPage() {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [selectedPeriod, setSelectedPeriod] = useState('7d');

    // Load data from API (with fallback to mock data)
    const { 
        stats, 
        visitorData, 
        hourlyData, 
        deviceData, 
        trafficSources,
        loading: dashboardLoading,
        refreshData 
    } = useDashboardData();

    const { 
        users, 
        loading: usersLoading, 
        createUser, 
        updateUser, 
        deleteUser 
    } = useUsers();

    const { 
        settings, 
        loading: settingsLoading, 
        saving, 
        updateSettings 
    } = useSettings();

    const { 
        pages, 
        posts, 
        media,
        loading: contentLoading 
    } = useContent();

    const COLORS = ['#4a9eff', '#00d4ff', '#7b61ff', '#ff6b9d'];

    const formatStatNumber = (value) => {
        if (typeof value === 'number') {
            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
            if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
            return value.toString();
        }
        return value;
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className="admin-section">
                        <div className="admin-header">
                            <h3>Dashboard</h3>
                            <div className="date-range-picker">
                                <select 
                                    value={selectedPeriod} 
                                    onChange={(e) => {
                                        setSelectedPeriod(e.target.value);
                                        refreshData(e.target.value);
                                    }}
                                >
                                    <option value="7d">Last 7 days</option>
                                    <option value="30d">Last 30 days</option>
                                    <option value="90d">Last 90 days</option>
                                </select>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="admin-stats-grid">
                            <div className="admin-stat-card gradient-1">
                                <div className="stat-icon">👥</div>
                                <div className="stat-info">
                                    <h4>Total Visitors</h4>
                                    <p className="stat-number">
                                        {stats?.totalVisitors ? formatStatNumber(stats.totalVisitors) : '32.8K'}
                                    </p>
                                    <span className="stat-change positive">+12.5%</span>
                                </div>
                            </div>
                            <div className="admin-stat-card gradient-2">
                                <div className="stat-icon">👤</div>
                                <div className="stat-info">
                                    <h4>Unique Visitors</h4>
                                    <p className="stat-number">
                                        {stats?.uniqueVisitors ? formatStatNumber(stats.uniqueVisitors) : '24.4K'}
                                    </p>
                                    <span className="stat-change positive">+8.3%</span>
                                </div>
                            </div>
                            <div className="admin-stat-card gradient-3">
                                <div className="stat-icon">⏱️</div>
                                <div className="stat-info">
                                    <h4>Avg. Session</h4>
                                    <p className="stat-number">{stats?.avgSession || '4m 32s'}</p>
                                    <span className="stat-change positive">+15.2%</span>
                                </div>
                            </div>
                            <div className="admin-stat-card gradient-4">
                                <div className="stat-icon">💰</div>
                                <div className="stat-info">
                                    <h4>Revenue</h4>
                                    <p className="stat-number">
                                        ${stats?.revenue ? formatStatNumber(stats.revenue) : '12.8K'}
                                    </p>
                                    <span className="stat-change positive">+23.1%</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Chart */}
                        <div className="chart-container">
                            <div className="chart-header">
                                <h4>Visitor Analytics</h4>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={visitorData}>
                                    <defs>
                                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4a9eff" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#4a9eff" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                                    <YAxis stroke="rgba(255,255,255,0.6)" />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'var(--fg)', 
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '4px',
                                        }} 
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="visitors" stroke="#4a9eff" fillOpacity={1} fill="url(#colorVisitors)" />
                                    <Area type="monotone" dataKey="unique" stroke="#00d4ff" fillOpacity={1} fill="url(#colorUnique)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Secondary Charts Row */}
                        <div className="charts-row">
                            <div className="chart-container half">
                                <div className="chart-header">
                                    <h4>Hourly Traffic</h4>
                                </div>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={hourlyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="time" stroke="rgba(255,255,255,0.6)" />
                                        <YAxis stroke="rgba(255,255,255,0.6)" />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'var(--fg)', 
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '4px',
                                            }} 
                                        />
                                        <Bar dataKey="visitors" fill="#7b61ff" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="chart-container half">
                                <div className="chart-header">
                                    <h4>Device Distribution</h4>
                                </div>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={deviceData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${value}%`}
                                            labelLine={false}
                                        >
                                            {deviceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'var(--fg)', 
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '4px',
                                            }} 
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Traffic Sources */}
                        <div className="chart-container">
                            <div className="chart-header">
                                <h4>Traffic Sources</h4>
                            </div>
                            <div className="traffic-sources">
                                {trafficSources.map((source, index) => (
                                    <div key={source.name} className="traffic-source-item">
                                        <div className="source-info">
                                            <span className="source-dot" style={{ backgroundColor: COLORS[index] }}></span>
                                            <span className="source-name">{source.name}</span>
                                        </div>
                                        <div className="source-bar">
                                            <div 
                                                className="source-progress" 
                                                style={{ 
                                                    width: `${source.value}%`,
                                                    backgroundColor: COLORS[index]
                                                }}
                                            ></div>
                                        </div>
                                        <span className="source-value">{source.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'users':
                return (
                    <div className="admin-section">
                        <div className="admin-header">
                            <h3>User Management</h3>
                            <button className="btn-primary" onClick={() => createUser({ name: 'New User', email: 'new@example.com', role: 'user', status: 'active' })}>+ Add User</button>
                        </div>
                        {usersLoading ? (
                            <p className="loading-text">Loading users...</p>
                        ) : (
                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td>#{user.id}</td>
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="user-avatar">
                                                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                        </div>
                                                        <span>{user.name}</span>
                                                    </div>
                                                </td>
                                                <td>{user.email}</td>
                                                <td><span className="role-badge">{user.role}</span></td>
                                                <td><span className="status-badge {user.status}">{user.status}</span></td>
                                                <td>{new Date(user.joinedAt).toLocaleDateString()}</td>
                                                <td>
                                                    <button 
                                                        className="btn-icon"
                                                        onClick={() => updateUser(user.id, { ...user, name: 'Updated Name' })}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button 
                                                        className="btn-icon"
                                                        onClick={() => deleteUser(user.id)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );

            case 'content':
                return (
                    <div className="admin-section">
                        <div className="admin-header">
                            <h3>Content Management</h3>
                            <button className="btn-primary">+ Create New</button>
                        </div>
                        {contentLoading ? (
                            <p className="loading-text">Loading content...</p>
                        ) : (
                            <div className="content-grid">
                                <div className="content-card-modern">
                                    <div className="content-icon">📄</div>
                                    <h4>Pages</h4>
                                    <p>{pages.length} pages published</p>
                                    <button className="btn-secondary">Manage Pages</button>
                                </div>
                                <div className="content-card-modern">
                                    <div className="content-icon">📝</div>
                                    <h4>Blog Posts</h4>
                                    <p>{posts.length} posts published</p>
                                    <button className="btn-secondary">Manage Posts</button>
                                </div>
                                <div className="content-card-modern">
                                    <div className="content-icon">🖼️</div>
                                    <h4>Media Library</h4>
                                    <p>{media.length} files uploaded</p>
                                    <button className="btn-secondary">Browse Media</button>
                                </div>
                                <div className="content-card-modern">
                                    <div className="content-icon">📊</div>
                                    <h4>Analytics</h4>
                                    <p>View performance</p>
                                    <button className="btn-secondary">View Stats</button>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'settings':
                return (
                    <div className="admin-section">
                        <h3>Settings</h3>
                        {settingsLoading ? (
                            <p className="loading-text">Loading settings...</p>
                        ) : (
                            <form className="admin-form" onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const data = Object.fromEntries(formData.entries());
                                await updateSettings(data);
                            }}>
                                <div className="form-group">
                                    <label htmlFor="siteName">Site Name</label>
                                    <input 
                                        type="text" 
                                        id="siteName"
                                        name="siteName"
                                        defaultValue={settings?.siteName || 'MassageSalon'} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="adminEmail">Admin Email</label>
                                    <input 
                                        type="email" 
                                        id="adminEmail"
                                        name="adminEmail"
                                        defaultValue={settings?.adminEmail || 'admin@example.com'} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="language">Language</label>
                                    <select id="language" name="language" defaultValue={settings?.language || 'en'}>
                                        <option value="en">English</option>
                                        <option value="ro">Română</option>
                                        <option value="ru">Русский</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="timezone">Timezone</label>
                                    <select id="timezone" name="timezone" defaultValue={settings?.timezone || 'europe/chisinau'}>
                                        <option value="europe/chisinau">Chisinau (EET)</option>
                                        <option value="utc">UTC</option>
                                    </select>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary" disabled={saving}>
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button type="reset" className="btn-secondary">Reset</button>
                                </div>
                            </form>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            <div className="admin-page">
                <div className="admin-content">
                    <div className="admin-title">
                        <h2>Admin Panel</h2>
                        <div className="admin-user">
                            <span className="admin-name">Admin</span>
                            <div className="admin-avatar">A</div>
                        </div>
                    </div>
                    <div className="admin-flex-container">
                        <div className="admin-sidebar">
                            <ul>
                                <li>
                                    <a
                                        href="#dashboard"
                                        className={activeSection === 'dashboard' ? 'active' : ''}
                                        onClick={(e) => { e.preventDefault(); setActiveSection('dashboard'); }}
                                    >
                                        <span className="menu-icon">📊</span>
                                        Dashboard
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#user-management"
                                        className={activeSection === 'users' ? 'active' : ''}
                                        onClick={(e) => { e.preventDefault(); setActiveSection('users'); }}
                                    >
                                        <span className="menu-icon">👥</span>
                                        Users
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#content-management"
                                        className={activeSection === 'content' ? 'active' : ''}
                                        onClick={(e) => { e.preventDefault(); setActiveSection('content'); }}
                                    >
                                        <span className="menu-icon">📁</span>
                                        Content
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#settings"
                                        className={activeSection === 'settings' ? 'active' : ''}
                                        onClick={(e) => { e.preventDefault(); setActiveSection('settings'); }}
                                    >
                                        <span className="menu-icon">⚙️</span>
                                        Settings
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="admin-main-content">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
