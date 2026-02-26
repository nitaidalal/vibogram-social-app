import React from 'react'
import { IoChevronForward } from 'react-icons/io5'

const SettingsItem = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  onClick, 
  danger = false, 
  showArrow = true 
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-4 transition-all duration-200 border-b border-border hover:bg-surface-hover ${
        danger ? 'text-danger' : 'text-text-primary'
      }`}
    >
      <Icon className={`text-2xl shrink-0 ${
        danger ? 'text-danger' : 'text-text-secondary'
      }`} />
      <div className="flex-1 text-left">
        <p className={`font-medium ${
          danger ? 'text-danger' : 'text-text-primary'
        }`}>
          {title}
        </p>
        {subtitle && (
          <p className="text-text-secondary text-sm mt-0.5">{subtitle}</p>
        )}
      </div>
      {showArrow && <IoChevronForward className="text-text-muted text-lg shrink-0" />}
    </button>
  )
}

export default SettingsItem
