# Testing

## Manual smoke test

1. Load the extension using `chrome://extensions`.
2. Open a normal HTTPS webpage.
3. Open the Tasbeeh Reminder popup.
4. Verify the defaults:
   - 3 minutes
   - 10 seconds
   - Bottom right
5. Click **Show test reminder**.
6. Verify Arabic, transliteration and meaning are displayed.
7. Verify the close button works.
8. Verify the card disappears after 10 seconds.
9. Change the position and interval.
10. Disable the extension and verify that scheduled reminders stop.
11. Reload the extension and verify settings remain saved.

## Developer debugging

Open:

```text
chrome://extensions
```

Then find Tasbeeh Reminder and use:

- **Service worker → Inspect**
- Open DevTools on the webpage for content-script errors.

## Future automated testing

The project can later add:

- Vitest/Jest for pure JavaScript utilities
- Playwright for browser-level end-to-end testing
- ESLint for static analysis
- Prettier for formatting
