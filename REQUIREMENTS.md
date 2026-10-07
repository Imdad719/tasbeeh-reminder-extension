# Requirements — Tasbeeh Reminder

## Functional requirements

### FR-01 — Enable/disable
The user must be able to enable or pause reminders.

### FR-02 — Default interval
The default reminder interval must be **3 minutes**.

### FR-03 — Configurable interval
The user must be able to choose another interval.

### FR-04 — Default display duration
The default reminder display duration must be **10 seconds**.

### FR-05 — Configurable display duration
The user must be able to change the display duration.

### FR-06 — Random message
Each reminder should select a message from the configured message collection.

### FR-07 — Automatic dismissal
The reminder should automatically disappear after the configured duration.

### FR-08 — Manual dismissal
The user should be able to close the reminder immediately.

### FR-09 — Position
The user should be able to choose a default screen corner.

### FR-10 — Dragging
The visible reminder should be draggable to another screen position.

### FR-11 — Persistence
Settings should persist between browser sessions.

### FR-12 — Test reminder
The extension popup should provide a way to display a reminder immediately.

## Non-functional requirements

### NFR-01 — Privacy
No browsing history or personal data should be sent to an external server.

### NFR-02 — Performance
The extension should remain lightweight and avoid unnecessary polling.

### NFR-03 — Security
No remotely hosted JavaScript should be required.

### NFR-04 — Accessibility
Reminder content should use semantic status/live-region behavior and have accessible controls.

### NFR-05 — Maintainability
Source code should be separated into background, content, popup and asset areas.

### NFR-06 — Compatibility
The extension should target Chrome/Chromium Manifest V3.

## Technical requirements

- Manifest V3
- `chrome.alarms`
- `chrome.storage`
- Content scripts
- JavaScript
- HTML
- CSS

## Future requirements

- Custom message editor
- Categories
- Import/export
- Firefox compatibility
- Edge compatibility
- Optional synchronization
- Automated tests
