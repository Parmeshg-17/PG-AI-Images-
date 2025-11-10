import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import Modal from '../components/Modal';

const AdminUsersPage = () => {
    const { users, adminUpdateUserCredits } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [newCredits, setNewCredits] = useState<number>(0);

    const filteredUsers = useMemo(() =>
        users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [users, searchTerm]
    );

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        const currentCredits = user.credits >= 99999 ? 999999 : user.credits;
        setNewCredits(currentCredits);
    };

    const handleSaveCredits = () => {
        if (editingUser) {
            adminUpdateUserCredits(editingUser.id, newCredits);
            setEditingUser(null);
        }
    };
    
    return (
        <div className="font-sans">
            <Modal 
                isOpen={!!editingUser}
                onClose={() => setEditingUser(null)}
                title={`Edit Credits for ${editingUser?.name}`}
            >
                <div className="space-y-4">
                    <p>Current Credits: <span className="font-bold">{editingUser?.credits >= 99999 ? 'Unlimited' : editingUser?.credits}</span></p>
                    <div>
                        <label htmlFor="credits-input" className="block text-sm font-medium mb-1">New Credit Amount</label>
                        <input
                            id="credits-input"
                            type="number" 
                            value={newCredits}
                            onChange={(e) => setNewCredits(parseInt(e.target.value, 10) || 0)}
                            className="w-full px-3 py-2 rounded-lg bg-light dark:bg-dark border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter 999999 for unlimited credits.</p>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-lg text-sm font-medium bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                        <button onClick={handleSaveCredits} className="px-4 py-2 rounded-lg text-sm font-medium bg-accent-dark text-accent dark:bg-accent dark:text-accent-dark hover:opacity-90 transition-opacity">Save Changes</button>
                    </div>
                </div>
            </Modal>

            <h2 className="text-2xl font-bold font-heading mb-4">Manage Users</h2>
            <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-sm px-4 py-2 rounded-lg bg-light dark:bg-dark/80 border border-light-border dark:border-dark-border mb-6 focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
            />
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="border-b border-light-border dark:border-dark-border">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Credits</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Role</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b border-light-border dark:border-dark-border">
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                                    {user.credits >= 99999 ? 'Unlimited' : user.credits}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.isAdmin ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Admin</span> : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">User</span>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEditClick(user)} className="font-semibold text-light-text dark:text-dark-text hover:underline">Edit Credits</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsersPage;