"use client"
import React, { useState } from 'react';
import { Search, Filter, Users, Building, MessageSquare, Calendar, Star, TrendingUp, Eye, MoreHorizontal } from 'lucide-react';

interface PlacementFeedback {
    id: string;
    studentName: string;
    studentId: string;
    department: string;
    placementCommunication: string;
    trainingRelevance: string;
    mockInterviewsHelpful: string;
    coordinationRating: string;
    suggestions: string;
    wishlistCompanies: string;
    createdAt: string;
}

interface InterviewFeedback {
    id: string;
    studentName: string;
    studentId: string;
    companyName: string;
    aptitudeTestRating: string;
    interviewerProfessionalism: string;
    questionRelevance: string;
    briefingHelpfulness: string;
    confidenceRating: string;
    aptitudeExperience: string;
    interviewQuestionTypes: string;
    toughestPart: string;
    aptitudeImprovementSuggestions: string;
    assessmentAccuracy: string;
    createdAt: string;
}

interface CompanyFeedback {
    id: string;
    studentName: string;
    companyName: string;
    technicalSkills: string;
    problemSolving: string;
    communicationSkills: string;
    overallSatisfaction: string;
    taskUnderstanding: string;
    adaptability: string;
    additionalComments?: string;
    createdAt: string;
}

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('placement');
    const [searchTerm, setSearchTerm] = useState('');

    // Sample data - replace with your actual data fetching
    const placementData = [
        {
            id: '1',
            studentName: 'John Doe',
            studentId: 'CS2021001',
            department: 'Computer Science',
            placementCommunication: 'Excellent',
            trainingRelevance: 'Good',
            mockInterviewsHelpful: 'Very Helpful',
            coordinationRating: '4.5',
            suggestions: 'More mock interviews needed',
            wishlistCompanies: 'Google, Microsoft, Amazon',
            createdAt: '2024-01-15T10:00:00Z'
        },
        {
            id: '2',
            studentName: 'Jane Smith',
            studentId: 'CS2021002',
            department: 'Computer Science',
            placementCommunication: 'Good',
            trainingRelevance: 'Excellent',
            mockInterviewsHelpful: 'Helpful',
            coordinationRating: '4.2',
            suggestions: 'More technical preparation',
            wishlistCompanies: 'Apple, Netflix, Spotify',
            createdAt: '2024-01-14T14:30:00Z'
        }
    ];

    const interviewData = [
        {
            id: '1',
            studentName: 'Alice Johnson',
            studentId: 'CS2021003',
            companyName: 'TechCorp',
            aptitudeTestRating: 'Good',
            interviewerProfessionalism: 'Excellent',
            questionRelevance: 'Very Relevant',
            briefingHelpfulness: 'Helpful',
            confidenceRating: '4.0',
            aptitudeExperience: 'Challenging but fair',
            interviewQuestionTypes: 'Technical, Behavioral',
            toughestPart: 'System design questions',
            aptitudeImprovementSuggestions: 'More practice with algorithms',
            assessmentAccuracy: 'Accurate',
            createdAt: '2024-01-16T09:15:00Z'
        }
    ];

    const companyData = [
        {
            id: '1',
            studentName: 'Bob Wilson',
            companyName: 'InnovateLabs',
            technicalSkills: 'Excellent',
            problemSolving: 'Good',
            communicationSkills: 'Very Good',
            overallSatisfaction: '4.3',
            taskUnderstanding: 'Clear',
            adaptability: 'High',
            additionalComments: 'Great learning experience',
            createdAt: '2024-01-17T16:45:00Z'
        }
    ];

    const getRatingColor = (rating: string) => {
        const numRating = parseFloat(rating);
        if (numRating >= 4.5) return 'text-green-400';
        if (numRating >= 4.0) return 'text-blue-400';
        if (numRating >= 3.5) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getQualityColor = (quality: string) => {
        const lower = quality.toLowerCase();
        if (lower.includes('excellent')) return 'text-green-400';
        if (lower.includes('good') || lower.includes('helpful')) return 'text-blue-400';
        if (lower.includes('average') || lower.includes('okay')) return 'text-yellow-400';
        return 'text-gray-400';
    };

    const formatDate = (dateString: string | number | Date) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const PlacementCard = ({ data }: { data: PlacementFeedback }) => (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-white">{data.studentName}</h3>
                    <p className="text-gray-400">{data.studentId} • {data.department}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`text-2xl font-bold ${getRatingColor(data.coordinationRating)}`}>
                        {data.coordinationRating}
                    </span>
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Communication:</span>
                        <span className={`font-medium ${getQualityColor(data.placementCommunication)}`}>
                            {data.placementCommunication}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Training:</span>
                        <span className={`font-medium ${getQualityColor(data.trainingRelevance)}`}>
                            {data.trainingRelevance}
                        </span>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Mock Interviews:</span>
                        <span className={`font-medium ${getQualityColor(data.mockInterviewsHelpful)}`}>
                            {data.mockInterviewsHelpful}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <p className="text-gray-400 text-sm mb-1">Suggestions:</p>
                    <p className="text-gray-300 text-sm">{data.suggestions}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-sm mb-1">Wishlist Companies:</p>
                    <div className="flex flex-wrap gap-2">
                        {data.wishlistCompanies.split(', ').map((company, index) => (
                            <span key={index} className="bg-blue-900 text-blue-200 px-2 py-1 rounded-full text-xs">
                                {company}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                <span className="text-gray-400 text-sm flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(data.createdAt)}
                </span>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    const InterviewCard = ({ data }: { data: InterviewFeedback }) => (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-white">{data.studentName}</h3>
                    <p className="text-gray-400">{data.studentId}</p>
                    <p className="text-blue-400 font-medium">{data.companyName}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`text-2xl font-bold ${getRatingColor(data.confidenceRating)}`}>
                        {data.confidenceRating}
                    </span>
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Aptitude Test:</span>
                        <span className={`font-medium ${getQualityColor(data.aptitudeTestRating)}`}>
                            {data.aptitudeTestRating}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Professionalism:</span>
                        <span className={`font-medium ${getQualityColor(data.interviewerProfessionalism)}`}>
                            {data.interviewerProfessionalism}
                        </span>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Question Relevance:</span>
                        <span className={`font-medium ${getQualityColor(data.questionRelevance)}`}>
                            {data.questionRelevance}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Briefing:</span>
                        <span className={`font-medium ${getQualityColor(data.briefingHelpfulness)}`}>
                            {data.briefingHelpfulness}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <p className="text-gray-400 text-sm mb-1">Question Types:</p>
                    <p className="text-gray-300 text-sm">{data.interviewQuestionTypes}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-sm mb-1">Toughest Part:</p>
                    <p className="text-gray-300 text-sm">{data.toughestPart}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-sm mb-1">Improvement Suggestions:</p>
                    <p className="text-gray-300 text-sm">{data.aptitudeImprovementSuggestions}</p>
                </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                <span className="text-gray-400 text-sm flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(data.createdAt)}
                </span>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    const CompanyCard = ({ data }: { data: CompanyFeedback }) => (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-white">{data.studentName}</h3>
                    <p className="text-blue-400 font-medium">{data.companyName}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`text-2xl font-bold ${getRatingColor(data.overallSatisfaction)}`}>
                        {data.overallSatisfaction}
                    </span>
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Technical Skills:</span>
                        <span className={`font-medium ${getQualityColor(data.technicalSkills)}`}>
                            {data.technicalSkills}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Problem Solving:</span>
                        <span className={`font-medium ${getQualityColor(data.problemSolving)}`}>
                            {data.problemSolving}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Communication:</span>
                        <span className={`font-medium ${getQualityColor(data.communicationSkills)}`}>
                            {data.communicationSkills}
                        </span>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Task Understanding:</span>
                        <span className={`font-medium ${getQualityColor(data.taskUnderstanding)}`}>
                            {data.taskUnderstanding}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Adaptability:</span>
                        <span className={`font-medium ${getQualityColor(data.adaptability)}`}>
                            {data.adaptability}
                        </span>
                    </div>
                </div>
            </div>

            {data.additionalComments && (
                <div className="space-y-3">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Additional Comments:</p>
                        <p className="text-gray-300 text-sm">{data.additionalComments}</p>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                <span className="text-gray-400 text-sm flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(data.createdAt)}
                </span>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    const getStats = () => {
        return {
            placement: {
                total: placementData.length,
                avgRating: (placementData.reduce((sum, item) => sum + parseFloat(item.coordinationRating), 0) / placementData.length).toFixed(1)
            },
            interview: {
                total: interviewData.length,
                avgRating: (interviewData.reduce((sum, item) => sum + parseFloat(item.confidenceRating), 0) / interviewData.length).toFixed(1)
            },
            company: {
                total: companyData.length,
                avgRating: (companyData.reduce((sum, item) => sum + parseFloat(item.overallSatisfaction), 0) / companyData.length).toFixed(1)
            }
        };
    };

    const stats = getStats();

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Placement Dashboard</h1>
                        <p className="text-gray-400">Track and analyze placement feedback</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search feedback..."
                                className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Placement Feedback</p>
                                <p className="text-2xl font-bold text-white">{stats.placement.total}</p>
                                <p className="text-green-400 text-sm">Avg: {stats.placement.avgRating}/5</p>
                            </div>
                            <div className="bg-blue-900 p-3 rounded-full">
                                <Users className="w-8 h-8 text-blue-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Interview Feedback</p>
                                <p className="text-2xl font-bold text-white">{stats.interview.total}</p>
                                <p className="text-green-400 text-sm">Avg: {stats.interview.avgRating}/5</p>
                            </div>
                            <div className="bg-green-900 p-3 rounded-full">
                                <MessageSquare className="w-8 h-8 text-green-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Company Feedback</p>
                                <p className="text-2xl font-bold text-white">{stats.company.total}</p>
                                <p className="text-green-400 text-sm">Avg: {stats.company.avgRating}/5</p>
                            </div>
                            <div className="bg-purple-900 p-3 rounded-full">
                                <Building className="w-8 h-8 text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('placement')}
                        className={`flex-1 py-2 px-4 rounded-md transition-colors ${activeTab === 'placement'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Placement Feedback
                    </button>
                    <button
                        onClick={() => setActiveTab('interview')}
                        className={`flex-1 py-2 px-4 rounded-md transition-colors ${activeTab === 'interview'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Interview Feedback
                    </button>
                    <button
                        onClick={() => setActiveTab('company')}
                        className={`flex-1 py-2 px-4 rounded-md transition-colors ${activeTab === 'company'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Company Feedback
                    </button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {activeTab === 'placement' && placementData.map((item) => (
                        <PlacementCard key={item.id} data={item} />
                    ))}
                    {activeTab === 'interview' && interviewData.map((item) => (
                        <InterviewCard key={item.id} data={item} />
                    ))}
                    {activeTab === 'company' && companyData.map((item) => (
                        <CompanyCard key={item.id} data={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;