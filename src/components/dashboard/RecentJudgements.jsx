import React from 'react';
import { Scale, ArrowRight } from 'lucide-react';

const RecentJudgements = () => {
    // Mock data for display purposes
    const recentCases = [
        { id: 1, title: 'Smith v. Jones', type: 'Contract Dispute', date: '08/29/2023', status: 'Ruling for Plaintiff' },
        { id: 2, title: 'State v. Sharma', type: 'Criminal Appeal', date: '08/28/2023', status: 'Hearing Scheduled' },
        { id: 3, title: 'TechCorp v. Devs', type: 'IP Infringement', date: '08/28/2023', status: 'Settlement Reached' },
        { id: 4, title: 'Estate of Roy', type: 'Probate', date: '09/01/2023', status: 'Ruling for Defendant' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#1a365d]">Recent Judgements</h3>
                <button className="text-sm text-[#c5a572] font-semibold hover:underline flex items-center">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                </button>
            </div>

            <div className="space-y-3">
                {recentCases.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors border-l-4 border-[#c5a572] bg-white shadow-sm">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-gray-800">{item.title}</h4>
                            <span className="text-xs font-mono text-gray-500">{item.date}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                                {item.type}
                            </span>
                            <span className="text-xs text-gray-600 italic">
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentJudgements;
