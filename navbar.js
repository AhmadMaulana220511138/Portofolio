
(async function () {
    const container = document.getElementById("navbar-container");

    if (!container) {
        console.error("Elemen #navbar-container tidak ditemukan.");
        return;
    }

    try {
        // Muat navbar.html terlebih dahulu
        const response = await fetch("./navbar.html");

        if (!response.ok) {
            throw new Error("Gagal memuat navbar.html: " + response.status);
        }

        const html = await response.text();

        // Masukkan HTML navbar ke halaman
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Pindahkan CSS navbar ke halaman utama
        doc.querySelectorAll("style").forEach((style) => {
            document.head.appendChild(style.cloneNode(true));
        });

        const navbar = doc.querySelector("#mainNavbar");

        if (!navbar) {
            throw new Error("Elemen #mainNavbar tidak ditemukan di navbar.html.");
        }

        container.replaceChildren(navbar);

        // Jalankan efek navbar setelah elemen tersedia
        const links = Array.from(navbar.querySelectorAll(".nav-link"));

        // Efek navbar saat halaman di-scroll
        const onScroll = () => {
            navbar.classList.toggle("scrolled", window.scrollY > 20);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        // Menentukan menu aktif
        const page = (
            window.location.pathname.split("/").pop() || "index.html"
        ).toLowerCase();

        if (page === "index.html") {
            const sections = document.querySelectorAll("section[id]");

            if ("IntersectionObserver" in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;

                        links.forEach((link) => {
                            const href = link.getAttribute("href");

                            link.classList.toggle(
                                "active",
                                href.endsWith("#" + entry.target.id)
                            );
                        });
                    });
                }, {
                    rootMargin: "-25% 0px -60% 0px"
                });

                sections.forEach((section) => observer.observe(section));
            }
        } else {
            links.forEach((link) => {
                const target = link
                    .getAttribute("href")
                    .split("#")[0]
                    .toLowerCase();

                link.classList.toggle("active", target === page);
            });
        }

        // Tutup menu mobile setelah link diklik
        links.forEach((link) => {
            link.addEventListener("click", () => {
                const menu = document.getElementById("navbarMenu");

                if (
                    window.innerWidth < 992 &&
                    menu &&
                    menu.classList.contains("show") &&
                    window.bootstrap
                ) {
                    window.bootstrap.Collapse
                        .getOrCreateInstance(menu)
                        .hide();
                }
            });
        });

        console.log("Navbar berhasil dimuat!");

    } catch (error) {
        console.error("Navbar gagal dimuat:", error);
        container.innerHTML =
            '<p style="color:red">Navbar gagal dimuat. Periksa Console browser.</p>';
    }
})();
