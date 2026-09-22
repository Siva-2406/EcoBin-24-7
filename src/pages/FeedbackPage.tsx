import React, { useState, useEffect } from 'react';
import { submitFeedback, fetchFeedback } from '../services/api';
import { FeedbackSubmission } from '../types';
import { Star, MessageSquare, Send, CheckCircle2, Heart, Sparkles } from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [suggestions, setSuggestions] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recentList, setRecentList] = useState<FeedbackSubmission[]>([]);

  useEffect(() => {
    fetchFeedback()
      .then((res) => {
        if (res && res.feedback) setRecentList(res.feedback);
      })
      .catch((e) => console.warn(e));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await submitFeedback({
        name,
        email,
        rating,
        feedback,
        suggestions,
      });

      setSubmitted(true);
      if (res.feedback) {
        setRecentList((prev) => [res.feedback, ...prev]);
      }
      setName('');
      setEmail('');
      setFeedback('');
      setSuggestions('');
      setRating(5);
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="feedback-page" className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-3 border border-emerald-200">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>User &amp; Citizen Feedback</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Help Improve EcoBin 24×7
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto font-medium">
          Have ideas, bug reports, or feature recommendations for our smart waste monitoring IoT project? Share your thoughts below.
        </p>
      </div>

      {/* Confirmation State */}
      {submitted && (
        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center animate-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-600/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-emerald-900">
            Thank you for helping improve EcoBin 24×7!
          </h3>
          <p className="text-xs text-emerald-700 mt-1 max-w-md mx-auto">
            Your feedback has been logged to the project database and will be reviewed by the engineering team.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 px-4 py-2 text-xs font-bold text-emerald-800 bg-white border border-emerald-300 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            Submit Another Response
          </button>
        </div>
      )}

      {/* Feedback Form */}
      {!submitted && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Senthil Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@kiot.ac.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Overall System Rating *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-300 hover:text-amber-400 focus:outline-hidden transition-colors"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-bold text-slate-600">
                  {rating === 5
                    ? '5 / 5 - Outstanding'
                    : rating === 4
                    ? '4 / 5 - Very Good'
                    : rating === 3
                    ? '3 / 5 - Average'
                    : rating === 2
                    ? '2 / 5 - Needs Improvement'
                    : '1 / 5 - Poor'}
                </span>
              </div>
            </div>

            {/* Feedback Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Feedback Message *
              </label>
              <textarea
                required
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What do you think of the real-time bin monitoring and visual interface?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden leading-relaxed"
              />
            </div>

            {/* Suggestions for improvement */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Suggestions for Improvement (Optional)
              </label>
              <textarea
                rows={2}
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="Any hardware ideas, sensor additions, or route optimization thoughts?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting Feedback...' : 'Submit Feedback'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Recent Feedback Reviews */}
      {recentList.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <h3 className="text-base font-extrabold text-slate-900 mb-4">
            Recent Community Submissions
          </h3>
          <div className="space-y-3">
            {recentList.slice(0, 4).map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{f.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({f.email})</span>
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= f.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-1">{f.feedback}</p>
                {f.suggestions && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1 bg-emerald-50 p-2 rounded border border-emerald-100">
                    Suggestion: {f.suggestions}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
