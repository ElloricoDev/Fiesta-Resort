// Notification system for admin header
const notificationBtn = document.getElementById("notificationBtn");
const notificationMenu = document.getElementById("notificationMenu");
const notificationsList = document.getElementById("notificationsList");
const notificationBadge = document.getElementById("notificationBadge");
const markAllReadBtn = document.getElementById("markAllReadBtn");
const viewAllNotificationsBtn = document.getElementById("viewAllNotificationsBtn");

// API base URL
const apiBaseUrl = "/admin/api/notifications";

// Get CSRF token from meta tag
function getCsrfToken() {
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  return metaTag ? metaTag.getAttribute("content") : "";
}

let notifications = [];
let unreadCount = 0;

// Fetch notifications from API
async function fetchNotifications() {
  try {
    const response = await fetch(`${apiBaseUrl}?unread_only=false`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    const result = await response.json();
    notifications = result.data || [];
    unreadCount = result.unread_count || 0;
    
    return { notifications, unreadCount };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { notifications: [], unreadCount: 0 };
  }
}

// Render notifications
function renderNotifications() {
  if (!notificationsList) return;

  if (notifications.length === 0) {
    notificationsList.innerHTML = `
      <div class="notification-empty">
        <p>No notifications</p>
      </div>
    `;
    if (markAllReadBtn) markAllReadBtn.style.display = "none";
    return;
  }

  // Show mark all as read button if there are unread notifications
  if (markAllReadBtn) {
    markAllReadBtn.style.display = unreadCount > 0 ? "block" : "none";
  }

  notificationsList.innerHTML = notifications
    .map((notification) => {
      const timeAgo = getTimeAgo(new Date(notification.created_at));
      const unreadClass = !notification.is_read ? "unread" : "";
      
      return `
        <div class="notification-item ${unreadClass}" data-id="${notification.id}" data-link="${notification.link || ''}">
          <div class="notification-item-actions">
            ${!notification.is_read ? `
              <button class="notification-action-btn mark-read-btn" data-id="${notification.id}" title="Mark as read">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
            ` : ''}
            <button class="notification-action-btn delete-notification-btn" data-id="${notification.id}" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="notification-item-content">
            <div class="notification-title">${escapeHtml(notification.title)}</div>
            <div class="notification-message">${escapeHtml(notification.message)}</div>
            <div class="notification-time">${timeAgo}</div>
          </div>
        </div>
      `;
    })
    .join("");

  // Add click handlers
  document.querySelectorAll(".notification-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      // Don't trigger if clicking action buttons
      if (e.target.closest(".notification-item-actions")) {
        return;
      }
      
      const link = item.getAttribute("data-link");
      const id = item.getAttribute("data-id");
      
      // Mark as read if unread
      const notification = notifications.find((n) => n.id == id);
      if (notification && !notification.is_read) {
        markAsRead(id);
      }
      
      // Navigate to link if available
      if (link) {
        window.location.href = link;
      }
    });
  });

  // Mark as read handlers
  document.querySelectorAll(".mark-read-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-id");
      await markAsRead(id);
    });
  });

  // Delete handlers
  document.querySelectorAll(".delete-notification-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-id");
      await deleteNotification(id);
    });
  });
}

// Update notification badge
function updateBadge() {
  if (notificationBadge) {
    if (unreadCount > 0) {
      notificationBadge.textContent = unreadCount > 99 ? "99+" : unreadCount;
      notificationBadge.style.display = "inline-block";
    } else {
      notificationBadge.style.display = "none";
    }
  }
}

// Mark notification as read
async function markAsRead(id) {
  try {
    const response = await fetch(`${apiBaseUrl}/${id}/read`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }

    // Update local state
    const notification = notifications.find((n) => n.id == id);
    if (notification) {
      notification.is_read = true;
    }

    const result = await response.json();
    unreadCount = result.unread_count || 0;

    renderNotifications();
    updateBadge();
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}

// Mark all as read
async function markAllAsRead() {
  try {
    const response = await fetch(`${apiBaseUrl}/read-all`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to mark all notifications as read");
    }

    // Update local state
    notifications.forEach((n) => {
      n.is_read = true;
    });
    unreadCount = 0;

    renderNotifications();
    updateBadge();
    
    if (window.showSuccess) {
      window.showSuccess("All notifications marked as read");
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    if (window.showError) {
      window.showError("Failed to mark all notifications as read");
    }
  }
}

// Delete notification
async function deleteNotification(id) {
  try {
    const response = await fetch(`${apiBaseUrl}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete notification");
    }

    // Remove from local state
    const notification = notifications.find((n) => n.id == id);
    if (notification && !notification.is_read) {
      unreadCount = Math.max(0, unreadCount - 1);
    }
    
    notifications = notifications.filter((n) => n.id != id);

    const result = await response.json();
    unreadCount = result.unread_count || 0;

    renderNotifications();
    updateBadge();
  } catch (error) {
    console.error("Error deleting notification:", error);
    if (window.showError) {
      window.showError("Failed to delete notification");
    }
  }
}

// Get time ago string
function getTimeAgo(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Load notifications
async function loadNotifications() {
  const result = await fetchNotifications();
  notifications = result.notifications;
  unreadCount = result.unreadCount;
  renderNotifications();
  updateBadge();
}

// Event listeners
if (markAllReadBtn) {
  markAllReadBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await markAllAsRead();
  });
}

if (viewAllNotificationsBtn) {
  viewAllNotificationsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (window.showInfo) {
      window.showInfo("Notifications page will be implemented soon.");
    }
  });
}

// Load notifications when menu is opened
if (notificationBtn && notificationMenu) {
  notificationBtn.addEventListener("click", async (event) => {
    event.stopPropagation();
    if (!notificationMenu.classList.contains("show")) {
      await loadNotifications();
    }
    notificationMenu.classList.toggle("show");
  });
}

// Auto-refresh notifications every 30 seconds
setInterval(() => {
  if (document.visibilityState === "visible") {
    loadNotifications();
  }
}, 30000);

// Initial load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadNotifications);
} else {
  loadNotifications();
}

