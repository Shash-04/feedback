'use client';

import { motion } from 'framer-motion';

export default function TextualSummary({ data }: { data: any }) {
    if (!data) return null;

    const getOverallRating = () => {
        if (data.ratings?.overall) return data.ratings.overall.toFixed(1);
        if (data.ratings?.averages?.length) {
            const avg = data.ratings.averages.reduce((a: number, b: number) => a + b, 0) / data.ratings.averages.length;
            return avg.toFixed(1);
        }
        return null;
    };

    const getSentiment = () => {
        if (!data.sentiment) return null;
        const { positive = 0, neutral = 0, negative = 0 } = data.sentiment;
        const total = positive + neutral + negative;
        if (total === 0) return null;
        const dominant = positive > negative ? 'positive' : 'negative';
        const percentage = Math.round((Math.max(positive, negative) / total) * 100);
        return { dominant, percentage };
    };

    const getTopWord = (type: 'positive' | 'negative') => {
        if (data.wordCloud?.[type]?.[0]?.text) {
            return `"${data.wordCloud[type][0].text}"`;
        }
        return null;
    };

    const overallRating = getOverallRating();
    const sentiment = getSentiment();
    const topPositiveWord = getTopWord('positive');
    const topNegativeWord = getTopWord('negative');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-900/50 p-4 sm:p-5 md:p-6 rounded-xl border border-gray-800 backdrop-blur-sm mb-6 md:mb-8 text-white w-full"
        >
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-blue-400">
                Key Insights Summary
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed sm:leading-loose">
                <p>
                    {overallRating ? (
                        <>
                            The feedback analysis reveals an overall rating of{' '}
                            <span className="font-semibold text-blue-300">{overallRating}/5</span>
                            {sentiment ? (
                                <>
                                    , with sentiment leaning{' '}
                                    <span className="font-semibold text-green-300">
                                        {sentiment.dominant}
                                    </span>{' '}
                                    ({sentiment.percentage}%).
                                </>
                            ) : (
                                '.'
                            )}
                        </>
                    ) : (
                        'The feedback analysis provides valuable insights.'
                    )}
                </p>

                <p>
                    {data.strengths?.[0] ? (
                        <>
                            Users particularly appreciate{' '}
                            <span className="font-semibold text-green-300">
                                {data.strengths[0].toLowerCase()}
                            </span>
                        </>
                    ) : (
                        'Feedback highlights several positive aspects'
                    )}
                    {data.weaknesses?.[0] ? (
                        <>
                            , while suggesting improvements in{' '}
                            <span className="font-semibold text-yellow-300">
                                {data.weaknesses[0].toLowerCase()}
                            </span>
                        </>
                    ) : (
                        ' and provides suggestions for enhancement'
                    )}
                    .
                </p>

                {(topPositiveWord || topNegativeWord) && (
                    <p>
                        {topPositiveWord && (
                            <>
                                The most frequently mentioned positive aspect was{' '}
                                <span className="font-semibold text-green-300">{topPositiveWord}</span>
                            </>
                        )}
                        {topPositiveWord && topNegativeWord ? ', while ' : ''}
                        {topNegativeWord && (
                            <>
                                the most common concern was{' '}
                                <span className="font-semibold text-red-300">{topNegativeWord}</span>
                            </>
                        )}
                        .
                    </p>
                )}

                <p>
                    Based on the feedback,{` `}
                    {data.recommendations?.[0] ? (
                        <>
                            the top recommendation is to{' '}
                            <span className="font-semibold text-purple-300">
                                {data.recommendations[0].toLowerCase()}
                            </span>
                        </>
                    ) : (
                        'several valuable suggestions have been made'
                    )}
                    {' '}for future improvements.
                </p>
            </div>
        </motion.div>
    );
}
