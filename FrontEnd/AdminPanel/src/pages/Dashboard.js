import React, { useEffect, useState } from 'react';
import DashboardService from '../services/DashboardServices';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState({
    taken_books: 0,
    books_count: 0,
    untaken_books: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await DashboardService.getDashboardData();
        setDashboardData({
          taken_books: data.data.taken_books || 0,
          books_count: data.data.books_count || 0,
          untaken_books: data.data.untaken_books || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard" style={{ position: 'relative', zIndex: 1, minHeight: '75vh', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/library_background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
      <div className="dashboard-content">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>{t('total_books')}</h3>
          </div>
          <div className="card-content">
            <p className="card-value">{dashboardData.books_count}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="card-header">
            <h3>{t('borrowed_books')}</h3>
          </div>
          <div className="card-content">
            <p className="card-value">{dashboardData.taken_books}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="card-header">
            <h3>{t('unborrowed_books')}</h3>
          </div>
          <div className="card-content">
            <p className="card-value">{dashboardData.untaken_books}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
