import React from 'react';

const KurdishSun = () => {
  const rays = Array.from({ length: 21 }, (_, idx) => {
    const angle = (idx * 360) / 21;
    return (
      <polygon
        key={idx}
        points="50,10 46,30 54,30"
        transform={`rotate(${angle} 50 50)`}
        fill="url(#sun-gradient)"
      />
    );
  });

  return (
    <svg viewBox="0 0 100 100" className="kurdish-sun-svg" width="48" height="48">
      <defs>
        <radialGradient id="sun-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="18" fill="url(#sun-gradient)" />
      <g>
        {rays}
      </g>
    </svg>
  );
};

const Header = () => {
  return (
    <header className="header no-print">
      <div className="logo-container">
        <div className="sun-emblem-container">
          <KurdishSun />
        </div>
        <h1 className="logo">وێنەکێش<span>AI</span></h1>
        <p className="subtitle">ستۆدیۆی پۆرترێتی قەڵەمی خەڵووزی پوخت</p>
      </div>
      <div className="header-decoration">
        <div className="line"></div>
        <span className="serif italic">دەفتەری یەکەم</span>
      </div>
    </header>
  );
};

export default Header;
