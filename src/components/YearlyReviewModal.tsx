import React from 'react';
import { Award, TrendingUp, TrendingDown, X } from 'lucide-react';
import { YearlyReview } from '../data/events';

interface YearlyReviewModalProps {
  review: YearlyReview;
  onClose: () => void;
}

const YearlyReviewModal: React.FC<YearlyReviewModalProps> = ({ review, onClose }) => {
  const ratingColors = {
    excellent: 'text-green-400',
    good: 'text-blue-400',
    fair: 'text-yellow-400',
    poor: 'text-red-400'
  };

  const fundingChange = Math.abs(review.fundingChange * 100);
  const fundingDirection = review.fundingChange >= 0 ? 'increase' : 'decrease';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-[600px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Award className={ratingColors[review.rating]} size={24} />
            <h2 className="text-2xl font-bold">Yearly Performance Review</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className={`text-xl font-bold mb-2 capitalize ${ratingColors[review.rating]}`}>
              {review.rating} Performance
            </h3>
            <p className="text-lg">{review.description}</p>
          </div>

          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {review.fundingChange >= 0 ? (
                <TrendingUp className="text-green-400" size={20} />
              ) : (
                <TrendingDown className="text-red-400" size={20} />
              )}
              <h4 className="font-semibold">Budget Adjustment</h4>
            </div>
            <p className={`text-lg ${review.fundingChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {fundingChange}% funding {fundingDirection}
            </p>
          </div>

          {review.bonuses.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Additional Bonuses</h4>
              <div className="space-y-2">
                {review.bonuses.map((bonus, index) => (
                  <div key={index} className="bg-blue-900/30 p-3 rounded-lg">
                    <p className="text-blue-400">{bonus.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default YearlyReviewModal;