// A-Team masthead, the navy bandeau of the Vibe Creators hub.
// Mounted beside #root, never inside it, so React keeps full ownership of the app.
(() => {
  const STARS = [
    [8, 24, 0], [19, 70, 1.2], [31, 18, 3.1], [46, 62, 2.3], [58, 30, 4.4],
    [67, 76, 0.7], [74, 22, 5.2], [83, 58, 2.9], [91, 34, 1.7], [96, 80, 3.8],
  ];

  const build = () => {
    const header = document.createElement("header");
    header.className = "ateam-bandeau";
    header.setAttribute("aria-label", "Vibe Creators");

    const frame = document.createElement("div");
    frame.className = "ateam-bandeau__panneau";

    for (const [x, y, delay] of STARS) {
      const star = document.createElement("span");
      star.className = "ateam-etoile";
      star.setAttribute("aria-hidden", "true");
      star.style.cssText = `--x:${x}%;--y:${y}%;--d:${delay}s`;
      frame.append(star);
    }
    for (const name of ["ateam-rails", "ateam-lueur"]) {
      const layer = document.createElement("span");
      layer.className = name;
      layer.setAttribute("aria-hidden", "true");
      frame.append(layer);
    }

    const content = document.createElement("div");
    content.className = "ateam-bandeau__contenu";

    const brand = document.createElement("a");
    brand.className = "ateam-marque";
    brand.href = "/";
    brand.setAttribute("aria-label", "Vibe Creators — accueil de la bibliothèque");

    const plate = document.createElement("span");
    plate.className = "ateam-plaque";
    const logo = document.createElement("img");
    logo.src = "/ateam/a-team.svg";
    logo.alt = "The A Team";
    logo.width = 2135;
    logo.height = 915;
    logo.decoding = "async";
    plate.append(logo);

    const titles = document.createElement("span");
    titles.className = "ateam-titres";
    const name = document.createElement("strong");
    name.className = "ateam-nom";
    name.textContent = "Vibe Creators";
    const beta = document.createElement("span");
    beta.className = "ateam-beta";
    beta.textContent = "Bêta";
    beta.title = "Version bêta : la bibliothèque évolue encore.";
    name.append(beta);
    const subtitle = document.createElement("span");
    subtitle.className = "ateam-sous-titre";
    subtitle.innerHTML = '<span class="ateam-long">La bibliothèque de composants IA · </span>Équipe IA Innovation TGV';
    titles.append(name, subtitle);
    brand.append(plate, titles);

    const inoui = document.createElement("img");
    inoui.className = "ateam-inoui";
    inoui.src = "/ateam/inoui-white.png";
    inoui.alt = "TGV INOUI";
    inoui.width = 1035;
    inoui.height = 480;
    inoui.decoding = "async";

    content.append(brand, inoui);
    frame.append(content);
    header.append(frame);
    return header;
  };

  // The site pins its sidebar and sticky bars below --banner-h. Feed it the part of
  // the masthead still on screen, so they sit under it at the top of the page and
  // rise with it as the page scrolls.
  const track = (header) => {
    let queued = false;
    const update = () => {
      queued = false;
      const visible = Math.max(0, Math.round(header.getBoundingClientRect().bottom));
      document.documentElement.style.setProperty("--banner-h", `${visible}px`);
    };
    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule, { passive: true });
    if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(header);
    update();
  };

  const mount = () => {
    if (document.querySelector(".ateam-bandeau")) return;
    const root = document.getElementById("root");
    if (!root || !root.parentNode) return;
    const header = build();
    root.parentNode.insertBefore(header, root);
    track(header);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
