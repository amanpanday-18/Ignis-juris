import React from 'react';
import { TrendingUp, Activity } from 'lucide-react';

const PerformanceChart = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#1a365d]">Key Performance Indicators</h3>
                <div className="flex items-center space-x-2">
                    <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                        <TrendingUp className="h-3 w-3 mr-1" /> +12%
                    </span>
                </div>
            </div>

            {/* Mock Chart Visualization */}
            <div className="h-48 relative flex items-end justify-between px-2 pt-8">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 top-8 flex flex-col justify-between pointer-events-none">
                    <div className="w-full h-px bg-gray-100"></div>
                    <div className="w-full h-px bg-gray-100"></div>
                    <div className="w-full h-px bg-gray-100"></div>
                    <div className="w-full h-px bg-gray-100"></div>
                </div>

                {/* Data Points (Fake Graph) */}
                <svg className="absolute inset-0 top-8 h-full w-full" preserveAspectRatio="none">
                    <polyline
                        fill="none"
                        stroke="#1a365d"
                        strokeWidth="3"
                        points="0,150 50,120 100,130 150,80 200,90 250,40 300,60 350,20"
                        className="drop-shadow-sm"
                    />
                    <polyline
                        fill="none"
                        stroke="#c5a572"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        points="0,180 50,160 100,140 150,130 200,110 250,100 300,80 350,70"
                    />
                </svg>

                {/* Tooltip Mock */}
                <div className="absolute top-[10%] left-[70%] bg-[#1a365d] text-white text-xs py-1 px-2 rounded transform -translate-x-1/2">
                    75.2%
                    <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#1a365d] rotate-45"></div>
                </div>
            </div>

            <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
            </div>
        </div>
    );
};

export default PerformanceChart;
