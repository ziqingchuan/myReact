import '../../styles/ToggleSwitch.css'
import { ToggleSwitchProps } from '../../types'

export default function ToggleSwitch({ checked, onChange, label, description, isDark = true }: ToggleSwitchProps) {
  return (
    <div className={`toggle-switch ${isDark ? 'dark' : ''}`}>
      <div className="toggle-switch-label">
        <label className="toggle-switch-label-text">
          {label}
        </label>
        {description && (
          <p className="toggle-switch-description">
            {description}
          </p>
        )}
      </div>
      
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`toggle-switch-btn ${checked ? 'checked' : ''}`}
      >
        <span className="toggle-switch-indicator" />
      </button>
    </div>
  )
}
