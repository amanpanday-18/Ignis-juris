import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import RecentDownloads from '../components/dashboard/RecentDownloads';
import ScheduleWidget from '../components/dashboard/ScheduleWidget';
import QuickActions from '../components/dashboard/QuickActions';
import UsageStats from '../components/dashboard/UsageStats';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
    return (
        <div className="flex h-screen bg-slate-900 overflow-hidden">
            <Helmet>
                <title>Dashboard - IGNIS JURIS</title>
            </Helmet>

            {/* Sidebar (Fixed Width) */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <DashboardHeader />

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-900 custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* Page Title */}
                        <div className="mb-2">
                            <h2 className="text-2xl font-bold text-white">Overview</h2>
                            <p className="text-slate-400">Welcome back to your workspace</p>
                        </div>

                        {/* Top Row: Recent Cases & Hearings */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <RecentDownloads />
                            <ScheduleWidget />
                        </div>

                        {/* Middle Row: Quick Actions & Chart */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <QuickActions />
                            </div>
                            <div>
                                <UsageStats />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};


export default Dashboard;
