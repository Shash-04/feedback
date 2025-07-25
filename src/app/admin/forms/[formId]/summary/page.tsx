'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function SummaryPage() {
    const params = useParams();
    const formId = params?.formId as string;

    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getSummary() {
            try {
                const res = await fetch(`/api/forms/${formId}/summary`);
                const data = await res.json();
                setSummary(data.summary);
            } catch (e) {
                setSummary('Failed to load summary.');
            } finally {
                setLoading(false);
            }
        }

        if (formId) getSummary();
    }, [formId]);

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <h1 className="text-3xl font-bold mb-6">📊 Summary Report</h1>
            {loading ? (
                <p className="text-gray-400">Generating summary...</p>
            ) : (
                <pre className="whitespace-pre-wrap bg-gray-800 p-4 rounded-lg border border-gray-700">
                    {summary}
                </pre>
            )}
        </div>
    );
}
