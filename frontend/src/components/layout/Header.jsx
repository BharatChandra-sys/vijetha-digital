import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import api from "../../api/axios";
import { BUSINESS, CATEGORIES, CATEGORY_LINK, rupees, unitLabel } from "../../config/business";

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
  const [activeResult, setActiveResult] = useState(-1);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

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
      if (!insideSearchBar) {
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
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
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
    setActiveResult(-1);
  };

  const hasQuery = searchQuery.trim().length > 0;

  const resultPath = (item) =>
    item.type === "page" ? item.data.path : `/products/${item.data.id}`;

  const openMobileSearch = () => {
    setShowSearch(true);
    // The input is display:none until this render commits
    setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const onSearchKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveResult((i) => Math.min(i + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveResult((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = searchResults[activeResult] || searchResults[0];
      if (target) {
        navigate(resultPath(target));
      } else if (hasQuery) {
        navigate("/products");
      }
      closeSearch();
      searchInputRef.current?.blur();
    }
  };

  const activeCategory = location.pathname === "/products"
    ? new URLSearchParams(location.search).get("category") ?? ""
    : null;

  const navLinkClass = (active) =>
    `flex items-center h-11 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
      active ? "border-accent font-semibold text-ink" : "border-transparent text-ink-2 hover:text-ink"
    }`;

  const closeMenus = () => {
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  const accountLinks = user ? [
    { to: "/profile", icon: "person", label: "My Profile" },
    ...(user.role === "customer" ? [{ to: "/orders", icon: "receipt_long", label: "My Orders" }] : []),
    { to: "/cart", icon: "shopping_cart", label: "Cart", count: cartCount },
    ...(isAdmin ? [{ to: "/admin/dashboard", icon: "admin_panel_settings", label: "Admin Dashboard" }] : []),
  ] : [];

  const drawerRow = "flex items-center gap-3 min-h-[48px] px-3 rounded-lg text-[0.9375rem] font-medium text-ink hover:bg-shade transition-colors";

  return (
    <>
      <a href="#main" className="vd-skip">Skip to content</a>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-ink/50 animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="relative flex h-full w-[86%] max-w-[340px] flex-col overflow-y-auto overscroll-contain bg-surface slide-in-left">
            <div className="flex items-center justify-between border-b border-line px-4 h-14 flex-shrink-0">
              <Link to="/" onClick={closeMenus} className="flex items-center gap-2.5">
                <img src="/vd-logo.jpeg" alt="" width="32" height="32" className="h-8 w-8 rounded-md object-cover" />
                <span className="text-[0.9375rem] font-bold tracking-tight">Vijetha Digital</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="vd-icon-btn -mr-2" aria-label="Close menu">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <button
              onClick={() => { setMobileOpen(false); openMobileSearch(); }}
              className="mx-4 mt-4 flex min-h-[46px] flex-shrink-0 items-center gap-3 rounded-lg border border-line-strong px-3 text-[0.9375rem] text-ink-3"
            >
              <span className="material-symbols-outlined text-xl">search</span>
              Search products…
            </button>

            <nav aria-label="Mobile" className="flex-1 px-2 pt-4">
              <p className="px-3 pb-1 text-[0.8125rem] font-semibold text-ink-3">Shop</p>
              <Link to="/products" onClick={closeMenus} className={drawerRow}>All Products</Link>
              {CATEGORIES.map((c) => (
                <Link key={c} to={CATEGORY_LINK(c)} onClick={closeMenus} className={drawerRow}>{c}</Link>
              ))}

              <div className="my-3 h-px bg-line mx-3" />
              {[
                { label: "Services", to: "/#services" },
                { label: "For Business", to: "/register" },
                { label: "About", to: "/about" },
                { label: "Contact", to: "/contact" },
                { label: "Track Order", to: "/orders" },
                { label: "Store Locator", to: "/contact#branches" },
              ].map((l) => (
                <Link key={l.label} to={l.to} onClick={closeMenus} className={drawerRow}>{l.label}</Link>
              ))}

              {user && (
                <>
                  <div className="my-3 h-px bg-line mx-3" />
                  {accountLinks.map((l) => (
                    <Link key={l.to} to={l.to} onClick={closeMenus} className={drawerRow}>
                      <span className="material-symbols-outlined text-xl text-ink-3">{l.icon}</span>
                      {l.label}
                      {l.count > 0 && <span className="ml-auto vd-chip vd-price">{l.count}</span>}
                    </Link>
                  ))}
                </>
              )}
            </nav>

            <div className="mt-4 space-y-2 border-t border-line p-4">
              <a href={BUSINESS.phoneHref} className="vd-btn vd-btn-quiet w-full">
                <span className="material-symbols-outlined text-lg">call</span>{BUSINESS.phone}
              </a>
              {!user ? (
                <>
                  <Link to={loginUrl} onClick={closeMenus} className="vd-btn vd-btn-outline w-full">Log In</Link>
                  <Link to="/contact?subject=quote" onClick={closeMenus} className="vd-btn vd-btn-accent w-full">Get Custom Quote</Link>
                </>
              ) : (
                <button onClick={handleLogout} className="vd-btn vd-btn-quiet w-full !text-accent-dark">
                  <span className="material-symbols-outlined text-lg">logout</span>Log Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Utility bar: desktop, scrolls away */}
      <div className="hidden bg-night text-white/85 lg:block">
        <div className="vd-wrap flex h-9 items-center justify-between text-[0.8125rem]">
          <p>Printing and signage in Hyderabad since {BUSINESS.established}. GST invoice on every order.</p>
          <div className="flex items-center gap-6">
            <Link to="/orders" className="hover:text-white">Track Order</Link>
            <Link to="/contact#branches" className="hover:text-white">Store Locator</Link>
            <a href={BUSINESS.phoneHref} className="vd-price font-semibold text-white">{BUSINESS.phone}</a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-surface font-display">
        <div ref={searchRef} className="relative">
          <div className="vd-wrap flex flex-wrap items-center gap-x-2 lg:flex-nowrap lg:gap-x-6">
            <div className="flex h-[var(--header-h)] min-w-0 flex-1 items-center gap-1 lg:flex-none">
              <button className="vd-icon-btn -ml-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <span className="material-symbols-outlined text-2xl">menu</span>
              </button>
              <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Vijetha Digital home">
                <img src="/vd-logo.jpeg" alt="" width="36" height="36" className="h-9 w-9 flex-shrink-0 rounded-md object-cover" />
                <span className="truncate text-[0.9375rem] font-bold tracking-tight lg:text-[1.0625rem]">Vijetha Digital</span>
              </Link>
            </div>

            {/* Search: always visible on desktop, opens as its own row on mobile */}
            <div className={`${showSearch ? "flex" : "hidden lg:flex"} order-last w-full pb-2.5 lg:order-none lg:w-auto lg:flex-1 lg:pb-0`}>
              <div className="relative flex w-full items-center">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 text-xl text-ink-3">search</span>
                <input
                  ref={searchInputRef}
                  type="search"
                  name="q"
                  role="combobox"
                  aria-expanded={showSearch}
                  aria-controls="search-results"
                  aria-label="Search products"
                  autoComplete="off"
                  value={searchQuery}
                  onFocus={() => setShowSearch(true)}
                  onChange={(e) => { setSearchQuery(e.target.value); setActiveResult(-1); }}
                  onKeyDown={onSearchKeyDown}
                  placeholder="Search sign boards, flex, banners, cards…"
                  className="vd-input !min-h-[44px] !bg-paper !pl-10 !pr-10 [&::-webkit-search-cancel-button]:hidden"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(""); searchInputRef.current?.focus(); }}
                    className="absolute right-1 flex h-9 w-9 items-center justify-center rounded-md text-ink-3 hover:text-ink"
                    aria-label="Clear search"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                )}
              </div>
            </div>

            <div className="-mr-2 flex h-[var(--header-h)] items-center gap-0.5 lg:mr-0 lg:gap-1">
              <button className="vd-icon-btn lg:hidden" onClick={() => (showSearch ? closeSearch() : openMobileSearch())} aria-label={showSearch ? "Close search" : "Search products"} aria-expanded={showSearch}>
                <span className="material-symbols-outlined text-2xl">{showSearch ? "close" : "search"}</span>
              </button>

              <Link to="/cart" className="vd-icon-btn relative" aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}>
                <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                {cartCount > 0 && (
                  <span className="vd-price absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded bg-accent px-1 text-[0.6875rem] font-bold leading-none text-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex min-h-[44px] items-center gap-2 rounded-lg px-1.5 transition-colors hover:bg-shade lg:px-2"
                    aria-label="Account menu"
                    aria-haspopup="menu"
                    aria-expanded={dropdownOpen}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-night text-[0.8125rem] font-bold text-white">{avatarLetter}</span>
                    <span className="hidden max-w-[96px] truncate text-sm font-semibold lg:block">{user.full_name?.split(" ")[0] || user.email}</span>
                    <span className="hidden lg:block"><span className="material-symbols-outlined text-lg text-ink-3">expand_more</span></span>
                  </button>
                  {dropdownOpen && (
                    <div role="menu" className="absolute right-0 z-50 mt-1 w-60 overflow-hidden rounded-lg border border-line bg-surface shadow-lg dropdown-enter">
                      <div className="border-b border-line px-4 py-3">
                        <p className="truncate text-sm font-semibold">{user.full_name || "User"}</p>
                        <p className="truncate text-[0.8125rem] text-ink-2">{user.email}</p>
                      </div>
                      <div className="py-1">
                        {accountLinks.map((l) => (
                          <Link key={l.to} role="menuitem" to={l.to} onClick={closeMenus} className="flex min-h-[44px] items-center gap-3 px-4 text-sm font-medium transition-colors hover:bg-shade">
                            <span className="material-symbols-outlined text-lg text-ink-3">{l.icon}</span>
                            {l.label}
                            {l.count > 0 && <span className="vd-chip vd-price ml-auto">{l.count}</span>}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-line py-1">
                        <button role="menuitem" onClick={handleLogout} className="flex min-h-[44px] w-full items-center gap-3 px-4 text-sm font-medium text-accent-dark transition-colors hover:bg-shade">
                          <span className="material-symbols-outlined text-lg">logout</span>Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to={loginUrl} className="vd-btn hidden hover:bg-shade lg:inline-flex">Log In</Link>
                  <Link to="/contact?subject=quote" className="vd-btn vd-btn-accent hidden lg:inline-flex">Get Quote</Link>
                </>
              )}
            </div>
          </div>

          {/* Search results */}
          {showSearch && (
            <div className="absolute inset-x-0 top-full z-[45] border-b border-line bg-surface shadow-lg animate-fade-in">
              <div id="search-results" className="vd-wrap max-h-[min(70vh,560px)] overflow-y-auto overscroll-contain py-4" aria-live="polite">
                {!productsLoaded && hasQuery && (
                  <p className="py-6 text-sm text-ink-2">Searching products…</p>
                )}

                {!hasQuery && (
                  <div>
                    <p className="mb-2 text-sm font-semibold">Popular searches</p>
                    <div className="flex flex-wrap gap-2">
                      {[...topSuggestions, "Profile", "Contact"].map((tag) => (
                        <button key={tag} onClick={() => setSearchQuery(tag)} className="vd-btn vd-btn-quiet !min-h-[40px] !text-sm !font-medium">{tag}</button>
                      ))}
                    </div>
                  </div>
                )}

                {hasQuery && productsLoaded && !searchLoading && searchResults.length === 0 && (
                  <div className="py-6">
                    <p className="font-semibold">No matching products</p>
                    <p className="text-sm text-ink-2">Try a different keyword like banner, board, card, or flex.</p>
                  </div>
                )}

                {hasQuery && searchResults.length > 0 && (
                  <ul className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                    {searchResults.map((item, idx) => {
                      const isPage = item.type === "page";
                      const entry = item.data;
                      const image = !isPage && (entry.image_url || entry.imageUrl);
                      const price = !isPage && Number(entry.base_price ?? entry.basePrice ?? 0);
                      return (
                        <li key={isPage ? `page-${entry.key}` : `product-${entry.id ?? idx}`}>
                          <Link
                            to={resultPath(item)}
                            onClick={closeSearch}
                            className={`flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-shade ${activeResult === idx ? "bg-shade" : ""}`}
                          >
                            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-shade text-ink-2">
                              {image
                                ? <img src={image} alt="" width="48" height="48" className="h-full w-full object-cover" />
                                : <span className="material-symbols-outlined text-xl">{isPage ? entry.icon : "inventory_2"}</span>}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold">{item.title}</span>
                              <span className="block truncate text-[0.8125rem] text-ink-2">
                                {isPage ? "Open page" : `${entry.category || "General"}${price ? ` · ${rupees(price)} / ${unitLabel(entry.unit)}` : ""}`}
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Category and page nav: desktop, scrolls away */}
      <nav aria-label="Primary" className="hidden border-b border-line bg-surface lg:block">
        <div className="vd-wrap flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link to="/products" className={navLinkClass(activeCategory === "")}>All Products</Link>
            {CATEGORIES.map((c) => (
              <Link key={c} to={CATEGORY_LINK(c)} className={navLinkClass(activeCategory === c)}>{c}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <Link to="/#services" className={navLinkClass(false)}>Services</Link>
            <Link to="/register" className={navLinkClass(false)}>For Business</Link>
            <Link to="/about" className={navLinkClass(location.pathname === "/about")}>About</Link>
            <Link to="/contact" className={navLinkClass(location.pathname === "/contact")}>Contact</Link>
          </div>
        </div>
      </nav>
    </>
  );
}
