(() => {
  const HOST_ID = "tasbeeh-reminder-host";

  let hideTimer = null;
  let removeTimer = null;

  function removeExistingHost() {
    clearTimeout(hideTimer);
    clearTimeout(removeTimer);

    hideTimer = null;
    removeTimer = null;

    const existingHost = document.getElementById(HOST_ID);

    if (existingHost) {
      existingHost.remove();
    }
  }

  function randomMessage(messages) {
    if (!Array.isArray(messages) || messages.length === 0) {
      return null;
    }

    const lastIndex = Number(
      sessionStorage.getItem("tasbeeh-reminder-last-index")
    );

    let index = Math.floor(Math.random() * messages.length);

    // Avoid showing the same message twice in a row
    if (
      messages.length > 1 &&
      Number.isInteger(lastIndex) &&
      index === lastIndex
    ) {
      index = (index + 1) % messages.length;
    }

    sessionStorage.setItem(
      "tasbeeh-reminder-last-index",
      String(index)
    );

    return messages[index];
  }

  function createHost() {
    const host = document.createElement("div");

    host.id = HOST_ID;
    host.setAttribute("role", "status");
    host.setAttribute("aria-live", "polite");

    document.documentElement.appendChild(host);

    return host;
  }

  function positionHost(host, position) {
    host.dataset.position = position || "bottom-right";
  }

  function makeDraggable(host, card) {
    let dragging = false;

    let startX = 0;
    let startY = 0;

    let startLeft = 0;
    let startTop = 0;

    card.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".tasbeeh-close")) {
        return;
      }

      dragging = true;

      card.setPointerCapture(event.pointerId);

      const rect = card.getBoundingClientRect();

      startX = event.clientX;
      startY = event.clientY;

      startLeft = rect.left;
      startTop = rect.top;

      card.classList.add("tasbeeh-dragging");
    });

    card.addEventListener("pointermove", (event) => {
      if (!dragging) {
        return;
      }

      const left = Math.max(
        8,
        Math.min(
          window.innerWidth - card.offsetWidth - 8,
          startLeft + event.clientX - startX
        )
      );

      const top = Math.max(
        8,
        Math.min(
          window.innerHeight - card.offsetHeight - 8,
          startTop + event.clientY - startY
        )
      );

      host.dataset.position = "custom";

      host.style.setProperty(
        "--tasbeeh-left",
        `${left}px`
      );

      host.style.setProperty(
        "--tasbeeh-top",
        `${top}px`
      );
    });

    const stopDragging = () => {
      dragging = false;
      card.classList.remove("tasbeeh-dragging");
    };

    card.addEventListener("pointerup", stopDragging);
    card.addEventListener("pointercancel", stopDragging);
  }

  const colorThemes = [
    {
      bg1: "#fff2b8",
      bg2: "#e5bd57",
      text: "#2b2410",
      muted: "rgba(43,36,16,.68)",
      border: "rgba(255,255,255,.72)",
      glow: "rgba(255,211,74,.55)"
    },
    {
      bg1: "#c9f3dc",
      bg2: "#63bd91",
      text: "#123b28",
      muted: "rgba(18,59,40,.70)",
      border: "rgba(255,255,255,.70)",
      glow: "rgba(99,189,145,.52)"
    },
    {
      bg1: "#d9eaff",
      bg2: "#719bd2",
      text: "#172b47",
      muted: "rgba(23,43,71,.70)",
      border: "rgba(255,255,255,.72)",
      glow: "rgba(113,155,210,.52)"
    },
    {
      bg1: "#f5d6ee",
      bg2: "#c784b1",
      text: "#43253b",
      muted: "rgba(67,37,59,.70)",
      border: "rgba(255,255,255,.72)",
      glow: "rgba(199,132,177,.52)"
    },
    {
      bg1: "#ffe0c2",
      bg2: "#dc9b62",
      text: "#472713",
      muted: "rgba(71,39,19,.70)",
      border: "rgba(255,255,255,.72)",
      glow: "rgba(220,155,98,.52)"
    },
    {
      bg1: "#d9d2ff",
      bg2: "#9185d1",
      text: "#28234b",
      muted: "rgba(40,35,75,.70)",
      border: "rgba(255,255,255,.72)",
      glow: "rgba(145,133,209,.52)"
    }
  ];

  function randomTheme() {
    return colorThemes[
      Math.floor(Math.random() * colorThemes.length)
    ];
  }

  function render(settings) {

    // IMPORTANT:
    // Completely remove any previous reminder first.
    removeExistingHost();

    const message = randomMessage(settings.messages);

    if (!message) {
      return;
    }

    const host = createHost();

    positionHost(
      host,
      settings.position
    );

    const card = document.createElement("section");

    card.className = "tasbeeh-card";

    const theme = randomTheme();

    card.style.setProperty(
      "--tasbeeh-bg-1",
      theme.bg1
    );

    card.style.setProperty(
      "--tasbeeh-bg-2",
      theme.bg2
    );

    card.style.setProperty(
      "--tasbeeh-text",
      theme.text
    );

    card.style.setProperty(
      "--tasbeeh-muted",
      theme.muted
    );

    card.style.setProperty(
      "--tasbeeh-border",
      theme.border
    );

    card.style.setProperty(
      "--tasbeeh-glow",
      theme.glow
    );

    /* Build popup without innerHTML */
    const handle = document.createElement("div");

    handle.className = "tasbeeh-handle";
    handle.setAttribute("aria-hidden", "true");

    const closeButton = document.createElement("button");

    closeButton.className = "tasbeeh-close";
    closeButton.setAttribute(
      "aria-label",
      "Close reminder"
    );

    closeButton.textContent = "×";

    const arabic = document.createElement("div");

    arabic.className = "tasbeeh-arabic";
    arabic.setAttribute("dir", "rtl");
    arabic.textContent = message.arabic || "";

    if ((message.arabic || "").length > 24) {
      arabic.classList.add("tasbeeh-long");
    }

    const transliteration =
      document.createElement("div");

    transliteration.className =
      "tasbeeh-transliteration";

    transliteration.textContent =
      message.transliteration || "";

    card.appendChild(handle);
    card.appendChild(closeButton);
    card.appendChild(arabic);
    card.appendChild(transliteration);

    host.appendChild(card);

    makeDraggable(host, card);

    closeButton.addEventListener("click", () => {

      clearTimeout(hideTimer);
      clearTimeout(removeTimer);

      hideTimer = null;
      removeTimer = null;

      host.classList.remove(
        "tasbeeh-visible"
      );

      removeTimer = setTimeout(() => {

        if (host.parentNode) {
          host.remove();
        }

      }, 180);
    });

    /* Show popup */
    requestAnimationFrame(() => {

      if (host.isConnected) {
        host.classList.add(
          "tasbeeh-visible"
        );
      }

    });

    /* Automatic hide */
    const duration = Math.max(
      1,
      Number(settings.displaySeconds) || 10
    );

    hideTimer = setTimeout(() => {

      if (!host.isConnected) {
        return;
      }

      host.classList.remove(
        "tasbeeh-visible"
      );

      removeTimer = setTimeout(() => {

        if (host.parentNode) {
          host.remove();
        }

      }, 180);

    }, duration * 1000);
  }

  chrome.runtime.onMessage.addListener(
    (message) => {

      if (
        message?.type === "SHOW_REMINDER"
      ) {
        render(message.settings);
      }

    }
  );
})();