import { useState, useEffect, useRef, useMemo } from "react";
import AdminPanel from "./AdminPanel";
import { BiLogoLinkedin } from "react-icons/bi";
import {
  SiFacebook,
  SiInstagram,
  SiTelegram,
  SiX,
  SiYoutube,
} from "react-icons/si";

// ─── API ENDPOINT ────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// Resolve uploaded image URLs — backend stores them as /uploads/...
// In dev the Vite proxy forwards /uploads → localhost:3001,
// but direct <img src> bypasses the proxy, so we always prefix with backend origin.
const BACKEND_ORIGIN = API_BASE.replace(/\/api\/?$/, '');
const imgUrl = (src) =>
  src && typeof src === 'string' && src.startsWith('/uploads')
    ? BACKEND_ORIGIN + src
    : src || '';

// ─── EMPTY DEFAULTS (no mock fallback content) ──────────────────────────────
const DEFAULT_PROJECTS = [];
const DEFAULT_GALLERY = [];
const DEFAULT_TEAM = [];
const DEFAULT_PARTNERS = [];
 
const HERO_VIDEO = "https://cdn.coverr.co/videos/coverr-modern-interior-design-3688/1080p.mp4";
const LOGO_SRC = "/LOGO.png";

const I18N = {
  uz: {
    nav: {
      portfolio: 'Portfolio',
      team: 'Jamoa',
      info: 'Aloqa',
      admin: 'Admin',
    },
    studioTagline: 'Dizayn va Arxitektura Studiyasi',
    scroll: 'Pastga',
    backToPortfolio: 'Portfolioga qaytish',
    loadingProject: 'Loyiha yuklanmoqda...',
    goBackHint: 'Agar shu oynani ko‘rsangiz, ortga qaytish uchun bu yerga bosing',
    moreProjects: 'Yana loyihalar',
    ourTeam: 'Bizning jamoa',
    aboutLead:
      'Layer Design — Toshkentda tashkil topgan dizayn va arxitektura studiyasi. Biz turar-joy va tijorat loyihalari uchun funksional va estetik muvozanatli makonlar yaratamiz.',
    aboutBody:
      'Bizning yondashuvimiz odamlarning makondan qanday foydalanishini chuqur tushunishga asoslanadi. Har bir loyiha tinglashdan boshlanadi: mijozni, joyni va madaniy kontekstni. Biz vazmin dizayn tanlaymiz, vaqt o‘tishi bilan qadri oshadigan material va shakllarni qo‘llaymiz.',
    partners: 'Hamkorlar va Brendlar',
    connect: 'Biz bilan bog‘laning',
    infoKeyLabels: {
      email: 'Email',
      phone: 'Telefon',
      address: 'Manzil',
      instagram: 'Instagram',
      telegram: 'Telegram',
      x: 'X',
      facebook: 'Facebook',
      linkedin: 'LinkedIn',
      youtube: 'YouTube',
    },
    fallbackProject: 'Loyiha',
    fallbackDesign: 'Dizayn',
    fallbackLocation: 'Xalqaro',
    detailDescription: (title, style) =>
      `${title} loyihasi ${style.toLowerCase()} yo‘nalishda ishlab chiqilgan bo‘lib, materiallar uyg‘unligi, proporsiya va makon tiniqligiga urg‘u beradi.`,
    footer: {
      tashkent: 'Toshkent, O‘zbekiston',
      dubai: 'Dubay, BAA',
      moscow: 'Moskva, Rossiya',
      copy: '© 2021 Layer Design - Dizayn va Arxitektura',
    },
    portfolioSearchLabel: 'Qidiruv',
    portfolioSearchPlaceholder: 'Nomi, joylashuv, uslub yoki loyiha turi...',
    portfolioTypeLabel: 'Loyiha turi',
    portfolioTypeAll: 'Barchasi',
    portfolioNoResults: 'Tanlangan filter bo‘yicha loyiha topilmadi.',
  },
  ru: {
    nav: {
      portfolio: 'Портфолио',
      team: 'Команда',
      info: 'Контакты',
      admin: 'Админ',
    },
    studioTagline: 'Студия Дизайна и Архитектуры',
    scroll: 'Листать',
    backToPortfolio: 'Назад в портфолио',
    loadingProject: 'Загрузка проекта...',
    goBackHint: 'Если вы видите это окно, нажмите здесь, чтобы вернуться назад',
    moreProjects: 'Другие проекты',
    ourTeam: 'Наша команда',
    aboutLead:
      'Layer Design — студия дизайна и архитектуры, основанная в Ташкенте. Мы создаем сбалансированные по функции и эстетике пространства для жилых и коммерческих проектов.',
    aboutBody:
      'Наш подход строится на понимании того, как люди живут и работают в пространстве. Каждый проект начинается с внимательного диалога: с клиентом, местом и культурным контекстом. Мы выбираем сдержанный дизайн, материалы и формы, которые остаются актуальными со временем.',
    partners: 'Партнеры и бренды',
    connect: 'Свяжитесь с нами',
    infoKeyLabels: {
      email: 'Эл. почта',
      phone: 'Телефон',
      address: 'Адрес',
      instagram: 'Instagram',
      telegram: 'Telegram',
      x: 'X',
      facebook: 'Facebook',
      linkedin: 'LinkedIn',
      youtube: 'YouTube',
    },
    fallbackProject: 'Проект',
    fallbackDesign: 'Дизайн',
    fallbackLocation: 'Международный',
    detailDescription: (title, style) =>
      `Проект ${title} разработан в стиле ${style.toLowerCase()} с акцентом на тактильность материалов, пропорции и пространственную ясность.`,
    footer: {
      tashkent: 'Ташкент, Узбекистан',
      dubai: 'Дубай, ОАЭ',
      moscow: 'Москва, Россия',
      copy: '© 2021 Layer Design - Дизайн и Архитектура',
    },
    portfolioSearchLabel: 'Поиск',
    portfolioSearchPlaceholder: 'Название, локация, стиль или тип проекта...',
    portfolioTypeLabel: 'Тип проекта',
    portfolioTypeAll: 'Все',
    portfolioNoResults: 'По выбранным фильтрам проекты не найдены.',
  },
};

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@200;300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --w: #ffffff; --b: #0a0a0a;
    --gl: #f5f5f3; --gm: #e8e8e4; --gd: #6b6b6b;
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans: 'Jost', system-ui, sans-serif;
    --nh: 96px;
    --ease: cubic-bezier(0.25,0.46,0.45,0.94);
  }

  html { scroll-behavior: smooth; }
  body { font-family: var(--sans); background: var(--w); color: var(--b); -webkit-font-smoothing: antialiased; overflow-x: hidden; }

  /* ── INTRO ── */
  .intro {
    position: fixed; inset: 0; z-index: 999;
    background: #0a0a0a;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    transition: transform 1.1s cubic-bezier(0.77,0,0.175,1);
  }
  .intro.exit { transform: translateY(-100%); }
  .ilogo {
    color: #fff;
    opacity: 0; transform: translateY(14px);
    animation: fu 0.9s 0.3s var(--ease) forwards;
  }
  .isub {
    margin-top: 16px; font-size: 12px; letter-spacing: 0.28em;
    text-transform: uppercase; color: rgba(255,255,255,0.3); font-weight: 300;
    opacity: 0; animation: fu 0.9s 0.75s var(--ease) forwards;
  }
  .ibar {
    position: absolute; bottom: 52px;
    width: 1px; height: 52px; background: rgba(255,255,255,0.2);
    transform-origin: top; transform: scaleY(0);
    animation: gb 1s 1.1s var(--ease) forwards;
  }
  @keyframes fu { to { opacity: 1; transform: translateY(0); } }
  @keyframes gb { to { transform: scaleY(1); } }

  /* ── SITE HEADER (in-flow, sticky after hero) ── */
  .site-header {
    position: sticky; top: 0; z-index: 100;
    height: var(--nh);
    background: #fff;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 86px;
    border-bottom: 1px solid var(--gm);
  }
  .sh-logo {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer; user-select: none;
    color: var(--b);
  }

  .logo-header-back {
    position: absolute;
    inset: 0;
    opacity: 0.35;
    filter: contrast(1.2) brightness(0.55);
    pointer-events: none;
  }

  .logo-header-front {
    position: relative;
    z-index: 1;
  }
  .sh-links { display: flex; gap: 42px; list-style: none; }
  .sh-links li {
    cursor: pointer; font-size: 13px; font-weight: 400;
    letter-spacing: 0.1em; text-transform: uppercase; color: var(--b); transition: opacity 0.2s;
  }
  .sh-links li:hover { opacity: 0.4; }
  .sh-links li.on { border-bottom: 1px solid currentColor; padding-bottom: 2px; }

  .lang-switch { display: inline-flex; align-items: center; gap: 8px; margin-left: 18px; }
  .lang-btn {
    border: 1px solid #d8d8d8;
    background: #fff;
    color: #222;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.2s;
  }
  .lang-btn:hover { border-color: #000; }
  .lang-btn.on { background: #111; color: #fff; border-color: #111; }

  .sh-burg { display: none; flex-direction: column; gap: 5px; cursor: pointer; border: none; background: none; padding: 4px; }
  .sh-burg span { display: block; width: 22px; height: 1px; background: var(--b); transition: transform 0.4s var(--ease), opacity 0.3s; }
  .sh-burg.op span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
  .sh-burg.op span:nth-child(2) { opacity: 0; }
  .sh-burg.op span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

  .mmenu {
    position: fixed; inset: 0; z-index: 200; background: var(--w);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 44px;
    transform: translateY(-100%); transition: transform 0.55s cubic-bezier(0.77,0,0.175,1); pointer-events: none;
  }
  .mmenu.op { transform: none; pointer-events: all; }
  .mmenu li { list-style: none; font-family: var(--serif); font-size: 42px; font-weight: 300; letter-spacing: 0.06em; cursor: pointer; transition: opacity 0.2s; }
  .mmenu li:hover { opacity: 0.38; }
  .mmenu .lang-switch { margin-top: 6px; }

  /* ── HERO ── */
  .hero {
    position: relative;
    width: 100%; height: 100vh;
    overflow: hidden;
    cursor: pointer;
  }
  .hero-video {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    filter: brightness(0.55);
  }
  .hero-fallback {
    position: absolute; inset: 0;
    background: linear-gradient(160deg, #1a1a1a 0%, #2d2d2d 50%, #111 100%);
  }
  .hero-content {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    pointer-events: none;
  }
  .hero-logo {
    color: white;
    opacity: 0; transform: translateY(20px);
    animation: fu 1s 0.2s var(--ease) forwards;
  }
  .hero-tagline {
    margin-top: 20px; font-size: 13px; letter-spacing: 0.24em;
    text-transform: uppercase; color: rgba(255,255,255,0.5); font-weight: 300;
    opacity: 0; animation: fu 1s 0.6s var(--ease) forwards;
  }
  .hero-arrow {
    position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    cursor: pointer; pointer-events: all;
    opacity: 0; animation: fu 1s 1s var(--ease) forwards;
  }
  .hero-arrow span {
    font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;
    color: rgba(255,255,255,0.5); font-weight: 300;
  }
  .arrow-line {
    width: 1px; height: 48px; background: rgba(255,255,255,0.3);
    animation: pulse-line 2s 1.5s ease-in-out infinite;
  }
  .arrow-chevron {
    width: 10px; height: 10px;
    border-right: 1px solid rgba(255,255,255,0.5);
    border-bottom: 1px solid rgba(255,255,255,0.5);
    transform: rotate(45deg);
    margin-top: -6px;
    animation: bounce-down 2s 1.5s ease-in-out infinite;
  }
  @keyframes pulse-line { 0%,100%{opacity:0.3} 50%{opacity:0.8} }
  @keyframes bounce-down { 0%,100%{transform:rotate(45deg) translateY(0)} 50%{transform:rotate(45deg) translateY(4px)} }

  /* ── PORTFOLIO GRID — ASYMMETRIC ROWS ── */
  #portfolio { scroll-margin-top: var(--nh); }
  .pgrid-wrap { padding: 0 70px; }

  /* Responsive editable grid driven by project.grid_size */
  .pfilters {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(220px, 0.6fr);
    gap: 10px;
    margin: 16px 0 14px;
  }

  .pfilter-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .pfilter-label {
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gd);
  }

  .pfilter-input {
    width: 100%;
    border: 1px solid var(--gm);
    background: #fff;
    color: var(--b);
    padding: 12px 13px;
    font-size: 13px;
    font-family: var(--sans);
    outline: none;
    transition: border-color 0.2s;
  }

  .pfilter-input:focus {
    border-color: var(--b);
  }

  .pgrid {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-bottom: 14px;
  }

  .prow {
    display: flex;
    gap: 14px;
  }

  .prow.pair-reverse {
    flex-direction: row-reverse;
  }

  .prow.single .pcard {
    flex: 1 1 100%;
    max-width: 100%;
  }

  .pcard {
    position: relative; overflow: hidden; cursor: pointer;
    background: var(--gl);
    height: clamp(280px, 29vw, 520px);
    flex: 1 1 0;
    min-width: 0;
  }

  .pcard.size-small { flex-basis: calc(40% - 7px); max-width: calc(40% - 7px); }
  .pcard.size-large { flex-basis: calc(60% - 7px); max-width: calc(60% - 7px); }

  .pcard-ani {
    opacity: 0;
    transform: translateY(22px);
    animation: pcard-in 3.05s cubic-bezier(0.19, 0.89, 0.22, 1) forwards;
  }

  @keyframes pcard-in {
    to {
      opacity: 1;
      transform: none;
    }
  }

  .pcard.grid-wide { height: clamp(300px, 30vw, 560px); }

  .pcard.grid-tall {
    height: clamp(340px, 38vw, 640px);
  }

  .pcard.grid-normal {}
  .pcard.grid-auto {}

  .pcard img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.8s var(--ease), filter 0.5s;
    filter: brightness(0.68);
  }
  .pcard:hover img { transform: scale(1.06); filter: brightness(0.50); }
  .pov {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    padding: 24px;
    transition: background 0.4s;
  }
  .pcard:hover .pov { background: rgba(0,0,0,0.18); }
  .pt { font-family: var(--serif); font-size: clamp(20px, 2.4vw, 42px); font-weight: 400; color: #fff; letter-spacing: 0.05em; }
  .ps { font-size: 11px; font-weight: 300; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.72); margin-top: 10px; }

  .pempty {
    border: 1px solid var(--gm);
    color: var(--gd);
    padding: 32px 20px;
    text-align: center;
    font-size: 13px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* ── SCROLL FADE ── */
  .fi { opacity: 0; transform: translateY(20px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fi.vis { opacity: 1; transform: none; }

  @media (prefers-reduced-motion: reduce) {
    .pcard-ani {
      opacity: 1;
      transform: none;
      animation: none;
    }
  }

  /* ── DETAIL ── */
  .page { min-height: 100vh; }
  .dback {
    display: inline-flex; align-items: center; gap: 10px;
    margin-top: 30px;
    font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--gd); cursor: pointer; border: none; background: none;
    font-family: var(--sans); transition: color 0.2s;
  }
  .dback:hover { color: var(--b); }
  .dback::before { content: '←'; font-size: 14px; }

  .detail-main { background: var(--w); }
  .dhero-wrap { padding: 22px 70px 0; }
  .dhero {
    width: 100%;
    height: clamp(420px, 68vh, 820px);
    overflow: hidden;
    background: var(--gl);
  }
  .dhero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .dinfo-wrap {
    padding: 0 70px;
  }
  .dinfo {
    padding: 34px 0 0;
    max-width: 1040px;
  }
  .dtitle { font-family: var(--serif); font-size: clamp(38px, 5.8vw, 86px); font-weight: 300; letter-spacing: 0.01em; line-height: 0.96; }
  .dsub { margin-top: 14px; font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--b); }
  .dloc { margin-top: 10px; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gd); }
  .ddesc {
    margin-top: 24px;
    max-width: 760px;
    font-size: 15px;
    line-height: 1.85;
    color: var(--gd);
    font-weight: 300;
  }

  .dgal-wrap {
    padding: 68px 70px 110px;
  }
  .dgal-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  .dgi {
    overflow: hidden;
    background: var(--gl);
  }
  .dgi.landscape {
    grid-column: 1 / -1;
    aspect-ratio: 16 / 10;
  }
  .dgi.portrait {
    grid-column: span 1;
    aspect-ratio: 3 / 4;
  }
  .dgi img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transition: transform 0.7s var(--ease);
  }
  .dgi:hover img { transform: scale(1.03); }

  .morewrap { padding: 80px 48px 100px; }
  .morelbl { font-size: 10px; font-weight: 300; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gd); margin-bottom: 32px; }
  .moregrid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; }
  .mcard { position: relative; overflow: hidden; cursor: pointer; aspect-ratio: 3/4; background: var(--gl); }
  .mcard img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s var(--ease); }
  .mcard:hover img { transform: scale(1.05); }
  .mcinfo { position: absolute; bottom: 16px; left: 16px; }
  .mct { font-family: var(--serif); font-size: 16px; color: #fff; font-weight: 400; }
  .mcs { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.58); margin-top: 2px; }

  /* ── TEAM ── */
  .twrap { padding: 80px 48px 100px; }
  .pgh { font-family: var(--serif); font-size: clamp(36px,5vw,78px); font-weight: 300; letter-spacing: 0.03em; margin-bottom: 60px; }
  .tgrid { display: grid; grid-template-columns: repeat(3,1fr); gap: 48px 24px; }
  .tphoto { aspect-ratio: 3/4; overflow: hidden; background: var(--gl); margin-bottom: 18px; }
  .tphoto img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(25%); transition: transform 0.7s var(--ease), filter 0.5s; }
  .tcard:hover .tphoto img { transform: scale(1.04); filter: none; }
  .tname { font-family: var(--serif); font-size: 22px; font-weight: 400; letter-spacing: 0.03em; }
  .trole { font-size: 10px; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gd); margin-top: 5px; }

  /* ── INFO ── */
  .iwrap { padding: 80px 48px 100px; }
  .ibody { max-width: 680px; margin-bottom: 88px; }
  .ibody p { font-family: var(--serif); font-size: clamp(20px,2.4vw,32px); font-weight: 300; line-height: 1.65; letter-spacing: 0.01em; }
  .idiv { width: 36px; height: 1px; background: var(--gm); margin: 40px 0; }
  .ibody p.sm { font-size: clamp(14px,1.5vw,17px); font-family: var(--sans); font-weight: 300; line-height: 1.9; color: var(--gd); }
  .slbl { font-size: 10px; font-weight: 300; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gd); margin-bottom: 28px; }
  .pgrid2 { display: flex; flex-wrap: wrap; border-top: 1px solid var(--gm); border-left: 1px solid var(--gm); }
  .pitem { padding: 24px 40px; border-right: 1px solid var(--gm); border-bottom: 1px solid var(--gm); font-family: var(--serif); font-size: 20px; font-weight: 300; letter-spacing: 0.06em; color: var(--gd); transition: color 0.3s, background 0.3s; }
  a.pitem { text-decoration: none; color: var(--gd); }
  .pitem:hover { color: var(--b); background: var(--gl); }
  .ctcts { margin-top: 88px; display: grid; grid-template-columns: repeat(3,1fr); gap: 40px; }
  .creg { font-size: 10px; font-weight: 300; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gd); margin-bottom: 14px; }
  .cadr { font-family: var(--serif); font-size: 16px; font-weight: 300; line-height: 1.85; }
  .cadr a { color: inherit; text-decoration: none; display: block; }
  .cadr a:hover { text-decoration: underline; }

  /* ── FOOTER ── */
  footer { padding: 52px 48px; border-top: 1px solid var(--gm); display: grid; grid-template-columns: 1.2fr 1fr 1fr 1fr; gap: 28px; align-items: start; }
  .flogo { display: inline-flex; align-items: center; }

  .footer-logo-btn {
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
  }

  .logo-img { display: block; width: auto; height: 100%; object-fit: contain; }
  .logo-intro { height: clamp(40px, 5vw, 68px); }
  .logo-header { width: 220px; height: auto; }
  .logo-hero { height: clamp(64px, 8.8vw, 132px); }
  .logo-footer { height: 22px; }
  .logo-light { filter: brightness(0) invert(1); }
  .fcity { font-size: 10px; font-weight: 300; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gd); margin-bottom: 10px; }
  .fadr { font-size: 12px; font-weight: 300; line-height: 1.9; }
  .fadr a { color: inherit; text-decoration: none; display: block; }
  .fadr a:hover { text-decoration: underline; }
  .fcopy { font-size: 10px; color: var(--gd); font-weight: 300; margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--gm); grid-column: 1/-1; }
  .fsocial {
    margin-top: 12px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .fsocial a {
    width: 34px;
    height: 34px;
    border: 1px solid var(--gm);
    color: var(--b);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }
  .fsocial a:hover {
    background: var(--b);
    color: var(--w);
    border-color: var(--b);
  }
  .fmap-wrap {
    grid-column: 1 / -1;
    margin-top: 10px;
    border: 1px solid var(--gm);
    background: #fafafa;
    padding: 10px;
  }
  .fmap-label {
    font-size: 10px;
    font-weight: 300;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gd);
    margin-bottom: 8px;
  }
  .fmap {
    width: 100%;
    height: 220px;
    border: 0;
    display: block;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .site-header { padding: 0 28px; }
    .logo-header { width: 190px; height: auto; }
    .sh-links { display: none; }
    .sh-burg { display: flex; }
    .pgrid-wrap { padding: 0 20px; }
    .pfilters { grid-template-columns: 1fr; }
    .pcard,
    .pcard.grid-normal,
    .pcard.grid-auto { height: clamp(220px, 42vw, 420px); }
    .pcard.grid-wide { height: clamp(240px, 44vw, 450px); }
    .pcard.grid-tall { height: clamp(280px, 56vw, 520px); }
    .dhero-wrap { padding: 16px 20px 0; }
    .dhero { height: clamp(290px, 56vw, 520px); }
    .dinfo-wrap { padding: 0 20px; }
    .dback { margin-top: 22px; }
    .dgal-wrap { padding: 52px 20px 82px; }
    .dgal-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .dgi.landscape { grid-column: 1 / -1; }
    .dgi.portrait { grid-column: span 1; }
    .morewrap { padding: 52px 20px 80px; }
    .moregrid { grid-template-columns: repeat(2,1fr); }
    .twrap, .iwrap { padding: 56px 20px 80px; }
    .tgrid { grid-template-columns: repeat(2,1fr); gap: 28px 14px; }
    .ctcts { grid-template-columns: 1fr; gap: 36px; }
    footer { grid-template-columns: 1fr 1fr; padding: 36px 20px; }
  }
  @media (max-width: 540px) {
    .logo-intro { height: clamp(34px, 8vw, 48px); }
    .logo-hero { height: clamp(46px, 12vw, 76px); }
    .isub { font-size: 11px; letter-spacing: 0.2em; }
    .hero-tagline { font-size: 11px; letter-spacing: 0.16em; }
    .pgrid-wrap { padding: 0 12px; }
    .pfilters { grid-template-columns: 1fr; }
    .prow,
    .prow.pair-reverse { flex-direction: column; }
    .pcard,
    .pcard.grid-normal,
    .pcard.grid-wide,
    .pcard.grid-tall,
    .pcard.grid-auto {
      flex-basis: 100%;
      max-width: 100%;
      height: 62vw;
      min-height: 250px;
    }
    .dhero-wrap { padding: 10px 12px 0; }
    .dhero { height: clamp(240px, 58vw, 360px); }
    .dinfo-wrap { padding: 0 12px; }
    .dtitle { font-size: clamp(34px, 12vw, 52px); }
    .dgal-wrap { padding: 46px 12px 72px; }
    .dgal-grid { grid-template-columns: 1fr; }
    .dgi.landscape, .dgi.portrait { grid-column: span 1; }
    .dgi.landscape { aspect-ratio: 4 / 3; }
    .dgi.portrait { aspect-ratio: 3 / 4; }
    .tgrid { grid-template-columns: 1fr; }
    .moregrid { grid-template-columns: 1fr; }
    footer { grid-template-columns: 1fr; }
  }
