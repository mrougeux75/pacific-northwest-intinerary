(function () {
  const trip = window.TRIP;
  const icons = {flight:"✈", car:"◆", drive:"➜", hotel:"⌂", hike:"▲", walk:"↟", view:"◉", coast:"≈", meal:"●", fish:"⌁"};
  const labels = {flight:"Flight", car:"Rental", drive:"Drive", hotel:"Hotel", hike:"Hike", walk:"Walk", view:"Viewpoint", coast:"Coast", meal:"Food", fish:"Fishing"};
  let activeDay = Number(localStorage.getItem("pnw-active-day") || 1);

  const strip = document.getElementById("dayStrip");
  const views = [...document.querySelectorAll(".view")];
  const navButtons = [...document.querySelectorAll(".bottom-nav button")];

  function mapUrl(query) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
  }

  function eventCard(event) {
    const node = document.getElementById("eventTemplate").content.cloneNode(true);
    node.querySelector(".event__icon").textContent = icons[event.type] || "•";
    node.querySelector("time").textContent = event.time;
    node.querySelector(".event__tag").textContent = labels[event.type] || event.type;
    node.querySelector("h3").textContent = event.title;
    node.querySelector(".event__summary").textContent = event.summary;
    const list = node.querySelector(".event__details");
    (event.details || []).forEach(detail => {
      const li = document.createElement("li");
      li.textContent = detail;
      list.appendChild(li);
    });
    if (!list.children.length) list.remove();
    if (event.map) {
      const link = document.createElement("a");
      link.className = "action";
      link.href = mapUrl(event.map);
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Open map ↗";
      node.querySelector(".event__actions").appendChild(link);
    }
    return node;
  }

  function renderStrip() {
    strip.innerHTML = "";
    trip.days.forEach(day => {
      const b = document.createElement("button");
      b.className = "day-chip" + (day.day === activeDay ? " active" : "");
      b.innerHTML = `<span>Day ${day.day}</span><strong>${day.date.split(", ")[1].replace("August ", "Aug ")}</strong>`;
      b.addEventListener("click", () => {
        activeDay = day.day;
        localStorage.setItem("pnw-active-day", activeDay);
        renderStrip();
        renderDay();
        showView("dayView");
        b.scrollIntoView({behavior:"smooth", inline:"center", block:"nearest"});
        window.scrollTo({top: document.querySelector(".day-strip").offsetTop, behavior:"smooth"});
      });
      strip.appendChild(b);
    });
  }

  function renderDay() {
    const day = trip.days.find(d => d.day === activeDay);
    const el = document.getElementById("dayView");
    el.innerHTML = `<header class="day-heading">
      <div class="day-heading__date">Day ${day.day} · ${day.date}</div>
      <h2>${day.title}</h2>
      <p>${day.subtitle}</p>
      <div class="route-pill">➜ ${day.route}</div>
    </header><div class="timeline"></div>`;
    const timeline = el.querySelector(".timeline");
    day.events.forEach(event => timeline.appendChild(eventCard(event)));
  }

  function renderMap() {
    const el = document.getElementById("mapView");
    el.innerHTML = `<div class="panel"><h2>Trip map</h2><p>Open each day’s key destinations in Google Maps. Download offline areas before the trip.</p><div class="map-list"></div></div>`;
    const list = el.querySelector(".map-list");
    trip.days.forEach(day => {
      const destinations = [...new Set(day.events.filter(e => e.map).map(e => e.map))];
      if (!destinations.length) return;
      const a = document.createElement("a");
      a.className = "map-item";
      a.href = mapUrl(destinations.join(" to "));
      a.target = "_blank";
      a.rel = "noopener";
      a.innerHTML = `<strong>Day ${day.day}: ${day.title}</strong><small>${destinations.join(" · ")}</small>`;
      list.appendChild(a);
    });
  }

  function renderTrip() {
    const el = document.getElementById("tripView");
    el.innerHTML = `<div class="panel"><h2>Trip essentials</h2><div class="info-grid"></div></div>
      <div class="panel"><h3>Private confirmation notes</h3><p class="privacy-note">Saved only in this browser on this device. Nothing is uploaded.</p><textarea class="private-field" id="privateNotes" placeholder="Paste additional confirmation numbers or private notes here…"></textarea></div>`;
    const grid = el.querySelector(".info-grid");
    trip.tripInfo.forEach(info => {
      const card = document.createElement("div");
      card.className = "info-card";
      card.innerHTML = `<div class="info-card__label">${info.label}</div><strong>${info.title}</strong><p>${info.body}</p>`;
      grid.appendChild(card);
    });
    const notes = el.querySelector("#privateNotes");
    notes.value = localStorage.getItem("pnw-private-notes") || "";
    notes.addEventListener("input", () => localStorage.setItem("pnw-private-notes", notes.value));
  }

  function renderSearch() {
    const el = document.getElementById("searchView");
    el.innerHTML = `<div class="panel"><h2>Search the trip</h2><input class="search-box" type="search" placeholder="Try “Rainier,” “hotel,” or “tide”…" aria-label="Search itinerary"><div class="result-list"></div></div>`;
    const input = el.querySelector("input");
    const results = el.querySelector(".result-list");
    function search() {
      const q = input.value.trim().toLowerCase();
      results.innerHTML = "";
      if (!q) {
        results.innerHTML = `<div class="empty">Search across every day, activity, hotel and note.</div>`;
        return;
      }
      const matches = [];
      trip.days.forEach(day => day.events.forEach(event => {
        const text = [day.title, day.date, event.title, event.summary, ...(event.details || [])].join(" ").toLowerCase();
        if (text.includes(q)) matches.push({day, event});
      }));
      matches.forEach(({day, event}) => {
        const b = document.createElement("button");
        b.className = "result-item";
        b.innerHTML = `<strong>Day ${day.day}: ${event.title}</strong><small>${day.date} · ${event.time}</small>`;
        b.addEventListener("click", () => {
          activeDay = day.day;
          renderStrip();
          renderDay();
          showView("dayView");
          window.scrollTo({top: document.querySelector(".day-strip").offsetTop, behavior:"smooth"});
        });
        results.appendChild(b);
      });
      if (!matches.length) results.innerHTML = `<div class="empty">No results for “${input.value.replace(/[<>&]/g, "")}”.</div>`;
    }
    input.addEventListener("input", search);
    search();
    setTimeout(() => input.focus(), 100);
  }

  function renderChecklist() {
    const el = document.getElementById("checklistView");
    el.innerHTML = `<div class="panel"><h2>Trip checklist</h2><p>Checks are saved on this device.</p><div id="checkGroups"></div></div>`;
    const wrap = el.querySelector("#checkGroups");
    let count = 0;
    Object.entries(trip.checklist).forEach(([group, items]) => {
      const section = document.createElement("section");
      section.className = "check-group";
      section.innerHTML = `<h3>${group}</h3>`;
      items.forEach(item => {
        const id = `pnw-check-${count++}`;
        const label = document.createElement("label");
        label.className = "check-item";
        label.innerHTML = `<input type="checkbox" id="${id}"><span>${item}</span>`;
        const checkbox = label.querySelector("input");
        checkbox.checked = localStorage.getItem(id) === "1";
        checkbox.addEventListener("change", () => localStorage.setItem(id, checkbox.checked ? "1" : "0"));
        section.appendChild(label);
      });
      wrap.appendChild(section);
    });
  }

  function showView(id) {
    views.forEach(view => view.hidden = view.id !== id);
    navButtons.forEach(button => button.classList.toggle("active", button.dataset.view === id));
    strip.hidden = id !== "dayView";
    if (id === "mapView") renderMap();
    if (id === "tripView") renderTrip();
    if (id === "searchView") renderSearch();
    if (id === "checklistView") renderChecklist();
  }

  navButtons.forEach(button => button.addEventListener("click", () => {
    showView(button.dataset.view);
    window.scrollTo({top: 0, behavior:"smooth"});
  }));

  renderStrip();
  renderDay();
  if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js");
})();
