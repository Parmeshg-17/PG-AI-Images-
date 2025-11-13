import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
    const { users, paymentRequests } = useAuth();
    const pendingPayments = paymentRequests.filter(p => p.status === 'pending').length;

    const navLinkClasses = ({ isActive }: { isActive: boolean }) => 
        `px-4 py-2 rounded-lg font-medium text-sm transition-colors ${isActive ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`;

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            <h1 className="text-4xl font-bold font-heading mb-2">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8 font-sans">Manage users and payment requests.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 font-sans">
                <div className="p-6 bg-light-secondary dark:bg-dark-secondary rounded-xl border border-light-border dark:border-dark-border">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Users</h3>
                    <p className="text-4xl font-bold font-heading mt-1">{users.length}</p>
                </div>
                <div className="p-6 bg-light-secondary dark:bg-dark-secondary rounded-xl border border-light-border dark:border-dark-border">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pending Payments</h3>
                    <p className="text-4xl font-bold font-heading mt-1">{pendingPayments}</p>
                </div>
            </div>

            <div className="flex space-x-2 border-b border-light-border dark:border-dark-border mb-6 font-sans">
                <NavLink to="users" className={navLinkClasses}>Manage Users</NavLink>
                <NavLink to="payments" className={navLinkClasses}>
                    Manage Payments {pendingPayments > 0 && <span className="ml-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">{pendingPayments}</span>}
                </NavLink>
                <NavLink to="environments" className={navLinkClasses}>Environments</NavLink>
            </div>

            <div className="bg-light-secondary dark:bg-dark-secondary p-6 rounded-xl shadow-inner border border-light-border dark:border-dark-border">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboardPage;