`;

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useFade() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); }
      }),
      { threshold: 0.08 }
    );
    ref.current.querySelectorAll(".fi").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Intro({ onDone }) {
  const [exit, setExit] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setExit(true), 2400);
    const t2 = setTimeout(onDone, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div className={"intro" + (exit ? " exit" : "")}>
      <div className="ilogo"><img className="logo-img logo-intro logo-light" src={LOGO_SRC} alt="Layer Design" /></div>
      <div className="isub">Dizayn va Arxitektura Studiyasi</div>
      <div className="ibar" />
    </div>
  );
}

function SiteHeader({ page, setPage, t, lang, setLang }) {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { key: 'portfolio', label: t.nav.portfolio },
    { key: 'team', label: t.nav.team },
    { key: 'info', label: t.nav.info },
  ];

  const go = p => {
    setPage(p);
    setOpen(false);
    window.scrollTo(0, 0);
  };

  const scrollToPortfolioGrid = () => {
    const tryScroll = (attempt = 0) => {
      const el = document.getElementById("portfolio");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (attempt < 8) {
        window.setTimeout(() => tryScroll(attempt + 1), 40);
      }
    };
    tryScroll();
  };

  const goPortfolio = () => {
    if (page === "portfolio") {
      scrollToPortfolioGrid();
    } else {
      setPage("portfolio");
      setOpen(false);
      scrollToPortfolioGrid();
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="sh-logo" onClick={goPortfolio}>
          <img className="logo-img logo-header logo-header-back" src={LOGO_SRC} alt="" aria-hidden="true" />
          <img className="logo-img logo-header logo-header-front" src={LOGO_SRC} alt="Layer Design" />
        </div>
        <ul className="sh-links">
          {menuItems.map(item => (
            <li key={item.key} className={page === item.key ? "on" : ""} onClick={() => item.key === "portfolio" ? goPortfolio() : go(item.key)}>{item.label}</li>
          ))}
        </ul>
        <div className="lang-switch" aria-label="Language switch">
          <button className={`lang-btn ${lang === 'uz' ? 'on' : ''}`} onClick={() => setLang('uz')} type="button">UZ</button>
          <button className={`lang-btn ${lang === 'ru' ? 'on' : ''}`} onClick={() => setLang('ru')} type="button">RU</button>
        </div>
        <button className={"sh-burg" + (open ? " op" : "")} onClick={() => setOpen(!open)} aria-label="menu">
          <span /><span /><span />
        </button>
      </header>
      <div className={"mmenu" + (open ? " op" : "")}>
        {menuItems.map(item => (
          <li key={item.key} onClick={() => item.key === "portfolio" ? goPortfolio() : go(item.key)}>{item.label}</li>
        ))}
        <div className="lang-switch" aria-label="Language switch mobile">
          <button className={`lang-btn ${lang === 'uz' ? 'on' : ''}`} onClick={() => setLang('uz')} type="button">UZ</button>
          <button className={`lang-btn ${lang === 'ru' ? 'on' : ''}`} onClick={() => setLang('ru')} type="button">RU</button>
        </div>
      </div>
    </>
  );
}

function Hero({ t }) {
  const videoRef = useRef(null);
  const [videoOk, setVideoOk] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => setVideoOk(false));
  }, []);

  const scrollDown = e => {
    e.stopPropagation();
    const el = document.getElementById("portfolio");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hero" onClick={scrollDown}>
      {videoOk ? (
        <video
          ref={videoRef}
          className="hero-video"
          src={HERO_VIDEO}
          autoPlay muted loop playsInline
          onError={() => setVideoOk(false)}
        />
      ) : (
        <div className="hero-fallback" />
      )}
      <div className="hero-content">
        <div className="hero-logo"><img className="logo-img logo-hero logo-light" src={LOGO_SRC} alt="Layer Design" /></div>
        <div className="hero-tagline">{t.studioTagline}</div>
      </div>
      <div className="hero-arrow" onClick={scrollDown}>
        <span>{t.scroll}</span>
        <div className="arrow-line" />
        <div className="arrow-chevron" />
      </div>
    </div>
  );
}

function Footer({ t, onSecretAdmin, info = [] }) {
  const byKey = (keys) => {
    const normalized = (info || []).map((item) => ({ ...item, _k: String(item.key || '').toLowerCase() }));
    return normalized.find((item) => keys.includes(item._k));
  };

  const city = byKey(['city_tashkent', 'tashkent_city'])?.value || 'Toshkent, O‘zbekiston';
  const address =
    byKey(['address_tashkent', 'tashkent_address', 'tashkent', 'office'])?.value ||
    'Uzbekistan, Tashkent, 8-mart 57A';
  const rawPhoneValue = byKey(['phone'])?.value || '';
  const rawPhoneUrl = byKey(['phone'])?.url || '';
  const hasLegacyUsPhone = /^\+1/.test(rawPhoneValue.trim()) || rawPhoneValue.includes('555');
  const phone = !rawPhoneValue || hasLegacyUsPhone ? '+99890 0430303' : rawPhoneValue;
  const phoneUrl = !rawPhoneUrl || hasLegacyUsPhone ? 'tel:+998900430303' : rawPhoneUrl;
  const telegramUrl = byKey(['telegram'])?.url || 'https://t.me/layerdesign';
  const instagramUrl = byKey(['instagram'])?.url || 'https://www.instagram.com/layer_design.uz/';

  const normalizeText = (value = '') => String(value).toLowerCase();
  const resolveSocialPlatform = (item) => {
    const key = normalizeText(item.key);
    const title = normalizeText(item.title);
    const url = normalizeText(item.url);
    const combined = `${key} ${title} ${url}`;
    if (combined.includes('instagram')) return 'instagram';
    if (combined.includes('telegram') || combined.includes('t.me')) return 'telegram';
    if (combined.includes('x.com') || combined.includes('twitter') || key === 'x') return 'x';
    if (combined.includes('facebook') || combined.includes('fb.com')) return 'facebook';
    if (combined.includes('linkedin')) return 'linkedin';
    if (combined.includes('youtube') || combined.includes('youtu.be')) return 'youtube';
    return null;
  };

  const socialFromInfo = (info || []).filter((item) => item.type === 'social' && item.url);
  const fallbackSocial = [
    { key: 'telegram', title: 'Telegram', url: telegramUrl },
    { key: 'instagram', title: 'Instagram', url: instagramUrl },
  ];
  const socialItems = socialFromInfo.length > 0 ? socialFromInfo : fallbackSocial;

  const renderFooterSocialIcon = (item) => {
    const platform = resolveSocialPlatform(item);
    if (platform === 'instagram') return <SiInstagram size={15} />;
    if (platform === 'telegram') return <SiTelegram size={15} />;
    if (platform === 'x') return <SiX size={15} />;
    if (platform === 'facebook') return <SiFacebook size={15} />;
    if (platform === 'linkedin') return <BiLogoLinkedin size={16} />;
    if (platform === 'youtube') return <SiYoutube size={15} />;
    return <span style={{ fontSize: '12px', fontWeight: 600 }}>#</span>;
  };

  const coordsRaw = byKey(['coordinates', 'coords', 'location_coordinates'])?.value || '';
  const coordMatch = String(coordsRaw).match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  const lat = coordMatch ? coordMatch[1] : '';
  const lng = coordMatch ? coordMatch[2] : '';
  const mapSrc = lat && lng
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${Number(lng) - 0.01}%2C${Number(lat) - 0.01}%2C${Number(lng) + 0.01}%2C${Number(lat) + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=69.284703%2C41.270567%2C69.304703%2C41.290567&layer=mapnik&marker=41.280567%2C69.294703`;

  const renderAddress = (text) =>
    String(text || '')
      .split('\n')
      .map((line, idx) => (
        <span key={`${line}-${idx}`}>
          {line}
          <br />
        </span>
      ));

  return (
    <footer>
      <div>
        <button
          type="button"
          className="footer-logo-btn"
          onClick={onSecretAdmin}
          aria-label="Admin login"
          title="Admin login"
        >
          <div className="flogo"><img className="logo-img logo-footer" src={LOGO_SRC} alt="Layer Design" /></div>
        </button>
      </div>
      <div>
        <div className="fcity">{city}</div>
        <div className="fadr">
          {renderAddress(address)}
          <a href={phoneUrl}>{phone}</a>
        </div>
        <div className="fsocial">
          {socialItems.map((item) => (
            <a
              key={item.id || item.key || item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              title={item.title || item.key || 'social'}
              aria-label={item.title || item.key || 'social'}
            >
              {renderFooterSocialIcon(item)}
            </a>
          ))}
        </div>
      </div>
      <div className="fcopy">{t.footer.copy}</div>
      <div className="fmap-wrap">
        <div className="fmap-label">Coordinates Live Preview</div>
        <iframe className="fmap" src={mapSrc} loading="lazy" title="Office map preview" />
      </div>
    </footer>
  );
}

