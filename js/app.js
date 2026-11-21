window.onload = function () {

  // 1. Room items data (single source of truth)
  const roomItems = [
    {
      id: "door",
      message: "A heavy wooden door. You pull the handle... locked. There's a small 4-digit keypad beside it."
    },
    {
      id: "wall-poster",
      message: "An old poster of a starry night sky. Some stars look brighter than others... almost like they're arranged on purpose."
    },
    {
      id: "desk-drawer",
      message: "A dusty desk drawer. It's stuck — something inside is rattling, but it won't open without a key."
    }
  ];

  // 2. Get room buttons + message box (once, outside the listeners)
  const items = document.querySelectorAll("button[data-name]");
  const messageText = document.getElementById("message-description");

  // 3. Add a click listener to each button
  items.forEach(function (element) {
    element.addEventListener("click", function () {

      // 4 + 5. Read data-name and find the matching object
      const result = roomItems.find(function (obj) {
        return obj.id === element.dataset.name;
      });

      // 6. Show its message on the page
      messageText.textContent = result.message;
    });
  });

};
