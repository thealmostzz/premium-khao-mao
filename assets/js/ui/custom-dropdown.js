(function (global, factory) {
  const api = factory();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  global.PremiumKhaoMaoCustomDropdown = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  const getNextEnabledOptionIndex = (options, currentIndex, direction) => {
    if (!options.length) return -1;

    for (let offset = 1; offset <= options.length; offset += 1) {
      const nextIndex = (currentIndex + (direction * offset) + options.length) % options.length;

      if (!options[nextIndex].disabled) {
        return nextIndex;
      }
    }

    return currentIndex;
  };

  const create = (select) => {
    if (!select || select.dataset.customDropdownInitialized === "true") return null;

    const wrapper = document.createElement("div");
    const trigger = document.createElement("button");
    const listbox = document.createElement("ul");
    const listboxId = `${select.id}-options`;
    const label = document.querySelector(`label[for="${select.id}"]`);

    wrapper.className = "relative";
    trigger.type = "button";
    trigger.className = "quick-order-input flex w-full items-center justify-between gap-3 text-left";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-controls", listboxId);
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-label", label?.textContent?.trim() || select.name);
    trigger.dataset.customDropdownTriggerFor = select.id;

    listbox.id = listboxId;
    listbox.className = "absolute z-30 mt-2 hidden max-h-72 w-full overflow-y-auto rounded-2xl border border-gold/40 bg-ivory p-2 shadow-2xl shadow-black/20";
    listbox.setAttribute("role", "listbox");
    listbox.setAttribute("aria-label", label?.textContent?.trim() || select.name);

    const chevron = document.createElement("span");
    chevron.className = "inline-flex h-5 w-5 shrink-0 items-center justify-center text-gold transition-transform duration-200";
    chevron.setAttribute("aria-hidden", "true");

    const chevronIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    chevronIcon.setAttribute("viewBox", "0 0 20 20");
    chevronIcon.setAttribute("fill", "none");
    chevronIcon.setAttribute("stroke", "currentColor");
    chevronIcon.setAttribute("stroke-width", "2");
    chevronIcon.setAttribute("stroke-linecap", "round");
    chevronIcon.setAttribute("stroke-linejoin", "round");
    chevronIcon.classList.add("h-4", "w-4");

    const chevronPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    chevronPath.setAttribute("d", "m5 7.5 5 5 5-5");
    chevronIcon.append(chevronPath);
    chevron.append(chevronIcon);

    const value = document.createElement("span");
    value.className = "min-w-0 truncate";
    trigger.append(value, chevron);
    wrapper.append(trigger, listbox);
    select.insertAdjacentElement("afterend", wrapper);
    select.classList.add("sr-only");
    select.dataset.customDropdownInitialized = "true";

    const close = (restoreFocus = false) => {
      listbox.classList.add("hidden");
      trigger.setAttribute("aria-expanded", "false");
      chevron.classList.remove("rotate-180");

      if (restoreFocus) {
        trigger.focus();
      }
    };

    const open = () => {
      listbox.classList.remove("hidden");
      trigger.setAttribute("aria-expanded", "true");
      chevron.classList.add("rotate-180");
    };

    const selectOption = (index) => {
      const option = select.options[index];
      if (!option || option.disabled) return;

      select.selectedIndex = index;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      close(true);
    };

    const refresh = () => {
      const selectedOption = select.options[select.selectedIndex];
      const isPlaceholder = !select.value;

      value.textContent = selectedOption?.textContent?.trim() || "";
      value.classList.toggle("text-riceBrown/60", isPlaceholder);
      value.classList.toggle("text-charcoal", !isPlaceholder);
      listbox.replaceChildren();

      Array.from(select.options).forEach((option, index) => {
        const item = document.createElement("li");
        const optionButton = document.createElement("button");
        const isSelected = index === select.selectedIndex;

        optionButton.type = "button";
        optionButton.className = "flex w-full items-center justify-between gap-4 rounded-xl px-3 py-3 text-left text-sm font-medium text-charcoal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold";
        optionButton.classList.toggle("bg-leaf", isSelected);
        optionButton.classList.toggle("text-ivory", isSelected);
        optionButton.classList.toggle("hover:bg-gold/15", !isSelected && !option.disabled);
        optionButton.classList.toggle("cursor-not-allowed", option.disabled);
        optionButton.classList.toggle("opacity-50", option.disabled);
        optionButton.setAttribute("role", "option");
        optionButton.setAttribute("aria-selected", String(isSelected));
        optionButton.disabled = option.disabled;
        optionButton.textContent = option.textContent;

        if (isSelected) {
          const checkmark = document.createElement("span");
          checkmark.className = "text-gold";
          checkmark.setAttribute("aria-hidden", "true");
          checkmark.textContent = "✓";
          optionButton.append(checkmark);
        }

        optionButton.addEventListener("click", () => selectOption(index));
        item.append(optionButton);
        listbox.append(item);
      });
    };

    const moveSelection = (direction) => {
      const nextIndex = getNextEnabledOptionIndex(Array.from(select.options), select.selectedIndex, direction);
      selectOption(nextIndex);
    };

    const onKeydown = (event) => {
      if (event.key === "Escape") {
        close(true);
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        moveSelection(event.key === "ArrowDown" ? 1 : -1);
        return;
      }

      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        selectOption(event.key === "Home" ? 0 : select.options.length - 1);
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (trigger.getAttribute("aria-expanded") === "true") {
          close();
        } else {
          open();
        }
      }
    };

    const onDocumentPointerDown = (event) => {
      if (!wrapper.contains(event.target)) {
        close();
      }
    };

    trigger.addEventListener("click", () => {
      if (trigger.getAttribute("aria-expanded") === "true") {
        close();
      } else {
        open();
      }
    });
    trigger.addEventListener("keydown", onKeydown);
    select.addEventListener("change", refresh);
    document.addEventListener("pointerdown", onDocumentPointerDown);
    refresh();

    return {
      refresh,
      destroy: () => {
        document.removeEventListener("pointerdown", onDocumentPointerDown);
        select.removeEventListener("change", refresh);
        wrapper.remove();
        select.classList.remove("sr-only");
        delete select.dataset.customDropdownInitialized;
      }
    };
  };

  return { create, getNextEnabledOptionIndex };
});
