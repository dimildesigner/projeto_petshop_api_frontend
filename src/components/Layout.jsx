import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PETSTOCK_PATH = "m 85.59776,1.5622494 c -4.186614,0 -8.142355,0.2208505 -11.892888,0.6469896 C 64.860249,3.2171462 57.154218,5.423248 50.530778,8.7473213 36.437078,14.562766 21.676014,19.957847 9.8282049,26.044761 1.5101592,30.316416 0.74307701,38.298492 1.3046307,41.692841 c 1.5043209,9.125398 7.7414105,33.051331 9.0249603,37.814585 1.092944,4.066287 5.60053,7.114878 11.040535,7.836875 3.088543,16.530839 10.965208,31.095919 22.045774,41.675269 5.660776,5.39507 12.163481,9.75216 19.283333,12.76049 7.114718,3.00831 14.851314,4.66249 22.898527,4.65768 9.165515,0.005 17.92446,-2.14586 25.83145,-5.99138 11.8677,-5.77597 21.82523,-15.33745 28.8145,-27.23532 4.53332,-7.713 7.82546,-16.427827 9.58209,-25.769269 l 23.67869,23.677889 c 3.04221,3.04241 7.97387,3.04241 11.01607,0 0.69336,-0.6934 22.28077,-22.278136 22.03535,-22.036551 3.0422,-3.042419 3.0422,-7.974047 0,-11.016467 L 193.65502,65.164958 c -0.63998,-0.643799 -25.42331,-25.424888 -25.29997,-25.305187 -7.8e-4,-9.31e-4 -9.9e-4,-0.0016 -0.002,-0.0023 -0.73208,-0.726842 -1.72061,-1.134738 -2.75162,-1.134738 h -0.18691 C 165.12235,34.822223 163.19413,29.33375 156.78987,26.0449 143.25211,19.090648 125.91392,13.033977 110.10539,6.2353339 109.58908,6.0097502 109.22816,5.8542001 109.02761,5.87955 101.72742,3.0717846 93.825473,1.5572755 85.597609,1.5624101 Z m 3.23e-4,11.0301066 c 7.57583,0.0051 14.740847,1.504241 21.248767,4.286656 2.60721,1.113158 5.10428,2.436659 7.48591,3.950927 2.02576,5.525361 4.63297,12.980942 7.86174,23.033705 -4.55275,29.100646 5.90634,40.847856 16.4507,43.184238 -2.4673,11.602329 -7.65156,21.926238 -14.66616,29.988548 -4.98884,5.73585 -10.89036,10.33321 -17.37806,13.48689 -6.48803,3.15881 -13.55261,4.88391 -21.003295,4.88391 -6.538084,0 -12.785361,-1.33386 -18.60626,-3.79089 -5.816087,-2.45671 -11.206033,-6.04671 -15.964153,-10.57925 h 0.0052 c -1.363772,-1.2935 -2.662244,-2.67741 -3.910817,-4.12622 0.03016,0.0302 0.06498,0.0649 0.10028,0.0951 27.967289,-14.38988 52.364849,-42.020942 50.59996,-73.217304 -0.862546,-15.136904 -7.590677,-24.873994 -15.61799,-31.136114 1.113158,-0.03498 2.236109,-0.06017 3.394188,-0.06017 z m 60.250327,33.917408 h 17.32993 c 0.51808,0 1.01286,0.205335 1.37902,0.572382 l 33.7369,33.738913 c 1.51915,1.523077 1.51915,3.988664 0,5.507633 l -16.52772,16.528918 c -1.51914,1.51897 -3.98498,1.51897 -5.50804,0 L 142.5216,69.118694 c -0.36629,-0.365928 -0.56837,-0.860743 -0.56837,-1.379015 V 50.408947 c 0,-2.154115 1.7411,-3.899183 3.89518,-3.899183 z m 7.05831,7.062331 c -2.15019,0 -3.89557,1.745167 -3.89557,3.895174 0,2.150379 1.74538,3.895575 3.89557,3.895575 2.15019,0 3.89518,-1.745196 3.89518,-3.895575 0,-2.150007 -1.74499,-3.895174 -3.89518,-3.895174 z M 86.79147,100.34025 c -8.167553,0 -14.791313,5.38481 -14.791313,12.03327 0,6.64847 6.62376,12.03328 14.791313,12.03328 8.167543,0 14.79091,-5.38481 14.79091,-12.03328 0,-6.64846 -6.623367,-12.03327 -14.79091,-12.03327 z";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/>
    </svg>
  )},
  { path: "/products", label: "Catálogo", icon: (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
      <rect x="2" y="2" width="12" height="3" rx="1.5" fill="currentColor"/>
      <rect x="2" y="7" width="9" height="2.5" rx="1.25" fill="currentColor" opacity=".6"/>
      <rect x="2" y="11.5" width="6" height="2.5" rx="1.25" fill="currentColor" opacity=".4"/>
    </svg>
  )},
  { path: "/stock", label: "Estoque", icon: (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
      <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )},
  { path: "/promotions", label: "Promoções", icon: (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 4.5v4l2.5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )},
];

function LogoIcon() {
  return (
    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shrink-0 p-1">
      <svg viewBox="0 0 210 148" fill="white" className="w-full h-full">
        <path d={PETSTOCK_PATH}/>
      </svg>
    </div>
  );
}

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const currentLabel = navItems.find((i) => i.path === location.pathname)?.label ?? "Petstock";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-stone-800">
        <LogoIcon />
        <span className="text-orange-500 font-medium text-base tracking-tight">Petstock</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left w-full ${
                active
                  ? "bg-stone-800 text-orange-400"
                  : "text-stone-400 hover:bg-stone-800 hover:text-stone-200"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-stone-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-stone-500 hover:text-red-400 hover:bg-stone-800 transition-colors w-full"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
            <path d="M6 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"
              stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">

      {/* Sidebar — desktop (sempre visível) */}
      <aside className="hidden md:flex w-56 bg-stone-900 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Sidebar — mobile (drawer com overlay) */}
      {sidebarOpen && (
        <div className="md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Conteúdo principal */}
      <main className="flex-1 bg-stone-100 overflow-auto min-w-0">

        {/* Header */}
        <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Botão hamburguer — só mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                <path d="M3 5h14M3 10h14M3 15h14"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <h1 className="text-stone-800 font-medium text-base">{currentLabel}</h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-400 hidden sm:block">Admin</span>
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-medium shrink-0">
              AD
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
