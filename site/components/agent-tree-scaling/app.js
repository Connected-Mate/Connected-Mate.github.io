/* Agent Tree Scaling — fractal agent-org visualization.
   Vanilla JS + SVG. No imports, no network. */
(function () {
  "use strict";

  /* ---------- Deterministic PRNG ---------- */

  function hashString(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pick(rng, arr) {
    return arr[Math.floor(rng() * arr.length) % arr.length];
  }

  /* ---------- Name / model / task pools ---------- */

  var CHIEF_TASKS = [
    "Coordinate the research workstream",
    "Align all teams on the launch brief",
    "Review branch results and merge",
    "Escalate blockers to the root chief",
    "Rebalance budget across teams",
    "Draft the executive summary",
    "Audit quality across sub-branches",
    "Plan the next growth ring",
    "Consolidate weekly chief reports",
    "Hire the next ring of chiefs"
  ];
  var TEAM_NAMES = ["Research", "Content", "Engineering", "Data", "Growth", "Design", "Quality", "Outreach", "Analysis", "Ops"];
  var AGENT_ROLES = ["Researcher", "Writer", "Coder", "Scraper", "Analyst", "Reviewer", "Planner", "Tester", "Designer", "Monitor"];
  var AGENT_TASKS = [
    "Compare the pricing of five competitors",
    "Write the copy for the three plans",
    "Build the page and wire up checkout",
    "Read the pricing pages of Linear, Notion and three more",
    "Summarize 120 G2 reviews",
    "Cluster the interview notes",
    "Draft the launch announcement",
    "Profile the signup funnel",
    "Verify the numbers in the sheet",
    "Scrape the changelog archive",
    "Cross-check the survey results",
    "Polish the onboarding emails"
  ];
  var CHIEF_MODELS = ["Opus 5.5", "Opus 5.5", "Opus 5.5", "Sonnet 5.5"];
  var TEAM_MODELS = ["Sonnet 5.5", "Sonnet 5.5", "GPT-6 Sol"];
  var AGENT_MODELS = ["Sonnet 5.5", "Sonnet 5.5", "Haiku 4.5", "GPT-6 Sol", "Gemini 3.8 Flash", "Opus 5.5"];

  var STATUS = {
    Running: "#4883ce",
    Done: "#34d399",
    Queued: "#f5b544",
    Waiting: "#8091a8"
  };

  function rollStatus(rng, weights) {
    var r = rng();
    var acc = 0;
    for (var i = 0; i < weights.length; i++) {
      acc += weights[i][1];
      if (r < acc) return weights[i][0];
    }
    return weights[0][0];
  }

  /* ---------- Layout constants ---------- */

  var CHIEF_W = 236, CHIEF_H = 112;
  var TEAM_W = 196, TEAM_H = 78;
  var AGENT_W = 216, AGENT_H = 100;
  var CELL_W = AGENT_W + 16;
  var GAP_X = 30;
  var GAP_Y = 66;
  var MARGIN = 60;

  /* ---------- Tree model ---------- */

  function trunc(s, n) {
    return s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…";
  }

  function fmtCost(c) {
    return "$" + (c >= 100 ? c.toFixed(0) : c.toFixed(2));
  }

  function fmtTime(sec) {
    sec = Math.round(sec);
    if (sec < 60) return sec + "s";
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    if (m < 60) return m + "m " + String(s).padStart(2, "0") + "s";
    return Math.floor(m / 60) + "h " + (m % 60) + "m";
  }

  function buildTree(cfg) {
    var nodes = [];
    var edges = [];
    var counts = { chiefs: 0, teams: 0, agents: 0 };

    function makeNode(id, type, level) {
      var rng = mulberry32(hashString("ats:" + id));
      var node = { id: id, type: type, level: level, children: [], rng: rng };
      if (type === "chief") {
        counts.chiefs++;
        node.name = "Chief of Staff";
        node.model = pick(rng, CHIEF_MODELS);
        node.task = pick(rng, CHIEF_TASKS);
        node.status = level === 0 ? "Running" : rollStatus(rng, [["Running", 0.55], ["Done", 0.15], ["Queued", 0.2], ["Waiting", 0.1]]);
        node.w = CHIEF_W; node.h = CHIEF_H;
        node.ownCost = 0.05 + rng() * 0.3;
        node.ownTime = 4 + rng() * 20;
      } else if (type === "team") {
        counts.teams++;
        node.name = pick(rng, TEAM_NAMES) + " Team";
        node.model = pick(rng, TEAM_MODELS);
        node.status = rollStatus(rng, [["Running", 0.5], ["Done", 0.25], ["Queued", 0.15], ["Waiting", 0.1]]);
        node.w = TEAM_W; node.h = TEAM_H;
        node.ownCost = 0.02 + rng() * 0.1;
        node.ownTime = 3 + rng() * 12;
      } else {
        counts.agents++;
        node.name = pick(rng, AGENT_ROLES);
        node.model = pick(rng, AGENT_MODELS);
        node.task = pick(rng, AGENT_TASKS);
        node.status = rollStatus(rng, [["Running", 0.45], ["Done", 0.35], ["Queued", 0.12], ["Waiting", 0.08]]);
        node.w = AGENT_W; node.h = AGENT_H;
        node.cost = 0.01 + rng() * 0.4;
        node.time = 5 + rng() * 120;
      }
      nodes.push(node);
      return node;
    }

    function spawnChief(id, level) {
      var chief = makeNode(id, "chief", level);
      if (level < cfg.depth) {
        for (var i = 0; i < cfg.fan; i++) {
          var child = spawnChief(id + "." + i, level + 1);
          chief.children.push(child);
          edges.push([chief, child]);
        }
      } else {
        for (var t = 0; t < cfg.fan; t++) {
          var team = spawnTeam(id + ".t" + t, level + 1);
          chief.children.push(team);
          edges.push([chief, team]);
        }
      }
      return chief;
    }

    function spawnTeam(id, level) {
      var team = makeNode(id, "team", level);
      for (var i = 0; i < cfg.agents; i++) {
        var agent = makeNode(id + ".a" + i, "agent", level + 1);
        team.children.push(agent);
        edges.push([team, agent]);
      }
      return team;
    }

    var root = spawnChief("0", 0);
    root.task = "Scale the org until the launch is covered";

    /* Roll up cost + time bottom-up. */
    (function rollup(node) {
      if (!node.children.length) return;
      var cost = node.ownCost;
      var time = node.ownTime;
      var anyRunning = node.status === "Running";
      for (var i = 0; i < node.children.length; i++) {
        var c = node.children[i];
        rollup(c);
        cost += c.cost;
        time = Math.max(time, node.ownTime + c.time);
        if (c.status === "Running") anyRunning = true;
      }
      node.cost = cost;
      node.time = time;
      if (anyRunning && node.status !== "Running") node.status = "Running";
    })(root);

    /* ---------- Layout ---------- */
    var levelH = [];
    for (var i = 0; i <= cfg.depth; i++) levelH.push(CHIEF_H);
    levelH.push(TEAM_H, AGENT_H);
    var y = [MARGIN];
    for (var l = 0; l < levelH.length - 1; l++) y.push(y[l] + levelH[l] + GAP_Y);

    (function measure(node) {
      if (!node.children.length) { node.subW = CELL_W; return; }
      var w = 0;
      for (var i = 0; i < node.children.length; i++) {
        measure(node.children[i]);
        w += node.children[i].subW;
      }
      w += GAP_X * (node.children.length - 1);
      node.subW = Math.max(node.w + 20, w);
    })(root);

    (function place(node, left) {
      node.y = y[node.level];
      if (!node.children.length) { node.x = left + node.subW / 2; return; }
      var total = -GAP_X * (node.children.length - 1);
      for (var i = 0; i < node.children.length; i++) total += node.children[i].subW;
      var cx = left + (node.subW - total) / 2;
      for (var j = 0; j < node.children.length; j++) {
        var c = node.children[j];
        place(c, cx);
        cx += c.subW + GAP_X;
      }
      node.x = (node.children[0].x + node.children[node.children.length - 1].x) / 2;
    })(root, MARGIN);

    return {
      root: root,
      nodes: nodes,
      edges: edges,
      counts: counts,
      worldW: root.subW + MARGIN * 2,
      worldH: y[y.length - 1] + AGENT_H + MARGIN
    };
  }

  /* ---------- Rendering ---------- */

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function pillSvg(x, y, label, color) {
    var w = label.length * 6.4 + 18;
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="18" rx="9" fill="' + color + '22" stroke="' + color + '55"/>' +
      '<circle cx="' + (x + 10) + '" cy="' + (y + 9) + '" r="3" fill="' + color + '"/>' +
      '<text class="node-pill-text" x="' + (x + 17) + '" y="' + (y + 12.5) + '" font-size="10" fill="' + color + '">' + label + "</text>";
  }

  function cardFull(n) {
    var x = n.x - n.w / 2, y = n.y;
    var s = '<g><rect class="node-card' + (n.level === 0 ? " node-card-root" : "") + '" x="' + x + '" y="' + y + '" width="' + n.w + '" height="' + n.h + '" rx="12"/>';
    s += '<text class="node-name" x="' + (x + 14) + '" y="' + (y + 24) + '" font-size="14">' + esc(n.name) + "</text>";
    s += '<text class="node-model" x="' + (x + 14) + '" y="' + (y + 40) + '" font-size="11">' + esc(n.model) + "</text>";
    s += pillSvg(x + n.w - 14 - (n.status.length * 6.4 + 18), y + 12, n.status, STATUS[n.status]);
    if (n.type === "team") {
      s += '<text class="node-foot" x="' + (x + 14) + '" y="' + (y + n.h - 14) + '" font-size="11.5">' +
        fmtCost(n.cost) + " · " + fmtTime(n.time) + " · " + n.children.length + " agents</text>";
    } else {
      s += '<text class="node-task" x="' + (x + 14) + '" y="' + (y + 60) + '" font-size="12">' + esc(trunc(n.task, 30)) + "</text>";
      var foot = fmtCost(n.cost) + " · " + fmtTime(n.time);
      if (n.children.length) foot += " · " + n.children.length + (n.type === "chief" && n.level < cfg.depth ? " chiefs" : n.type === "chief" ? " teams" : "");
      s += '<text class="node-foot" x="' + (x + 14) + '" y="' + (y + n.h - 14) + '" font-size="11.5">' + foot + "</text>";
    }
    return s + "</g>";
  }

  function cardCompact(n) {
    var x = n.x - n.w / 2, y = n.y;
    return '<g><rect class="node-card' + (n.level === 0 ? " node-card-root" : "") + '" x="' + x + '" y="' + y + '" width="' + n.w + '" height="' + n.h + '" rx="12"/>' +
      '<circle cx="' + (x + 16) + '" cy="' + (y + n.h / 2) + '" r="4" fill="' + STATUS[n.status] + '"/>' +
      '<text class="node-name" x="' + (x + 28) + '" y="' + (y + n.h / 2 + 4) + '" font-size="13">' + esc(trunc(n.name, 20)) + "</text></g>";
  }

  function cardDot(n) {
    /* Minimum on-screen size so dots stay visible when fully zoomed out. */
    var w = Math.max(n.w, 3 / view.k), h = Math.max(n.h, 2 / view.k);
    return '<rect class="node-dot-card" x="' + (n.x - w / 2) + '" y="' + (n.y + (n.h - h) / 2) + '" width="' + w + '" height="' + h + '" rx="' + Math.min(10, h / 2) + '" fill="' + STATUS[n.status] + '"/>';
  }

  /* ---------- View state ---------- */

  var viewport = document.getElementById("viewport");
  var stage = document.getElementById("stage");
  var world = document.getElementById("world");
  var edgePath = document.getElementById("edgePath");
  var nodeLayer = document.getElementById("nodeLayer");
  var totalsEl = document.getElementById("totals");

  var cfg = { depth: 1, fan: 2, agents: 3 };
  var tree = null;
  var view = { x: 0, y: 0, k: 1 };
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function viewBounds() {
    var r = viewport.getBoundingClientRect();
    return {
      x1: -view.x / view.k - 80,
      y1: -view.y / view.k - 80,
      x2: (r.width - view.x) / view.k + 80,
      y2: (r.height - view.y) / view.k + 80
    };
  }

  function render() {
    if (!tree) return;
    var b = viewBounds();
    var lod = view.k >= 0.32 ? "full" : view.k >= 0.07 ? "compact" : "dot";
    var draw = lod === "full" ? cardFull : lod === "compact" ? cardCompact : cardDot;
    var parts = [];
    var nodes = tree.nodes;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.x + n.subW / 2 < b.x1 || n.x - n.subW / 2 > b.x2 || n.y > b.y2 || n.y + n.h < b.y1) continue;
      parts.push(draw(n));
    }
    nodeLayer.innerHTML = parts.join("");

    var d = "";
    var edges = tree.edges;
    for (var e = 0; e < edges.length; e++) {
      var p = edges[e][0], c = edges[e][1];
      if (Math.max(p.x, c.x) < b.x1 || Math.min(p.x, c.x) > b.x2 || p.y > b.y2 || c.y < b.y1) continue;
      var y1 = p.y + p.h, y2 = c.y;
      var my = (y1 + y2) / 2;
      d += "M" + p.x + " " + y1 + "C" + p.x + " " + my + " " + c.x + " " + my + " " + c.x + " " + y2;
    }
    edgePath.setAttribute("d", d);
  }

  function applyView(anim) {
    if (anim && !reducedMotion) {
      world.classList.add("zoom-anim");
      clearTimeout(applyView._t);
      applyView._t = setTimeout(function () { world.classList.remove("zoom-anim"); }, 480);
    }
    world.setAttribute("transform", "translate(" + view.x + " " + view.y + ") scale(" + view.k + ")");
  }

  function fit(anim) {
    var r = viewport.getBoundingClientRect();
    if (!r.width || !tree) return;
    var k = Math.min(r.width / tree.worldW, r.height / tree.worldH);
    k = Math.min(k, 0.85);
    /* Keep the tree at least ~200px tall on screen, even if that means
       horizontal overflow — a one-pixel-tall line shows nothing. */
    k = Math.max(k, Math.min(0.85, 200 / tree.worldH));
    view.k = k;
    view.x = (r.width - tree.worldW * k) / 2;
    view.y = Math.max(12, (r.height - tree.worldH * k) / 2);
    applyView(anim);
    render();
  }

  /* Readable opening view: root card plus its children, centered near the top. */
  function zoomRoot(anim) {
    var r = viewport.getBoundingClientRect();
    if (!r.width || !tree) return;
    var root = tree.root;
    var span = CHIEF_W;
    var midX = root.x;
    if (root.children.length) {
      var first = root.children[0], last = root.children[root.children.length - 1];
      span = last.x - first.x + CHIEF_W;
      midX = (first.x + last.x) / 2;
    }
    var k = Math.min(0.95, r.width / (span + 160));
    view.k = k;
    view.x = r.width / 2 - midX * k;
    view.y = 36 - (MARGIN - 20) * k;
    applyView(anim);
    render();
  }

  function zoomAt(cx, cy, factor) {
    var k2 = Math.min(3, Math.max(0.0005, view.k * factor));
    if (k2 === view.k) return;
    view.x = cx - (cx - view.x) * (k2 / view.k);
    view.y = cy - (cy - view.y) * (k2 / view.k);
    view.k = k2;
    applyView(false);
    scheduleRender();
  }

  var renderTimer = 0;
  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 130);
  }

  function updateTotals() {
    var c = tree.counts;
    totalsEl.innerHTML = "<strong>" + c.chiefs + "</strong> chiefs · <strong>" + c.teams + "</strong> teams · <strong>" +
      c.agents + "</strong> agents · <strong>" + fmtCost(tree.root.cost) + "</strong> · <strong>" + fmtTime(tree.root.time) + "</strong>";
  }

  function rebuild(mode) {
    tree = buildTree(cfg);
    updateTotals();
    if (mode === "root") zoomRoot(false);
    else fit(mode === "anim");
  }

  /* ---------- Pan & zoom ---------- */

  var drag = null;
  stage.addEventListener("pointerdown", function (e) {
    drag = { px: e.clientX, py: e.clientY };
    stage.setPointerCapture(e.pointerId);
    stage.classList.add("panning");
  });
  stage.addEventListener("pointermove", function (e) {
    if (!drag) return;
    view.x += e.clientX - drag.px;
    view.y += e.clientY - drag.py;
    drag.px = e.clientX;
    drag.py = e.clientY;
    applyView(false);
    scheduleRender();
  });
  function endDrag() {
    drag = null;
    stage.classList.remove("panning");
    render();
  }
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  stage.addEventListener("wheel", function (e) {
    e.preventDefault();
    var r = stage.getBoundingClientRect();
    zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.0016));
  }, { passive: false });

  document.getElementById("zoomIn").addEventListener("click", function () {
    var r = viewport.getBoundingClientRect();
    zoomAt(r.width / 2, r.height / 2, 1.4);
    render();
  });
  document.getElementById("zoomOut").addEventListener("click", function () {
    var r = viewport.getBoundingClientRect();
    zoomAt(r.width / 2, r.height / 2, 1 / 1.4);
    render();
  });
  document.getElementById("zoomReset").addEventListener("click", function () { fit(true); });

  if (window.ResizeObserver) {
    var roT = 0;
    new ResizeObserver(function () {
      clearTimeout(roT);
      roT = setTimeout(function () { render(); }, 120);
    }).observe(viewport);
  }

  /* ---------- Controls ---------- */

  function bindSlider(id, outId, key) {
    var input = document.getElementById(id);
    var out = document.getElementById(outId);
    input.addEventListener("input", function () {
      cfg[key] = +input.value;
      out.textContent = input.value;
      stopAutoScale();
      rebuild("fit");
    });
    return {
      set: function (v) {
        input.value = v;
        out.textContent = v;
        cfg[key] = v;
      },
      get: function () { return +input.value; }
    };
  }

  var sDepth = bindSlider("chiefLevels", "chiefLevelsVal", "depth");
  var sFan = bindSlider("chiefsPer", "chiefsPerVal", "fan");
  var sAgents = bindSlider("agentsPer", "agentsPerVal", "agents");

  /* ---------- Auto-scale ---------- */

  var autoBtn = document.getElementById("autoScaleBtn");
  var autoTimer = 0;
  var AUTO_STEPS = [
    [1, 1, 2], [1, 2, 2], [2, 2, 3], [2, 3, 3], [3, 3, 4], [3, 4, 5], [4, 4, 6]
  ];
  var autoIdx = 0, autoDir = 1;

  function autoStep() {
    var step = AUTO_STEPS[autoIdx];
    sDepth.set(step[0]);
    sFan.set(step[1]);
    sAgents.set(step[2]);
    rebuild("anim");
    autoIdx += autoDir;
    if (autoIdx >= AUTO_STEPS.length) { autoIdx = AUTO_STEPS.length - 2; autoDir = -1; }
    else if (autoIdx < 0) { autoIdx = 1; autoDir = 1; }
  }

  function stopAutoScale() {
    if (!autoTimer) return;
    clearInterval(autoTimer);
    autoTimer = 0;
    autoBtn.setAttribute("aria-pressed", "false");
  }

  if (reducedMotion) {
    autoBtn.disabled = true;
    autoBtn.title = "Auto-scale is disabled because you prefer reduced motion";
  } else {
    autoBtn.addEventListener("click", function () {
      if (autoTimer) { stopAutoScale(); return; }
      autoBtn.setAttribute("aria-pressed", "true");
      autoIdx = 0; autoDir = 1;
      autoStep();
      autoTimer = setInterval(autoStep, 1400);
    });
  }

  /* ---------- Tabs ---------- */

  var tabPreview = document.getElementById("tabPreview");
  var tabCode = document.getElementById("tabCode");
  var panelPreview = document.getElementById("panelPreview");
  var panelCode = document.getElementById("panelCode");
  var codeText = document.getElementById("codeText");
  var codeLoaded = false;

  function selectTab(which) {
    var isPreview = which === "preview";
    tabPreview.classList.toggle("active", isPreview);
    tabCode.classList.toggle("active", !isPreview);
    tabPreview.setAttribute("aria-selected", String(isPreview));
    tabCode.setAttribute("aria-selected", String(!isPreview));
    panelPreview.hidden = !isPreview;
    panelCode.hidden = isPreview;
    if (!isPreview && !codeLoaded) {
      codeLoaded = true;
      fetch("app.js").then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      }).then(function (src) {
        codeText.textContent = src;
      }).catch(function (err) {
        codeText.innerHTML = '<span class="code-error">Could not load app.js (' + esc(err.message) + "). Serve this page over HTTP and try again.</span>";
      });
    }
    if (isPreview) fit(false);
  }

  tabPreview.addEventListener("click", function () { selectTab("preview"); });
  tabCode.addEventListener("click", function () { selectTab("code"); });

  /* ---------- Copy ---------- */

  var copyBtn = document.getElementById("copyBtn");
  var copyLabel = document.getElementById("copyLabel");
  copyBtn.addEventListener("click", function () {
    var text = codeText.textContent;
    function done(ok) {
      copyBtn.classList.toggle("copied", ok);
      copyLabel.textContent = ok ? "Copied" : "Copy failed";
      setTimeout(function () {
        copyBtn.classList.remove("copied");
        copyLabel.textContent = "Copy";
      }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { fallback(); });
    } else {
      fallback();
    }
    function fallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        done(true);
      } catch (e) {
        done(false);
      }
    }
  });

  /* ---------- Sidebar search filter ---------- */

  var navSearch = document.getElementById("navSearch");
  var navItems = document.getElementById("navItems");
  navSearch.addEventListener("input", function () {
    var q = navSearch.value.trim().toLowerCase();
    var lis = navItems.querySelectorAll("li");
    for (var i = 0; i < lis.length; i++) {
      lis[i].classList.toggle("hidden", q !== "" && lis[i].textContent.toLowerCase().indexOf(q) === -1);
    }
  });

  /* ---------- Boot ---------- */

  rebuild("root");
})();