function PortfolioPage({ setPage, setProject, projects, t, lang, setLang, onSecretAdmin, info }) {
  const ref = useFade();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const projectTypes = useMemo(() => {
    const set = new Set();
    (projects || []).forEach((project) => {
      const raw = String(project?.project_type || '').trim();
      if (raw) set.add(raw);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (projects || []).filter((project) => {
      const matchesType = selectedType === 'all' || String(project?.project_type || '') === selectedType;
      if (!matchesType) return false;
      if (!q) return true;
      const haystack = `${project?.title || ''} ${project?.subtitle || ''} ${project?.location || ''} ${project?.style || ''} ${project?.project_type || ''}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, searchQuery, selectedType]);

  const projectRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < filteredProjects.length; i += 2) {
      rows.push(filteredProjects.slice(i, i + 2));
    }
    return rows;
  }, [filteredProjects]);

  const normalizeGridSize = (project, index) => {
    const valid = ['normal', 'wide', 'tall', 'auto'];
    if (project && valid.includes(project.grid_size)) return project.grid_size;
    // Legacy data fallback if grid_size is missing
    if (index % 5 === 0) return 'wide';
    if (index % 3 === 0) return 'tall';
    return 'normal';
  };

  return (
    <div ref={ref}>
      <Hero t={t} />
      <SiteHeader page="portfolio" setPage={setPage} t={t} lang={lang} setLang={setLang} />
      <div id="portfolio" className="pgrid-wrap">
        <div className="pfilters">
          <div className="pfilter-group">
            <label className="pfilter-label">{t.portfolioSearchLabel}</label>
            <input
              className="pfilter-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.portfolioSearchPlaceholder}
            />
          </div>
          <div className="pfilter-group">
            <label className="pfilter-label">{t.portfolioTypeLabel}</label>
            <select
              className="pfilter-input"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">{t.portfolioTypeAll}</option>
              {projectTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="pgrid">
          {projectRows.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className={`prow ${row.length === 1 ? 'single' : ''} ${rowIndex % 2 === 1 ? 'pair-reverse' : ''}`}>
              {row.map((p, cardIndex) => {
                const gridSize = normalizeGridSize(p, rowIndex * 2 + cardIndex);
                const widthClass = gridSize === 'wide' ? 'size-large' : gridSize === 'normal' ? 'size-small' : cardIndex === 0 ? 'size-small' : 'size-large';
                return (
                  <div
                    key={p.id}
                    className={`pcard pcard-ani grid-${gridSize} ${widthClass}`}
                    style={{ animationDelay: `${Math.min((rowIndex * 2 + cardIndex) * 55, 520)}ms` }}
                    onClick={() => { setProject(p); setPage("detail"); window.scrollTo(0, 0); }}
                  >
                    <img src={imgUrl(p.img)} alt={p.title} loading="lazy" />
                    <div className="pov">
                      <div className="pt">{p.title}</div>
                      <div className="ps">{p.subtitle}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          {projectRows.length === 0 && <div className="pempty">{t.portfolioNoResults}</div>}
        </div>
      </div>
      <Footer t={t} onSecretAdmin={onSecretAdmin} info={info} />
    </div>
  );
}

function DetailPage({ project, setPage, setProject, projects, gallery, t, lang, setLang, onSecretAdmin, info }) {
  const ref = useFade();
  const [projectGallery, setProjectGallery] = useState([]);
  
  console.log('DetailPage loaded with project:', project);
  
  // Fetch project-specific gallery
  useEffect(() => {
    if (!project || !project.id) return;
    
    fetch(`${API_BASE}/projects/${project.id}/gallery`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched project gallery:', data);
        setProjectGallery(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Failed to fetch project gallery:', err);
        setProjectGallery([]);
      });
  }, [project?.id]);
  
  // Safety check - redirect if no project
  if (!project) {
    console.warn('DetailPage: No project provided, redirecting to portfolio');
    return (
      <div style={{ padding: '40px', textAlign: 'center', minHeight: '100vh' }}>
        <h2>{t.loadingProject}</h2>
        <p>{t.goBackHint} <a href="/" onClick={e => { e.preventDefault(); setPage('portfolio'); }}>{t.backToPortfolio}</a></p>
      </div>
    );
  }

  console.log('Project details:', { id: project.id, title: project.title, img: project.img, style: project.style });

  const others = projects.filter(p => p.id !== project.id).slice(0, 4);
  
  // Keep gallery objects so admin-defined per-image layout can be used here.
  const galleryEntries = (Array.isArray(projectGallery) ? projectGallery : [])
    .map((g) => {
      if (typeof g === 'string') return { id: g, url: g, layout: 'auto' };
      return { id: g.id || g.url, url: g.url || g, layout: g.layout || 'auto' };
    })
    .filter((g) => g.url && typeof g.url === 'string');

  const fallbackGlobalGalleryEntries = (Array.isArray(gallery) ? gallery : [])
    .map((g) => {
      if (typeof g === 'string') return { id: g, url: g, layout: 'auto' };
      return { id: g.id || g.url, url: g.url || g, layout: g.layout || 'auto' };
    })
    .filter((g) => g.url && typeof g.url === 'string');

  const effectiveGalleryEntries = galleryEntries.length > 0 ? galleryEntries : fallbackGlobalGalleryEntries;

  console.log('Project gallery entries:', effectiveGalleryEntries.length);

  // Build gallery with project image variations
  const projectImgBase = project.img || '';
  const galleryImages = [
    ...effectiveGalleryEntries,
  ];
  
  // Add project image variations if it's a URL
  if (projectImgBase && projectImgBase.includes('http')) {
    const v1 = projectImgBase.includes('?') 
      ? projectImgBase.replace(/w=\d+/, 'w=1500')
      : projectImgBase + '?w=1500&q=80';
    const v2 = projectImgBase.includes('?')
      ? projectImgBase.replace(/w=\d+/, 'w=1200').replace(/h=\d+|$/, '&h=1700')
      : projectImgBase + '?w=1200&h=1700&q=80';
    galleryImages.push(
      { id: `${project.id}-v1`, url: v1, layout: 'auto' },
      { id: `${project.id}-v2`, url: v2, layout: 'auto' }
    );
  }

  console.log('Total gallery images:', galleryImages.length);

  const [imageKinds, setImageKinds] = useState({});

  useEffect(() => {
    setImageKinds({});
  }, [project.id]);

  const onGalleryImageLoad = (src, e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (!naturalWidth || !naturalHeight) return;
    const ratio = naturalWidth / naturalHeight;
    const kind = ratio >= 1 ? "landscape" : "portrait";
    setImageKinds(prev => (prev[src] === kind ? prev : { ...prev, [src]: kind }));
  };

  const detailDescription = t.detailDescription(project.title, project.style || t.fallbackDesign);

  // Ensure hero image URL works
  const heroImageSrc = projectImgBase.includes('?')
    ? projectImgBase.replace(/w=\d+/, 'w=2000')
    : projectImgBase + '?w=2000&q=85';

  return (
    <>
      <SiteHeader page="detail" setPage={setPage} t={t} lang={lang} setLang={setLang} />
      <main className="page detail-main" ref={ref}>
        <section className="dhero-wrap fi">
          <div className="dhero">
            <img src={imgUrl(heroImageSrc)} alt={project.title} loading="eager" />
          </div>
        </section>

        <section className="dinfo-wrap fi">
          <button className="dback" onClick={() => { setPage("portfolio"); window.scrollTo(0, 0); }}>{t.backToPortfolio}</button>
          <div className="dinfo">
            <h1 className="dtitle">{project.title}</h1>
            <p className="dsub">{project.subtitle || t.fallbackProject} · {project.style || t.fallbackDesign}</p>
            <p className="dloc">{project.location || t.fallbackLocation}</p>
            <p className="ddesc">{detailDescription}</p>
          </div>
        </section>

        <section className="dgal-wrap fi">
          <div className="dgal-grid">
            {galleryImages && galleryImages.length > 0 ? (
              galleryImages.map((entry, i) => {
                if (!entry || !entry.url || typeof entry.url !== 'string') {
                  console.warn('Invalid gallery image:', entry);
                  return null;
                }
                const key = `${entry.id || entry.url}-${i}`;
                const savedKind = entry.layout === 'landscape' || entry.layout === 'portrait' ? entry.layout : null;
                const kind = savedKind || imageKinds[key] || "portrait";
                return (
                  <figure key={key} className={`dgi ${kind}`}>
                    <img
                      src={imgUrl(entry.url)}
                      alt={`${project.title} gallery ${i + 1}`}
                      loading="lazy"
                      onLoad={e => onGalleryImageLoad(key, e)}
                      onError={e => {
                        console.error('Failed to load image:', entry.url);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </figure>
                );
              })
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#999' }}>
                <p>Loading gallery images...</p>
              </div>
            )}
          </div>
        </section>

        <div className="morewrap">
          <div className="morelbl fi">{t.moreProjects}</div>
          <div className="moregrid">
            {others.map((p, i) => (
              <div key={p.id} className="mcard fi" style={{ transitionDelay: `${i * 80}ms` }}
                onClick={() => { setProject(p); window.scrollTo(0, 0); }}>
                <img src={imgUrl(p.img)} alt={p.title} loading="lazy" />
                <div className="mcinfo">
                  <div className="mct">{p.title}</div>
                  <div className="mcs">{p.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer t={t} onSecretAdmin={onSecretAdmin} info={info} />
      </main>
    </>
  );
}

function TeamPage({ setPage, team, t, lang, setLang, onSecretAdmin, info }) {
  const ref = useFade();
  return (
    <>
      <SiteHeader page="team" setPage={setPage} t={t} lang={lang} setLang={setLang} />
      <div className="twrap" ref={ref}>
      <div className="pgh fi">{t.ourTeam}</div>
      <div className="tgrid">
        {team.map((m, i) => (
          <div key={m.id} className="tcard fi" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
            <div className="tphoto"><img src={imgUrl(m.img)} alt={m.name} loading="lazy" /></div>
            <div className="tname">{m.name}</div>
            <div className="trole">{m.role}</div>
          </div>
        ))}
      </div>
      <Footer t={t} onSecretAdmin={onSecretAdmin} info={info} />
      </div>
    </>
  );
}

function InfoPage({ setPage, partners, info, t, lang, setLang, onSecretAdmin }) {
  const ref = useFade();
  const infoItems = Array.isArray(info) ? info : [];

  const infoValueByKeys = (keys) => {
    const normalized = infoItems.map((item) => ({
      ...item,
      _k: String(item.key || '').toLowerCase(),
    }));
    const hit = normalized.find((item) => keys.includes(item._k));
    return hit?.value || '';
  };

  const dynamicAboutLead =
    infoValueByKeys([`about_lead_${lang}`, `about_lead`, `about_intro_${lang}`, `about_intro`]) ||
    t.aboutLead;
  const dynamicAboutBody =
    infoValueByKeys([`about_body_${lang}`, `about_body`, `about_text_${lang}`, `about_text`]) ||
    t.aboutBody;

  const emojiByKey = {
    email: '📧',
    phone: '📱',
    address: '📍',
    location: '📍',
    instagram: '📸',
    telegram: '✈️',
    x: '𝕏',
    twitter: '𝕏',
    facebook: '👥',
    linkedin: '💼',
    youtube: '▶️',
  };

  const withEmoji = (item) => item.emoji || emojiByKey[(item.key || '').toLowerCase()] || '🔗';
  const labelForItem = (item) => t.infoKeyLabels[(item.key || '').toLowerCase()] || item.title;

  const contactItems = (info || [])
    .filter(i => i.type === 'text' || i.type === 'email' || i.type === 'phone')
    .sort((a, b) => {
      const priority = { phone: 1, text: 2, email: 3 };
      return (priority[a.type] || 99) - (priority[b.type] || 99);
    });

  const socialItems = (info || []).filter(i => i.type === 'social');

  const normalizeText = (value = '') => String(value).toLowerCase();

  const resolveSocialPlatform = (item) => {
    const key = normalizeText(item.key);
    const title = normalizeText(item.title);
    const url = normalizeText(item.url);
    const combined = `${key} ${title} ${url}`;

    if (combined.includes('instagram')) return 'instagram';
    if (combined.includes('telegram') || combined.includes('t.me')) return 'telegram';
    if (combined.includes('x.com') || combined.includes('twitter') || key === 'x') return 'x';
    if (combined.includes('facebook') || combined.includes('fb.com')) return 'facebook';
    if (combined.includes('linkedin')) return 'linkedin';
    if (combined.includes('youtube') || combined.includes('youtu.be')) return 'youtube';
    return null;
  };

  const getSocialIcon = (item) => {
    const platform = resolveSocialPlatform(item);
    if (platform === 'instagram') return <SiInstagram size={16} />;
    if (platform === 'telegram') return <SiTelegram size={16} />;
    if (platform === 'x') return <SiX size={16} />;
    if (platform === 'facebook') return <SiFacebook size={16} />;
    if (platform === 'linkedin') return <BiLogoLinkedin size={17} />;
    if (platform === 'youtube') return <SiYoutube size={16} />;
    return <span style={{ fontSize: '15px', lineHeight: 1 }}>{withEmoji(item)}</span>;
  };

  return (
    <>
      <SiteHeader page="info" setPage={setPage} t={t} lang={lang} setLang={setLang} />
      <div className="iwrap" ref={ref}>
      <div className="ibody fi">
        <p>{dynamicAboutLead}</p>
        <div className="idiv" />
        <p className="sm">{dynamicAboutBody}</p>
      </div>

      <div className="slbl fi">{t.partners}</div>
      <div className="pgrid2 fi">
        {partners.map((p) => {
          const name = p?.name || p;
          const url = p?.url || '';
          if (url) {
            return (
              <a key={p.id || p.name} className="pitem" href={url} target="_blank" rel="noopener noreferrer">
                {name}
              </a>
            );
          }
          return <div key={p.id || p.name || name} className="pitem">{name}</div>;
        })}
      </div>

      {/* Dynamic Contact Info from Info items */}
      {info && info.length > 0 ? (
        <div className="ctcts">
          {contactItems.map((item) => (
              <div key={item.id} className="fi">
                <div className="creg">{withEmoji(item)} {labelForItem(item)}</div>
                <div className="cadr">
                  {item.url ? (
                    <a href={item.url}>{item.value}</a>
                  ) : (
                    <span>{item.value}</span>
                  )}
                </div>
              </div>
            ))
          }
        </div>
      ) : null}

      {/* Social Links from Info - Below Contact Info */}
      {info && info.length > 0 && (
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <div className="slbl fi" style={{ marginBottom: '24px' }}>{t.connect}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {socialItems.map(item => (
                <a key={item.id} href={item.url || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', padding: '12px 20px', background: '#f5f5f7', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#000', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.background = '#e5e5eb'} onMouseLeave={(e) => e.target.style.background = '#f5f5f7'}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{getSocialIcon(item)}</span>
                  {labelForItem(item)}
                </a>
              ))
            }
          </div>
        </div>
      )}

      <Footer t={t} onSecretAdmin={onSecretAdmin} info={info} />
      </div>
    </>
  );
}

// ─── ADMIN LOGIN GATE ────────────────────────────────────────────────────────

function AdminLoginPage({ onLogin }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        const { token } = await res.json();
        onLogin(token);
      } else {
        setError('Incorrect password');
      }
    } catch {
      setError('Cannot connect to server');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0a', fontFamily: "'Jost', system-ui, sans-serif",
    }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex', flexDirection: 'column', gap: 16,
        background: '#161616', padding: '48px 40px', width: 320, borderRadius: 2,
      }}>
        <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#666', marginBottom: 8 }}>Admin Access</div>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="Password"
          autoFocus
          required
          style={{
            background: '#222', border: '1px solid #333', color: '#fff', padding: '12px 14px',
            fontSize: 14, outline: 'none', borderRadius: 1,
          }}
        />
        {error && <div style={{ fontSize: 12, color: '#e55', letterSpacing: '0.05em' }}>{error}</div>}
        <button type="submit" disabled={loading} style={{
          background: '#fff', color: '#0a0a0a', border: 'none', padding: '13px',
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, borderRadius: 1,
        }}>
          {loading ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage]           = useState("portfolio");
  const [project, setProject]     = useState(null);
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem('admin_token') || '');
  const [lang, setLangState]      = useState(() => {
    const saved = localStorage.getItem('layer_lang');
    return saved === 'ru' ? 'ru' : 'uz';
  });
  
  // State for dynamic data from backend
  const [projects, setProjects]   = useState(DEFAULT_PROJECTS);
  const [gallery, setGallery]     = useState(DEFAULT_GALLERY);
  const [team, setTeam]           = useState(DEFAULT_TEAM);
  const [partners, setPartners]   = useState(DEFAULT_PARTNERS);
  const [info, setInfo]           = useState([]);
  const t = I18N[lang] || I18N.uz;

  const setLang = (nextLang) => {
    setLangState(nextLang);
    localStorage.setItem('layer_lang', nextLang);
  };

  // Refresh data function
  const refreshData = async () => {
    try {
      const [pRes, gRes, tRes, paRes, iRes] = await Promise.all([
        fetch(`${API_BASE}/projects`),
        fetch(`${API_BASE}/gallery`),
        fetch(`${API_BASE}/team`),
        fetch(`${API_BASE}/partners`),
        fetch(`${API_BASE}/info`),
      ]);

      if (pRes.ok) {
        const pData = await pRes.json();
        setProjects(pData);
        // If a project is selected, update it with fresh data
        if (project && pData.length > 0) {
          const updated = pData.find(p => p.id === project.id);
          if (updated) setProject(updated);
        }
      }
      if (gRes.ok) setGallery(await gRes.json());
      if (tRes.ok) setTeam(await tRes.json());
      if (paRes.ok) setPartners(await paRes.json());
      if (iRes.ok) setInfo(await iRes.json());
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    refreshData();
  }, []);

  // Refresh data when returning from admin
  useEffect(() => {
    if (page !== 'admin') {
      refreshData();
    }
  }, [page]);

  // Handle page changes
  const handleSetPage = (newPage) => {
    setPage(newPage);
    if (newPage === 'portfolio') {
      setProject(null);
    }
  };

  const handleSetProject = (proj) => {
    setProject(proj);
  };

  const handleLogin = (token) => {
    sessionStorage.setItem('admin_token', token);
    setAdminToken(token);
  };

  const handleLogout = () => {
    fetch(`${API_BASE}/admin/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    }).catch(() => {});
    sessionStorage.removeItem('admin_token');
    setAdminToken('');
    setPage('portfolio');
  };

  const handleSessionExpired = () => {
    sessionStorage.removeItem('admin_token');
    setAdminToken('');
    // Keep user in admin flow and show login gate instead of kicking to portfolio.
    setPage('admin');
  };

  const openAdmin = () => setPage('admin');

  // Secret admin entry points:
  // 1) Keyboard: Ctrl+Shift+#
  // 2) URL: ?admin=1 or #admin
  useEffect(() => {
    const url = new URL(window.location.href);
    const byQuery = url.searchParams.get('admin') === '1';
    const byHash = window.location.hash.toLowerCase() === '#admin';
    if (byQuery || byHash) {
      setPage('admin');
    }

    const onKeyDown = (e) => {
      const isHashCombo = e.ctrlKey && e.shiftKey && (e.key === '#' || e.code === 'Digit3');
      if (isHashCombo) {
        e.preventDefault();
        setPage('admin');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <style>{css}</style>
      {page === "admin"     && (!adminToken
        ? <AdminLoginPage onLogin={handleLogin} />
        : <AdminPanel token={adminToken} onLogout={handleLogout} onSessionExpired={handleSessionExpired} lang={lang} setLang={setLang} />
      )}
      {page === "portfolio" && <PortfolioPage setPage={setPage} setProject={setProject} projects={projects} t={t} lang={lang} setLang={setLang} onSecretAdmin={openAdmin} info={info} />}
      {page === "detail"    && project && <DetailPage project={project} setPage={setPage} setProject={setProject} projects={projects} gallery={gallery} t={t} lang={lang} setLang={setLang} onSecretAdmin={openAdmin} info={info} />}
      {page === "team"      && <TeamPage setPage={setPage} team={team} t={t} lang={lang} setLang={setLang} onSecretAdmin={openAdmin} info={info} />}
      {page === "info"      && <InfoPage setPage={setPage} partners={partners} info={info} t={t} lang={lang} setLang={setLang} onSecretAdmin={openAdmin} />}
    </>
  );
}
