/**
 * Toast Notification System
 * Replaces alert() calls with beautiful toast notifications
 */

class NotificationManager {
  constructor(containerId = 'toastContainer') {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      // Create container if it doesn't exist
      this.container = document.createElement('div');
      this.container.id = containerId;
      this.container.className = 'toast-container';
      this.container.setAttribute('aria-live', 'polite');
      this.container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(this.container);
    }
  }

  show(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = this.getIcon(type);
    
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <p class="toast-message">${this.escapeHtml(message)}</p>
      </div>
      <button class="toast-close" type="button" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    this.container.appendChild(toast);

    // Close button handler
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.remove(toast);
    });

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast);
      }, duration);
    }

    return toast;
  }

  remove(toast) {
    toast.classList.add('hiding');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  getIcon(type) {
    const icons = {
      success: `<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>`,
      error: `<svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>`,
      warning: `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>`,
      info: `<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>`,
    };
    return icons[type] || icons.info;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  success(message, duration = 5000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 5000) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration = 5000) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration = 5000) {
    return this.show(message, 'info', duration);
  }
}

// Helper function to get or create notification manager
function getNotificationManager() {
  const adminContainer = document.getElementById('adminToastContainer');
  const clientContainer = document.getElementById('clientToastContainer');
  
  if (adminContainer) {
    if (!window.adminNotifications) {
      window.adminNotifications = new NotificationManager('adminToastContainer');
    }
    return window.adminNotifications;
  } else if (clientContainer) {
    if (!window.clientNotifications) {
      window.clientNotifications = new NotificationManager('clientToastContainer');
    }
    return window.clientNotifications;
  }
  
  // Fallback: create a default container
  if (!window.defaultNotifications) {
    window.defaultNotifications = new NotificationManager('toastContainer');
  }
  return window.defaultNotifications;
}

// Helper functions for easy access
window.showSuccess = (message, duration) => {
  const manager = getNotificationManager();
  return manager.success(message, duration);
};

window.showError = (message, duration) => {
  const manager = getNotificationManager();
  return manager.error(message, duration);
};

window.showWarning = (message, duration) => {
  const manager = getNotificationManager();
  return manager.warning(message, duration);
};

window.showInfo = (message, duration) => {
  const manager = getNotificationManager();
  return manager.info(message, duration);
};
