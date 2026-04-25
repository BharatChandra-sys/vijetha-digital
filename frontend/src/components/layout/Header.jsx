import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import api from "../../api/axios";

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stemToken = (token) => {
  if (!token) return "";
  if (token.endsWith("ies") && token.length > 4) return `${token.slice(0, -3)}y`;
  if (token.endsWith("es") && token.length > 4) return token.slice(0, -2);
  if (token.endsWith("s") && token.length > 3) return token.slice(0, -1);
  return token;
};

const levenshteinDistance = (a, b) => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[a.length][b.length];
};

const tokenSimilarity = (a, b) => {
  const left = stemToken(normalizeText(a));
  const right = stemToken(normalizeText(b));
  if (!left || !right) return 0;
  if (left === right) return 1;
  if (left.includes(right) || right.includes(left)) return 0.92;
  const distance = levenshteinDistance(left, right);
  return 1 - distance / Math.max(left.length, right.length);
};

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Header-attached search panel state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [sliceOrigin, setSliceOrigin] = useState(80);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchButtonRef = useRef(null);
  const searchPanelRef = useRef(null);
  const searchOverlayRef = useRef(null);
  const searchResultsCardRef = useRef(null);

  const cartCount = items?.length ?? 0;
  const loginUrl = `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`;

  const avatarLetter = user
    ? (user.full_name?.[0] || user.email?.[0] || "?").toUpperCase()
    : "?";

  const topSuggestions = useMemo(() => ["Sign Boards", "Banners", "Business Cards", "Printing"], []);

  const searchablePages = useMemo(() => {
    const basePages = [
      { key: "home", title: "Home", path: "/", hint: "landing main page", icon: "home" },
      { key: "products", title: "Products", path: "/products", hint: "all product catalog", icon: "inventory_2" },
      { key: "about", title: "About", path: "/about", hint: "company and story", icon: "info" },
      { key: "contact", title: "Contact", path: "/contact", hint: "phone email address", icon: "call" },
      { key: "cart", title: "Cart", path: "/cart", hint: "shopping cart checkout", icon: "shopping_cart" },
      { key: "services", title: "Services", path: "/products", hint: "printing service options", icon: "design_services" },
    ];

    const authPages = user
      ? [
          { key: "profile", title: "My Profile", path: "/profile", hint: "account profile settings", icon: "person" },
          { key: "orders", title: "My Orders", path: "/orders", hint: "track order history", icon: "receipt_long" },
        ]
      : [{ key: "login", title: "Log In", path: loginUrl, hint: "sign in access account", icon: "login" }];

    const adminPages = isAdmin
      ? [{ key: "admin", title: "Admin Dashboard", path: "/admin/dashboard", hint: "admin management panel", icon: "admin_panel_settings" }]
      : [];

    return [...basePages, ...authPages, ...adminPages];
  }, [user, isAdmin, loginUrl]);

  const keywordSynonyms = useMemo(
    () => ({
      banner: ["flex", "vinyl", "hoarding", "standee"],
      banners: ["banner", "flex", "vinyl", "hoarding", "standee"],
      business: ["visiting", "corporate", "office"],
      cards: ["card", "visiting", "id", "brochure", "flyer"],
      board: ["sign", "acp", "led", "nameplate"],
      sign: ["board", "nameplate", "acrylic", "acp", "led"],
      printing: ["print", "offset", "digital", "press"],
    }),
    []
  );

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    logout();
  };

  const updateSliceOrigin = () => {
    if (!searchButtonRef.current || !searchPanelRef.current) return;
    const buttonRect = searchButtonRef.current.getBoundingClientRect();
    const panelRect = searchPanelRef.current.getBoundingClientRect();
    if (!panelRect.width) return;

    const iconCenterX = buttonRect.left + buttonRect.width / 2;
    const originPercent = ((iconCenterX - panelRect.left) / panelRect.width) * 100;
    const clamped = Math.max(8, Math.min(92, originPercent));
    setSliceOrigin(clamped);
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const insideSearchBar = searchRef.current && searchRef.current.contains(e.target);
      const insideResultsCard = searchResultsCardRef.current && searchResultsCardRef.current.contains(e.target);
      if (!insideSearchBar && !insideResultsCard) {
        setShowSearch(false);
      }
    };

    if (showSearch) {
      document.addEventListener("mousedown", handler);
    }

    return () => document.removeEventListener("mousedown", handler);
  }, [showSearch]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") {
        setShowSearch(false);
      }
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  useEffect(() => {
    if (showSearch) {
      updateSliceOrigin();
      const timer = setTimeout(() => searchInputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [showSearch]);

  useEffect(() => {
    updateSliceOrigin();
    const onResize = () => updateSliceOrigin();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const loadProductsOnce = async () => {
      if (!showSearch || productsLoaded) return;
      try {
        const res = await api.get("/products");
        setAllProducts(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to preload products for header search", error);
      } finally {
        setProductsLoaded(true);
      }
    };

    loadProductsOnce();
  }, [showSearch, productsLoaded]);

  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const queryNormalized = normalizeText(query);
      const queryTokens = queryNormalized.split(" ").filter(Boolean).map(stemToken);
      const expandedQueryTokens = Array.from(
        new Set(
          queryTokens.flatMap((token) => [token, ...(keywordSynonyms[token] || []).map(stemToken)])
        )
      );

      const rankedProducts = (allProducts || [])
        .map((p) => {
          const name = normalizeText(p.name || "");
          const category = normalizeText(p.category || "");
          const description = normalizeText(p.description || "");

          const haystack = `${name} ${category} ${description}`.trim();
          const haystackTokens = haystack.split(" ").filter(Boolean).map(stemToken);

          let score = 0;

          if (name.includes(queryNormalized)) score += 100;
          if (category.includes(queryNormalized)) score += 75;
          if (description.includes(queryNormalized)) score += 40;

          expandedQueryTokens.forEach((qt) => {
            const bestTokenScore = haystackTokens.reduce((best, ht) => Math.max(best, tokenSimilarity(qt, ht)), 0);
            score += bestTokenScore * 28;
          });

          if (queryTokens.every((qt) => haystackTokens.some((ht) => ht.includes(qt) || qt.includes(ht)))) {
            score += 30;
          }

          return {
            type: "product",
            data: p,
            score,
            title: p.name || "Unnamed product",
            subtitle: p.category || "General",
          };
        })
        .filter((x) => x.score >= 10);

      const rankedPages = searchablePages
        .map((page) => {
          const title = normalizeText(page.title);
          const hint = normalizeText(page.hint);
          const haystack = `${title} ${hint}`.trim();
          const haystackTokens = haystack.split(" ").filter(Boolean).map(stemToken);

          let score = 0;
          if (title.includes(queryNormalized)) score += 120;
          if (hint.includes(queryNormalized)) score += 60;

          expandedQueryTokens.forEach((qt) => {
            const bestTokenScore = haystackTokens.reduce((best, ht) => Math.max(best, tokenSimilarity(qt, ht)), 0);
            score += bestTokenScore * 30;
          });

          return {
            type: "page",
            data: page,
            score,
            title: page.title,
            subtitle: "Page",
          };
        })
        .filter((x) => x.score >= 16);

      const ranked = [...rankedPages, ...rankedProducts].sort((a, b) => b.score - a.score);

      const strongMatches = ranked.filter((x) => x.score >= 24).slice(0, 10);
      const nearMatches = ranked.filter((x) => x.score >= 12).slice(0, 10);
      const fallbackMatches = ranked.slice(0, 8);

      const finalResults = strongMatches.length
        ? strongMatches
        : nearMatches.length
          ? nearMatches
          : fallbackMatches;

      setSearchResults(finalResults);
    } catch (error) {
      console.error("Search failed", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, [allProducts, keywordSynonyms, searchablePages]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (showSearch) {
        performSearch(searchQuery);
      }
    }, 240);

    return () => clearTimeout(debounce);
  }, [searchQuery, showSearch, performSearch]);

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const hasQuery = searchQuery.trim().length > 0;
  const hasResults = hasQuery && searchResults.length > 0;
  const dynamicPanelHeightClass = !hasQuery
    ? "max-h-[300px]"
    : hasResults
      ? "max-h-[calc(100vh-150px)]"
      : "max-h-[380px]";

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer with slide animation */}
          <div className="relative h-full w-[82%] max-w-[320px] overflow-y-auto bg-white shadow-2xl flex flex-col slide-in-left">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-border/60">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                <img src="/vd-logo.jpeg" alt="Vijetha Digital" className="h-9 w-9 flex-shrink-0 rounded-xl object-cover shadow-sm" />
                <span className="text-sm font-bold tracking-tight text-plum-deep">VIJETHA DIGITAL</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-light transition-colors"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined text-plum-deep text-xl">close</span>
              </button>
            </div>

            {/* Search shortcut */}
            <button
              onClick={() => { setMobileOpen(false); setShowSearch(true); }}
              className="mx-4 mt-4 flex items-center gap-3 rounded-xl border border-stone-border bg-stone-light/60 px-4 py-3 text-sm font-medium text-text-muted hover:border-plum-deep/30 hover:text-plum-deep transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-plum-deep/50">search</span>
              Search products…
            </button>

            {/* Nav links */}
            <nav className="flex flex-col px-3 mt-4 flex-1">
              {[
                { label: "Products",     to: "/products",  icon: "inventory_2" },
                { label: "About",        to: "/about",     icon: "info" },
                { label: "Contact",      to: "/contact",   icon: "call" },
                { label: "For Business", to: "/register",  icon: "business" },
              ].map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-base font-semibold text-text-dark hover:bg-stone-light hover:text-plum-deep transition-colors"
                >
                  <span className="material-symbols-outlined text-xl text-plum-deep/50">{l.icon}</span>
                  {l.label}
                </Link>
              ))}

              {user && (
                <>
                  <div className="h-px bg-stone-border/60 my-2 mx-3" />
                  <Link to="/profile" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-base font-semibold text-text-dark hover:bg-stone-light hover:text-plum-deep transition-colors">
                    <span className="material-symbols-outlined text-xl text-plum-deep/50">person</span>
                    My Profile
                  </Link>
                  {user.role === "customer" && (
                    <Link to="/orders" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-base font-semibold text-text-dark hover:bg-stone-light hover:text-plum-deep transition-colors">
                      <span className="material-symbols-outlined text-xl text-plum-deep/50">receipt_long</span>
                      My Orders
                    </Link>
                  )}
                  <Link to="/cart" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-base font-semibold text-text-dark hover:bg-stone-light hover:text-plum-deep transition-colors">
                    <span className="material-symbols-outlined text-xl text-plum-deep/50">shopping_cart</span>
                    Cart
                    {cartCount > 0 && (
                      <span className="ml-auto text-xs font-bold bg-coral-accent text-white rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
                    )}
                  </Link>
                  {isAdmin && (
                    <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-base font-semibold text-text-dark hover:bg-stone-light hover:text-plum-deep transition-colors">
                      <span className="material-symbols-outlined text-xl text-plum-deep/50">admin_panel_settings</span>
                      Admin Dashboard
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Bottom CTA */}
            <div className="px-4 pb-6 pt-4 border-t border-stone-border/60 space-y-3 mt-auto">
              {!user ? (
                <>
                  <Link to={loginUrl} onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center w-full h-11 rounded-xl border-2 border-plum-deep font-bold text-plum-deep hover:bg-plum-deep hover:text-white transition-all">
                    Log In
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center w-full h-11 rounded-xl bg-coral-accent font-bold text-white shadow-md hover:bg-coral-dark transition-all">
                    Get Custom Quote
                  </Link>
                </>
              ) : (
                <button onClick={handleLogout}
                  className="flex items-center gap-2 w-full h-11 px-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                  <span className="material-symbols-outlined text-base">logout</span>
                  Log Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="sticky top-0 z-40 border-b border-stone-border bg-warm-white/95 font-display backdrop-blur-md supports-[backdrop-filter]:bg-warm-white/80">
        <div className="relative mx-auto flex max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center lg:hidden">
            <button className="p-1 text-plum-deep transition-colors hover:text-coral-accent" onClick={() => setMobileOpen(true)}>
              <span className="material-symbols-outlined text-[1.625rem]">menu</span>
            </button>
          </div>

          <Link to="/" className="flex items-center gap-2 lg:mx-0">
            <img src="/vd-logo.jpeg" alt="Vijetha Digital" className="h-9 w-9 flex-shrink-0 rounded-xl object-cover shadow-sm" />
            <span className="text-sm font-bold tracking-tight text-plum-deep">VIJETHA DIGITAL</span>
          </Link>

          <div className={`hidden items-center gap-7 text-sm font-medium text-text-muted transition-all duration-300 lg:flex ${showSearch ? "pointer-events-none -translate-x-4 opacity-0" : "translate-x-0 opacity-100"}`}>
            <Link to="/products" className="transition-colors hover:text-plum-deep">Products</Link>
            <Link to="/about" className="transition-colors hover:text-plum-deep">About</Link>
            <Link to="/contact" className="transition-colors hover:text-plum-deep">Contact</Link>
            <Link to="/products" className="transition-colors hover:text-plum-deep">Services</Link>
            <Link to="/register" className="transition-colors hover:text-plum-deep">For Business</Link>
          </div>

          {/* Icon-Anchored Chat Search Box Through Nav Links */}
          <div ref={searchRef} className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[min(780px,54vw)] -translate-x-1/2 items-center lg:flex">
            <div
              ref={searchPanelRef}
              className={`pointer-events-auto flex w-full items-center gap-2 rounded-2xl border border-plum-deep/20 bg-white/85 px-3 py-2 shadow-lg backdrop-blur-xl transform-gpu transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                showSearch
                  ? "translate-x-0 scale-x-100 opacity-100"
                  : "pointer-events-none -translate-x-16 scale-x-75 opacity-0"
              }`}
              style={{
                transformOrigin: `${sliceOrigin}% center`,
                clipPath: showSearch
                  ? "inset(0 0 0 0 round 16px)"
                  : `inset(0 ${Math.max(0, 100 - sliceOrigin)}% 0 ${Math.max(0, sliceOrigin)}% round 16px)`,
              }}
            >
              <span className="material-symbols-outlined text-plum-deep/55">search</span>
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, categories, printing services..."
                className="w-full border-0 bg-transparent text-sm text-plum-deep outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 placeholder:text-plum-deep/45"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="rounded-md p-1 text-plum-deep/50 transition-colors hover:bg-plum-deep/10 hover:text-plum-deep"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              ) : null}
              <button
                onClick={closeSearch}
                className="rounded-lg border border-plum-deep/20 bg-plum-deep/10 px-2.5 py-1 text-xs font-semibold text-plum-deep transition-colors hover:bg-plum-deep hover:text-white"
              >
                Close
              </button>
            </div>
          </div>

          {/* Trailing glow line from icon anchor */}
          <div
            className={`pointer-events-none absolute -bottom-[1px] hidden h-[3px] rounded-full bg-gradient-to-r from-transparent via-coral-accent to-plum-light blur-[1px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block ${showSearch ? "opacity-100" : "opacity-0"}`}
            style={{
              left: `${sliceOrigin}%`,
              width: showSearch ? "320px" : "0px",
              transform: `translateX(${showSearch ? "-35%" : "-50%"})`,
            }}
          />
          <div
            className={`pointer-events-none absolute -bottom-[3px] hidden h-[8px] rounded-full bg-gradient-to-r from-transparent via-plum-light/60 to-transparent blur-md transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block ${showSearch ? "opacity-80" : "opacity-0"}`}
            style={{
              left: `${sliceOrigin}%`,
              width: showSearch ? "420px" : "0px",
              transform: `translateX(${showSearch ? "-30%" : "-50%"})`,
            }}
          />

          <div className="flex items-center gap-1.5">
            {/* Search — mobile shows always, desktop shows when search not open */}
            <button
              ref={searchButtonRef}
              onClick={() => setShowSearch((v) => !v)}
              className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all ${
                showSearch
                  ? "pointer-events-none scale-90 border-plum-deep bg-plum-deep text-white opacity-0 hidden"
                  : "border-transparent lg:border-stone-border text-plum-deep hover:text-coral-accent hover:bg-stone-light lg:hover:border-plum-deep/40"
              }`}
              aria-label="Search products"
            >
              <span className="material-symbols-outlined text-[1.25rem]">search</span>
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center w-9 h-9 rounded-full text-plum-deep hover:text-coral-accent hover:bg-stone-light transition-all"
              aria-label="Cart"
            >
              <span className="material-symbols-outlined text-[1.25rem]">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-coral-accent text-[9px] font-bold text-white leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile: avatar if logged in */}
            {user && (
              <div className="relative lg:hidden" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-plum-deep text-white text-xs font-bold"
                  aria-label="Account"
                >
                  {avatarLetter}
                </button>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="fixed z-50 overflow-hidden rounded-xl border border-stone-border bg-white shadow-card-enhanced dropdown-enter"
                      style={{ top: 60, right: 12, minWidth: 192, maxWidth: "calc(100vw - 24px)" }}>
                      <div className="px-4 py-2.5 border-b border-stone-border/60 bg-stone-light/40">
                        <p className="text-[0.875rem] font-bold text-plum-deep leading-tight truncate">{user.full_name || "User"}</p>
                        <p className="text-[0.6875rem] text-text-muted mt-0.5 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[0.875rem] font-medium text-text-dark hover:bg-stone-light hover:text-plum-deep transition-colors">
                          <span className="material-symbols-outlined text-[1.125rem] text-text-muted flex-shrink-0">person</span>My Profile
                        </Link>
                        {user.role === "customer" && (
                          <Link to="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[0.875rem] font-medium text-text-dark hover:bg-stone-light hover:text-plum-deep transition-colors">
                            <span className="material-symbols-outlined text-[1.125rem] text-text-muted flex-shrink-0">receipt_long</span>My Orders
                          </Link>
                        )}
                        <Link to="/cart" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[0.875rem] font-medium text-text-dark hover:bg-stone-light hover:text-plum-deep transition-colors">
                          <span className="material-symbols-outlined text-[1.125rem] text-text-muted flex-shrink-0">shopping_cart</span>
                          Cart {cartCount > 0 && <span className="ml-auto text-[0.6875rem] font-bold text-coral-accent">{cartCount}</span>}
                        </Link>
                        {isAdmin && (
                          <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[0.875rem] font-medium text-text-dark hover:bg-stone-light hover:text-plum-deep transition-colors">
                            <span className="material-symbols-outlined text-[1.125rem] text-text-muted flex-shrink-0">admin_panel_settings</span>Admin
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-stone-border/60">
                        <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2.5 text-[0.875rem] font-semibold text-red-500 hover:bg-red-50 transition-colors">
                          <span className="material-symbols-outlined text-[1.125rem] flex-shrink-0">logout</span>Log Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Desktop: login / user dropdown */}
            {!user ? (
              <>
                <Link to={loginUrl} className="hidden text-sm font-semibold text-plum-deep transition-colors hover:text-coral-accent lg:block">
                  Log In
                </Link>
                <Link to="/products" className="hidden rounded-full bg-coral-accent px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-coral-dark lg:block">
                  Get Quote
                </Link>
              </>
            ) : (
              <div className="relative hidden lg:block" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-stone-border bg-white px-3 py-1.5 shadow-sm transition-colors hover:border-plum-deep/40"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-plum-deep text-xs font-bold text-white">
                    {avatarLetter}
                  </div>
                  <span className="hidden max-w-[90px] truncate text-sm font-semibold text-plum-deep sm:block">
                    {user.full_name?.split(" ")[0] || user.email}
                  </span>
                  <span className="material-symbols-outlined text-sm text-text-muted">expand_more</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 z-50 mt-1.5 w-52 overflow-hidden rounded-xl border border-stone-border bg-white shadow-card-enhanced dropdown-enter">
                    <div className="px-4 py-2.5 border-b border-stone-border/60 bg-stone-light/40">
                      <p className="text-[0.875rem] font-bold text-plum-deep leading-tight truncate max-w-[180px]">{user.full_name || "User"}</p>
                      <p className="text-[0.6875rem] text-text-muted mt-0.5 truncate max-w-[180px]">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-[0.875rem] font-medium text-text-dark hover:bg-stone-light hover:text-plum-deep transition-colors">
                        <span className="material-symbols-outlined text-[1.125rem] text-text-muted flex-shrink-0">person</span>My Profile
                      </Link>
                      {user.role === "customer" && (
                        <Link to="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-[0.875rem] font-medium text-text-dark hover:bg-stone-light hover:text-plum-deep transition-colors">
                          <span className="material-symbols-outlined text-[1.125rem] text-text-muted flex-shrink-0">receipt_long</span>My Orders
                        </Link>
                      )}
                      <Link to="/cart" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-[0.875rem] font-medium text-text-dark hover:bg-stone-light hover:text-plum-deep transition-colors">
                        <span className="material-symbols-outlined text-[1.125rem] text-text-muted flex-shrink-0">shopping_cart</span>
                        Cart {cartCount > 0 && <span className="ml-auto text-[0.6875rem] font-bold text-coral-accent">{cartCount}</span>}
                      </Link>
                      {isAdmin && (
                        <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-[0.875rem] font-medium text-text-dark hover:bg-stone-light hover:text-plum-deep transition-colors">
                          <span className="material-symbols-outlined text-[1.125rem] text-text-muted flex-shrink-0">admin_panel_settings</span>Admin
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-stone-border/60">
                      <button onClick={handleLogout} className="flex w-full items-center gap-2.5 px-4 py-2 text-[0.875rem] font-semibold text-red-500 hover:bg-red-50 transition-colors">
                        <span className="material-symbols-outlined text-[1.125rem] flex-shrink-0">logout</span>Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Interactive Results Panel */}
        <div ref={searchOverlayRef} className={`absolute left-0 right-0 top-full z-[45] bg-transparent transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${showSearch ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"}`}>
          <div className="mx-auto w-full max-w-[1280px] px-3 pb-5 pt-4 sm:px-6 lg:px-8">
            <div ref={searchResultsCardRef} className={`relative flex ${dynamicPanelHeightClass} flex-col overflow-hidden rounded-3xl border border-stone-border/70 bg-warm-white/95 shadow-[0_16px_34px_rgba(26,22,46,0.14)] ring-1 ring-black/5 transition-all duration-300 ${!searchQuery.trim() ? "mx-auto w-full max-w-4xl" : ""}`}>
              <div className="border-b border-stone-border/50 p-3 lg:hidden">
                <div className="relative flex items-center gap-2 rounded-xl border border-plum-deep/25 bg-white px-3 py-2">
                  <span className="material-symbols-outlined text-plum-deep/55">search</span>
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, categories, printing services..."
                    className="w-full border-0 bg-transparent text-sm text-plum-deep outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 placeholder:text-plum-deep/45"
                  />
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="rounded-md p-1 text-plum-deep/50 transition-colors hover:bg-plum-deep/10 hover:text-plum-deep"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  ) : null}
                </div>
              </div>

              <div className={`${hasResults ? "search-scrollbar overflow-y-auto" : "overflow-hidden"} p-4 sm:p-5`}>
                {searchLoading && (
                  <div className="flex items-center gap-2 py-10 text-sm font-medium text-text-muted">
                    <span className="material-symbols-outlined animate-spin text-plum-deep/60">autorenew</span>
                    Searching products...
                  </div>
                )}

                {!searchLoading && !searchQuery.trim() && (
                  <div className="grid min-h-[190px] place-items-center px-2 py-3 sm:min-h-[210px] sm:px-4">
                    <div className="mx-auto flex w-[min(860px,92%)] flex-col items-center rounded-3xl border border-stone-border/70 bg-white/96 px-6 py-8 text-center shadow-[0_14px_36px_rgba(30,22,54,0.14)] ring-1 ring-black/5 sm:px-10 sm:py-10">
                      <span className="material-symbols-outlined text-5xl text-plum-deep/40">travel_explore</span>
                      <p className="mt-2 text-3xl font-black tracking-tight text-plum-deep/95 sm:text-4xl">Search Anything</p>
                      <p className="mt-1 max-w-2xl text-sm text-plum-deep/60">Type a product name, category, or service keyword to get results.</p>
                      <div className="mt-5 flex w-full max-w-2xl flex-wrap items-center justify-center gap-2 sm:mt-6">
                        {[...topSuggestions, "Profile", "Contact"].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSearchQuery(tag)}
                            className="rounded-full border border-plum-deep/30 bg-white px-3 py-1.5 text-xs font-semibold text-plum-deep transition-all hover:-translate-y-0.5 hover:border-plum-deep hover:bg-plum-deep hover:text-white"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!searchLoading && searchQuery.trim() && searchResults.length === 0 && (
                  <div className="rounded-xl border border-stone-border/70 bg-white/90 p-6 text-center">
                    <span className="material-symbols-outlined text-5xl text-plum-deep/30">search_off</span>
                    <p className="mt-3 text-lg font-bold text-plum-deep">No matching products</p>
                    <p className="text-sm text-text-muted">Try a different keyword like banner, board, card, or flex.</p>
                  </div>
                )}

                {!searchLoading && searchResults.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {searchResults.map((item, idx) => {
                      if (item.type === "page") {
                        const page = item.data;
                        return (
                          <button
                            key={`${page.key}-${idx}`}
                            onClick={() => {
                              navigate(page.path);
                              closeSearch();
                            }}
                            className="group rounded-xl border border-stone-border/80 bg-white/90 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-plum-deep/40 hover:shadow-md"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-plum-deep/10 text-plum-deep">
                                <span className="material-symbols-outlined text-[20px]">{page.icon}</span>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-plum-deep">{page.title}</p>
                                <p className="text-xs text-text-muted">Open page</p>
                              </div>
                            </div>
                          </button>
                        );
                      }

                      const product = item.data;
                      const image = product.image_url || product.imageUrl || null;
                      const price = Number(product.base_price ?? product.basePrice ?? 0);
                      return (
                        <button
                          key={product.id || `${product.name}-${idx}`}
                          onClick={() => {
                            navigate(`/products/${product.id}`);
                            closeSearch();
                          }}
                          className="group rounded-xl border border-stone-border/80 bg-white/80 p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-plum-deep/40 hover:shadow-md"
                        >
                          <div className="mb-3 h-28 overflow-hidden rounded-lg bg-stone-light">
                            {image ? (
                              <img src={image} alt={product.name || "Product"} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-text-muted">
                                <span className="material-symbols-outlined text-4xl">inventory_2</span>
                              </div>
                            )}
                          </div>
                          <p className="line-clamp-1 text-sm font-bold text-plum-deep">{product.name || "Unnamed product"}</p>
                          <p className="mt-1 line-clamp-1 text-xs text-text-muted">{product.category || "General"}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="rounded-md bg-plum-deep/10 px-2 py-1 text-[11px] font-semibold text-plum-deep">{product.unit || "Custom"}</span>
                            <span className="text-sm font-extrabold text-coral-accent">Rs {price.toLocaleString("en-IN")}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
