import React from 'react'

const SettingsSection = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h2 className="text-text-muted text-xs font-semibold px-2 mb-2 uppercase tracking-wider">
        {title}
      </h2>
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {children}
      </div>
    </div>
  )
}

export default SettingsSection
