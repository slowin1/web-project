import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useDashboardData } from '../hooks/useDashboardData';
import { useContent } from '../hooks/useContent';
import { useSettings } from '../hooks/useSettings';
import ServicesManager from '../components/Admin/ServicesManager';
import UsersManager from '../components/Admin/UsersManager';
import { ADMIN_LANGUAGES, getStoredAdminLanguage, setStoredAdminLanguage, useAdminText } from '../components/Admin/adminI18n';
import { useState } from 'react';

export function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const { t } = useAdminText();

  const {
    stats,
    visitorData,
    hourlyData,
    deviceData,
    trafficSources,
    loading: dashboardLoading,
    refreshData,
  } = useDashboardData();

  const COLORS = ['#007aff', '#34c759', '#ff9500', '#af52de'];

  const formatStatNumber = (value) => {
    if (typeof value === 'number') {
      if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
      if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
      return value.toString();
    }
    return value;
  };

  if (dashboardLoading) {
    return (
      <div className="admin-section">
          <div className="admin-header">
          <h3>{t.dashboard.title}</h3>
        </div>
        <p className="loading-text">{t.dashboard.loading}</p>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="admin-hero-panel">
        <div>
          <p className="admin-panel-eyebrow">{t.dashboard.eyebrow}</p>
          <h3>{t.dashboard.title}</h3>
          <p className="admin-panel-copy">
            {t.dashboard.copy}
          </p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => refreshData(selectedPeriod)}
        >
          {t.dashboard.refresh}
        </button>
      </div>

      <div className="admin-header">
        <h4 className="admin-subtitle">{t.dashboard.period}</h4>
        <div className="date-range-picker">
          <select
            value={selectedPeriod}
            onChange={(e) => {
              setSelectedPeriod(e.target.value);
              refreshData(e.target.value);
            }}
          >
            <option value="7d">{t.dashboard.periods["7d"]}</option>
            <option value="30d">{t.dashboard.periods["30d"]}</option>
            <option value="90d">{t.dashboard.periods["90d"]}</option>
          </select>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card gradient-1">
          <div className="stat-icon">VIS</div>
          <div className="stat-info">
            <h4>{t.dashboard.totalVisitors}</h4>
            <p className="stat-number">{stats?.totalVisitors ? formatStatNumber(stats.totalVisitors) : '32.8K'}</p>
            <span className="stat-change positive">+12.5%</span>
          </div>
        </div>
        <div className="admin-stat-card gradient-2">
          <div className="stat-icon">UNI</div>
          <div className="stat-info">
            <h4>{t.dashboard.uniqueVisitors}</h4>
            <p className="stat-number">{stats?.uniqueVisitors ? formatStatNumber(stats.uniqueVisitors) : '24.4K'}</p>
            <span className="stat-change positive">+8.3%</span>
          </div>
        </div>
        <div className="admin-stat-card gradient-3">
          <div className="stat-icon">AVG</div>
          <div className="stat-info">
            <h4>{t.dashboard.avgSession}</h4>
            <p className="stat-number">{stats?.avgSession || '4m 32s'}</p>
            <span className="stat-change positive">+15.2%</span>
          </div>
        </div>
        <div className="admin-stat-card gradient-4">
          <div className="stat-icon">REV</div>
          <div className="stat-info">
            <h4>{t.dashboard.revenue}</h4>
            <p className="stat-number">{stats?.revenue ? '$' + formatStatNumber(stats.revenue) : '$12.8K'}</p>
            <span className="stat-change positive">+23.1%</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h4>{t.dashboard.visitorAnalytics}</h4>
        </div>

        {visitorData && visitorData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={visitorData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007aff" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#007aff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34c759" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#34c759" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.6)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="visitors" stroke="#007aff" fillOpacity={1} fill="url(#colorVisitors)" name="Visitors" />
              <Area type="monotone" dataKey="unique" stroke="#34c759" fillOpacity={1} fill="url(#colorUnique)" name="Unique" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="loading-text">{t.dashboard.noVisitors}</p>
        )}
      </div>

      <div className="charts-row">
        <div className="chart-container half">
          <div className="chart-header">
            <h4>{t.dashboard.hourlyTraffic}</h4>
          </div>

          {hourlyData && hourlyData.length > 0 ? (
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
                <Bar dataKey="visitors" fill="#007aff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="loading-text">{t.dashboard.noHourly}</p>
          )}
        </div>

        <div className="chart-container half">
          <div className="chart-header">
            <h4>{t.dashboard.devices}</h4>
          </div>

          {deviceData && deviceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
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
          ) : (
            <p className="loading-text">{t.dashboard.noDevices}</p>
          )}
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h4>{t.dashboard.trafficSources}</h4>
        </div>

        <div className="traffic-sources">
          {trafficSources.map((source, index) => (
            <div key={source.name} className="traffic-source-item">
              <div className="source-info">
                <span className="source-dot" style={{ backgroundColor: COLORS[index] }} />
                <span className="source-name">{source.name}</span>
              </div>
              <div className="source-bar">
                <div
                  className="source-progress"
                  style={{ width: `${source.value}%`, backgroundColor: COLORS[index] }}
                />
              </div>
              <span className="source-value">{source.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminUsers() {
  return <UsersManager />;
}

export function AdminServices() {
  return <ServicesManager />;
}

export function AdminContent() {
  const { pages, posts, media, loading: contentLoading } = useContent();
  const { t } = useAdminText();

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h3>{t.content.title}</h3>
        <button className="btn-primary">{t.content.create}</button>
      </div>

      {contentLoading ? (
        <p className="loading-text">{t.content.loading}</p>
      ) : (
        <div className="content-grid">
          <div className="content-card-modern">
            <div className="content-icon">PG</div>
            <h4>{t.content.pages}</h4>
            <p>{pages.length} {t.content.pagesCount}</p>
            <button className="btn-secondary">{t.content.managePages}</button>
          </div>
          <div className="content-card-modern">
            <div className="content-icon">BL</div>
            <h4>{t.content.posts}</h4>
            <p>{posts.length} {t.content.postsCount}</p>
            <button className="btn-secondary">{t.content.managePosts}</button>
          </div>
          <div className="content-card-modern">
            <div className="content-icon">MD</div>
            <h4>{t.content.media}</h4>
            <p>{media.length} {t.content.mediaCount}</p>
            <button className="btn-secondary">{t.content.browseMedia}</button>
          </div>
          <div className="content-card-modern">
            <div className="content-icon">AN</div>
            <h4>{t.content.analytics}</h4>
            <p>{t.content.performance}</p>
            <button className="btn-secondary">{t.content.viewStats}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminSettings() {
  const { settings, loading: settingsLoading, saving, updateSettings } = useSettings();
  const { t } = useAdminText();

  return (
    <div className="admin-section">
      <h3>{t.settings.title}</h3>

      {settingsLoading ? (
        <p className="loading-text">{t.settings.loading}</p>
      ) : (
        <form
          className="admin-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            setStoredAdminLanguage(data.language);
            await updateSettings(data);
          }}
        >
          <div className="form-group">
            <label htmlFor="siteName">{t.settings.siteName}</label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              defaultValue={settings?.siteName || 'MassageSalon'}
            />
          </div>
          <div className="form-group">
            <label htmlFor="adminEmail">{t.settings.adminEmail}</label>
            <input
              type="email"
              id="adminEmail"
              name="adminEmail"
              defaultValue={settings?.adminEmail || 'admin@example.com'}
            />
          </div>
          <div className="form-group">
            <label htmlFor="language">{t.settings.language}</label>
            <select
              id="language"
              name="language"
              defaultValue={settings?.language || getStoredAdminLanguage()}
              onChange={(event) => setStoredAdminLanguage(event.target.value)}
            >
              {ADMIN_LANGUAGES.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="timezone">{t.settings.timezone}</label>
            <select
              id="timezone"
              name="timezone"
              defaultValue={settings?.timezone || 'europe/chisinau'}
            >
              <option value="europe/chisinau">Chisinau (EET)</option>
              <option value="utc">UTC</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? t.settings.saving : t.settings.save}
            </button>
            <button type="reset" className="btn-secondary">{t.settings.reset}</button>
          </div>
        </form>
      )}
    </div>
  );
}
