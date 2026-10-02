/* Invert Digital — site behaviour (no dependencies) */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.remove("no-js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.dataLayer = window.dataLayer || [];
  function pushEvent(name, params) {
    window.dataLayer.push(Object.assign({ event: name }, params || {}));
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------- Header: scrolled state + progress bar ---------------- */
  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".scroll-progress");
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 12);
    if (progress) {
      var max = document.body.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------------- Mobile nav + mega menu ---------------- */
  var navToggle = document.querySelector(".nav-toggle");
  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("no-scroll", open);
    });
  }
  document.querySelectorAll(".has-mega > .nav-link").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var li = btn.parentElement;
      var open = li.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      e.stopPropagation();
    });
  });
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".has-mega.is-open").forEach(function (li) {
      if (!li.contains(e.target) && window.innerWidth > 960) {
        li.classList.remove("is-open");
        li.querySelector(".nav-link").setAttribute("aria-expanded", "false");
      }
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".has-mega.is-open").forEach(function (li) { li.classList.remove("is-open"); });
    if (header && header.classList.contains("nav-open")) navToggle.click();
  });

  /* ---------------- Scroll reveal (auto + opt-in) ---------------- */
  var autoReveal = ".section-head, .card, .channel-card, .case-card, .fact, .accordion-item, .compare, .calc, .industry-highlight, .split > *, .stat, [data-reveal]";
  var revealEls = document.querySelectorAll(autoReveal);
  revealEls.forEach(function (el) {
    if (!el.classList.contains("reveal-scale")) el.classList.add("reveal");
  });
  // Stagger siblings inside grids
  document.querySelectorAll(".grid-2, .grid-3, .grid-4, .case-grid, .stats-grid, .accordion, .hero-facts").forEach(function (grid) {
    Array.prototype.forEach.call(grid.children, function (child, i) {
      child.style.setProperty("--d", (i % 6) * 0.08 + "s");
    });
  });

  var observed = document.querySelectorAll(".reveal, .reveal-scale, .process");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    observed.forEach(function (el) { io.observe(el); });
  } else {
    observed.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------- Count-up numbers ----------------
     <span data-count="900" data-prefix="" data-suffix="+" data-decimals="0">900+</span> */
  function formatNum(n, decimals) {
    return Number(n).toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    if (isNaN(target)) return;
    if (reduceMotion) { el.textContent = prefix + formatNum(target, decimals) + suffix; return; }
    var duration = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = prefix + formatNum(target * eased, decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------------- Card spotlight + subtle tilt ---------------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".channel-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty("--mx", x + "px");
        card.style.setProperty("--my", y + "px");
        var rx = ((y / r.height) - 0.5) * -6, ry = ((x / r.width) - 0.5) * 6;
        card.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll(".accordion-trigger").forEach(function (trigger) {
    var item = trigger.closest(".accordion-item");
    var panel = item.querySelector(".accordion-panel");
    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      var group = item.parentElement;
      group.querySelectorAll(".accordion-item.is-open").forEach(function (o) {
        o.classList.remove("is-open");
        o.querySelector(".accordion-panel").style.maxHeight = null;
        o.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("is-open");
        panel.style.maxHeight = panel.scrollHeight + "px";
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------------- Case study filter ---------------- */
  document.querySelectorAll("[data-filter-group]").forEach(function (bar) {
    var target = document.querySelector(bar.getAttribute("data-filter-group"));
    if (!target) return;
    bar.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        bar.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        var f = btn.getAttribute("data-filter");
        target.querySelectorAll(".case-card").forEach(function (card) {
          var tags = (card.getAttribute("data-tags") || "").split(" ");
          var show = f === "all" || tags.indexOf(f) !== -1;
          card.classList.toggle("is-hidden", !show);
          if (show && !reduceMotion) {
            card.animate([{ opacity: 0, transform: "translateY(16px) scale(0.98)" }, { opacity: 1, transform: "none" }], { duration: 450, easing: "cubic-bezier(0.22,1,0.36,1)" });
          }
        });
      });
    });
  });

  /* ---------------- Case study dialogs ---------------- */
  document.querySelectorAll("[data-case]").forEach(function (card) {
    card.addEventListener("click", function () {
      var dlg = document.getElementById(card.getAttribute("data-case"));
      if (!dlg || typeof dlg.showModal !== "function") return;
      dlg.showModal();
      document.body.classList.add("no-scroll");
      pushEvent("view_case_study", { case_id: dlg.id });
    });
  });
  // Open a case dialog from a URL hash, e.g. /case-studies.html#case-alo
  if (location.hash) {
    var hashCard = document.querySelector('[data-case="' + location.hash.slice(1) + '"]');
    if (hashCard) setTimeout(function () { hashCard.scrollIntoView({ block: "center" }); hashCard.click(); }, 400);
  }
  document.querySelectorAll(".case-dialog").forEach(function (dlg) {
    dlg.addEventListener("close", function () { document.body.classList.remove("no-scroll"); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", function () { dlg.close(); }); });
  });

  /* ---------------- Lead forms (Netlify AJAX) ---------------- */
  function encodeForm(formEl) {
    return Array.from(new FormData(formEl).entries()).map(function (p) {
      return encodeURIComponent(p[0]) + "=" + encodeURIComponent(p[1]);
    }).join("&");
  }
  document.querySelectorAll("form[data-netlify]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var label = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeForm(form)
      }).then(function (res) {
        if (!res.ok) throw new Error("Bad response");
        var svc = form.querySelector('[name="service"]');
        var budget = form.querySelector('[name="budget"]');
        pushEvent("generate_lead", { form_id: form.id, service: svc ? svc.value : undefined, budget: budget ? budget.value : undefined });
        var success = form.querySelector(".form-success");
        Array.prototype.forEach.call(form.children, function (el) { if (el !== success) el.style.display = "none"; });
        if (success) success.hidden = false;
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.innerHTML = label; }
        alert("Something went wrong sending your details. Please WhatsApp or call us instead.");
      });
    });
  });

  /* ---------------- Call / WhatsApp click tracking ---------------- */
  document.querySelectorAll("[data-track]").forEach(function (el) {
    el.addEventListener("click", function () { pushEvent(el.getAttribute("data-track"), { location: el.getAttribute("data-loc") || undefined }); });
  });

  /* ---------------- Lead calculator ----------------
     Benchmarks are the cost-per-lead ranges seen in our own case studies. */
  var calc = document.querySelector("[data-calc]");
  if (calc) {
    var budgetIn = calc.querySelector("#calcBudget");
    var budgetOut = calc.querySelector("#calcBudgetOut");
    var closeIn = calc.querySelector("#calcClose");
    var closeOut = calc.querySelector("#calcCloseOut");
    var dealIn = calc.querySelector("#calcDeal");
    var dealOut = calc.querySelector("#calcDealOut");
    var segBtns = calc.querySelectorAll(".seg button");
    var cpl = [150, 300];
    var tracked = false;

    function inr(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }
    function fill(input) {
      var p = (input.value - input.min) / (input.max - input.min) * 100;
      input.style.setProperty("--fill", p + "%");
    }
    function update() {
      var budget = +budgetIn.value, close = +closeIn.value / 100, deal = +dealIn.value;
      budgetOut.textContent = inr(budget);
      closeOut.textContent = closeIn.value + "%";
      dealOut.textContent = inr(deal);
      [budgetIn, closeIn, dealIn].forEach(fill);
      var leadsLo = Math.floor(budget / cpl[1]), leadsHi = Math.floor(budget / cpl[0]);
      calc.querySelector("#calcLeads").textContent = leadsLo + "–" + leadsHi;
      calc.querySelector("#calcCpl").textContent = inr(cpl[0]) + "–" + inr(cpl[1]);
      var salesLo = leadsLo * close, salesHi = leadsHi * close;
      calc.querySelector("#calcSales").textContent = salesLo.toFixed(1).replace(".0", "") + "–" + salesHi.toFixed(1).replace(".0", "");
      calc.querySelector("#calcRevenue").textContent = inr(salesLo * deal) + "–" + inr(salesHi * deal);
    }
    [budgetIn, closeIn, dealIn].forEach(function (inp) {
      inp.addEventListener("input", function () {
        update();
        if (!tracked) { pushEvent("calculator_use"); tracked = true; }
      });
    });
    segBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        segBtns.forEach(function (x) { x.classList.remove("is-active"); x.setAttribute("aria-pressed", "false"); });
        b.classList.add("is-active");
        b.setAttribute("aria-pressed", "true");
        cpl = b.getAttribute("data-cpl").split(",").map(Number);
        update();
      });
    });
    update();
  }
})();
