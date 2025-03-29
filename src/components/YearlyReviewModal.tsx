import React from 'react';
import { Award, TrendingUp, TrendingDown, X } from 'lucide-react';
import { YearlyReview } from '../data/events';

interface YearlyReviewModalProps {
  review: YearlyReview;
  onClose: () => void;
}

const YearlyReviewModal: React.FC<YearlyReviewModalProps> = ({ review, onClose }) => {
  const ratingColors = {
    excellent: 'text-emerald-400',
    good: 'text-cyan-400',
    fair: 'text-amber-400',
    poor: 'text-rose-400'
  };

  const fundingChange = Math.abs(review.fundingChange * 100);
  const fundingDirection = review.fundingChange >= 0 ? 'increase' : 'decrease';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-lg border border-slate-800 shadow-xl p-6 w-[600px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Award className={`${ratingColors[review.rating]} filter drop-shadow-glow`} size={24} />
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-300">Yearly Performance Review</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className={`text-xl font-bold mb-2 capitalize ${ratingColors[review.rating]} drop-shadow-sm`}>
              {review.rating} Performance
            </h3>
            <p className="text-lg text-slate-300">{review.description}</p>
          </div>

          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              {review.fundingChange >= 0 ? (
                <TrendingUp className="text-emerald-400 filter drop-shadow-glow" size={20} />
              ) : (
                <TrendingDown className="text-rose-400 filter drop-shadow-glow" size={20} />
              )}
              <h4 className="font-semibold text-slate-200">Budget Adjustment</h4>
            </div>
            <p className={`text-lg ${review.fundingChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {fundingChange}% funding {fundingDirection}
            </p>
          </div>

          {review.bonuses.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-slate-200">Additional Bonuses</h4>
              <div className="space-y-2">
                {review.bonuses.map((bonus, index) => (
                  <div key={index} className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 p-3 rounded-lg border border-slate-700/50">
                    <p className="text-cyan-400">{bonus.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-slate-100 font-bold py-2 px-4 rounded border-none transition-all duration-200 shadow-lg hover:shadow-emerald-900/20"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default YearlyReviewModal;