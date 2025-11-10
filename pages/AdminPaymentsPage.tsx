import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { PaymentRequest } from '../types';

const AdminPaymentsPage = () => {
    const { paymentRequests, approvePayment, rejectPayment } = useAuth();
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [actionablePayment, setActionablePayment] = useState<{type: 'approve' | 'reject', payment: PaymentRequest} | null>(null);


    const filteredPayments = useMemo(() => {
        if (filter === 'all') return paymentRequests;
        return paymentRequests.filter(p => p.status === filter);
    }, [paymentRequests, filter]);
    
    const handleActionConfirm = () => {
        if(actionablePayment) {
            if(actionablePayment.type === 'approve') {
                approvePayment(actionablePayment.payment.id);
            } else {
                rejectPayment(actionablePayment.payment.id);
            }
            setActionablePayment(null);
        }
    }

    const getStatusChip = (status: 'pending' | 'approved' | 'rejected') => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        }
    };
    
    return (
        <div className="font-sans">
            <Modal
                isOpen={!!actionablePayment}
                onClose={() => setActionablePayment(null)}
                title={`${actionablePayment?.type === 'approve' ? 'Approve' : 'Reject'} Payment?`}
            >
                <div>
                   <p className="mb-4">
                        Are you sure you want to {actionablePayment?.type} this payment request from <span className="font-bold">{actionablePayment?.payment.userName}</span> for the <span className="font-bold">{actionablePayment?.payment.plan}</span> plan?
                   </p>
                    <p className="text-sm text-gray-500 bg-light dark:bg-dark p-3 rounded-lg">UTR Code: <span className="font-mono">{actionablePayment?.payment.utrCode}</span></p>
                    <div className="flex justify-end space-x-2 pt-4 mt-2">
                        <button onClick={() => setActionablePayment(null)} className="px-4 py-2 rounded-lg text-sm font-medium bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                        <button 
                            onClick={handleActionConfirm} 
                            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 ${actionablePayment?.type === 'approve' ? 'bg-green-600' : 'bg-red-600'}`}>
                            Confirm {actionablePayment?.type === 'approve' ? 'Approval' : 'Rejection'}
                        </button>
                    </div>
                </div>
            </Modal>

            <h2 className="text-2xl font-bold font-heading mb-4">Manage Payments</h2>
            <div className="flex space-x-2 mb-6">
                {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)} 
                        className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-light dark:bg-dark/80 hover:bg-gray-200 dark:hover:bg-gray-800 border border-light-border dark:border-dark-border'}`}>
                        {f}
                    </button>
                ))}
            </div>
             <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="border-b border-light-border dark:border-dark-border">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">User</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Plan</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">UTR Code</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.map((p) => (
                            <tr key={p.id} className="border-b border-light-border dark:border-dark-border">
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{p.userName} (<span className="text-gray-500">₹{p.amount}</span>)</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{p.plan}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-500 dark:text-gray-400">{p.utrCode}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{p.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChip(p.status)} capitalize`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {p.status === 'pending' && (
                                        <div className="flex space-x-4">
                                            <button onClick={() => setActionablePayment({ type: 'approve', payment: p })} className="text-green-600 hover:text-green-500 font-semibold">Approve</button>
                                            <button onClick={() => setActionablePayment({ type: 'reject', payment: p })} className="text-red-600 hover:text-red-500 font-semibold">Reject</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {filteredPayments.length === 0 && <p className="text-center py-8 text-gray-500">No {filter} payments found.</p>}
        </div>
    );
};

export default AdminPaymentsPage;