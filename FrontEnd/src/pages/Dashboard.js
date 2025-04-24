import React, { useEffect, useState } from 'react';
import DashboardService from '../services/DashboardServices';

const Dashboard = () => {
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
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Total Books</h3>
          </div>
          <div className="card-content">
            <p className="card-value">{dashboardData.books_count}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Taken Books</h3>
          </div>
          <div className="card-content">
            <p className="card-value">{dashboardData.taken_books}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Untaken Books</h3>
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