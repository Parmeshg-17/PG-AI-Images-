import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CreditPlan } from '../types';

const CREDIT_PLANS: CreditPlan[] = [
    { name: '50 Credits', credits: 50, price: 99 },
    { name: '100 Credits', credits: 100, price: 199 },
    { name: '200 Credits', credits: 200, price: 249 },
    { name: 'Unlimited Credits', credits: 'Unlimited', price: 499 },
];

const TrustBadge = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
        {icon}
        <span className="ml-2">{text}</span>
    </div>
);

const CreditsPage = () => {
    const { submitPaymentRequest } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<CreditPlan>(CREDIT_PLANS[0]);
    const [utrCode, setUtrCode] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handlePlanChange = (planName: string) => {
        const plan = CREDIT_PLANS.find(p => p.name === planName);
        if (plan) setSelectedPlan(plan);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!utrCode.trim() || !date) {
            alert('Please fill out all required fields.');
            return;
        }
        submitPaymentRequest({
            plan: selectedPlan.name,
            amount: selectedPlan.price,
            utrCode,
            date,
            note
        });
        setSubmitted(true);
    };
    
    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto text-center bg-light-secondary dark:bg-dark-secondary p-8 md:p-12 rounded-xl shadow-xl border border-light-border dark:border-dark-border animate-fade-in">
                 <h1 className="text-3xl font-bold font-heading mb-4">Request Submitted!</h1>
                 <p className="text-gray-500 dark:text-gray-400 font-sans">Your payment request has been sent for verification. Credits will be added to your account upon admin approval. This may take some time.</p>
                 <button onClick={() => setSubmitted(false)} className="mt-8 bg-accent-dark text-accent dark:bg-accent dark:text-accent-dark px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    Make Another Purchase
                 </button>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-heading">Purchase Credits</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 font-sans">
                    Follow the steps below to add credits to your account via UPI.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start font-sans">
                <div className="bg-light-secondary dark:bg-dark-secondary p-6 md:p-8 rounded-xl shadow-lg border border-light-border dark:border-dark-border">
                    <h3 className="font-bold text-xl font-heading mb-4 border-b border-light-border dark:border-dark-border pb-3">Payment Instructions</h3>
                    <ol className="list-decimal list-inside space-y-4 text-gray-600 dark:text-gray-300">
                        <li><strong>Select Plan:</strong> Choose your desired credit plan on the right.</li>
                        <li><strong>Scan & Pay:</strong> Use any UPI app to scan the QR code and pay the exact amount.</li>
                        <li><strong>Get UTR ID:</strong> After payment, copy the 12-digit UTR / Transaction ID from your app.</li>
                        <li><strong>Submit Details:</strong> Fill out the form on the right with your payment details and submit for verification.</li>
                    </ol>
                    <div className="mt-8 p-6 bg-light dark:bg-dark rounded-lg text-center border border-light-border dark:border-dark-border">
                        <img src="https://placehold.co/250x250/000000/FFFFFF?text=Scan+UPI+QR" alt="UPI QR Code" className="mx-auto rounded-lg shadow-md" />
                        <p className="font-mono mt-4 text-sm tracking-wider">parmeshgaud9594@oksbi</p>
                    </div>
                     <div className="mt-6 space-y-3">
                        <TrustBadge icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>} text="Privacy Pledge: We don't store payment data." />
                        <TrustBadge icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>} text="Manual Verification for Security" />
                    </div>
                </div>
                <div className="bg-light-secondary dark:bg-dark-secondary p-6 md:p-8 rounded-xl shadow-lg border border-light-border dark:border-dark-border">
                     <h3 className="font-bold text-xl font-heading mb-4 border-b border-light-border dark:border-dark-border pb-3">Submit Payment Details</h3>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                             <label htmlFor="plan" className="block text-sm font-medium mb-1">1. Select Plan</label>
                             <select id="plan" value={selectedPlan.name} onChange={e => handlePlanChange(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-light dark:bg-dark border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white">
                                 {CREDIT_PLANS.map(plan => <option key={plan.name} value={plan.name}>{plan.name} - ₹{plan.price}</option>)}
                             </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Amount to Pay</label>
                            <input type="text" value={`₹ ${selectedPlan.price}`} readOnly className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-dark/60 border border-light-border dark:border-dark-border cursor-not-allowed"/>
                        </div>
                         <div>
                            <label htmlFor="utrCode" className="block text-sm font-medium mb-1">2. UTR / Transaction ID</label>
                            <input type="text" id="utrCode" value={utrCode} onChange={e => setUtrCode(e.target.value)} required placeholder="Enter your 12-digit UTR code" className="w-full px-4 py-3 rounded-lg bg-light dark:bg-dark border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"/>
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium mb-1">3. Date of Payment</label>
                            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-light dark:bg-dark border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"/>
                        </div>
                         <div>
                            <label htmlFor="note" className="block text-sm font-medium mb-1">Note (Optional)</label>
                            <textarea id="note" value={note} onChange={e => setNote(e.target.value)} placeholder="Anything else we should know?" rows={2} className="w-full px-4 py-3 rounded-lg bg-light dark:bg-dark border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"></textarea>
                        </div>
                        <button type="submit" disabled={!utrCode.trim()} className="w-full bg-accent-dark text-accent dark:bg-accent dark:text-accent-dark py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 transform hover:scale-105">
                            Submit for Verification
                        </button>
                     </form>
                </div>
            </div>
        </div>
    )
}

export default CreditsPage;