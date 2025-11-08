// ===== Language Switcher =====
function switchLanguage(lang) {
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  document.body.setAttribute("lang", lang);

  document.querySelectorAll("[data-en]").forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });

  document.querySelectorAll(".lang-btn").forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.getElementById(`lang-${lang}`);
  if (activeBtn) activeBtn.classList.add("active");

  localStorage.setItem("language", lang);
}

// ===== Load Menu from JSON =====
async function loadMenu() {
  const container = document.getElementById('menuSections');
  const tabsContainer = document.querySelector('.tabs');
  if (!container || !tabsContainer) return;

  try {
    const res = await fetch('menu.json');
    const items = await res.json();

    container.innerHTML = '';
    tabsContainer.innerHTML = '';

    const sectionsMap = {};
    const categoriesMap = {};

    // إنشاء تاب "الكل"
    const allTab = document.createElement('button');
    allTab.className = 'tab-btn active';
    allTab.dataset.tab = 'all';
    allTab.dataset.en = 'All';
    allTab.dataset.ar = 'الكل';
    allTab.textContent = allTab.dataset.en;
    tabsContainer.appendChild(allTab);

    items.forEach(item => {
      if (!categoriesMap[item.category]) {
        const btn = document.createElement('button');
        btn.className = 'tab-btn';
        btn.dataset.tab = item.category;
        btn.dataset.en = item.enCategory || item.category;
        btn.dataset.ar = item.arCategory || item.category;
        btn.textContent = btn.dataset.en;
        tabsContainer.appendChild(btn);

        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'menu-section';
        sectionDiv.id = item.category;

        const h2 = document.createElement('h2');
        h2.className = 'section-title';
        h2.dataset.en = item.enCategory || item.category;
        h2.dataset.ar = item.arCategory || item.category;
        h2.textContent = h2.dataset.en;

        const grid = document.createElement('div');
        grid.className = 'menu-grid';

        sectionDiv.appendChild(h2);
        sectionDiv.appendChild(grid);
        container.appendChild(sectionDiv);

        sectionsMap[item.category] = grid;
        categoriesMap[item.category] = true;
      }

      const div = document.createElement('div');
      div.className = 'menu-item';

      // صورة المنتج
      const img = document.createElement('img');
      img.src = item.image || 'photo/placeholder.png';
      img.alt = item.enName;
      img.className = 'product-image';
      div.appendChild(img);

      // اسم المنتج
      const h3 = document.createElement('h3');
      h3.className = 'product-name';
      h3.dataset.en = item.enName;
      h3.dataset.ar = item.arName;
      h3.textContent = item.enName;
      div.appendChild(h3);

      // وصف المنتج
      const desc = document.createElement('p');
      desc.className = 'product-description';
      desc.dataset.en = item.enDescription;
      desc.dataset.ar = item.arDescription;
      desc.textContent = item.enDescription;
      div.appendChild(desc);

      // السعر كنص (SAR / ريال)
      const price = document.createElement('p');
      price.className = 'product-price';
      price.dataset.en = item.price + ' SAR';
      price.dataset.ar = item.price + ' ريال';

      const lang = document.documentElement.getAttribute("lang") || "en";
      price.textContent = lang === "ar" ? `${item.price} ريال` : `${item.price} SAR`;

      div.appendChild(price);

      // السعرات الحرارية
      const cal = document.createElement('p');
      cal.className = 'product-calories';
      cal.dataset.en = item.calories ? item.calories + ' cal' : '';
      cal.dataset.ar = item.calories ? item.calories + ' سعرة حرارية' : '';
      cal.textContent = item.calories ? item.calories + ' cal' : '';
      div.appendChild(cal);

      sectionsMap[item.category].appendChild(div);
    });

    // التابز
    const tabs = document.querySelectorAll(".tab-btn");
    const sections = document.querySelectorAll(".menu-section");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        if (tab.dataset.tab === "all") {
          sections.forEach(s => s.classList.add("active"));
        } else {
          sections.forEach(s => {
            s.classList.remove("active");
            if (s.id === tab.dataset.tab) s.classList.add("active");
          });
        }
      });
    });
    sections.forEach(s => s.classList.add("active"));

    // تطبيق اللغة بعد إنشاء العناصر
    const savedLanguage = localStorage.getItem("language") || "en";
    switchLanguage(savedLanguage);

  } catch (err) {
    console.error('Error loading menu:', err);
  }
}

// ===== Page Initialization =====
document.addEventListener("DOMContentLoaded", () => {
  const savedLanguage = localStorage.getItem("language") || "en";
  switchLanguage(savedLanguage);

  loadMenu();

  const langEnBtn = document.getElementById("lang-en");
  if (langEnBtn) langEnBtn.addEventListener("click", () => switchLanguage('en'));

  const langArBtn = document.getElementById("lang-ar");
  if (langArBtn) langArBtn.addEventListener("click", () => switchLanguage('ar'));

  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) backToTopBtn.classList.add("show");
      else backToTopBtn.classList.remove("show");
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const locationBtn = document.getElementById('locationBtn');
  const popup = document.getElementById('locationPopup');
  const closeBtn = popup ? popup.querySelector('.close-btn') : null;
  if (locationBtn && popup && closeBtn) {
    locationBtn.addEventListener('click', () => { popup.style.display = 'flex'; });
    closeBtn.addEventListener('click', () => { popup.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === popup) popup.style.display = 'none'; });
  }
});
