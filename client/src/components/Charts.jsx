import React, { useEffect, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

function Charts() {
    // ✅ URL YAHAN FIX KAR DIYA HAI
    const API_BASE_URL = "http://localhost:5000";

    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchChartData();
    }, []);

    const fetchChartData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${API_BASE_URL}/api/complaints/chart-data`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setChartData(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Chart error:', err);
            setError('Failed to load chart data');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading charts...</p>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger mt-3">{error}</div>;
    }

    if (!chartData) return null;

    const colors = ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)', 'rgba(199, 199, 199, 0.7)'];
    const borderColors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(199, 199, 199, 1)'];

    const barData = {
        labels: chartData.category.map(item => item._id || 'Unknown'),
        datasets: [{
            label: 'Complaints by Category',
            data: chartData.category.map(item => item.count),
            backgroundColor: colors.slice(0, chartData.category.length),
            borderColor: borderColors.slice(0, chartData.category.length),
            borderWidth: 2,
            borderRadius: 5
        }]
    };

    const statusColors = { 'Pending': '#f0b70e', 'In Progress': '#1b5f69', 'Resolved': '#067e46' };
    const doughnutData = {
        labels: chartData.status.map(item => item._id || 'Unknown'),
        datasets: [{
            data: chartData.status.map(item => item.count),
            backgroundColor: chartData.status.map(item => statusColors[item._id] || '#cccccc'),
            borderWidth: 2,
            hoverOffset: 8
        }]
    };

    const lineData = {
        labels: chartData.trend.map(item => {
            const date = new Date(item._id);
            return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        }),
        datasets: [{
            label: 'Complaints per Day',
            data: chartData.trend.map(item => item.count),
            borderColor: '#1b5f69',
            backgroundColor: 'rgba(27, 95, 105, 0.1)',
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#1b5f69',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4
        }]
    };

    const barOptions = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } };
    const doughnutOptions = { responsive: true, plugins: { legend: { position: 'bottom' } }, cutout: '65%' };
    const lineOptions = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } };

    const totalComplaints = chartData.status.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="mt-4">
            <h4 className="text-success fw-bold mb-3">📊 Complaint Analytics</h4>
            <div className="row mb-4">
                <div className="col-md-3 col-6 mb-2">
                    <div className="card bg-light shadow-sm text-center p-2">
                        <h6 className="text-muted mb-0">Total</h6>
                        <h3 className="fw-bold text-primary">{totalComplaints}</h3>
                    </div>
                </div>
                {chartData.status.map(item => (
                    <div className="col-md-3 col-6 mb-2" key={item._id}>
                        <div className="card shadow-sm text-center p-2" style={{ backgroundColor: statusColors[item._id] || '#f8f9fa', color: item._id === 'Pending' ? '#000' : '#fff' }}>
                            <h6 className="mb-0">{item._id || 'Unknown'}</h6>
                            <h3 className="fw-bold">{item.count}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card shadow p-3 h-100">
                        <h6 className="text-center fw-bold">Category Distribution</h6>
                        <div style={{ height: '280px' }}><Bar data={barData} options={barOptions} /></div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card shadow p-3 h-100">
                        <h6 className="text-center fw-bold">Status Distribution</h6>
                        <div style={{ height: '280px' }}><Doughnut data={doughnutData} options={doughnutOptions} /></div>
                    </div>
                </div>
                <div className="col-12 mb-4">
                    <div className="card shadow p-3">
                        <h6 className="text-center fw-bold">Last 7 Days Trend</h6>
                        <div style={{ height: '250px' }}><Line data={lineData} options={lineOptions} /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Charts;