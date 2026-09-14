// Тимчасовий фірмовий логотип: слово BALL(◯◯)NS, де дві «O» — це кульки,
// та слово DECOR акцентним кольором. Координати підібрані під реальні
// метрики шрифту Montserrat (розмір 30, letter-spacing 1), тому кульки
// стоять точно на місці літер «O», а між NS та DECOR є пробіл.
// Кольори тексту й стрічок беруться з теми (var(--ink) / var(--accent)),
// тож логотип коректний і в темній, і в світлій темі. Якщо покласти файл
// public/media/logo.* — він замінить цей знак (див. layout.js).

// Кулька-«O»: тіло-овал у слоті літери, вузлик і коротка стрічка знизу.
function BalloonO({ cx, fill }) {
  return (
    <g>
      <ellipse cx={cx} cy="27" rx="12" ry="13" fill={fill} />
      <ellipse cx={cx - 4.6} cy="21" rx="2.2" ry="3.2" fill="#fff" opacity="0.5" />
      <path d={`M${cx - 2.5},39 L${cx + 2.5},39 L${cx},43 Z`} fill={fill} />
      <path className="brandlogo__ribbon" d={`M${cx},43 c1.6,2 .5,3.6 -.7,5.6`} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

export default function BrandLogo({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 332 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Balloons Decor"
    >
      <text className="brandlogo__txt" x="4" y="40" fontSize="30" letterSpacing="1">BALL</text>
      <BalloonO cx={105.6} fill="#ff2e7e" />
      <BalloonO cx={132.1} fill="#e9b949" />
      <text className="brandlogo__txt" x="145.4" y="40" fontSize="30" letterSpacing="1">NS</text>
      <text className="brandlogo__accent" x="206" y="40" fontSize="30" letterSpacing="1">DECOR</text>
    </svg>
  );
}
