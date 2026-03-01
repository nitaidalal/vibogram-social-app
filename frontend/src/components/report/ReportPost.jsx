import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { MdReportProblem } from 'react-icons/md'
import axios from 'axios'
import toast from 'react-hot-toast'

const REASONS = [
  "Spam",
  "Nudity or Sexual Content",
  "Harassment or Bullying",
  "Violence or Dangerous Content",
  "Misinformation",
  "Hate Speech",
  "Other",
]

const ReportPost = ({ postId, onClose }) => {
  const [form, setForm] = useState({ reason: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.reason) {
      toast.error('Please select a reason')
      return
    }
    setLoading(true)
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/posts/report/${postId}`,
        { reason: form.reason, description: form.description },
        { withCredentials: true }
      )
      setSubmitted(true)
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to report post'
      onClose()
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 backdrop-blur-md bg-black/60 z-9999 flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && onClose()} 
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-surface rounded-2xl w-full max-w-md mx-4 border-2 border-border shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()} //double layer of protection against click propagation
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-red-500/15 to-orange-500/10">
              <div className="flex items-center gap-2">
                <MdReportProblem className="text-red-500 text-xl" />
                <h3 className="text-lg font-bold text-text-primary">
                  Report Post
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary text-2xl transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            {submitted ? (
              /* Success state */
              <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
                  <span className="text-3xl">✓</span>
                </div>
                <p className="text-text-primary font-semibold text-lg">
                  Report Submitted
                </p>
                <p className="text-text-secondary text-sm">
                  Thanks for letting us know. We'll review this post and take
                  action if it violates our community guidelines.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-6 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Form */
              <form
                onSubmit={handleSubmit}
                className="px-6 py-5 flex flex-col gap-5"
              >
                {/* Reason selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-primary">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col gap-1.5">
                    {REASONS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, reason: r }))}
                        className={`text-left px-4 py-2.5 rounded-xl cursor-pointer text-sm font-medium border transition-all duration-150 ${
                          form.reason === r
                            ? "bg-red-500/15 border-red-500 text-red-500"
                            : "bg-surface-hover border-border text-text-secondary hover:border-red-400 hover:text-text-primary"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional description */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-primary">
                    Additional details{" "}
                    <span className="text-text-muted font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    placeholder="Describe the issue..."
                    rows={3}
                    className="bg-surface-hover text-text-primary text-sm px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-red-500 resize-none placeholder:text-text-muted transition-all"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="cursor-pointer flex-1 py-2.5 rounded-full border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!form.reason || loading}
                    className="cursor-pointer flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all"
                  >
                    {loading ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
    , document.body
  )
}

export default ReportPost
