import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";


// ── BOOT SCREEN ──────────────────────────────────────────────────────────────



// ── COLORS ─────────────────────────────────────────────────────────────────────
const C={bg:"#0A0A0A",panel:"#111111",p2:"#1C1C1C",border:"#2A2A2A",
  text:"#F0EDE4",dim:"#888",faint:"#555",
  red:"#CC0000",yellow:"#FFCB05",blue:"#4A5FD6",
  green:"#3DBB50",orange:"#F08030",purple:"#9B6FE8"};

// ── UTILS ──────────────────────────────────────────────────────────────────────
const FEE=0.87;
const P1=(p,n)=>1-Math.pow(1-p,n);
const avgN=p=>Math.round(1/p);
const fmt$=v=>(v==null||!isFinite(v))?"—":v>=1000?`$${(v/1000).toFixed(1)}k`:`$${Math.round(v)}`;
const fmtPct=x=>x<0.001?(x*100).toFixed(3)+"%":(x*100).toFixed(1)+"%";
const packs4=(p,t)=>Math.ceil(Math.log(1-t)/Math.log(1-p));

// ── SET ARTWORK COLORS ──────────────────────────────────────────────────────
const SET_COLORS={
  en_pitch:{g1:"#1a1a1a",g2:"#4a4a4a",accent:"#ff00ff"},
  en_30th:{g1:"#2d5a3d",g2:"#ff6b35",accent:"#ffd700"},
  en_delta:{g1:"#1a3a5c",g2:"#ff4444",accent:"#3dd9ff"},
  en_chaos:{g1:"#3d1a1a",g2:"#ff6b35",accent:"#ff00ff"},
  en_phantasmal:{g1:"#4a2020",g2:"#ff8c00",accent:"#ff0000"},
  en_perfect:{g1:"#1a3a4a",g2:"#00ccff",accent:"#ffff00"},
  en_ascended:{g1:"#2a1a4a",g2:"#aa77ff",accent:"#ffcc00"},
  en_destined:{g1:"#3a1a2a",g2:"#9b6fe8",accent:"#ff00ff"},
  en_prismatic:{g1:"#1a3a3a",g2:"#00ffff",accent:"#ff0099"},
  en_journey:{g1:"#2a3a1a",g2:"#88dd00",accent:"#ffaa00"},
  en_151:{g1:"#3a2a1a",g2:"#ccaa00",accent:"#ffff00"},
  en_surging:{g1:"#1a2a4a",g2:"#0088ff",accent:"#ffff00"},
  en_paldean:{g1:"#2a1a3a",g2:"#ff00ff",accent:"#00ff00"},
  en_paradox:{g1:"#3a1a1a",g2:"#ff4444",accent:"#00ffff"},
  en_evolving:{g1:"#1a2a4a",g2:"#0099ff",accent:"#ff00ff"},
  en_crown:{g1:"#3a1a2a",g2:"#ff00ff",accent:"#ffff00"},
  en_shining:{g1:"#2a3a1a",g2:"#ffff00",accent:"#ff6600"},
  en_celebrations:{g1:"#2a1a3a",g2:"#ff00ff",accent:"#00ff00"},
  en_surging2:{g1:"#1a3a4a",g2:"#0099ff",accent:"#ffff00"},
  jp_sv4a:{g1:"#1a4a2a",g2:"#00ff00",accent:"#ff00ff"},
  jp_s8b:{g1:"#3a1a4a",g2:"#aa77ff",accent:"#ffaa00"},
  jp_s12a:{g1:"#1a2a4a",g2:"#0088ff",accent:"#ffff00"},
  jp_sv2a:{g1:"#2a3a1a",g2:"#88dd00",accent:"#ff00ff"},
  jp_m2a:{g1:"#3a2a1a",g2:"#cc8800",accent:"#ff00ff"},
  jp_m1:{g1:"#1a3a3a",g2:"#00ccff",accent:"#ffaa00"},
  jp_s4a:{g1:"#2a1a3a",g2:"#ff00ff",accent:"#ffff00"},
  jp_sm12a:{g1:"#3a1a1a",g2:"#ff0000",accent:"#ffff00"},
  kr_sv4a:{g1:"#1a2a3a",g2:"#0099ff",accent:"#ff00ff"},
  kr_sv2a:{g1:"#2a1a3a",g2:"#ff00ff",accent:"#ffff00"},
  kr_sv8a:{g1:"#3a2a1a",g2:"#cc8800",accent:"#00ff00"},
  kr_s8b:{g1:"#1a3a2a",g2:"#00ff00",accent:"#ff00ff"},
};

const genPackSVG=(setId,name)=>{
  const colors=SET_COLORS[setId]||{g1:"#2a2a4a",g2:"#6666ff",accent:"#ffff00"};
  const g1e=encodeURIComponent(colors.g1);
  const g2e=encodeURIComponent(colors.g2);
  const ace=encodeURIComponent(colors.accent);
  const ne=encodeURIComponent(name.split(' ')[0]);
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 160'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:${g1e};stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:${g2e};stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='160' fill='url(%23g)'/%3E%3Crect x='8' y='8' width='104' height='144' fill='none' stroke='${ace}' stroke-width='2' rx='4'/%3E%3Ccircle cx='60' cy='40' r='12' fill='${ace}'/%3E%3Ctext x='60' y='130' font-size='9' font-weight='bold' text-anchor='middle' fill='${ace}'%3E${ne}%3C/text%3E%3C/svg%3E`;
};

// ── PRODUCT CATALOG ────────────────────────────────────────────────────────────
const PT={
  raw_card: {n:"Raw single (ungraded)",    pk:0, msrp:null,   cat:"Singles"},
  psa10:    {n:"PSA 10 — Gem Mint",        pk:0, msrp:null,   cat:"Singles"},
  psa9:     {n:"PSA 9 — Mint",             pk:0, msrp:null,   cat:"Singles"},
  tag10:    {n:"TAG 10 — Gold",            pk:0, msrp:null,   cat:"Singles"},
  cgc10:    {n:"CGC 10 — Pristine",        pk:0, msrp:null,   cat:"Singles"},
  loose:    {n:"Loose pack",               pk:1, msrp:4.49,   cat:"Packs",      warn:"⚠ May be searched"},
  b1:       {n:"1-pack blister",           pk:1, msrp:5.99,   cat:"Packs"},
  b2:       {n:"2-pack blister",           pk:2, msrp:9.99,   cat:"Packs"},
  b3:       {n:"3-pack blister",           pk:3, msrp:13.99,  cat:"Packs"},
  mini_tin: {n:"Mini tin (2p)",            pk:2, msrp:9.99,   cat:"Tins"},
  tin_s:    {n:"Collector tin (3p)",       pk:3, msrp:19.99,  cat:"Tins"},
  tin_l:    {n:"Premium tin (4p)",         pk:4, msrp:24.99,  cat:"Tins"},
  pball:    {n:"Poké Ball tin (3p)",       pk:3, msrp:19.99,  cat:"Tins"},
  bb:       {n:"Build & Battle (4p)",      pk:4, msrp:14.99,  cat:"Decks"},
  pin:      {n:"Pin collection (3p)",      pk:3, msrp:19.99,  cat:"Collections"},
  cbox:     {n:"Collection box (4p)",      pk:4, msrp:24.99,  cat:"Collections"},
  prem:     {n:"Premium collection (8p)",  pk:8, msrp:49.99,  cat:"Collections"},
  upc:      {n:"Ultra Premium (16p+)",     pk:16,msrp:119.99, cat:"Collections"},
  bundle:   {n:"Bundle / 6-pack",          pk:6, msrp:26.99,  cat:"ETBs & Bundles"},
  etb:      {n:"Elite Trainer Box (9p)",   pk:9, msrp:49.99,  cat:"ETBs & Bundles"},
  pcetb:    {n:"PC ETB (11p + promo)",     pk:11,msrp:59.99,  cat:"ETBs & Bundles"},
  box:      {n:"Booster box (36p)",        pk:36,msrp:143.64, cat:"Boxes & Cases"},
  case6:    {n:"Case (6 boxes)",           pk:216,msrp:862,   cat:"Boxes & Cases"},
  jp_pack:  {n:"JP pack (5c, ¥180)",       pk:1, msrp:1.50,   cat:"Japanese"},
  jp_p200:  {n:"JP pack (5c, ¥200)",       pk:1, msrp:1.70,   cat:"Japanese"},
  jp_hcp:   {n:"JP HC pack (10c, ¥450)",   pk:1, msrp:4.50,   cat:"Japanese"},
  jp_box:   {n:"JP box (30p, ¥5,400)",     pk:30,msrp:45,     cat:"Japanese"},
  jp_box6k: {n:"JP box (30p, ¥6,000)",     pk:30,msrp:50,     cat:"Japanese"},
  jp_hcbox: {n:"JP HC box (10p, ¥4,500)",  pk:10,msrp:45,     cat:"Japanese"},
  kr_pack:  {n:"KR pack (5c)",             pk:1, msrp:1.20,   cat:"Korean"},
  kr_box:   {n:"KR box (30p)",             pk:30,msrp:25,     cat:"Korean"},
  // ── SPECIAL COLLECTIONS (figures, giant tins, etc.) ──
  figure_col:{n:"Figure Collection (6p + figure)", pk:6, msrp:39.99,  cat:"Collections", note:"Articulated figure + 6 packs + promo. These sell fast at launch."},
  prem_fig:  {n:"Premium Figure Collection (6p + oversized)", pk:6, msrp:49.99, cat:"Collections", note:"Figure + oversized card + 6 packs. High collector demand."},
  giant_tin: {n:"Giant Premium Tin (6p + promo)", pk:6, msrp:39.99,  cat:"Tins",        note:"Large tin with foil promo card(s). ~6 weeks after set launch."},
  chest:     {n:"Collector's Chest (6p + accessories)", pk:6, msrp:29.99, cat:"Tins",  note:"Flip-open chest with coins, dice, sleeve set + 6 packs."},
  stadium:   {n:"Stadium Collection (8p + mat)", pk:8, msrp:54.99,   cat:"Collections", note:"Playmat + 8 packs + promo. Limited print run."},
  binder_col:{n:"Binder Collection (6p + binder)", pk:6, msrp:54.99, cat:"Collections", note:"Premium binder + 6 packs + sleeves."},
  holiday_etb:{n:"Holiday ETB (9p + extras)", pk:9, msrp:59.99,      cat:"ETBs & Bundles", note:"Holiday variant ETB with extra accessories. Limited."},
};

// ── GRADERS ────────────────────────────────────────────────────────────────────
const GRADERS=[
  {id:"psa",n:"PSA",cost:80, days:"40-50d",m10:1.00,m9:0.38,best:"Max resale"},
  {id:"tag",n:"TAG",cost:149,days:"15-30d",m10:0.80,m9:0.34,best:"Fastest"},
  {id:"cgc",n:"CGC",cost:16, days:"60-100d",m10:0.78,m9:0.33,best:"Budget"},
  {id:"bgs",n:"BGS",cost:25, days:"60d+",  m10:0.83,m9:0.35,best:"Crossover"},
];

// ── OHLC PRICE HISTORY ─────────────────────────────────────────────────────────
// o=open h=high l=low c=close v=volume (activity proxy)
const OHLC={
  // ── BUNDLE & ADDITIONAL PRODUCT DATA ────────────────────────────────────
  en_chaos:{
    etb:[
      {d:"May 22",o:50,h:58,l:48,c:55,v:80},{d:"May 28",o:55,h:62,l:52,c:58,v:72},
      {d:"Jun 5",o:58,h:65,l:55,c:62,v:66},{d:"Jun 12",o:62,h:68,l:58,c:60,v:62},
      {d:"Jun 20",o:60,h:66,l:56,c:58,v:58},
    ],
    box:[
      {d:"May 22",o:168,h:198,l:162,c:192,v:28},{d:"May 28",o:192,h:225,l:185,c:218,v:26},
      {d:"Jun 5",o:218,h:252,l:210,c:245,v:24},{d:"Jun 12",o:245,h:278,l:236,c:262,v:22},
      {d:"Jun 20",o:262,h:285,l:228,c:235,v:20},
    ],
    bundle:[
      {d:"May 22",o:27,h:30,l:26,c:28,v:65},{d:"May 28",o:28,h:32,l:27,c:30,v:58},
      {d:"Jun 10",o:30,h:33,l:28,c:31,v:52},{d:"Jun 20",o:31,h:33,l:27,c:30,v:48},
    ],
    loose:[
      {d:"May 22",o:5.50,h:7,l:5,c:6.50,v:320},{d:"May 28",o:6.50,h:8,l:6,c:7,v:290},
      {d:"Jun 10",o:7,h:8.50,l:6.50,c:7.50,v:265},{d:"Jun 20",o:7.50,h:8.50,l:6,c:6.50,v:240},
    ]
  },
  en_phantasmal:{
    etb:[
      {d:"Nov'25",o:48,h:58,l:45,c:55,v:90},{d:"Jan'26",o:55,h:70,l:52,c:67,v:75},
      {d:"Mar'26",o:67,h:76,l:62,c:68,v:65},{d:"May'26",o:68,h:73,l:58,c:60,v:57},
      {d:"Jun'26",o:60,h:65,l:49,c:52,v:54},
    ],
    box:[
      {d:"Nov'25",o:148,h:178,l:142,c:172,v:32},{d:"Jan'26",o:172,h:215,l:165,c:208,v:27},
      {d:"Mar'26",o:208,h:238,l:200,c:215,v:23},{d:"May'26",o:215,h:228,l:178,c:185,v:20},
      {d:"Jun'26",o:185,h:195,l:140,c:148,v:19},
    ],
    bundle:[
      {d:"Nov'25",o:27,h:30,l:26,c:28,v:90},{d:"Jan'26",o:28,h:32,l:27,c:30,v:78},
      {d:"Mar'26",o:30,h:33,l:28,c:29,v:68},{d:"May'26",o:29,h:32,l:26,c:28,v:60},
      {d:"Jun'26",o:28,h:30,l:25,c:28,v:55},
    ]
  },
  en_destined:{
    etb:[
      {d:"Jun'25",o:50,h:68,l:47,c:64,v:120},{d:"Aug'25",o:64,h:105,l:60,c:100,v:100},
      {d:"Oct'25",o:100,h:136,l:94,c:131,v:87},{d:"Dec'25",o:131,h:158,l:124,c:153,v:76},
      {d:"Feb'26",o:153,h:173,l:146,c:168,v:68},{d:"Apr'26",o:168,h:185,l:160,c:181,v:62},
      {d:"Jun'26",o:181,h:194,l:132,c:140,v:56},
    ],
    box:[
      {d:"Jun'25",o:145,h:188,l:138,c:180,v:45},{d:"Aug'25",o:180,h:292,l:172,c:282,v:37},
      {d:"Oct'25",o:282,h:425,l:270,c:415,v:31},{d:"Dec'25",o:415,h:548,l:399,c:538,v:27},
      {d:"Feb'26",o:538,h:642,l:519,c:632,v:24},{d:"Apr'26",o:632,h:714,l:610,c:704,v:22},
      {d:"Jun'26",o:704,h:768,l:548,c:565,v:20},
    ],
    bundle:[
      {d:"Jun'25",o:27,h:35,l:26,c:32,v:120},{d:"Aug'25",o:32,h:48,l:30,c:45,v:100},
      {d:"Oct'25",o:45,h:62,l:43,c:58,v:88},{d:"Dec'25",o:58,h:75,l:55,c:70,v:78},
      {d:"Feb'26",o:70,h:84,l:67,c:80,v:70},{d:"Apr'26",o:80,h:92,l:77,c:88,v:64},
      {d:"Jun'26",o:88,h:95,l:68,c:90,v:58},
    ]
  },
  en_prismatic:{
    etb:[
      {d:"Jan'25",o:50,h:66,l:47,c:62,v:200},{d:"Mar'25",o:62,h:98,l:58,c:93,v:164},
      {d:"May'25",o:93,h:125,l:88,c:120,v:138},{d:"Jul'25",o:120,h:145,l:114,c:138,v:119},
      {d:"Sep'25",o:138,h:158,l:131,c:151,v:105},{d:"Nov'25",o:151,h:168,l:144,c:162,v:94},
      {d:"Jan'26",o:162,h:176,l:154,c:171,v:86},{d:"Mar'26",o:171,h:186,l:163,c:180,v:80},
      {d:"May'26",o:180,h:190,l:170,c:183,v:75},{d:"Jun'26",o:183,h:190,l:132,c:140,v:72},
    ],
    bundle:[
      {d:"Jan'25",o:27,h:34,l:26,c:32,v:180},{d:"Mar'25",o:32,h:44,l:30,c:42,v:155},
      {d:"May'25",o:42,h:54,l:40,c:51,v:135},{d:"Jul'25",o:51,h:62,l:49,c:59,v:118},
      {d:"Sep'25",o:59,h:68,l:56,c:65,v:105},{d:"Nov'25",o:65,h:73,l:62,c:70,v:95},
      {d:"Jan'26",o:70,h:77,l:67,c:74,v:88},{d:"Mar'26",o:74,h:80,l:71,c:77,v:82},
      {d:"Jun'26",o:77,h:82,l:62,c:75,v:76},
    ],
    mini_tin:[
      {d:"Jan'25",o:10,h:14,l:9,c:13,v:320},{d:"Apr'25",o:13,h:18,l:12,c:17,v:268},
      {d:"Jul'25",o:17,h:22,l:16,c:21,v:225},{d:"Oct'25",o:21,h:26,l:20,c:25,v:192},
      {d:"Jan'26",o:25,h:30,l:24,c:28,v:168},{d:"Jun'26",o:28,h:32,l:24,c:28,v:148},
    ]
  },
  en_151:{
    etb:[
      {d:"Sep'23",o:50,h:68,l:47,c:64,v:150},{d:"Nov'23",o:64,h:100,l:60,c:96,v:124},
      {d:"Jan'24",o:96,h:128,l:90,c:122,v:106},{d:"Mar'24",o:122,h:152,l:116,c:146,v:93},
      {d:"Jun'24",o:146,h:175,l:139,c:169,v:82},{d:"Sep'24",o:169,h:200,l:162,c:194,v:73},
      {d:"Dec'24",o:194,h:220,l:186,c:212,v:65},{d:"Mar'25",o:212,h:240,l:204,c:232,v:58},
      {d:"Jun'25",o:232,h:254,l:224,c:246,v:53},{d:"Sep'25",o:246,h:262,l:236,c:254,v:50},
      {d:"Dec'25",o:254,h:270,l:244,c:262,v:48},{d:"Jun'26",o:262,h:275,l:212,c:220,v:45},
    ],
    bundle:[
      {d:"Sep'23",o:27,h:36,l:26,c:34,v:150},{d:"Jan'24",o:34,h:48,l:32,c:46,v:120},
      {d:"May'24",o:46,h:62,l:44,c:60,v:100},{d:"Sep'24",o:60,h:76,l:58,c:74,v:85},
      {d:"Jan'25",o:74,h:90,l:72,c:88,v:75},{d:"May'25",o:88,h:105,l:86,c:102,v:68},
      {d:"Jun'26",o:102,h:118,l:80,c:120,v:60},
    ],
    upc:[
      {d:"Sep'23",o:120,h:148,l:115,c:142,v:28},{d:"2024",o:142,h:240,l:138,c:230,v:20},
      {d:"2025",o:230,h:420,l:225,c:408,v:13},{d:"Jun'26",o:408,h:480,l:320,c:650,v:9},
    ]
  },
  en_journey:{
    etb:[
      {d:"Mar'25",o:50,h:66,l:47,c:62,v:85},{d:"May'25",o:62,h:82,l:58,c:78,v:72},
      {d:"Aug'25",o:78,h:98,l:74,c:94,v:62},{d:"Nov'25",o:94,h:112,l:90,c:108,v:54},
      {d:"Feb'26",o:108,h:125,l:104,c:120,v:48},{d:"Jun'26",o:120,h:135,l:82,c:85,v:42},
    ],
    box:[
      {d:"Mar'25",o:145,h:168,l:142,c:162,v:32},{d:"May'25",o:162,h:200,l:158,c:195,v:26},
      {d:"Aug'25",o:195,h:238,l:190,c:232,v:22},{d:"Nov'25",o:232,h:268,l:228,c:258,v:19},
      {d:"Feb'26",o:258,h:290,l:254,c:278,v:17},{d:"Jun'26",o:278,h:300,l:240,c:250,v:15},
    ],
    bundle:[
      {d:"Mar'25",o:27,h:34,l:26,c:32,v:95},{d:"Jun'25",o:32,h:42,l:30,c:40,v:78},
      {d:"Sep'25",o:40,h:50,l:38,c:48,v:65},{d:"Jun'26",o:48,h:55,l:38,c:40,v:52},
    ]
  },
  en_paradox:{
    etb:[
      {d:"Q4'23",o:50,h:65,l:47,c:60,v:88},{d:"Q2'24",o:60,h:80,l:56,c:75,v:72},
      {d:"Q4'24",o:75,h:92,l:71,c:87,v:60},{d:"Jun'26",o:87,h:100,l:60,c:65,v:48},
    ],
    box:[
      {d:"Q4'23",o:145,h:175,l:142,c:168,v:30},{d:"Q2'24",o:168,h:215,l:164,c:208,v:24},
      {d:"Q4'24",o:208,h:255,l:204,c:248,v:20},{d:"Jun'26",o:248,h:280,l:185,c:190,v:16},
    ]
  },
  en_paldean:{
    etb:[
      {d:"Jan'24",o:50,h:68,l:47,c:64,v:95},{d:"May'24",o:64,h:85,l:60,c:80,v:78},
      {d:"Sep'24",o:80,h:102,l:76,c:98,v:66},{d:"Jan'25",o:98,h:118,l:94,c:112,v:58},
      {d:"Jun'26",o:112,h:125,l:88,c:100,v:50},
    ]
  },
  en_surging:{
    etb:[
      {d:"Nov'24",o:50,h:65,l:47,c:61,v:95},{d:"Feb'25",o:61,h:94,l:57,c:90,v:77},
      {d:"May'25",o:90,h:115,l:85,c:110,v:64},{d:"Aug'25",o:110,h:130,l:104,c:125,v:55},
      {d:"Nov'25",o:125,h:141,l:119,c:136,v:48},{d:"Mar'26",o:136,h:152,l:130,c:145,v:42},
      {d:"Jun'26",o:145,h:158,l:128,c:130,v:38},
    ],
    box:[
      {d:"Nov'24",o:145,h:165,l:142,c:158,v:32},{d:"Mar'25",o:158,h:195,l:155,c:188,v:26},
      {d:"Jun'25",o:188,h:228,l:182,c:220,v:22},{d:"Sep'25",o:220,h:262,l:215,c:254,v:19},
      {d:"Dec'25",o:254,h:288,l:248,c:278,v:17},{d:"Jun'26",o:278,h:315,l:265,c:300,v:15},
    ],
    bundle:[
      {d:"Nov'24",o:27,h:32,l:26,c:30,v:95},{d:"Mar'25",o:30,h:38,l:28,c:36,v:78},
      {d:"Jun'25",o:36,h:44,l:34,c:42,v:65},{d:"Sep'25",o:42,h:48,l:40,c:46,v:55},
      {d:"Jun'26",o:46,h:52,l:40,c:45,v:48},
    ]
  },
  en_evolving:{
    etb:[
      {d:"Aug'21",o:48,h:64,l:44,c:58,v:92},{d:"Dec'21",o:58,h:102,l:54,c:96,v:74},
      {d:"Jun'22",o:96,h:150,l:90,c:144,v:58},{d:"Dec'22",o:144,h:188,l:138,c:182,v:50},
      {d:"Jun'23",o:182,h:230,l:175,c:224,v:43},{d:"Dec'23",o:224,h:280,l:218,c:272,v:38},
      {d:"Jun'24",o:272,h:328,l:265,c:318,v:33},{d:"Dec'24",o:318,h:362,l:310,c:352,v:30},
      {d:"Jun'25",o:352,h:378,l:338,c:345,v:27},{d:"Dec'25",o:345,h:355,l:312,c:320,v:25},
      {d:"Jun'26",o:320,h:338,l:300,c:310,v:24},
    ],
    box:[
      {d:"Aug'21",o:185,h:225,l:175,c:215,v:32},{d:"Dec'21",o:215,h:370,l:205,c:355,v:27},
      {d:"Jun'22",o:355,h:580,l:340,c:562,v:22},{d:"Dec'22",o:562,h:900,l:542,c:878,v:18},
      {d:"Jun'23",o:878,h:1320,l:850,c:1295,v:15},{d:"Dec'23",o:1295,h:1850,l:1262,c:1818,v:13},
      {d:"Jun'24",o:1818,h:2350,l:1780,c:2318,v:12},{d:"Dec'24",o:2318,h:2680,l:2280,c:2652,v:11},
      {d:"Jun'25",o:2652,h:2820,l:2615,c:2795,v:10},{d:"Dec'25",o:2795,h:2865,l:2748,c:2838,v:9},
      {d:"Jun'26",o:2838,h:2920,l:2762,c:2600,v:9},
    ],
    bundle:[
      {d:"Aug'21",o:27,h:35,l:26,c:33,v:180},{d:"2022",o:33,h:55,l:31,c:52,v:130},
      {d:"2023",o:52,h:75,l:50,c:72,v:95},{d:"2024",o:72,h:95,l:70,c:90,v:72},
      {d:"2025",o:90,h:112,l:88,c:108,v:58},{d:"Jun'26",o:108,h:118,l:88,c:95,v:50},
    ]
  },
  en_crown:{
    etb:[
      {d:"Jan'23",o:50,h:65,l:47,c:60,v:110},{d:"Jul'23",o:60,h:105,l:56,c:100,v:84},
      {d:"Jan'24",o:100,h:148,l:95,c:144,v:68},{d:"Jul'24",o:144,h:182,l:138,c:175,v:57},
      {d:"Jan'25",o:175,h:220,l:168,c:212,v:49},{d:"Jul'25",o:212,h:248,l:204,c:240,v:43},
      {d:"Jan'26",o:240,h:268,l:232,c:260,v:38},{d:"Jun'26",o:260,h:282,l:218,c:225,v:35},
    ]
  },
  en_shining:{
    etb:[
      {d:"Feb'21",o:50,h:66,l:47,c:62,v:140},{d:"2022",o:62,h:120,l:58,c:115,v:96},
      {d:"2023",o:115,h:163,l:110,c:158,v:75},{d:"2024",o:158,h:200,l:152,c:194,v:62},
      {d:"2025",o:194,h:218,l:188,c:208,v:52},{d:"Jun'26",o:208,h:225,l:174,c:180,v:48},
    ]
  },
  // ── JP HIGH CLASS BOX OHLC ─────────────────────────────────────────────────
  jp_sv4a:{
    jp_hcbox:[
      {d:"Dec'23",o:148,h:182,l:142,c:175,v:44},{d:"Mar'24",o:175,h:215,l:168,c:208,v:37},
      {d:"Jun'24",o:208,h:250,l:200,c:242,v:31},{d:"Sep'24",o:242,h:278,l:235,c:270,v:26},
      {d:"Dec'24",o:270,h:298,l:262,c:288,v:22},{d:"Mar'25",o:288,h:312,l:280,c:305,v:19},
      {d:"Jun'26",o:305,h:318,l:235,c:245,v:16},
    ]
  },
  jp_s8b:{
    jp_hcbox:[
      {d:"Dec'21",o:115,h:155,l:110,c:148,v:58},{d:"Jun'22",o:148,h:225,l:140,c:215,v:46},
      {d:"Dec'22",o:215,h:305,l:208,c:295,v:39},{d:"Jun'23",o:295,h:375,l:285,c:362,v:33},
      {d:"Dec'23",o:362,h:438,l:352,c:425,v:28},{d:"Jun'24",o:425,h:488,l:415,c:478,v:23},
      {d:"Dec'24",o:478,h:525,l:468,c:515,v:19},{d:"Jun'26",o:515,h:528,l:385,c:400,v:15},
    ]
  },
  jp_s12a:{
    jp_hcbox:[
      {d:"Dec'22",o:148,h:188,l:142,c:180,v:50},{d:"Jun'23",o:180,h:252,l:172,c:242,v:42},
      {d:"Dec'23",o:242,h:328,l:234,c:318,v:35},{d:"Jun'24",o:318,h:385,l:308,c:375,v:29},
      {d:"Dec'24",o:375,h:428,l:365,c:418,v:24},{d:"Jun'26",o:418,h:438,l:338,c:350,v:19},
    ]
  },
  jp_sv2a:{
    jp_box:[
      {d:"Jun'23",o:68,h:92,l:64,c:88,v:60},{d:"Sep'23",o:88,h:135,l:82,c:128,v:50},
      {d:"Dec'23",o:128,h:180,l:120,c:172,v:42},{d:"Jun'24",o:172,h:235,l:164,c:225,v:36},
      {d:"Dec'24",o:225,h:285,l:218,c:275,v:29},{d:"Jun'25",o:275,h:325,l:268,c:315,v:23},
      {d:"Jun'26",o:315,h:355,l:335,c:350,v:18},
    ]
  },
  jp_m2a:{
    jp_hcbox:[
      {d:"Sep'25",o:148,h:182,l:142,c:172,v:36},{d:"Nov'25",o:172,h:208,l:165,c:198,v:30},
      {d:"Feb'26",o:198,h:232,l:190,c:225,v:25},{d:"Jun'26",o:225,h:248,l:210,c:220,v:20},
    ]
  },
  jp_m1:{
    jp_box:[
      {d:"Mar'25",o:68,h:85,l:64,c:80,v:40},{d:"Jun'25",o:80,h:102,l:76,c:96,v:33},
      {d:"Sep'25",o:96,h:115,l:90,c:108,v:27},{d:"Jun'26",o:108,h:122,l:92,c:98,v:22},
    ]
  },
  jp_s4a:{
    jp_hcbox:[
      {d:"Nov'20",o:65,h:88,l:62,c:82,v:65},{d:"2021",o:82,h:158,l:78,c:150,v:52},
      {d:"2022",o:150,h:265,l:142,c:255,v:42},{d:"2023",o:255,h:368,l:245,c:355,v:34},
      {d:"2024",o:355,h:435,l:342,c:422,v:28},{d:"Jun'26",o:422,h:462,l:435,c:450,v:22},
    ]
  },
  jp_sm12a:{
    jp_hcbox:[
      {d:"2019",o:55,h:72,l:52,c:68,v:70},{d:"2021",o:68,h:145,l:65,c:138,v:55},
      {d:"2022",o:138,h:285,l:132,c:275,v:44},{d:"2023",o:275,h:445,l:268,c:432,v:36},
      {d:"2024",o:432,h:555,l:422,c:542,v:28},{d:"Jun'26",o:542,h:618,l:582,c:600,v:20},
    ]
  },
  // ── JP STANDARD BOX OHLC (all missing sets) ──────────────────────────────
  jp_m4:{jp_box:[
    {d:"Dec'25",o:58,h:72,l:54,c:68,v:55},{d:"Jan'26",o:68,h:82,l:64,c:76,v:48},
    {d:"Mar'26",o:76,h:92,l:70,c:88,v:42},{d:"May'26",o:88,h:102,l:80,c:95,v:36},
    {d:"Jun'26",o:95,h:108,l:82,c:98,v:30},
  ]},
  jp_m3:{jp_box:[
    {d:"Sep'25",o:72,h:88,l:68,c:84,v:48},{d:"Nov'25",o:84,h:100,l:80,c:96,v:40},
    {d:"Jan'26",o:96,h:115,l:90,c:110,v:33},{d:"Mar'26",o:110,h:125,l:105,c:120,v:27},
    {d:"Jun'26",o:120,h:130,l:100,c:110,v:22},
  ]},
  jp_m2:{jp_box:[
    {d:"Jun'25",o:62,h:78,l:58,c:74,v:52},{d:"Aug'25",o:74,h:92,l:70,c:88,v:44},
    {d:"Oct'25",o:88,h:105,l:84,c:100,v:37},{d:"Dec'25",o:100,h:115,l:95,c:110,v:30},
    {d:"Jun'26",o:110,h:120,l:88,c:100,v:24},
  ]},
  jp_sv11w:{jp_box:[
    {d:"Nov'24",o:42,h:55,l:38,c:52,v:60},{d:"Jan'25",o:52,h:68,l:48,c:64,v:50},
    {d:"Mar'25",o:64,h:78,l:60,c:74,v:42},{d:"Jun'25",o:74,h:88,l:68,c:82,v:35},
    {d:"Sep'25",o:82,h:95,l:75,c:88,v:29},{d:"Jun'26",o:88,h:98,l:72,c:80,v:22},
  ]},
  jp_sv9:{jp_box:[
    {d:"Aug'24",o:38,h:50,l:35,c:47,v:58},{d:"Oct'24",o:47,h:60,l:44,c:57,v:48},
    {d:"Dec'24",o:57,h:70,l:54,c:66,v:40},{d:"Mar'25",o:66,h:78,l:62,c:74,v:33},
    {d:"Jun'26",o:74,h:84,l:62,c:75,v:25},
  ]},
  jp_sv8:{jp_box:[
    {d:"Aug'24",o:32,h:44,l:30,c:42,v:62},{d:"Oct'24",o:42,h:54,l:39,c:51,v:52},
    {d:"Dec'24",o:51,h:62,l:48,c:59,v:43},{d:"Mar'25",o:59,h:70,l:55,c:66,v:35},
    {d:"Jun'26",o:66,h:75,l:55,c:60,v:27},
  ]},
  jp_sv7a:{jp_box:[
    {d:"May'24",o:35,h:48,l:32,c:45,v:55},{d:"Aug'24",o:45,h:58,l:42,c:55,v:46},
    {d:"Nov'24",o:55,h:68,l:52,c:64,v:38},{d:"Mar'25",o:64,h:75,l:60,c:72,v:31},
    {d:"Jun'26",o:72,h:80,l:58,c:65,v:23},
  ]},
  jp_sv7:{jp_box:[
    {d:"May'24",o:28,h:40,l:26,c:38,v:58},{d:"Aug'24",o:38,h:50,l:35,c:47,v:48},
    {d:"Nov'24",o:47,h:58,l:44,c:55,v:40},{d:"Mar'25",o:55,h:65,l:52,c:62,v:32},
    {d:"Jun'26",o:62,h:70,l:48,c:50,v:24},
  ]},
  jp_sv2:{jp_box:[
    {d:"Apr'23",o:25,h:35,l:23,c:33,v:75},{d:"Aug'23",o:33,h:42,l:30,c:40,v:62},
    {d:"Dec'23",o:40,h:50,l:38,c:48,v:52},{d:"Jun'24",o:48,h:58,l:45,c:55,v:43},
    {d:"Jun'25",o:55,h:65,l:50,c:58,v:35},{d:"Jun'26",o:58,h:68,l:45,c:35,v:25},
  ]},
  jp_sv1:{jp_box:[
    {d:"Jan'23",o:22,h:32,l:20,c:30,v:80},{d:"May'23",o:30,h:40,l:28,c:38,v:65},
    {d:"Sep'23",o:38,h:48,l:35,c:45,v:52},{d:"Jan'24",o:45,h:55,l:42,c:52,v:42},
    {d:"Jun'25",o:52,h:62,l:48,c:58,v:33},{d:"Jun'26",o:58,h:68,l:38,c:30,v:22},
  ]},
  jp_base:{jp_box:[
    {d:"2019",o:2200,h:3200,l:2000,c:3000,v:12},{d:"2021",o:3000,h:5800,l:2800,c:5500,v:9},
    {d:"2023",o:5500,h:7500,l:5200,c:7000,v:7},{d:"Jun'26",o:7000,h:8500,l:6800,c:8000,v:5},
  ]},
  jp_sv8a:{jp_hcbox:[
    {d:"Sep'24",o:145,h:185,l:140,c:178,v:38},{d:"Nov'24",o:178,h:215,l:172,c:208,v:32},
    {d:"Jan'25",o:208,h:242,l:202,c:235,v:26},{d:"Mar'25",o:235,h:262,l:228,c:252,v:21},
    {d:"Jun'26",o:252,h:268,l:218,c:225,v:16},
  ]},
  jp_sv11b:{jp_hcp:[
    {d:"Jan'26",o:12,h:18,l:11,c:16,v:120},{d:"Mar'26",o:16,h:22,l:14,c:20,v:100},
    {d:"May'26",o:20,h:24,l:16,c:18,v:85},{d:"Jun'26",o:18,h:22,l:14,c:16,v:70},
  ]},
  // ── KR BOX OHLC ───────────────────────────────────────────────────────────
  kr_sv4a:{
    kr_box:[
      {d:"Q1'24",o:58,h:75,l:54,c:70,v:30},{d:"Q3'24",o:70,h:90,l:66,c:86,v:24},
      {d:"Q1'25",o:86,h:102,l:82,c:96,v:19},{d:"Jun'26",o:96,h:108,l:82,c:90,v:15},
    ]
  },
  kr_sv2a:{
    kr_box:[
      {d:"Q2'23",o:38,h:52,l:35,c:48,v:35},{d:"Q4'23",o:48,h:65,l:44,c:62,v:28},
      {d:"Q2'24",o:62,h:76,l:58,c:72,v:22},{d:"Jun'26",o:72,h:82,l:60,c:65,v:17},
    ]
  },
  kr_sv8a:{
    kr_box:[
      {d:"Oct'24",o:42,h:58,l:40,c:54,v:26},{d:"Feb'25",o:54,h:70,l:50,c:66,v:21},
      {d:"Jun'26",o:66,h:75,l:55,c:60,v:16},
    ]
  },
  kr_s8b:{
    kr_box:[
      {d:"Dec'21",o:68,h:85,l:64,c:80,v:30},{d:"Jun'22",o:80,h:112,l:76,c:108,v:24},
      {d:"Jun'23",o:108,h:132,l:102,c:126,v:19},{d:"Jun'26",o:126,h:145,l:112,c:120,v:14},
    ]
  },
  kr_sv11b:{kr_box:[
    {d:"Jan'26",o:28,h:38,l:26,c:36,v:45},{d:"Mar'26",o:36,h:45,l:33,c:42,v:38},
    {d:"May'26",o:42,h:50,l:38,c:46,v:32},{d:"Jun'26",o:46,h:52,l:40,c:45,v:26},
  ]},
  kr_sv11w:{kr_box:[
    {d:"Jan'26",o:28,h:38,l:26,c:36,v:45},{d:"Mar'26",o:36,h:46,l:33,c:43,v:38},
    {d:"May'26",o:43,h:51,l:39,c:47,v:32},{d:"Jun'26",o:47,h:53,l:40,c:45,v:26},
  ]},
  kr_sv10:{kr_box:[
    {d:"Jun'25",o:25,h:35,l:23,c:32,v:52},{d:"Sep'25",o:32,h:42,l:29,c:39,v:43},
    {d:"Dec'25",o:39,h:48,l:36,c:44,v:35},{d:"Jun'26",o:44,h:52,l:34,c:37,v:26},
  ]},
  kr_sv9:{kr_box:[
    {d:"Apr'25",o:22,h:30,l:20,c:28,v:55},{d:"Jun'25",o:28,h:36,l:25,c:33,v:46},
    {d:"Sep'25",o:33,h:42,l:30,c:39,v:38},{d:"Jun'26",o:39,h:48,l:32,c:36,v:28},
  ]},
  kr_m4:{kr_box:[
    {d:"Feb'26",o:25,h:34,l:23,c:31,v:50},{d:"Apr'26",o:31,h:40,l:28,c:37,v:42},
    {d:"Jun'26",o:37,h:44,l:30,c:33,v:34},
  ]},
  kr_m2:{kr_box:[
    {d:"Sep'25",o:22,h:30,l:20,c:28,v:55},{d:"Nov'25",o:28,h:37,l:25,c:34,v:46},
    {d:"Jan'26",o:34,h:42,l:31,c:38,v:38},{d:"Jun'26",o:38,h:45,l:30,c:35,v:28},
  ]},
  // ── VINTAGE EN OHLC ────────────────────────────────────────────────────────
  en_base:{box:[
    {d:"2016",o:2200,h:3500,l:2000,c:3200,v:12},{d:"2018",o:3200,h:6500,l:3000,c:6200,v:10},
    {d:"2020",o:6200,h:18000,l:5800,c:16000,v:8},{d:"2021",o:16000,h:42000,l:15000,c:40000,v:6},
    {d:"2022",o:40000,h:58000,l:38000,c:52000,v:5},{d:"2024",o:52000,h:62000,l:50000,c:58000,v:4},
    {d:"Jun'26",o:58000,h:65000,l:52000,c:42000,v:3},
  ],loose:[
    {d:"2018",o:80,h:140,l:75,c:130,v:35},{d:"2020",o:130,h:320,l:125,c:300,v:25},
    {d:"2022",o:300,h:480,l:285,c:450,v:18},{d:"2024",o:450,h:520,l:420,c:480,v:12},
    {d:"Jun'26",o:480,h:520,l:300,c:350,v:8},
  ]},
  en_base_u:{
    box:[
      {d:"2016",o:350,h:500,l:320,c:480,v:25},{d:"2018",o:480,h:850,l:460,c:820,v:20},
      {d:"2020",o:820,h:2800,l:800,c:2600,v:15},{d:"2021",o:2600,h:8500,l:2500,c:8200,v:12},
      {d:"2022",o:8200,h:12500,l:7800,c:9800,v:9},{d:"2024",o:9800,h:13000,l:9500,c:12000,v:7},
      {d:"Jun'26",o:12000,h:13500,l:11500,c:12000,v:6},
    ],
    loose:[
      {d:"2018",o:20,h:40,l:18,c:38,v:60},{d:"2020",o:38,h:80,l:35,c:75,v:45},
      {d:"2022",o:75,h:120,l:70,c:115,v:32},{d:"2024",o:115,h:150,l:110,c:145,v:22},
      {d:"Jun'26",o:145,h:165,l:120,c:80,v:14},
    ]
  },
  en_jungle:{
    box:[
      {d:"2018",o:400,h:650,l:380,c:620,v:18},{d:"2020",o:620,h:1800,l:590,c:1700,v:12},
      {d:"2022",o:1700,h:5000,l:1600,c:4800,v:9},{d:"2024",o:4800,h:7200,l:4600,c:7000,v:6},
      {d:"Jun'26",o:7000,h:8000,l:6500,c:7500,v:4},
    ],
    loose:[
      {d:"2018",o:12,h:22,l:10,c:20,v:80},{d:"2020",o:20,h:45,l:18,c:42,v:58},
      {d:"2022",o:42,h:70,l:38,c:65,v:38},{d:"2024",o:65,h:85,l:60,c:80,v:24},
      {d:"Jun'26",o:80,h:95,l:50,c:55,v:15},
    ]
  },
};

// ── SET DATABASE ───────────────────────────────────────────────────────────────
const DB=[
  // COMING SOON
  {id:"en_pitch",  lang:"en",era:"coming",n:"Pitch Black",       code:"ME05",yr:2026,lean:"coming",
   release:"Jul 17, 2026",note:"Mega Darkrai ex headliner. Likely rip-leaning. Get at MSRP on release day.",
   prods:[{t:"bundle",market:null,v:"tbd"},{t:"etb",market:null,v:"tbd"},{t:"pcetb",market:null,v:"tbd"},{t:"box",market:null,v:"tbd"}],hist:[]},
  {id:"en_30th",   lang:"en",era:"coming",n:"30th Celebration",  code:"TCG30",yr:2026,lean:"coming",
   release:"Sep 16, 2026",note:"All-foil worldwide release. Mew & Mewtwo Futuristic Rares. Get at MSRP and hold.",
   prods:[{t:"etb",market:null,v:"tbd"},{t:"upc",market:null,v:"tbd"},{t:"box",market:null,v:"tbd"}],hist:[]},
  {id:"en_delta",  lang:"en",era:"coming",n:"Delta Reign",       code:"ME06",yr:2026,lean:"coming",
   release:"Nov 6, 2026",note:"Mega Rayquaza ex. Capstone Mega Era set.",
   prods:[{t:"bundle",market:null,v:"tbd"},{t:"etb",market:null,v:"tbd"},{t:"box",market:null,v:"tbd"}],hist:[]},
  // MEGA ERA EN
  {id:"en_chaos",  lang:"en",era:"mega",n:"Chaos Rising",        code:"ME04",yr:2026,lean:"rip",hasCards:true,
   note:"Greninja ex SIR $350. Box near break-even. Best rip EV right now.",
   prods:[{t:"loose",market:6.50,v:"skip"},{t:"b3",market:14,v:"ok"},{t:"mini_tin",market:18,v:"ok"},{t:"bundle",market:30,v:"ok"},{t:"etb",market:58,v:"ok"},{t:"pcetb",market:70,v:"ok"},{t:"box",market:235,v:"ok"},{t:"case6",market:1410,v:"ok"},{t:"figure_col",market:42,v:"ok"},{t:"giant_tin",market:44,v:"ok"},{t:"chest",market:32,v:"ok"}],
   hist:[{p:"May 22",etb:52,box:175},{p:"May 30",etb:55,box:205},{p:"Jun 10",etb:58,box:225},{p:"Jun 20",etb:58,box:235}]},
  {id:"en_phantasmal",lang:"en",era:"mega",n:"Phantasmal Flames",code:"ME02",yr:2025,lean:"rip",hasCards:true,
   note:"Charizard X SIR $780 raw. Guaranteed ex every pack.",
   prods:[{t:"loose",market:5.50,v:"ok"},{t:"b3",market:14,v:"ok"},{t:"mini_tin",market:17,v:"ok"},{t:"bundle",market:28,v:"buy"},{t:"etb",market:52,v:"buy"},{t:"pcetb",market:63,v:"ok"},{t:"box",market:148,v:"rip"},{t:"case6",market:890,v:"rip"},{t:"figure_col",market:55,v:"hold"},{t:"prem_fig",market:68,v:"hold"},{t:"giant_tin",market:48,v:"ok"}],
   hist:[{p:"Nov'25",etb:48,box:155},{p:"Feb'26",etb:52,box:170},{p:"Jun'26",etb:52,box:148}]},
  {id:"en_perfect",lang:"en",era:"mega",n:"Perfect Order",       code:"ME03",yr:2026,lean:"hold",hasCards:true,
   note:"Negative rip EV. Sealed up 18-35% since launch. Hold.",
   prods:[{t:"loose",market:5,v:"skip"},{t:"bundle",market:28,v:"hold"},{t:"etb",market:55,v:"hold"},{t:"pcetb",market:65,v:"hold"},{t:"box",market:150,v:"hold"}],
   hist:[{p:"Mar'26",etb:50,box:145},{p:"Jun'26",etb:55,box:150}]},
  {id:"en_ascended",lang:"en",era:"mega",n:"Ascended Heroes",   code:"ME02.5",yr:2026,lean:"watch",
   note:"Best ETB return of current sets per RipOrFlip. Near MSRP — watch closely.",
   prods:[{t:"mini_tin",market:31,v:"ok"},{t:"bundle",market:28,v:"ok"},{t:"etb",market:43,v:"ok"},{t:"pcetb",market:62,v:"ok"},{t:"box",market:180,v:"ok"}],
   hist:[{p:"Jan'26",etb:42,box:175},{p:"Jun'26",etb:43,box:180}]},
  // SV EN
  {id:"en_destined",lang:"en",era:"sv",n:"Destined Rivals",      code:"SV10",yr:2025,lean:"single",hasCards:true,
   note:"Mewtwo SIR $500. Sealed 2.7× card value. The trap set — buy the single.",
   prods:[{t:"loose",market:15.70,v:"avoid"},{t:"bundle",market:90,v:"hold"},{t:"etb",market:140,v:"hold"},{t:"box",market:565,v:"hold"},{t:"case6",market:3390,v:"hold"},{t:"figure_col",market:85,v:"hold"},{t:"prem_fig",market:110,v:"hold"},{t:"giant_tin",market:72,v:"hold"}],
   hist:[{p:"Jun'25",etb:50,box:145},{p:"Sep'25",etb:100,box:380},{p:"Dec'25",etb:122,box:480},{p:"Jun'26",etb:140,box:565}]},
  {id:"en_prismatic",lang:"en",era:"sv",n:"Prismatic Evolutions",code:"SV8.5",yr:2025,lean:"hold",hasCards:true,
   note:"No booster box. Umbreon SIR $1,250. ETBs 2.8× MSRP and climbing.",
   prods:[{t:"loose",market:12,v:"avoid"},{t:"mini_tin",market:28,v:"hold"},{t:"bundle",market:75,v:"hold"},{t:"etb",market:140,v:"hold"},{t:"pcetb",market:180,v:"hold"},{t:"figure_col",market:95,v:"hold"},{t:"prem_fig",market:145,v:"hold"},{t:"stadium",market:180,v:"hold"}],
   hist:[{p:"Jan'25",etb:50},{p:"May'25",etb:105},{p:"Sep'25",etb:122},{p:"Jun'26",etb:140}]},
  {id:"en_journey",lang:"en",era:"sv",n:"Journey Together",      code:"SV9",yr:2025,lean:"hold",
   note:"N's Zoroark ex SIR climbing. Hold sealed or buy raw singles.",
   prods:[{t:"loose",market:8,v:"skip"},{t:"bundle",market:40,v:"hold"},{t:"etb",market:85,v:"hold"},{t:"box",market:250,v:"hold"}],
   hist:[{p:"Mar'25",etb:50,box:145},{p:"Jun'25",etb:60,box:175},{p:"Jun'26",etb:85,box:250}]},
  {id:"en_151",   lang:"en",era:"sv",n:"Pokémon 151",            code:"SV3.5",yr:2023,lean:"hold",hasCards:true,
   note:"No booster box. ETBs 4× MSRP. 30th anniversary demand. Strong hold.",
   prods:[{t:"bundle",market:120,v:"hold"},{t:"etb",market:220,v:"hold"},{t:"upc",market:650,v:"hold"}],
   hist:[{p:"Sep'23",etb:50},{p:"Mar'24",etb:120},{p:"Sep'24",etb:160},{p:"Mar'25",etb:195},{p:"Jun'26",etb:220}]},
  {id:"en_surging",lang:"en",era:"sv",n:"Surging Sparks",        code:"SV8",yr:2024,lean:"hold",
   note:"Pikachu ex SIR $1,200. Don't rip at current box price.",
   prods:[{t:"bundle",market:45,v:"hold"},{t:"etb",market:90,v:"hold"},{t:"box",market:300,v:"hold"}],
   hist:[{p:"Q4'24",etb:55,box:155},{p:"Q2'25",etb:78,box:240},{p:"Jun'26",etb:90,box:300}]},
  {id:"en_paldean",lang:"en",era:"sv",n:"Paldean Fates",         code:"SV4.5",yr:2024,lean:"hold",
   note:"Shiny set — no booster box. ETBs appreciating.",
   prods:[{t:"bundle",market:55,v:"hold"},{t:"etb",market:100,v:"hold"}],
   hist:[{p:"Jan'24",etb:50},{p:"Jun'24",etb:65},{p:"Jun'26",etb:100}]},
  {id:"en_paradox",lang:"en",era:"sv",n:"Paradox Rift",          code:"SV4",yr:2023,lean:"hold",
   note:"Two ETB variants. Moderate hold.",
   prods:[{t:"bundle",market:30,v:"hold"},{t:"etb",market:65,v:"hold"},{t:"box",market:190,v:"hold"}],
   hist:[{p:"Q4'23",etb:50,box:145},{p:"Q2'24",etb:55,box:160},{p:"Jun'26",etb:65,box:190}]},
  // SWSH EN
  {id:"en_evolving",lang:"en",era:"swsh",n:"Evolving Skies",     code:"SWSH7",yr:2021,lean:"hold",hasCards:true,
   note:"Blue-chip. Moonbreon $900. Box $200 in 2021 → $2,600 now. NEVER rip.",
   prods:[{t:"etb",market:310,v:"hold"},{t:"box",market:2600,v:"hold"},{t:"case6",market:15600,v:"hold"}],
   hist:[{p:"Q4'21",etb:55,box:200},{p:"Q4'22",etb:162,box:878},{p:"Q4'23",etb:272,box:1818},{p:"Q4'24",etb:352,box:2652},{p:"Jun'26",etb:310,box:2600}]},
  {id:"en_crown",  lang:"en",era:"swsh",n:"Crown Zenith",        code:"SWSH12.5",yr:2023,lean:"hold",hasCards:true,
   note:"ETB-only. Giratina VSTAR Alt Art. $210-250/ETB. Strong hold.",
   prods:[{t:"etb",market:225,v:"hold"},{t:"pcetb",market:250,v:"hold"}],
   hist:[{p:"Jan'23",etb:50},{p:"Jan'24",etb:144},{p:"Jan'25",etb:222},{p:"Jun'26",etb:225}]},
  {id:"en_shining",lang:"en",era:"swsh",n:"Shining Fates",       code:"SWSH4.5",yr:2021,lean:"hold",hasCards:true,
   note:"Out of print. No booster box. Charizard VMAX SIR. Strong hold.",
   prods:[{t:"mini_tin",market:45,v:"hold"},{t:"etb",market:180,v:"hold"},{t:"box",market:450,v:"hold"}],
   hist:[{p:"Feb'21",etb:50,box:200},{p:"2023",etb:145,box:360},{p:"Jun'26",etb:180,box:450}]},
  {id:"en_celebrations",lang:"en",era:"swsh",n:"Celebrations",   code:"SWSH7.5",yr:2021,lean:"hold",
   note:"25th Anniversary. Classic reprints. ETBs & UPC strong hold.",
   prods:[{t:"pin",market:30,v:"hold"},{t:"etb",market:120,v:"hold"},{t:"upc",market:350,v:"hold"}],
   hist:[{p:"Q4'21",etb:55},{p:"2023",etb:90},{p:"Jun'26",etb:120}]},
  {id:"en_surging2",lang:"en",era:"swsh",n:"Brilliant Stars",    code:"SWSH9",yr:2022,lean:"hold",
   note:"Arceus VSTAR. Moderate hold.",
   prods:[{t:"bundle",market:26,v:"hold"},{t:"etb",market:55,v:"hold"},{t:"box",market:155,v:"hold"}],
   hist:[{p:"Feb'22",etb:50,box:145},{p:"Jun'26",etb:55,box:155}]},
  // SM EN
  {id:"en_hidden",lang:"en",era:"sm",n:"Hidden Fates",           code:"SM12.5",yr:2019,lean:"hold",hasCards:true,
   note:"Out of print. Charizard GX SIR. ETBs 3× MSRP. Never rip.",
   prods:[{t:"tin_l",market:80,v:"hold"},{t:"etb",market:150,v:"hold"}],
   hist:[{p:"2019",etb:50},{p:"2021",etb:88},{p:"2023",etb:134},{p:"Jun'26",etb:150}]},
  // VINTAGE EN
  {id:"en_base",   lang:"en",era:"vintage",n:"Base Set (1st Ed.)",code:"BS1E",yr:1999,lean:"always-hold",
   note:"1st Ed. Charizard PSA 10 = $300k–550k+. ANY sealed Base Set is a generational asset.",
   prods:[{t:"loose",market:350,v:"hold"},{t:"box",market:42000,v:"hold"}],
   hist:[{p:"2016",box:2500},{p:"2018",box:6000},{p:"2020",box:18000},{p:"2022",box:38000},{p:"2024",box:42000},{p:"Jun'26",box:42000}]},
  {id:"en_base_u", lang:"en",era:"vintage",n:"Base Set (Unlimited)",code:"BS",yr:1999,lean:"always-hold",
   note:"Unlimited Charizard Holo PSA 10 = $8k–18k. Sealed booster box ~$12,000. Never sell.",
   prods:[{t:"loose",market:80,v:"hold"},{t:"box",market:12000,v:"hold"}],
   hist:[{p:"2018",box:800},{p:"2020",box:2500},{p:"2022",box:8000},{p:"2024",box:11500},{p:"Jun'26",box:12000}]},
  {id:"en_jungle", lang:"en",era:"vintage",n:"Jungle",            code:"JU",yr:1999,lean:"always-hold",
   note:"2nd ever set. Scyther, Snorlax. Any sealed PSA 10 grade = $1k–8k. Box $7k+.",
   prods:[{t:"loose",market:55,v:"hold"},{t:"box",market:7500,v:"hold"}],
   hist:[{p:"2018",box:400},{p:"2020",box:1200},{p:"2022",box:4500},{p:"2024",box:7000},{p:"Jun'26",box:7500}]},
  // JP — key sets
  {id:"jp_m5",     lang:"jp",era:"coming",n:"JP Pitch Black (M5)",code:"M5",yr:2026,lean:"coming",
   release:"Late 2026",note:"First JP set at new ¥200/pack (¥6,000/box).",
   prods:[{t:"jp_p200",market:null,v:"tbd"},{t:"jp_box6k",market:null,v:"tbd"}],hist:[]},
  {id:"jp_m4",     lang:"jp",era:"mega",n:"Ninja Spinner (M4)",  code:"M4",yr:2026,lean:"rip",
   note:"JP Chaos Rising equiv. Last set at ¥180/pack. Strong buy before price increase.",
   prods:[{t:"jp_pack",market:4,v:"buy"},{t:"jp_box",market:95,v:"ok"}],hist:[]},
  {id:"jp_m3",     lang:"jp",era:"mega",n:"Nihil Zero (M3)",     code:"M3",yr:2026,lean:"hold",
   note:"JP Perfect Order equiv. Sealed up vs launch. Hold.",
   prods:[{t:"jp_pack",market:4.50,v:"skip"},{t:"jp_box",market:110,v:"hold"}],hist:[]},
  {id:"jp_m2",     lang:"jp",era:"mega",n:"Inferno X (M2)",      code:"M2",yr:2025,lean:"rip",
   note:"JP Phantasmal equiv. Box near reasonable price.",
   prods:[{t:"jp_pack",market:5,v:"ok"},{t:"jp_box",market:100,v:"ok"}],hist:[]},
  {id:"jp_m2a",    lang:"jp",era:"mega",n:"MEGA Dream ex HC (M2a)",code:"M2a",yr:2025,lean:"hold",
   note:"HIGH CLASS: 10-card packs, 10pk/box. Box $220. Hold.",
   prods:[{t:"jp_hcp",market:28,v:"skip"},{t:"jp_hcbox",market:220,v:"hold"}],hist:[]},
  {id:"jp_m1",     lang:"jp",era:"mega",n:"Mega Evolution (M1)", code:"M1",yr:2025,lean:"hold",
   note:"First JP Mega Era. Box ~$98. Hold.",
   prods:[{t:"jp_pack",market:3.50,v:"ok"},{t:"jp_box",market:98,v:"hold"}],hist:[]},
  {id:"jp_sv11w",  lang:"jp",era:"sv",n:"White Flare (JP)",      code:"SV11W",yr:2025,lean:"rip",
   note:"Box ~$80. Reasonable for JP ripping.",
   prods:[{t:"jp_pack",market:4,v:"ok"},{t:"jp_box",market:80,v:"ok"}],hist:[]},
  {id:"jp_sv11b",  lang:"jp",era:"sv",n:"Black Bolt (JP)",       code:"SV11B",yr:2025,lean:"watch",
   note:"Pack elevated ~$16. Monitor before buying.",
   prods:[{t:"jp_pack",market:16,v:"skip"}],hist:[]},
  {id:"jp_sv9",    lang:"jp",era:"sv",n:"Battle Partners (JP)",  code:"SV9",yr:2025,lean:"rip",
   note:"Pack ~$4, box ~$75. Good JP entry point.",
   prods:[{t:"jp_pack",market:4,v:"ok"},{t:"jp_box",market:75,v:"ok"}],hist:[]},
  {id:"jp_sv8a",   lang:"jp",era:"sv",n:"Terastal Festival ex HC",code:"SV8a",yr:2024,lean:"hold",
   note:"HIGH CLASS: 10-card packs. Box $225. Strong hold.",
   prods:[{t:"jp_hcp",market:29,v:"skip"},{t:"jp_hcbox",market:225,v:"hold"}],hist:[]},
  {id:"jp_sv8",    lang:"jp",era:"sv",n:"Super Electric Breaker",code:"SV8",yr:2024,lean:"hold",
   note:"Box ~$60. Hold.",
   prods:[{t:"jp_pack",market:6,v:"skip"},{t:"jp_box",market:60,v:"hold"}],hist:[]},
  {id:"jp_sv7a",   lang:"jp",era:"sv",n:"Paradise Dragona",      code:"SV7a",yr:2024,lean:"hold",
   note:"Box ~$65. Hold.",
   prods:[{t:"jp_pack",market:7,v:"skip"},{t:"jp_box",market:65,v:"hold"}],hist:[]},
  {id:"jp_sv7",    lang:"jp",era:"sv",n:"Stellar Miracle",       code:"SV7",yr:2024,lean:"hold",
   note:"Box ~$50. Hold.",
   prods:[{t:"jp_pack",market:6,v:"skip"},{t:"jp_box",market:50,v:"hold"}],hist:[]},
  {id:"jp_sv4a",   lang:"jp",era:"sv",n:"Shiny Treasure ex HC",  code:"SV4a",yr:2023,lean:"hold",
   note:"HIGH CLASS. Box $245. Better hit rates than EN Paldean Fates. Strong hold.",
   prods:[{t:"jp_hcp",market:30,v:"skip"},{t:"jp_hcbox",market:245,v:"hold"}],hist:[]},
  {id:"jp_sv2a",   lang:"jp",era:"sv",n:"Pokémon Card 151 (JP)", code:"SV2a",yr:2023,lean:"hold",
   note:"Most valuable modern JP set. SAR 1-in-6 boxes. Box $350+. Never rip.",
   prods:[{t:"jp_pack",market:18,v:"avoid"},{t:"jp_box",market:350,v:"hold"}],hist:[]},
  {id:"jp_sv2",    lang:"jp",era:"sv",n:"Clay Burst / Snow Hazard",code:"SV2",yr:2023,lean:"hold",
   note:"JP Paldea Evolved split. Box ~$35 each. Hold.",
   prods:[{t:"jp_pack",market:4,v:"ok"},{t:"jp_box",market:35,v:"hold"}],hist:[]},
  {id:"jp_sv1",    lang:"jp",era:"sv",n:"Scarlet ex / Violet ex",code:"SV1",yr:2023,lean:"hold",
   note:"JP SV launch. Box ~$30 each. Moderate hold.",
   prods:[{t:"jp_pack",market:3.50,v:"ok"},{t:"jp_box",market:30,v:"hold"}],hist:[]},
  {id:"jp_s12a",   lang:"jp",era:"swsh",n:"VSTAR Universe HC",   code:"S12a",yr:2022,lean:"hold",
   note:"JP Crown Zenith equiv. HIGH CLASS. Box ~$350. Strong hold.",
   prods:[{t:"jp_hcp",market:40,v:"skip"},{t:"jp_hcbox",market:350,v:"hold"}],hist:[]},
  {id:"jp_s8b",    lang:"jp",era:"swsh",n:"VMAX Climax HC",      code:"S8b",yr:2021,lean:"hold",
   note:"JP Evolving Skies era. Most popular SWSH JP. Box $400+. Hold.",
   prods:[{t:"jp_hcp",market:45,v:"skip"},{t:"jp_hcbox",market:400,v:"hold"}],hist:[]},
  {id:"jp_s4a",    lang:"jp",era:"swsh",n:"Shiny Star V HC",     code:"S4a",yr:2020,lean:"hold",
   note:"JP Shining Fates equiv. Box $450+. Never rip.",
   prods:[{t:"jp_hcp",market:55,v:"avoid"},{t:"jp_hcbox",market:450,v:"hold"}],hist:[]},
  {id:"jp_sm12a",  lang:"jp",era:"sm",n:"TAG TEAM GX All Stars HC",code:"SM12a",yr:2019,lean:"hold",
   note:"JP HC. TAG TEAM powerhouse. Box $600+. Hold.",
   prods:[{t:"jp_hcp",market:65,v:"avoid"},{t:"jp_hcbox",market:600,v:"hold"}],hist:[]},
  {id:"jp_base",   lang:"jp",era:"vintage",n:"Base Set (JP, 1996)",code:"JPB1",yr:1996,lean:"always-hold",
   note:"The very first Pokémon TCG set. 1996. Sealed pack ~$250–500. Museum grade — generational hold.",
   prods:[{t:"loose",market:350,v:"hold"},{t:"jp_box",market:8000,v:"hold"}],
   hist:[{p:"2019",jp_box:800},{p:"2021",jp_box:2500},{p:"2023",jp_box:5500},{p:"Jun'26",jp_box:8000}]},
  // KR sets
  {id:"kr_sv11b",  lang:"kr",era:"sv",n:"Black Bolt (KR)",       code:"SV11B",yr:2025,lean:"rip",
   note:"Box ~$45. Reasonable KR rip.",prods:[{t:"kr_pack",market:2,v:"ok"},{t:"kr_box",market:45,v:"ok"}],hist:[]},
  {id:"kr_sv11w",  lang:"kr",era:"sv",n:"White Flare (KR)",      code:"SV11W",yr:2025,lean:"rip",
   note:"Box ~$45.",prods:[{t:"kr_pack",market:2,v:"ok"},{t:"kr_box",market:45,v:"ok"}],hist:[]},
  {id:"kr_sv10",   lang:"kr",era:"sv",n:"Glory of Team Rocket (KR)",code:"SV10",yr:2025,lean:"rip",
   note:"KR Destined Rivals. Box $37. KR singles thinner US market.",
   prods:[{t:"kr_pack",market:1.50,v:"ok"},{t:"kr_box",market:37,v:"ok"}],hist:[]},
  {id:"kr_sv9",    lang:"kr",era:"sv",n:"Battle Partners (KR)",  code:"SV9",yr:2025,lean:"rip",
   note:"Box ~$36. Affordable.",prods:[{t:"kr_pack",market:1.50,v:"ok"},{t:"kr_box",market:36,v:"ok"}],hist:[]},
  {id:"kr_sv8a",   lang:"kr",era:"sv",n:"Terastal Festival (KR)",code:"SV8a",yr:2024,lean:"hold",
   note:"Box ~$60. Hold.",prods:[{t:"kr_pack",market:8,v:"skip"},{t:"kr_box",market:60,v:"hold"}],hist:[]},
  {id:"kr_sv4a",   lang:"kr",era:"sv",n:"Shiny Treasure ex (KR)",code:"SV4a",yr:2023,lean:"hold",
   note:"Box ~$90. Hold.",prods:[{t:"kr_pack",market:9,v:"skip"},{t:"kr_box",market:90,v:"hold"}],hist:[]},
  {id:"kr_sv2a",   lang:"kr",era:"sv",n:"Pokémon 151 (KR)",      code:"SV2a",yr:2023,lean:"hold",
   note:"Box $65. KR singles thinner US market.",prods:[{t:"kr_pack",market:3,v:"skip"},{t:"kr_box",market:65,v:"hold"}],hist:[]},
  {id:"kr_m4",     lang:"kr",era:"mega",n:"Chaos Rising (KR)",   code:"M4-KR",yr:2026,lean:"rip",
   note:"Box ~$33.",prods:[{t:"kr_pack",market:2,v:"ok"},{t:"kr_box",market:33,v:"ok"}],hist:[]},
  {id:"kr_m2",     lang:"kr",era:"mega",n:"Phantasmal Flames (KR)",code:"M2-KR",yr:2025,lean:"rip",
   note:"Box ~$35.",prods:[{t:"kr_pack",market:2,v:"ok"},{t:"kr_box",market:35,v:"ok"}],hist:[]},
  {id:"kr_s8b",    lang:"kr",era:"swsh",n:"VMAX Climax (KR HC)", code:"S8b-KR",yr:2021,lean:"hold",
   note:"Box ~$120. Hold.",prods:[{t:"kr_pack",market:12,v:"skip"},{t:"kr_box",market:120,v:"hold"}],hist:[]},
];

// ── CARD DATA ──────────────────────────────────────────────────────────────────
const CARDS={
  en_chaos:[
    {n:"Mega Greninja ex SIR",pull:1/400,raw:350,p9:380,p10:1000,r10:0.40,hot:true,note:"Top-3 globally."},
    {n:"Any SIR (avg)",pull:1/101,raw:45,p9:55,p10:135,r10:0.41,hot:false,note:"1-in-101 per pack."},
    {n:"Double Rare — BULK",pull:1/5,raw:3,p9:0,p10:0,r10:0,hot:false,note:"Not a hit."},
  ],
  en_phantasmal:[
    {n:"Mega Charizard X SIR #125",pull:1/400,raw:780,p9:600,p10:2000,r10:0.42,hot:true,note:"Crown jewel. 1-in-400."},
    {n:"Mega Charizard X MHR #130",pull:1/1260,raw:340,p9:280,p10:900,r10:0.38,hot:false,note:"Rarest. Less liquid than SIR."},
    {n:"Dawn SIR #129",pull:1/400,raw:60,p9:75,p10:180,r10:0.45,hot:false,note:"Character card."},
    {n:"Any SIR (avg)",pull:1/80,raw:80,p9:90,p10:240,r10:0.42,hot:false,note:"1-in-80 per pack."},
    {n:"Double Rare — BULK",pull:1/3,raw:3,p9:0,p10:0,r10:0,hot:false,note:"Not a hit."},
  ],
  en_perfect:[
    {n:"Any SIR (avg)",pull:1/81,raw:50,p9:70,p10:150,r10:0.40,hot:false,note:"Negative rip EV."},
    {n:"Double Rare — BULK",pull:1/5,raw:3,p9:0,p10:0,r10:0,hot:false,note:"Bulk."},
  ],
  en_destined:[
    {n:"Rocket's Mewtwo ex SIR",pull:1/376,raw:500,p9:420,p10:1150,r10:0.38,hot:true,note:"PSA 10 $1,150."},
    {n:"Other SIRs (avg)",pull:1/376,raw:80,p9:95,p10:250,r10:0.42,hot:false,note:"Drops after #1."},
    {n:"Double Rare — BULK",pull:1/5,raw:3,p9:0,p10:0,r10:0,hot:false,note:"Bulk."},
  ],
  en_prismatic:[
    {n:"Umbreon ex SIR #161",pull:1/45,raw:1250,p9:1800,p10:4500,r10:0.40,hot:true,note:"Modern benchmark. $4,500 PSA 10."},
    {n:"Sylveon ex SIR",pull:1/45,raw:200,p9:260,p10:700,r10:0.44,hot:false,note:"Strong demand."},
    {n:"Any Eeveelution SIR",pull:1/45,raw:200,p9:240,p10:650,r10:0.42,hot:false,note:"All carry demand."},
    {n:"Double Rare — BULK",pull:1/5,raw:4,p9:0,p10:0,r10:0,hot:false,note:"Bulk."},
  ],
  en_151:[
    {n:"Charizard ex SIR",pull:1/288,raw:400,p9:580,p10:1500,r10:0.40,hot:true,note:"1-in-288."},
    {n:"Venusaur ex SIR",pull:1/288,raw:150,p9:220,p10:580,r10:0.43,hot:false,note:"Big 3 Kanto."},
    {n:"Any SIR (avg)",pull:1/32,raw:120,p9:170,p10:450,r10:0.41,hot:false,note:"Best SIR rate in SV era."},
    {n:"Double Rare — BULK",pull:1/5,raw:3,p9:0,p10:0,r10:0,hot:false,note:"Bulk."},
  ],
  en_evolving:[
    {n:"Umbreon VMAX Alt Art",pull:1/48,raw:900,p9:1100,p10:1500,r10:0.45,hot:true,note:"#1 modern alt art."},
    {n:"Rayquaza VMAX Alt Art",pull:1/48,raw:350,p9:380,p10:500,r10:0.44,hot:false,note:"Dragon iconic."},
    {n:"Glaceon VMAX Alt Art",pull:1/48,raw:180,p9:250,p10:400,r10:0.43,hot:false,note:"Eeveelution demand."},
  ],
  en_crown:[
    {n:"Giratina VSTAR Alt Art",pull:1/24,raw:90,p9:100,p10:240,r10:0.30,hot:true,note:"Best grading economics."},
    {n:"Galarian Gallery (avg)",pull:1/12,raw:35,p9:45,p10:110,r10:0.30,hot:false,note:"Most $15-30 raw."},
  ],
  en_shining:[
    {n:"Charizard VMAX SIR",pull:1/50,raw:220,p9:280,p10:600,r10:0.37,hot:true,note:"Set anchor. Out of print."},
    {n:"Any SIR (avg)",pull:1/50,raw:35,p9:48,p10:110,r10:0.36,hot:false,note:"1-in-50."},
  ],
  en_hidden:[
    {n:"Charizard GX SIR",pull:1/72,raw:285,p9:320,p10:700,r10:0.35,hot:true,note:"PSA 10 $600-800."},
    {n:"Gyarados GX SIR",pull:1/72,raw:80,p9:90,p10:200,r10:0.36,hot:false,note:"2nd most popular."},
    {n:"Any SIR (avg)",pull:1/72,raw:60,p9:75,p10:175,r10:0.35,hot:false,note:"1-in-72. 20 shiny SIRs."},
  ],
  // ── SV ERA ───────────────────────────────────────────────────────────────
  en_journey:[
    {n:"N's Zoroark ex SIR",pull:1/180,raw:120,p9:140,p10:350,r10:0.38,hot:true,note:"Chase card. N is beloved character — high demand."},
    {n:"Arceus ex SIR",pull:1/150,raw:65,p9:80,p10:195,r10:0.40,hot:false,note:"Arceus always holds collector demand."},
    {n:"Lugia ex SIR",pull:1/165,raw:85,p9:100,p10:240,r10:0.39,hot:false,note:"Lugia nostalgia factor. Solid hold."},
    {n:"Any SIR (avg)",pull:1/100,raw:50,p9:65,p10:165,r10:0.39,hot:false,note:"SV standard SIR rate."},
    {n:"Double Rare — BULK",pull:1/5,raw:3,p9:0,p10:0,r10:0,hot:false,note:"Bulk."},
  ],
  en_surging:[
    {n:"Pikachu ex SIR #181",pull:1/72,raw:180,p9:220,p10:500,r10:0.40,hot:true,note:"Best pull in set. PSA 10 ~$500. Pikachu always wins."},
    {n:"Terapagos ex SIR",pull:1/72,raw:120,p9:150,p10:320,r10:0.38,hot:false,note:"Signature Scarlet & Violet mascot."},
    {n:"Iron Thorns ex SIR",pull:1/72,raw:45,p9:58,p10:130,r10:0.37,hot:false,note:"Paradox fan favorite."},
    {n:"Any SIR (avg)",pull:1/54,raw:65,p9:85,p10:200,r10:0.38,hot:false,note:"1-in-54 per pack (set has many SIRs)."},
    {n:"Double Rare — BULK",pull:1/5,raw:3,p9:0,p10:0,r10:0,hot:false,note:"Bulk."},
  ],
  en_paradox:[
    {n:"Roaring Moon ex SIR",pull:1/96,raw:80,p9:98,p10:220,r10:0.38,hot:true,note:"Paradox Salamence. Strong collector demand."},
    {n:"Iron Valiant ex SIR",pull:1/96,raw:65,p9:82,p10:185,r10:0.39,hot:false,note:"Paradox Gardevoir/Gallade hybrid."},
    {n:"Ancient Booster Capsule SIR",pull:1/96,raw:38,p9:50,p10:115,r10:0.36,hot:false,note:"Unique card art — collector item."},
    {n:"Any SIR (avg)",pull:1/75,raw:45,p9:60,p10:140,r10:0.37,hot:false,note:"Standard SV SIR rate."},
    {n:"Double Rare — BULK",pull:1/5,raw:3,p9:0,p10:0,r10:0,hot:false,note:"Bulk."},
  ],
  en_paldean:[
    {n:"Charizard ex Shiny SIR",pull:1/36,raw:85,p9:110,p10:240,r10:0.38,hot:true,note:"Shiny Charizard = highest demand. 1-in-36 is the best rate."},
    {n:"Mewtwo ex Shiny SIR",pull:1/36,raw:55,p9:72,p10:165,r10:0.38,hot:false,note:"Kanto nostalgia."},
    {n:"Any Shiny SIR (avg)",pull:1/36,raw:40,p9:55,p10:125,r10:0.37,hot:false,note:"Best shiny pull rate in the game. 1-in-36 vs 1-in-288 for normal sets."},
    {n:"Double Rare — BULK",pull:1/5,raw:3,p9:0,p10:0,r10:0,hot:false,note:"Bulk."},
  ],
  en_surging2:[
    {n:"Arceus VSTAR SIR",pull:1/54,raw:45,p9:58,p10:130,r10:0.36,hot:true,note:"Brilliant Stars anchor. Steady demand."},
    {n:"Any SIR (avg)",pull:1/54,raw:30,p9:42,p10:95,r10:0.35,hot:false,note:"SWSH SIR rate."},
    {n:"Double Rare — BULK",pull:1/5,raw:2,p9:0,p10:0,r10:0,hot:false,note:"Bulk."},
  ],
};

const VD={
  rip:{l:"✅ RIP IT",c:C.green,bg:"rgba(61,187,80,0.10)",
    sub:"Open the packs. The expected value from pulling is worth the cost."},
  hold:{l:"🔒 HOLD SEALED",c:C.blue,bg:"rgba(74,95,214,0.10)",
    sub:"Do NOT open. Keep it sealed — sealed versions are worth more than ripped ones and climbing."},
  single:{l:"🎯 BUY THE CARD DIRECTLY",c:C.yellow,bg:"rgba(255,203,5,0.08)",
    sub:"The card you want costs less to buy outright on TCGPlayer than to rip for. Skip the packs."},
  coming:{l:"🔜 COMING SOON",c:C.purple,bg:"rgba(155,111,232,0.08)",
    sub:"Not released yet. Check back on the release date listed below."},
  watch:{l:"👀 WATCH PRICE",c:C.orange,bg:"rgba(240,128,48,0.08)",
    sub:"Uncertain market. Monitor prices before buying. Set a reminder for 2 weeks from now."},
  "always-hold":{l:"🏛️ VINTAGE — NEVER SELL",c:C.red,bg:"rgba(204,0,0,0.08)",
    sub:"This is a museum piece. Any sealed product from this era is irreplaceable. Buy if you can afford it; never open or sell."},
};
const PVD={rip:{l:"RIP",c:C.green},buy:{l:"BUY",c:C.green},ok:{l:"OK",c:C.yellow},
  skip:{l:"SKIP",c:C.orange},hold:{l:"HOLD",c:C.blue},avoid:{l:"AVOID",c:C.red},tbd:{l:"TBA",c:C.faint}};

// ── TABS ───────────────────────────────────────────────────────────────────────
const TABS=[
  {id:"scout",icon:"🎯",l:"Scout"},
  {id:"market",icon:"📈",l:"Market"},
  {id:"analyzer",icon:"🎲",l:"Analyzer"},
  {id:"grade",icon:"🏆",l:"Grade"},
  {id:"compare",icon:"⚖️",l:"Compare"},
  {id:"budget",icon:"💰",l:"Budget"},
  {id:"tracker",icon:"📦",l:"Tracker"},
  {id:"show",icon:"🛒",l:"At a Show"},
];

// ── HELPERS ────────────────────────────────────────────────────────────────────
function getPackCost(set) {
  const order=["box","jp_box","jp_box6k","jp_hcbox","kr_box","etb","pcetb","jp_hcp","bundle"];
  for(const t of order){
    const p=set.prods.find(x=>x.t===t);
    if(p?.market&&PT[t]?.pk>0)return p.market/PT[t].pk;
  }
  const any=set.prods.find(p=>p.market&&PT[p.t]?.pk>0);
  return any?any.market/PT[any.t].pk:5;
}

// ── MAIN APP ───────────────────────────────────────────────────────────────────
export default function App(){
  const [tab,setTab]=useState("scout");
  const [lang,setLang]=useState("en");
  const [era,setEra]=useState("all");
  const [sid,setSid]=useState("en_chaos");
  const [cmpId1,setCmpId1]=useState("en_chaos");
  const [cmpId2,setCmpId2]=useState("en_phantasmal");
  const [ci,sCi]=useState(0);
  const [shopP,setShopP]=useState({});
  const [grader,setGrader]=useState("psa");
  const [crGrader,setCrGrader]=useState("tag");
  const [budget,setBudget]=useState(300);
  const [obs,setObs]=useState(6);
  const [hits,setHits]=useState(0);
  const [mktProd,setMktProd]=useState("etb");
  const [period,setPeriod]=useState("All");
  const [tracker,setTracker]=useState([]);
  const [newT,setNewT]=useState({name:"",cost:"",current:""});
  const [liveLoading,setLiveLoading]=useState(false);
  const [liveTs,setLiveTs]=useState(null);
  const [liveErr,setLiveErr]=useState(null);
  const [livePrices,setLivePrices]=useState({});
  const [showSet,setShowSet]=useState("en_chaos");
  const [showProd,setShowProd]=useState("etb");
  const [showPrice,setShowPrice]=useState("");

  const ERAS_LIST=[
    {id:"all",n:"All"},
    {id:"coming",n:"🔜 Coming"},
    {id:"mega",n:"Mega Era"},
    {id:"sv",n:"Scarlet & Violet"},
    {id:"swsh",n:"Sword & Shield"},
    {id:"sm",n:"Sun & Moon"},
    {id:"vintage",n:"Vintage"},
  ];

  const filtered=useMemo(()=>DB.filter(s=>s.lang===lang&&(era==="all"||s.era===era)),[lang,era]);
  const set=useMemo(()=>DB.find(s=>s.id===sid)||DB[0],[sid]);
  const cmpSet=useMemo(()=>DB.find(s=>s.id===cmpId2)||DB[1],[cmpId2]);
  const cmpSet1=useMemo(()=>DB.find(s=>s.id===cmpId1)||DB[0],[cmpId1]);
  // analyzerSid: auto-switch to first EN set with card data when on analyzer/grade tab
  const analyzerSid=useMemo(()=>{
    if((tab==="analyzer"||tab==="grade")&&!CARDS[sid]){
      return DB.find(s=>s.lang==="en"&&CARDS[s.id])?.id||sid;
    }
    return sid;
  },[tab,sid]);
  const cards=CARDS[analyzerSid||sid]||null;
  const card=cards?cards[Math.min(ci,cards.length-1)]:null;
  const gr=GRADERS.find(g=>g.id===grader)||GRADERS[0];
  const crGr=GRADERS.find(g=>g.id===crGrader)||GRADERS[1];
  const packCost=useMemo(()=>getPackCost(set),[set]);
  const isBulk=card&&card.raw<20;

  const avgPacks=card?avgN(card.pull):0;
  const avgCost=card?avgPacks*packCost:0;
  const leverage=card&&card.raw>0?avgCost/card.raw:0;
  const kelly=card?(()=>{const b=(card.raw/packCost)-1,p=card.pull,q=1-p;return((b*p-q)/b)*100;})():0;
  const budgetPacks=Math.floor(budget/packCost);
  const budgetChance=card?P1(card.pull,budgetPacks):0;
  const expRet=card?budgetChance*card.raw*0.78:0;
  const bROI=card?((expRet-budget)/budget)*100:0;
  const gn10=card?Math.round(card.p10*gr.m10*FEE-card.raw-gr.cost):0;
  const gn9=card?Math.round(card.p9*gr.m10*0.62*FEE-card.raw-gr.cost):0;
  const expG=card?Math.round(card.r10*gn10+(1-card.r10)*0.6*gn9):0;
  const crn10=card?Math.round(card.p10*crGr.m10*FEE-(card.p9||0)-crGr.cost):0;
  const crn9=card?Math.round((card.p9||0)*crGr.m10*0.62*FEE-(card.p9||0)-crGr.cost):0;
  const crEV=card?Math.round(0.40*crn10+0.33*crn9+0.27*(-(card.p9||0)*0.1-crGr.cost)):0;
  const sExp=card?obs*card.pull:0;
  const sSE=card?Math.sqrt(obs*card.pull*(1-card.pull)):0.001;
  const sZ=(hits-sExp)/sSE;
  const sLo=Math.max(0,sExp-1.96*sSE),sHi=sExp+1.96*sSE;
  const p0=card?Math.pow(1-card.pull,obs):0;

  const trackerTotals=useMemo(()=>tracker.reduce((a,t)=>({spent:a.spent+(Number(t.cost)||0),now:a.now+(Number(t.current)||0)}),{spent:0,now:0}),[tracker]);

  // market tab derived values — wrapped in useMemo to isolate from other tabs
  const mktData=useMemo(()=>{
    try{
      const slices={"1D":1,"1W":2,"2W":3,"1M":5,"2M":7,"4M":10,"1Y":20,"All":9999};
      const ep=set.prods.find(p=>p.t===mktProd&&PT[p.t]?.pk>0)?mktProd:(set.prods.find(p=>PT[p.t]?.pk>0)?.t||"etb");
      // Try direct match, then bundle suffix, then common aliases
      const all=OHLC[sid]?.[ep]
        ||OHLC[sid+'_b']?.[ep]
        // For JP/KR: try the primary box/pack type if exact ep not found
        ||(ep==="jp_box"?OHLC[sid]?.jp_box:null)
        ||(ep==="jp_hcbox"?OHLC[sid]?.jp_hcbox:null)
        ||(ep==="jp_hcp"?OHLC[sid]?.jp_hcp:null)
        ||(ep==="kr_box"?OHLC[sid]?.kr_box:null)
        ||(ep==="kr_pack"?OHLC[sid]?.kr_pack:null)
        ||(ep==="loose"?OHLC[sid]?.loose:null)
        ||null;
      const n=slices[period]||9999;
      const data=all?all.slice(-Math.min(all.length,n)):null;
      const cur=data&&data.length>0?data[data.length-1]:null;
      const first=data&&data.length>0?data[0]:null;
      const pChg=cur&&first?cur.c-first.o:0;
      const pPct=cur&&first&&first.o>0?(pChg/first.o)*100:0;
      const msrp=PT[ep]?.msrp||49.99; // use actual catalog MSRP for every product
      const hi=data&&data.length?data.reduce((m,d)=>Math.max(m,d.h),0):0;
      const lo=data&&data.length?data.reduce((m,d)=>Math.min(m,d.l),Infinity):0;
      const allHi=all&&all.length?all.reduce((m,d)=>Math.max(m,d.h),0):0;
      const allLo=all&&all.length?all.reduce((m,d)=>Math.min(m,d.l),Infinity):0;
      const curProdMkt=set.prods.find(p=>p.t===ep)?.market||null;
      const gain=cur&&msrp>0?((cur.c-msrp)/msrp*100):curProdMkt&&msrp>0?((curProdMkt-msrp)/msrp*100):0;
      const sigFromLean=(()=>{
        if(set.lean==="rip")return{l:"RIP IT",c:C.green,sub:"Open packs — expected value is positive"};
        if(set.lean==="hold")return{l:"HOLD SEALED",c:C.blue,sub:"Keep sealed — worth more closed"};
        if(set.lean==="single")return{l:"BUY THE SINGLE",c:C.yellow,sub:"Cheaper to buy the card directly than ripping"};
        if(set.lean==="always-hold")return{l:"VINTAGE HOLD",c:C.red,sub:"Museum piece — never open, never sell"};
        if(set.lean==="coming")return{l:"COMING SOON",c:C.purple,sub:"Not yet released"};
        if(set.lean==="watch")return{l:"WATCH PRICE",c:C.orange,sub:"Monitor before buying"};
        return{l:"HOLD SEALED",c:C.blue,sub:"Keep sealed for now"};
      })();
      const sig=cur?(
        set.lean==="rip"&&cur.c<=msrp*1.2?{l:"STRONG BUY",c:C.green,sub:"At or near MSRP — buy now"}:
        set.lean==="rip"&&cur.c<=msrp*1.8?{l:"BUY",c:C.green,sub:"Below 1.8× retail — still good"}:
        set.lean==="single"?{l:"BUY THE SINGLE",c:C.yellow,sub:"Ripping has negative EV — buy the card directly"}:
        set.lean==="always-hold"?{l:"VINTAGE HOLD",c:C.red,sub:"Museum piece — never open"}:
        pPct>20?{l:"STRONG HOLD",c:C.blue,sub:"Up 20%+ this period — keep sealed"}:
        set.lean==="hold"?{l:"HOLD SEALED",c:C.blue,sub:"Keep sealed — value growing over time"}:
        pPct<-10?{l:"WATCH PRICE",c:C.orange,sub:"Declining — wait before buying"}:
        {l:"HOLD SEALED",c:C.blue,sub:"Keep sealed for now"}
      ):sigFromLean;
      return {ep,all,data,cur,first,pChg,pPct,isUp:pChg>=0,hi,lo,allHi,allLo,msrp,gain,sig,curProdMkt};
    }catch(e){
      console.error('mktData error:',e?.message||e);
      const ep2=set?.prods?.[0]?.t||"etb";
      return {ep:ep2,all:null,data:null,cur:null,first:null,pChg:0,pPct:0,isUp:true,
              hi:0,lo:0,allHi:0,allLo:0,msrp:49.99,gain:0,
              sig:{l:"HOLD SEALED",c:"#4A5FD6",sub:"Keep sealed for now"},
              curProdMkt:set?.prods?.find(p=>p.t===ep2)?.market||null};
    }
  },[sid,mktProd,period,set]);
  const {data:ohlcData,cur:ohlcCur,first:ohlcFirst,pChg,pPct,isUp,hi:periodHi,lo:periodLo,allHi:ath,allLo:atl,msrp:mktMsrp,gain:gainMsrp,sig:mktSignal,ep:effectiveProd2,curProdMkt}=mktData;

  // show tool
  const showSetObj=DB.find(s=>s.id===showSet)||DB[0];
  const showProdObj=showSetObj.prods.find(p=>p.t===showProd)||showSetObj.prods[0];
  const showPT=showProdObj?PT[showProdObj.t]:null;
  const spVal=parseFloat(showPrice)||0;
  const showVerdict=showProdObj&&spVal>0&&showPT&&showPT.msrp?(
    spVal<=showPT.msrp*1.05?{t:"✅ AT MSRP — BUY IT",c:C.green}:
    spVal<=showPT.msrp*1.20?{t:"✓ FAIR PRICE",c:C.green}:
    showProdObj.market&&spVal<=showProdObj.market*1.05?{t:"⚠️ AT MARKET",c:C.yellow}:
    {t:"🛑 OVERPRICED — WALK AWAY",c:C.red}
  ):null;

  const vd=VD[set.lean]||VD.hold||{l:"HOLD",c:"#4A5FD6",bg:"rgba(74,95,214,0.10)",sub:"Hold sealed"};
  const groupedProds=useMemo(()=>{
    const g={};
    set.prods.forEach(p=>{const pt=PT[p.t];if(!pt)return;const cat=pt.cat||"Other";if(!g[cat])g[cat]=[];g[cat].push(p);});
    return g;
  },[set]);

  const doLiveFetch=useCallback(async()=>{
    setLiveLoading(true);setLiveErr(null);
    try{
      const prodKeys=set.prods.filter(p=>PT[p.t]?.pk>0).map(p=>p.t).join(",");
      const prompt=`You are a Pokemon TCG price researcher. Search for CURRENT SOLD/COMPLETED sales data for Pokemon TCG "${set.n}" (set code: ${set.code}) sealed products.

Search these sources:
1. eBay completed/sold listings (last 30 days average sale price)
2. TCGPlayer current market price
3. PriceCharting recent sold price

Return ONLY a valid JSON object. No text before or after. No markdown. Example format:
{"etb":{"ebay":58,"tcgp":60,"pricech":57},"box":{"ebay":235,"tcgp":240,"pricech":232}}

Use these exact product keys (include only products that have real sold data): ${prodKeys}
If a source has no data for a product, omit that source key.`;
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:prompt}]})});
      const data=await r.json();
      const text=data.content?.map(b=>b.type==="text"?b.text:"").join("")||"";
      // Try multiple JSON extraction strategies
      let m=null;
      const cleaned=text.replace(/```json/gi,'').replace(/```/g,'').trim();
      // Strategy 1: find largest JSON object
      const matches=cleaned.match(/\{[\s\S]*\}/g);
      if(matches)m=[matches.reduce((a,b)=>b.length>a.length?b:a)];
      if(m&&m[0]){
        try{
          const parsed=JSON.parse(m[0]);
          // Support both old flat format {etb:58} and new nested {etb:{ebay:58,tcgp:60}}
          const normalized={};
          Object.entries(parsed).forEach(([k,v])=>{
            if(typeof v==="number") normalized[k]={avg:v};
            else if(typeof v==="object"&&v!==null){
              const vals=Object.values(v).filter(x=>typeof x==="number"&&x>0);
              normalized[k]={...v,avg:vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):null};
            }
          });
          setLivePrices(prev=>({...prev,[sid]:normalized}));
          setLiveTs(new Date().toLocaleTimeString());
        }catch(pe){setLiveErr("Price data format error. Data may be partial.");}
      } else setLiveErr("No sold data found. Try TCGPlayer.com or PriceCharting.com directly.");
    }catch(e){setLiveErr("Network error. Try TCGPlayer.com directly.");}
    setLiveLoading(false);
  },[set,sid]);

  useEffect(()=>{
    const f=DB.filter(s=>s.lang===lang&&(era==="all"||s.era===era));
    if(f.length&&!f.find(s=>s.id===sid)){
      const ns=f[0];
      setSid(ns.id);
      sCi(0);
      const fp=ns.prods.find(p=>PT[p.t]?.pk>0);
      if(fp)setMktProd(fp.t);
    }
  },[lang,era]);

  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&display=swap');
    .dsp{font-family:'Space Grotesk',sans-serif;}.mono{font-family:'JetBrains Mono',monospace;}
    *{box-sizing:border-box;}
    input[type=range]{-webkit-appearance:none;height:3px;border-radius:4px;background:#2A2A2A;outline:none;width:100%;}
    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#FFCB05;cursor:pointer;}
    input:not([type=range]){background:#1C1C1C;border:1px solid #2A2A2A;color:#F0EDE4;border-radius:6px;padding:8px 10px;font-family:'JetBrains Mono',monospace;font-size:13px;width:100%;}
    select{background:#1C1C1C;border:1px solid #2A2A2A;color:#F0EDE4;border-radius:8px;padding:8px 10px;font-size:13px;width:100%;}
    button{cursor:pointer;}
    ::-webkit-scrollbar{width:3px;height:3px;} ::-webkit-scrollbar-thumb{background:#2A2A2A;}
  `;

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{background:C.bg,color:C.text,minHeight:"100vh",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <style>{css}</style>

      {/* HEADER */}
      <div style={{background:C.panel,borderBottom:`1px solid ${C.border}`,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50}}>
        <div>
          <div className="dsp" style={{fontSize:22,fontWeight:700,background:`linear-gradient(90deg,${C.red},${C.yellow})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1}}>TCG Pokédex</div>
          <div style={{fontSize:11,color:C.faint}}>Personal TCG investment tool</div>
        </div>
        <div style={{textAlign:"right"}}>
          {tracker.length>0
            ? <>
                <div className="mono" style={{fontSize:13,fontWeight:600,color:trackerTotals.now>=trackerTotals.spent?C.green:C.red}}>{fmt$(trackerTotals.now)}</div>
                <div style={{fontSize:10,color:C.faint}}>{trackerTotals.now>=trackerTotals.spent?"+":""}{Math.round((trackerTotals.now-trackerTotals.spent)/(trackerTotals.spent||1)*100)}% portfolio</div>
              </>
            : <>
                <div className="mono" style={{fontSize:11,color:C.faint}}>No purchases</div>
                <div style={{fontSize:10,color:C.faint}}>Add in Tracker tab</div>
              </>
          }
        </div>
      </div>

      {/* TABS */}
      <div style={{background:C.p2,borderBottom:`1px solid ${C.border}`,display:"flex",overflowX:"auto"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{minWidth:76,padding:"10px 4px",background:tab===t.id?C.border:"transparent",border:"none",color:tab===t.id?C.yellow:C.dim,fontSize:11,fontWeight:tab===t.id?600:400,display:"flex",flexDirection:"column",alignItems:"center",gap:2,flexShrink:0}}>
            <span style={{fontSize:15}}>{t.icon}</span>
            <span>{t.l}</span>
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{maxWidth:740,margin:"0 auto",padding:"14px 14px 80px"}}>

        {/* ══ SCOUT ══════════════════════════════════════════════════════════ */}
        {tab==="scout" && (
          <div>
            {/* Language */}
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              {[{id:"en",f:"🇺🇸",n:"English"},{id:"jp",f:"🇯🇵",n:"Japanese"},{id:"kr",f:"🇰🇷",n:"Korean"}].map(l=>(
                <button key={l.id} onClick={()=>{setLang(l.id);setEra("all");}} style={{flex:1,background:lang===l.id?C.p2:"transparent",color:lang===l.id?C.text:C.dim,border:`1px solid ${lang===l.id?C.yellow:C.border}`,borderRadius:8,padding:"9px",fontSize:12.5,fontWeight:600}}>
                  {l.f} {l.n}
                </button>
              ))}
            </div>

            {/* Era */}
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
              {ERAS_LIST.map(e=>{
                const ct=DB.filter(s=>s.lang===lang&&(e.id==="all"||s.era===e.id)).length;
                if(e.id!=="all"&&ct===0)return null;
                return (
                  <button key={e.id} onClick={()=>setEra(e.id)} style={{background:era===e.id?C.p2:"transparent",color:era===e.id?C.yellow:C.dim,border:`1px solid ${era===e.id?C.yellow:C.border}`,borderRadius:6,padding:"5px 11px",fontSize:11.5,fontWeight:era===e.id?600:400}}>
                    {e.n} <span style={{fontSize:9,color:C.faint}}>({ct})</span>
                  </button>
                );
              })}
            </div>

            {/* Set picker */}
            <div style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <select value={sid} onChange={e=>{setSid(e.target.value);sCi(0);setShopP({});}} style={{width:"100%"}}>
                  {filtered.map(s=>(
                    <option key={s.id} value={s.id}>
                      {s.lean==="rip"?"✅ ":s.lean==="coming"?"🔜 ":s.lean==="single"?"🎯 ":"📦 "}{s.n} ({s.code}) {s.yr}
                    </option>
                  ))}
                </select>
              </div>
              <img src={genPackSVG(set.id,set.n)} alt={set.n} style={{width:60,height:80,borderRadius:6,border:`2px solid ${C.yellow}`,boxShadow:`0 4px 12px rgba(255, 203, 5, 0.3)`,objectFit:"cover"}}/>
            </div>

            {/* Verdict */}
            <div style={{background:vd.bg,border:`1.5px solid ${vd.c}`,borderRadius:12,padding:"14px 16px",marginBottom:12}}>
              <div className="dsp" style={{fontSize:22,fontWeight:700,color:vd.c,marginBottom:6}}>{vd.l}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                <span className="mono" style={{fontSize:10,color:C.dim,border:`1px solid ${C.border}`,borderRadius:4,padding:"2px 7px"}}>{set.code}</span>
                <span className="mono" style={{fontSize:10,color:C.dim,border:`1px solid ${C.border}`,borderRadius:4,padding:"2px 7px"}}>{set.yr}</span>
                {set.lean==="coming"&&<span className="mono" style={{fontSize:10,color:C.purple,border:`1px solid ${C.purple}`,borderRadius:4,padding:"2px 7px"}}>{set.release}</span>}
                {!set.prods.find(p=>p.t==="box")&&set.lean!=="coming"&&<span className="mono" style={{fontSize:10,color:C.orange,border:`1px solid ${C.orange}`,borderRadius:4,padding:"2px 7px"}}>NO BOOSTER BOX</span>}
              </div>
              {vd.sub&&<div style={{fontSize:12,color:C.dim,lineHeight:1.5,marginBottom:6,fontStyle:"italic"}}>{vd.sub}</div>}
              <div style={{fontSize:13,color:C.dim,lineHeight:1.6}}>{set.note}</div>
            </div>

            {/* Live refresh bar */}
            <div style={{background:C.p2,border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div>
                <div style={{fontSize:12,fontWeight:600}}>📡 Live market prices</div>
                <div style={{fontSize:11,color:liveErr?C.red:C.faint}}>{liveErr||liveTs?`Updated ${liveTs}`:"Estimates below. Tap Refresh to pull live data."}</div>
              </div>
              <button onClick={doLiveFetch} disabled={liveLoading} style={{padding:"7px 13px",background:liveLoading?C.p2:C.green,color:liveLoading?C.dim:C.bg,border:"none",borderRadius:7,fontSize:12,fontWeight:700}}>
                {liveLoading?"⏳ Fetching...":"🔄 Refresh"}
              </button>
            </div>

            {/* Products by category */}
            {set.lean==="coming"
              ? <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:"20px",textAlign:"center",color:C.dim,fontSize:13}}>Products not yet confirmed. Releases {set.release}. Check Pokémon.com on drop day and buy at MSRP.</div>
              : Object.entries(groupedProds).map(([cat,prods])=>(
                  <div key={cat} style={{marginBottom:14}}>
                    <div className="mono" style={{fontSize:9.5,letterSpacing:2,color:C.faint,marginBottom:8}}>{cat.toUpperCase()}</div>
                    <div style={{overflow:"hidden",background:C.panel,border:`1px solid ${C.border}`,borderRadius:10}}>
                      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                        <thead>
                          <tr style={{borderBottom:`1px solid ${C.border}`}}>
                            {["Product","Packs","MSRP","Market","Live","$/pk","Verdict","Shop $","Deal?"].map(h=>(
                              <th key={h} style={{padding:"7px 8px",textAlign:h==="Product"?"left":"center",color:C.faint,fontWeight:400,fontSize:9.5,whiteSpace:"nowrap"}} className="mono">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {prods.map((p,i)=>{
                            const pt=PT[p.t];
                            if(!pt)return null;
                            const pv=PVD[p.v]||PVD.tbd;
                            const liveEntry=livePrices[sid]?.[p.t];
                            const liveAvg=liveEntry&&(liveEntry.avg||liveEntry.ebay||liveEntry.tcgp||liveEntry.pricech)||null;
                            const mkt=liveAvg||p.market;
                            const sp2=parseFloat(shopP[p.t])||0;
                            const sv=sp2>0&&pt.msrp?(
                              sp2<=pt.msrp*1.05?{t:"✅ MSRP",c:C.green}:
                              sp2<=pt.msrp*1.20?{t:"✓ Fair",c:C.green}:
                              mkt&&sp2<=mkt*1.05?{t:"⚠ Market",c:C.yellow}:
                              {t:"🛑 Overpriced",c:C.red}
                            ):null;
                            return (
                              <tr key={i} style={{borderBottom:i<prods.length-1?`1px solid ${C.border}`:"none",background:i%2===0?C.bg:C.p2}}>
                                <td style={{padding:"8px",fontWeight:500,maxWidth:160}}>
                                  {pt.n}
                                  {pt.warn&&<div style={{fontSize:9.5,color:C.orange}}>{pt.warn}</div>}
                                </td>
                                <td className="mono" style={{padding:"8px",textAlign:"center",color:C.faint}}>{pt.pk||"—"}</td>
                                <td className="mono" style={{padding:"8px",textAlign:"center",color:C.dim}}>{pt.msrp?`$${pt.msrp}`:"—"}</td>
                                <td className="mono" style={{padding:"8px",textAlign:"center",color:C.yellow,fontWeight:600}}>{(p.market&&Number(p.market)>0)?`$${Number(p.market).toLocaleString()}`:"—"}</td>
                                <td className="mono" style={{padding:"8px",textAlign:"center",color:liveEntry?C.green:C.faint,fontWeight:liveEntry?700:400}}>
                                  {liveEntry?(liveEntry.avg||liveEntry.ebay||liveEntry.tcgp||liveEntry.pricech)?`$${liveEntry.avg||liveEntry.ebay||liveEntry.tcgp||liveEntry.pricech}`:"—":"—"}
                                </td>
                                <td className="mono" style={{padding:"8px",textAlign:"center",color:C.faint}}>{mkt&&pt.pk>0?`$${(mkt/pt.pk).toFixed(2)}`:"—"}</td>
                                <td style={{padding:"8px",textAlign:"center"}}>
                                  <span style={{background:`${pv.c}20`,color:pv.c,border:`1px solid ${pv.c}44`,borderRadius:4,padding:"2px 7px",fontSize:9.5,fontWeight:700}} className="mono">{pv.l}</span>
                                </td>
                                <td style={{padding:"8px",textAlign:"center"}}>
                                  <input type="text" placeholder="$__" style={{width:60,textAlign:"center",padding:"4px 6px",fontSize:11}} value={shopP[p.t]||""} onChange={e=>setShopP(s=>({...s,[p.t]:e.target.value}))}/>
                                </td>
                                <td style={{padding:"8px",textAlign:"center",fontSize:10,fontWeight:600,color:sv?sv.c:C.faint}}>{sv?sv.t:"—"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
            }
          </div>
        )}

        {/* ══ MARKET ═════════════════════════════════════════════════════════ */}
        {tab==="market" && (
          <div>
            {/* Controls */}
            <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}>
              <div style={{flex:2}}>
                <select value={sid} onChange={e=>{const ns=DB.find(s=>s.id===e.target.value);setSid(e.target.value);setPeriod("All");if(ns){const fp=ns.prods.find(p=>PT[p.t]?.pk>0);if(fp)setMktProd(fp.t);}}}>
                  {DB.filter(s=>s.lang===lang).map(s=><option key={s.id} value={s.id}>{s.n} ({s.code})</option>)}
                </select>
              </div>
              <div style={{flex:1}}>
                <select value={mktProd} onChange={e=>setMktProd(e.target.value)}>
                  {set.prods.filter(p=>PT[p.t]?.pk>0).slice(0,5).map(p=><option key={p.t} value={p.t}>{PT[p.t]?.n}</option>)}
                </select>
              </div>
              <img src={genPackSVG(set.id,set.n)} alt={set.n} style={{width:50,height:70,borderRadius:4,border:`2px solid ${C.yellow}`,boxShadow:`0 3px 8px rgba(255, 203, 5, 0.25)`}}/>
            </div>

            {/* Price hero + time periods */}
            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:12}}>
                <div>
                  <div className="mono" style={{fontSize:30,fontWeight:700,letterSpacing:-1,lineHeight:1}}>
                    {ohlcCur?(ohlcCur.c<10?`$${ohlcCur.c.toFixed(2)}`:`$${ohlcCur.c.toLocaleString()}`):curProdMkt?(curProdMkt<10?`$${curProdMkt.toFixed(2)}`:`$${curProdMkt.toLocaleString()}`):"—"}
                  </div>
                  {ohlcCur && (
                    <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
                      <span className="mono" style={{fontSize:13,fontWeight:700,color:isUp?C.green:C.red,background:isUp?"rgba(61,187,80,0.12)":"rgba(204,0,0,0.12)",padding:"3px 10px",borderRadius:20}}>
                        {isUp?"▲":"▼"} {isUp?"+":""}${Math.abs(Math.round(pChg)).toLocaleString()} ({isUp?"+":""}{pPct.toFixed(1)}%)
                      </span>
                      <span style={{fontSize:11,color:C.faint}}>{period==="All"?"since launch":`${period} period`}</span>
                    </div>
                  )}
                </div>
                <div style={{background:mktSignal.c+"18",border:`1px solid ${mktSignal.c}44`,borderRadius:9,padding:"8px 14px",textAlign:"center"}}>
                  <div className="mono" style={{fontSize:12,fontWeight:700,color:mktSignal.c}}>{mktSignal.l}</div>
                  {mktSignal.sub&&<div style={{fontSize:10,color:C.dim,marginTop:2}}>{mktSignal.sub}</div>}
                  {(ohlcCur||curProdMkt)&&<div style={{fontSize:10,color:C.faint,marginTop:2}}>{isFinite(gainMsrp)?(gainMsrp>=0?"+":" ")+Math.round(Math.abs(gainMsrp))+"%"+" vs":"vs"} MSRP ${mktMsrp&&mktMsrp<5?Number(mktMsrp).toFixed(2):mktMsrp||49.99}</div>}
                </div>
              </div>

              {/* Period buttons */}
              <div style={{display:"flex",gap:6}}>
                {["1M","2M","4M","1Y","All"].map(p=>(
                  <button key={p} onClick={()=>setPeriod(p)} style={{flex:1,padding:"5px 0",borderRadius:6,fontSize:11,fontWeight:600,background:period===p?C.yellow:"transparent",color:period===p?C.bg:C.dim,border:`1px solid ${period===p?C.yellow:C.border}`}}>
                    {p==="All"?"All Time":p}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform price bubbles (PriceCharting style) */}
            <PriceBubbles livePrices={livePrices} sid={sid} ep={mktData.ep||mktProd} set={set}/>

            {/* Short-period note when data insufficient */}
            {(!ohlcData||(ohlcData&&ohlcData.length<=1))&&["1D","1W","2W"].includes(period)&&(
              <div style={{fontSize:11,color:C.faint,textAlign:"center",padding:"6px 0",marginBottom:4}}>
                Showing most recent candle only — {period} doesn't have multiple data points for this set. Try 4M or 1Y for a full chart.
              </div>
            )}
            {/* Chart */}
            {ohlcData
              ? <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",marginBottom:10}}>
                  <CandleChart data={ohlcData}/>
                  <div style={{display:"flex",gap:12,marginTop:6,justifyContent:"flex-end"}}>
                    <span style={{fontSize:9,color:C.faint,display:"flex",alignItems:"center",gap:3}}><span style={{width:8,height:8,background:C.green,borderRadius:1,display:"inline-block"}}/> UP</span>
                    <span style={{fontSize:9,color:C.faint,display:"flex",alignItems:"center",gap:3}}><span style={{width:8,height:8,background:C.red,borderRadius:1,display:"inline-block"}}/> DOWN</span>
                    <span style={{fontSize:9,color:C.faint}}>Bars = activity</span>
                  </div>
                </div>
              : <HistChart set={set} mktProd={mktData.ep||mktProd} mktMsrp={mktMsrp}/>
            }

            {/* OHLC stats (only when candlestick data available) */}
            {ohlcCur && ohlcFirst && (()=>{
              const allData=mktData.all;
              const launchPrice=allData&&allData.length>0?allData[0].o:null;
              const launchGain=launchPrice&&launchPrice>0?((ohlcCur.c-launchPrice)/launchPrice*100):null;
              const launchLabel=allData&&allData.length>0?allData[0].d:"Launch";
              return (
                <div>
                  {/* Launch → now hero row */}
                  <div style={{background:C.p2,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:10,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:100}}>
                      <div className="mono" style={{fontSize:9,color:C.faint,letterSpacing:1}}>LAUNCH ({launchLabel})</div>
                      <div className="mono" style={{fontSize:18,fontWeight:700,color:C.dim,marginTop:2}}>${launchPrice!=null?launchPrice.toLocaleString():"—"}</div>
                    </div>
                    <div style={{fontSize:20,color:C.faint}}>→</div>
                    <div style={{flex:1,minWidth:100}}>
                      <div className="mono" style={{fontSize:9,color:C.faint,letterSpacing:1}}>NOW</div>
                      <div className="mono" style={{fontSize:18,fontWeight:700,color:C.text,marginTop:2}}>${ohlcCur.c.toLocaleString()}</div>
                    </div>
                    {launchGain!=null&&(
                      <div style={{background:launchGain>=0?"rgba(61,187,80,0.12)":"rgba(204,0,0,0.12)",border:`1px solid ${launchGain>=0?C.green:C.red}44`,borderRadius:8,padding:"8px 14px",textAlign:"center"}}>
                        <div className="mono" style={{fontSize:9,color:C.faint,letterSpacing:1}}>TOTAL GAIN</div>
                        <div className="mono" style={{fontSize:20,fontWeight:700,color:launchGain>=0?C.green:C.red,marginTop:2}}>{launchGain>=0?"+":""}{Math.round(launchGain)}%</div>
                        <div className="mono" style={{fontSize:10,color:C.faint,marginTop:1}}>{launchGain>=0?"+":""}${Math.round(ohlcCur.c-launchPrice).toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
                    {[{l:"ALL-TIME HIGH",v:fmt$(ath),c:C.yellow},{l:"ALL-TIME LOW",v:fmt$(atl),c:C.faint},{l:"RELEASE MSRP",v:`$${mktMsrp<5?Number(mktMsrp).toFixed(2):mktMsrp}`,c:C.dim}].map(({l,v,c})=>(
                      <div key={l} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 10px"}}>
                        <div className="mono" style={{fontSize:9,color:C.faint,letterSpacing:1}}>{l}</div>
                        <div className="mono" style={{fontSize:13,fontWeight:600,color:c,marginTop:3}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Rankings */}
            <div className="mono" style={{fontSize:10,letterSpacing:2,color:C.faint,marginBottom:8}}>ALL SETS — SORTED BY MARKET MULTIPLE</div>
            <div style={{overflow:"hidden",borderRadius:10,border:`1px solid ${C.border}`,marginBottom:14}}>
              <div className="mono" style={{display:"grid",gridTemplateColumns:"1.4fr 0.9fr 0.6fr 0.7fr 0.6fr",fontSize:9.5,color:C.faint,background:C.p2,padding:"8px 10px",borderBottom:`1px solid ${C.border}`,letterSpacing:0.5}}>
                <span>SET</span><span>SIGNAL</span><span style={{textAlign:"right"}}>MSRP</span><span style={{textAlign:"right"}}>MARKET</span><span style={{textAlign:"right"}}>MULT</span>
              </div>
              {DB.filter(s=>s.lang===lang&&s.lean!=="coming").sort((a,b)=>{
                const mlt=s=>{const bp=s.prods.find(p=>p.t==="box")||s.prods.find(p=>p.t==="etb")||s.prods[0];const bpt=bp?PT[bp.t]:null;return(bp&&bpt&&bpt.msrp>0&&bp.market)?bp.market/bpt.msrp:0;};
                return mlt(b)-mlt(a);
              }).map((s,i,arr)=>{
                const bp=s.prods.find(p=>p.t==="box")||s.prods.find(p=>p.t==="etb")||s.prods[0];
                const bpt=bp?PT[bp.t]:null;
                const ratio=bp&&bpt&&bpt.msrp>0&&bp.market?bp.market/bpt.msrp:0;
                const mc=ratio<=1.3?C.green:ratio<=2.5?C.yellow:ratio<=6?C.orange:C.red;
                const sig=s.lean==="rip"&&ratio<1.3?"STRONG BUY":s.lean==="rip"&&ratio<2?"BUY":s.lean==="single"?"SINGLES":s.lean==="always-hold"?"VINTAGE":ratio>4?"STRONG HOLD":"HOLD";
                const sc=sig==="STRONG BUY"||sig==="BUY"?C.green:sig==="VINTAGE"?C.red:sig==="SINGLES"?C.yellow:C.blue;
                return (
                  <div key={s.id} onClick={()=>setSid(s.id)} style={{cursor:"pointer",display:"grid",gridTemplateColumns:"1.4fr 0.9fr 0.6fr 0.7fr 0.6fr",alignItems:"center",padding:"9px 10px",background:s.id===sid?C.p2:C.bg,borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",borderLeft:`3px solid ${s.id===sid?C.yellow:"transparent"}`}}>
                    <div style={{fontSize:12,color:s.id===sid?C.yellow:C.text,fontWeight:s.id===sid?600:400}}>{s.n}</div>
                    <div className="mono" style={{fontSize:10,color:sc,fontWeight:600}}>{sig}</div>
                    <div className="mono" style={{textAlign:"right",fontSize:11,color:C.faint}}>{bpt?.msrp?`$${bpt.msrp}`:"—"}</div>
                    <div className="mono" style={{textAlign:"right",fontSize:12,color:C.yellow,fontWeight:600}}>{bp?.market?`$${bp.market}`:"—"}</div>
                    <div className="mono" style={{textAlign:"right",fontSize:13,fontWeight:600,color:mc}}>
                      {ratio>0?ratio.toFixed(1)+"×":"—"}
                      {(()=>{try{const od=OHLC[s.id];const k=od?Object.keys(od)[0]:null;const arr=k?od[k]:null;if(!arr||arr.length<3)return null;const t=arr[arr.length-1].c-arr[arr.length-3].c;return (<span style={{fontSize:9,marginLeft:3,color:t>0?C.green:C.red}}>{t>0?"▲":"▼"}</span>);}catch(e){return null;}})()}
                    </div>
                  </div>
                );
              })}
            </div>



            {/* Full Release Calendar */}
            <div className="mono" style={{fontSize:10,letterSpacing:2,color:C.faint,marginBottom:10}}>2026 RELEASE CALENDAR — ALL PRODUCTS</div>
            <div style={{fontSize:11,color:C.faint,marginBottom:10}}>Tap any release to track. Figure collections and tins drop 4-8 weeks after main set. Watch for store restocks on these dates.</div>
            {[
              {date:"Jul 17",type:"MAIN SET",name:"Pitch Black (ME05)",products:["ETB $49.99","Booster Box $143.64","Bundle $26.99","3-pack $13.99","B&B $14.99"],c:C.green,lean:"RIP IT",note:"Mega Darkrai ex. Last Mega Era set at ¥180/pack. Get at MSRP — this one rips well."},
              {date:"~Aug 28",type:"TINS",name:"Pitch Black Tins Wave 1",products:["Collector Tin (3p) $19.99","Mini Tin (2p) $9.99"],c:C.yellow,lean:"WATCH",note:"Tins drop ~6 weeks after main set. Darkrai ex, Greninja ex artwork. Check Target/Walmart on Thursdays."},
              {date:"~Sep 5",type:"FIGURES",name:"Pitch Black Figure Collections",products:["Mega Darkrai ex Fig. Collection (6p) $39.99","Premium Figure Collection (6p + oversized) $49.99"],c:C.orange,lean:"BUY AT MSRP",note:"This is what you saw at the show — figure + packs + promo. These sell fast. At MSRP = great deal."},
              {date:"Sep 16",type:"MAIN SET",name:"30th Celebration",products:["UPC $119.99","ETB $49.99","Anniversary Tins $24.99","Premium Collections $49.99"],c:C.blue,lean:"HOLD",note:"ALL-FOIL worldwide set. Mew + Mewtwo Futuristic Rares. Historic. Buy any sealed and hold 12+ months."},
              {date:"~Sep 25",type:"COLLECTOR",name:"30th Collector's Chest",products:["Chest (6p + accessories) $29.99","Stadium Collection (8p + mat) $54.99","Binder Collection $54.99"],c:C.blue,lean:"HOLD",note:"Accessories + packs. The binder and stadium mat versions are limited print. Good hold."},
              {date:"Nov 6",type:"MAIN SET",name:"Delta Reign (ME06)",products:["ETB $49.99","Booster Box $143.64","Bundle $26.99"],c:C.yellow,lean:"WATCH",note:"Mega Rayquaza ex. Capstone Mega Era set — could be the most valuable Mega set long term."},
              {date:"~Dec 5",type:"HOLIDAY",name:"Holiday 2026 Wave",products:["Holiday Collector Chest $29.99","Giant Tin (6p) $39.99","Holiday ETB $59.99"],c:C.purple||C.blue,lean:"BUY AT MSRP",note:"Holiday drops hit stores first week of December. Limited quantities. Get multiples if at MSRP."},
            ].map((item,i)=>(
              <div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                    <span className="mono" style={{fontSize:11,fontWeight:700,color:item.c}}>{item.date}</span>
                    <span style={{fontSize:10,color:C.p2||"#1C1C1C",background:item.c,borderRadius:4,padding:"1px 7px",fontWeight:700,fontSize:9}}>{item.type}</span>
                    <span style={{fontWeight:600,fontSize:13}}>{item.name}</span>
                  </div>
                  <span className="mono" style={{fontSize:10,color:item.c,background:item.c+"18",padding:"2px 8px",borderRadius:5,flexShrink:0}}>{item.lean}</span>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:6}}>
                  {item.products.map((p,j)=>(
                    <span key={j} style={{fontSize:10.5,color:C.text,background:C.p2,borderRadius:5,padding:"3px 8px"}}>{p}</span>
                  ))}
                </div>
                <div style={{fontSize:11.5,color:C.dim,lineHeight:1.5}}>{item.note}</div>
              </div>
            ))}
            <div style={{padding:"10px 14px",background:C.panel,border:`1px solid ${C.border}`,borderRadius:9,fontSize:11,color:C.faint,lineHeight:1.6,marginTop:4}}>
              Dates marked ~ are estimates. Main sets drop on Fridays. Tins and figure collections drop on Thursdays ~4-8 weeks later. Check Target, Walmart, Best Buy, and Game Stop. Pokemon Center online drops at midnight ET.
            </div>
          </div>
        )}

        {/* ══ ANALYZER ═══════════════════════════════════════════════════════ */}
        {tab==="analyzer" && (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              <select value={sid} onChange={e=>{setSid(e.target.value);sCi(0);}}>
                <optgroup label="— Sets with full data —">
                  {DB.filter(s=>s.lang==="en"&&CARDS[s.id]).map(s=><option key={s.id} value={s.id}>{s.n}</option>)}
                </optgroup>
                <optgroup label="— Sets coming soon —">
                  {DB.filter(s=>s.lang==="en"&&!CARDS[s.id]&&s.lean!=="coming").map(s=><option key={s.id} value={s.id}>{s.n} (limited data)</option>)}
                </optgroup>
              </select>
              {cards
                ? <select value={ci} onChange={e=>sCi(+e.target.value)}>
                    {cards.map((c,i)=><option key={i} value={i}>{c.hot?"🔥 ":""}{c.n} {c.raw>=20?`$${c.raw}`:""}</option>)}
                  </select>
                : <select><option>No card data for this set</option></select>
              }
            </div>

            {!cards && (
              <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:9,padding:"12px 14px",marginBottom:8}}>
                <div style={{fontWeight:600,marginBottom:8,fontSize:13}}>No full pull rate data for this set yet.</div>
                <div style={{fontSize:12.5,color:C.dim,lineHeight:1.6,marginBottom:8}}>
                  Select a set from the <span style={{color:C.yellow,fontWeight:600}}>Sets with full data</span> group above.
                </div>
                <div style={{background:C.p2,borderRadius:8,padding:"10px 12px"}}>
                  <div style={{fontWeight:600,fontSize:12,marginBottom:6,color:C.yellow}}>What is a chase card?</div>
                  <div style={{fontSize:12,color:C.dim,lineHeight:1.6}}>
                    A <strong style={{color:C.text}}>chase card</strong> is the rarest, most valuable card in a set — the one collectors most want to pull from packs. In Scarlet & Violet era, these are called <strong style={{color:C.text}}>Special Illustration Rares (SIR)</strong> — full-art cards with unique backgrounds, worth $50–$1,000+ each. The "pull rate" is how rare it is: <em>"1 in 400 packs"</em> means on average you'd need to open 400 packs to pull it once.
                  </div>
                </div>
              </div>
            )}

            {cards && !isBulk && card && (
              <div>
                {/* Card stats */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
                  <SB label="Pull rate" val={`1 in ${avgPacks.toLocaleString()}`}/>
                  <SB label="Raw value" val={fmt$(card.raw)} color={C.yellow}/>
                  <SB label="PSA 10" val={fmt$(card.p10)} color={C.blue}/>
                  <SB label="Avg packs" val={`${avgPacks.toLocaleString()}p`}/>
                  <SB label="Avg cost to pull" val={`$${Math.round(avgCost).toLocaleString()}`} color={avgCost>card.raw?C.red:C.green}/>
                  <SB label="Leverage" val={`${leverage.toFixed(1)}×`} color={leverage>2?C.red:leverage>1?C.orange:C.green}/>
                </div>
                {card.note&&<div style={{fontSize:13,color:C.dim,marginBottom:14}}>{card.note}</div>}

                {/* Pull odds */}
                <div className="mono" style={{fontSize:10,letterSpacing:2,color:C.faint,marginBottom:8}}>PULL ODDS BY PRODUCT</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
                  {[[1,"Loose pack"],[3,"3-pack blister"],[6,"Bundle (6p)"],[9,"ETB (9p)"],[11,"PC ETB (11p)"],[16,"Ultra Premium"],[36,"Booster box"],[72,"2 Boxes"],[216,"Full case"]].map(([n,lbl])=>{
                    const ch=P1(card.pull,n)*100;
                    return (
                      <div key={n} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:12,color:C.dim}}>{lbl}</span>
                        <span className="mono" style={{fontSize:13,fontWeight:600,color:ch>50?C.green:ch>20?C.orange:C.text}}>{fmtPct(ch/100)}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{padding:"10px 13px",borderRadius:9,border:`1px solid ${C.border}`,background:C.panel,fontSize:12.5,color:C.dim,lineHeight:1.6,marginBottom:14}}>
                  Coin-flip: <span className="mono">{packs4(card.pull,0.5).toLocaleString()} packs</span> for 50/50. Getting nothing from a bundle or ETB is the <em>expected</em> result — not bad luck.
                </div>

                {/* ROI */}
                <div className="mono" style={{fontSize:10,letterSpacing:2,color:C.faint,marginBottom:8}}>ROI & KELLY CRITERION</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                  <SB label="Kelly criterion" val={`${kelly.toFixed(1)}%`} color={kelly<0?C.red:C.green}/>
                  <SB label="Hard stop $" val={`$${Math.round(card.raw*0.5).toLocaleString()}`} color={C.orange}/>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                  <span style={{fontSize:12,color:C.dim,minWidth:80}}>Budget</span>
                  <input type="range" min={20} max={2000} step={10} value={budget} onChange={e=>setBudget(+e.target.value)}/>
                  <span className="mono" style={{color:C.yellow,minWidth:54,textAlign:"right"}}>${budget.toLocaleString()}</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
                  <SB label="Packs" val={budgetPacks.toLocaleString()}/>
                  <SB label="Pull chance" val={fmtPct(budgetChance)} color={budgetChance>0.5?C.green:budgetChance>0.2?C.orange:C.red}/>
                  <SB label="Exp return" val={fmt$(expRet)} color={expRet>=budget?C.green:C.red}/>
                  <SB label="Exp ROI" val={`${bROI>=0?"+":""}${Math.round(bROI)}%`} color={bROI>=0?C.green:C.red}/>
                </div>
                <div style={{padding:"10px 13px",borderRadius:9,border:`1px solid ${kelly<0?C.red:C.green}`,background:C.panel,fontSize:12.5,color:C.dim,lineHeight:1.6,marginBottom:14}}>
                  <span style={{color:kelly<0?C.red:C.green,fontWeight:600}}>{kelly<0?"Negative Kelly":"Positive Kelly"}</span> — {kelly<0?"Don't chase this card via packs as an investment.":` Ripping is defensible — max ${kelly.toFixed(1)}% of your risk budget.`}
                </div>

                {/* Session checker */}
                <div className="mono" style={{fontSize:10,letterSpacing:2,color:C.faint,marginBottom:8}}>SESSION CHECKER</div>
                <div style={{display:"flex",gap:12,marginBottom:10,flexWrap:"wrap"}}>
                  <label style={{fontSize:13,color:C.dim,display:"flex",gap:8,alignItems:"center"}}>Packs<input type="number" min={1} value={obs} onChange={e=>setObs(Math.max(1,+e.target.value))} style={{width:64}}/></label>
                  <label style={{fontSize:13,color:C.dim,display:"flex",gap:8,alignItems:"center"}}>Hits<input type="number" min={0} value={hits} onChange={e=>setHits(Math.max(0,+e.target.value))} style={{width:64}}/></label>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:8}}>
                  <SB label="Expected" val={sExp.toFixed(2)}/>
                  <SB label="Normal range" val={`${sLo.toFixed(1)}–${sHi.toFixed(1)}`}/>
                  <SB label="Chance of zero" val={fmtPct(p0)} color={p0>0.5?C.red:C.green}/>
                </div>
                <div style={{padding:"10px 13px",borderRadius:9,border:`1px solid ${hits>sHi?C.yellow:hits<sLo?C.red:C.green}`,background:C.panel,fontSize:12.5,color:C.dim,lineHeight:1.6}}>
                  <span className="mono" style={{color:hits>sHi?C.yellow:hits<sLo?C.red:C.green,fontWeight:600}}>
                    {hits>sHi?`🔥 HOT — ${Math.abs(sZ).toFixed(1)}σ above avg`:hits<sLo?`🥶 COLD — ${Math.abs(sZ).toFixed(1)}σ below avg`:"✅ NORMAL — exactly what variance looks like"}
                  </span>
                  {obs<10&&<span style={{color:C.dim}}> · Only {obs} packs — need ~{packs4(card.pull,0.5)} for a coin-flip.</span>}
                </div>
              </div>
            )}
            {card&&isBulk&&<div style={{padding:"10px 13px",borderRadius:9,border:`1px solid ${C.red}`,background:C.panel,fontSize:12.5,color:C.dim}}>This is bulk ($1–5). Not a real hit. Select an SIR or chase card above.</div>}
          </div>
        )}

        {/* ══ GRADE ══════════════════════════════════════════════════════════ */}
        {tab==="grade" && (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              <select value={sid} onChange={e=>{setSid(e.target.value);sCi(0);}}>
                <optgroup label="— Sets with full data —">
                  {DB.filter(s=>s.lang==="en"&&CARDS[s.id]).map(s=><option key={s.id} value={s.id}>{s.n}</option>)}
                </optgroup>
                <optgroup label="— Sets coming soon —">
                  {DB.filter(s=>s.lang==="en"&&!CARDS[s.id]&&s.lean!=="coming").map(s=><option key={s.id} value={s.id}>{s.n} (limited data)</option>)}
                </optgroup>
              </select>
              {cards&&<select value={ci} onChange={e=>sCi(+e.target.value)}>
                {cards.filter(c=>c.raw>=10).map((c,i)=><option key={i} value={cards.indexOf(c)}>{c.hot?"🔥 ":""}{c.n} — ${c.raw}</option>)}
              </select>}
            </div>
            <div style={{padding:"10px 13px",borderRadius:9,border:`1px solid ${C.orange}`,background:C.panel,fontSize:12.5,color:C.dim,lineHeight:1.6,marginBottom:12}}>
              <span style={{color:C.yellow,fontWeight:600}}>Jun 2026:</span> PSA Value tiers paused — min $80. TAG Priority only ($149). CGC Economy $16. BGS $25. Only grade NM condition cards.
            </div>
            {card && (
              <div>
                <div className="mono" style={{fontSize:10,letterSpacing:2,color:C.faint,marginBottom:8}}>ALL 4 GRADERS — NET PROFIT COMPARISON</div>
                <div style={{overflow:"hidden",borderRadius:10,border:`1px solid ${C.border}`,marginBottom:12}}>
                  <div className="mono" style={{display:"grid",gridTemplateColumns:"0.7fr 0.5fr 0.5fr 1fr 1fr 1fr",fontSize:9.5,color:C.faint,background:C.p2,padding:"8px 12px",borderBottom:`1px solid ${C.border}`,letterSpacing:0.5}}>
                    <span>GRADER</span><span>COST</span><span>SPEED</span><span style={{textAlign:"right"}}>IF GRADE 10</span><span style={{textAlign:"right"}}>IF GRADE 9</span><span>BEST FOR</span>
                  </div>
                  {GRADERS.map((g,i)=>{
                    const n10=Math.round(card.p10*g.m10*FEE-card.raw-g.cost);
                    const n9=Math.round(card.p9*g.m10*0.62*FEE-card.raw-g.cost);
                    const act=g.id===grader;
                    return (
                      <div key={g.id} onClick={()=>setGrader(g.id)} style={{cursor:"pointer",display:"grid",gridTemplateColumns:"0.7fr 0.5fr 0.5fr 1fr 1fr 1fr",alignItems:"center",padding:"10px 12px",background:act?C.p2:C.bg,borderBottom:i<3?`1px solid ${C.border}`:"none",borderLeft:`3px solid ${act?C.yellow:"transparent"}`}}>
                        <div className="dsp" style={{fontSize:14,fontWeight:700,color:act?C.yellow:C.text}}>{g.n}</div>
                        <div className="mono" style={{fontSize:12,color:C.dim}}>${g.cost}</div>
                        <div style={{fontSize:11,color:C.dim}}>{g.days}</div>
                        <div className="mono" style={{textAlign:"right",fontSize:13,fontWeight:600,color:n10>=0?C.green:C.red}}>{n10>=0?"+":""}${n10.toLocaleString()}</div>
                        <div className="mono" style={{textAlign:"right",fontSize:12,color:n9>=0?C.green:C.red}}>{n9>=0?"+":""}${n9.toLocaleString()}</div>
                        <div style={{fontSize:11,color:C.dim,paddingLeft:8}}>{g.best}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{padding:"10px 13px",borderRadius:9,border:`1px solid ${expG>=50?C.green:expG>=0?C.orange:C.red}`,background:C.panel,fontSize:12.5,color:C.dim,lineHeight:1.6,marginBottom:14}}>
                  <span className="mono" style={{color:expG>=50?C.green:expG>=0?C.orange:C.red,fontWeight:600}}>{expG>=50?"GRADE IT":expG>=0?"BORDERLINE":"SKIP"}</span>
                  {" — "}Expected net with {gr.n}: {expG>=0?"+":""}${expG.toLocaleString()}. {card.raw<50?"Raw under $50 — fee kills margin. ":""}Submit only if visually perfect.
                </div>

                <div className="mono" style={{fontSize:10,letterSpacing:2,color:C.faint,marginBottom:8}}>CRACK & REGRADE — PSA 9 → DIFFERENT GRADER</div>
                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  {GRADERS.filter(g=>g.id!=="psa").map(g=>(
                    <button key={g.id} onClick={()=>setCrGrader(g.id)} style={{flex:1,padding:"8px",borderRadius:8,fontSize:12,fontWeight:600,background:crGrader===g.id?C.p2:C.panel,border:`1px solid ${crGrader===g.id?C.yellow:C.border}`,color:crGrader===g.id?C.yellow:C.dim}}>
                      {g.n} ${g.cost}
                    </button>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:10}}>
                  <SB label="Sell PSA 9 now" val={`${fmt$(Math.round((card.p9||0)*FEE))} net`}/>
                  <SB label={`${crGr.n} 10 net`} val={`${crn10>=0?"+":""}${fmt$(crn10)}`} color={crn10>=0?C.green:C.red}/>
                  <SB label={`${crGr.n} 9 net`} val={`${crn9>=0?"+":""}${fmt$(crn9)}`} color={crn9>=0?C.green:C.red}/>
                  <SB label="Expected EV" val={`${crEV>=0?"+":""}${fmt$(crEV)}`} color={crEV>=0?C.green:C.red}/>
                </div>
                <div style={{padding:"10px 13px",borderRadius:9,border:`1px solid ${crEV>0?C.green:C.red}`,background:C.panel,fontSize:12.5,color:C.dim,lineHeight:1.6}}>
                  <span className="mono" style={{color:crEV>0?C.green:C.red,fontWeight:600}}>{crEV>0?"CRACK IT":"SELL THE PSA 9"}</span>
                  {" — "}{crGr.n} 10 at ~{Math.round(crGr.m10*100)}% of PSA 10. Cost ${crGr.cost}. Crack only if it looked like a 10 that PSA undercalled.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ COMPARE ════════════════════════════════════════════════════════ */}
        {tab==="compare" && (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
              {[[cmpId1,setCmpId1,"SET 1"],[cmpId2,setCmpId2,"SET 2"]].map(([val,setter,lbl])=>(
                <div key={lbl}>
                  <div className="mono" style={{fontSize:9.5,color:C.faint,marginBottom:6}}>{lbl}</div>
                  <select value={val} onChange={e=>setter(e.target.value)}>
                    <optgroup label="English">
                      {DB.filter(s=>s.lang==="en").map(s=><option key={s.id} value={s.id}>{s.n} ({s.code})</option>)}
                    </optgroup>
                    <optgroup label="Japanese">
                      {DB.filter(s=>s.lang==="jp").map(s=><option key={s.id} value={s.id}>{s.n} ({s.code})</option>)}
                    </optgroup>
                    <optgroup label="Korean">
                      {DB.filter(s=>s.lang==="kr").map(s=><option key={s.id} value={s.id}>{s.n} ({s.code})</option>)}
                    </optgroup>
                  </select>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              {[DB.find(s=>s.id===cmpId1)||DB[0],cmpSet].map((s,idx)=>{
                const v=VD[s.lean]||VD.hold;
                const bp=s.prods.find(p=>p.t==="box")||s.prods.find(p=>p.t==="etb");
                const bpt=bp?PT[bp.t]:null;
                const sc=CARDS[s.id];
                const tc=sc?sc.find(c=>c.hot):null;
                const mult=bp&&bpt&&bp.market?bp.market/bpt.msrp:null;
                const pc=getPackCost(s);
                const avgCost2=tc?avgN(tc.pull)*pc:null;
                return (
                  <div key={idx} style={{background:v.bg,border:`1.5px solid ${v.c}`,borderRadius:10,padding:12}}>
                    <div className="dsp" style={{fontSize:14,fontWeight:700,marginBottom:2}}>{s.n}</div>
                    <div className="mono" style={{fontSize:9.5,color:C.faint,marginBottom:8}}>{s.code} · {s.yr}</div>
                    <div style={{color:v.c,fontWeight:700,fontSize:12,marginBottom:8}}>{v.l}</div>
                    {[
                      ["Top product", bp?`$${bp.market||"TBA"}`:"—"],
                      ["Market mult", mult?`${mult.toFixed(1)}×`:"—"],
                      ["Chase card", tc?`$${tc.raw} raw`:"—"],
                      ["Pull rate", tc?`1 in ${avgN(tc.pull).toLocaleString()}`:"—"],
                      ["Avg cost to pull", avgCost2?`$${Math.round(avgCost2).toLocaleString()}`:"—"],
                    ].map(([l,v2])=>(
                      <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:11.5}}>
                        <span style={{color:C.dim}}>{l}</span>
                        <span className="mono" style={{fontWeight:600}}>{v2}</span>
                      </div>
                    ))}
                    <div style={{fontSize:11,color:C.faint,marginTop:8,lineHeight:1.5}}>{s.note}</div>
                  </div>
                );
              })}
            </div>
            <div style={{padding:"10px 13px",borderRadius:9,border:`1px solid ${C.border}`,background:C.panel,fontSize:12.5,color:C.dim,lineHeight:1.6}}>
              <span style={{color:C.yellow,fontWeight:600}}>How to compare:</span> Lower market mult = better rip opportunity. Higher mult = sealed is appreciating. Low pull rate + high card value = negative EV, buy the single instead.
            </div>
          </div>
        )}

        {/* ══ BUDGET ═════════════════════════════════════════════════════════ */}
        {tab==="budget" && (
          <div>
            <div className="mono" style={{fontSize:10,letterSpacing:2,color:C.faint,marginBottom:8}}>HOW MUCH DO YOU HAVE?</div>
            <div style={{fontSize:11,color:C.faint,marginBottom:8}}>Recommendations based on current top sets. For card math, use Analyzer. <span style={{color:C.yellow,fontWeight:600}}>New to TCG investing? Start with Chaos Rising ($58 ETB) — it's at MSRP and rip-positive right now.</span></div>
            <input type="number" min={20} max={10000} step={50} value={budget} onChange={e=>setBudget(+e.target.value)} style={{fontSize:20,padding:"12px",fontWeight:600,marginBottom:10}}/>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
              {[50,100,200,300,500,1000].map(v=>(
                <button key={v} onClick={()=>setBudget(v)} style={{flex:"1 0 60px",padding:"8px",borderRadius:7,fontSize:12,fontWeight:600,background:budget===v?C.p2:"transparent",border:`1px solid ${budget===v?C.yellow:C.border}`,color:budget===v?C.yellow:C.dim}}>
                  ${v}
                </button>
              ))}
            </div>
            <BudgetRecs budget={budget}/>
          </div>
        )}

        {/* ══ TRACKER ════════════════════════════════════════════════════════ */}
        {tab==="tracker" && (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
              <SB label="Total spent" val={`$${trackerTotals.spent.toLocaleString()}`}/>
              <SB label="Current value" val={`$${trackerTotals.now.toLocaleString()}`} color={trackerTotals.now>=trackerTotals.spent?C.green:C.red}/>
              <SB label="P & L" val={`${trackerTotals.now>=trackerTotals.spent?"+":""}$${(trackerTotals.now-trackerTotals.spent).toLocaleString()}`} color={trackerTotals.now>=trackerTotals.spent?C.green:C.red}/>
            </div>

            {tracker.length===0
              ? <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:"20px",textAlign:"center",color:C.dim,marginBottom:12}}>No purchases logged yet. Add your first one below.</div>
              : tracker.map((t,i)=>{
                  const pl=t.current-t.cost;
                  const pct=Math.round(pl/t.cost*100);
                  return (
                    <div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:9,padding:"11px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:13}}>{t.name}</div>
                        <div style={{fontSize:11,color:C.faint}}>{t.date} · paid ${t.cost.toLocaleString()}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div className="mono" style={{fontSize:16,fontWeight:700,color:pl>=0?C.green:C.red}}>{pl>=0?"+":""}${pl.toLocaleString()}</div>
                        <div style={{fontSize:10,color:C.dim}}>${t.current.toLocaleString()} · {pct>=0?"+":""}{pct}%</div>
                      </div>
                      <button onClick={()=>setTracker(tr=>tr.filter((_,j)=>j!==i))} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.faint,borderRadius:6,padding:"4px 8px",fontSize:13,flexShrink:0}} title="Remove">✕</button>
                    </div>
                  );
                })
            }

            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:12}}>
              <div className="mono" style={{fontSize:10,letterSpacing:2,color:C.faint,marginBottom:8}}>LOG NEW PURCHASE</div>
              <input placeholder="What (e.g. 151 ETB, raw Umbreon SIR)" value={newT.name} onChange={e=>setNewT(n=>({...n,name:e.target.value}))} style={{marginBottom:8}}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <input type="number" placeholder="Paid ($)" value={newT.cost} onChange={e=>setNewT(n=>({...n,cost:e.target.value}))}/>
                <input type="number" placeholder="Market now ($)" value={newT.current} onChange={e=>setNewT(n=>({...n,current:e.target.value}))}/>
              </div>
              <button
                onClick={()=>{
                  if(newT.name&&newT.cost&&newT.current){
                    const d=new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"});
                    setTracker(tr=>[...tr,{name:newT.name,date:d,cost:+newT.cost,current:+newT.current}]);
                    setNewT({name:"",cost:"",current:""});
                  }
                }}
                style={{width:"100%",padding:"10px",background:C.green,color:C.bg,border:"none",borderRadius:8,fontWeight:700,fontSize:13}}
              >
                + Add to Portfolio
              </button>
            </div>
          </div>
        )}

        {/* ══ AT A SHOW ══════════════════════════════════════════════════════ */}
        {tab==="show" && (
          <ShowTab DB={DB} PT={PT} VD={VD} CARDS={CARDS}/>
        )}

      </div>

      {/* FOOTER */}
      <div style={{maxWidth:740,margin:"0 auto",padding:"0 14px 20px"}}>
        <div style={{fontSize:10.5,color:C.faint,padding:"10px 12px",background:C.panel,borderRadius:8,border:`1px solid ${C.border}`,lineHeight:1.5}}>
          Pull rates from community studies (1k–8k+ packs). Pokémon never publishes official odds. Prices mid-2026 — verify on TCGPlayer before spending. Grading net = sell × 87% − raw − fee. Not financial advice.
        </div>
      </div>
    </div>
  );
}


// ── HIST CHART (fallback when no OHLC data) ──────────────────────────────────
function HistChart({set,mktProd,mktMsrp}){
  const C2={panel:"#111111",border:"#2A2A2A",yellow:"#FFCB05",green:"#3DBB50",red:"#CC0000",orange:"#F08030",faint:"#555",dim:"#888",text:"#F0EDE4"};
  // Try to get hist values for the selected product
  const getVal=(d)=>{
    if(mktProd==="box")return d.box||d.etb||0;
    if(mktProd==="bundle")return d.bundle||d.etb||0;
    if(mktProd==="pcetb")return d.pcetb||d.etb||0;
    return d.etb||d.box||0;
  };
  const vals=(set.hist||[]).map(getVal).filter(v=>v>0);
  const lbls=(set.hist||[]).filter((_,i)=>(set.hist.map(getVal)[i]||0)>0).map(d=>d.p);
  // Current market price from set.prods
  // Find the product — exact match preferred, then any product with market price
  const exactProd=set.prods.find(p=>p.t===mktProd);
  const prodEntry=exactProd||set.prods.find(p=>p.market&&PT[p.t]?.pk>0)||set.prods[0];
  const marketNow=exactProd?.market||set.prods.find(p=>p.market&&PT[p.t]?.pk>0)?.market||null;
  const actualMsrp=PT[mktProd]?.msrp||mktMsrp||49.99;
  const msrp=actualMsrp;

  if(vals.length<2){
    // No chart history — show market price card with info
    return (
      <div style={{background:C2.panel,border:`1px solid ${C2.border}`,borderRadius:12,padding:"16px",marginBottom:10}}>
        {marketNow?(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:28,fontWeight:700,color:C2.text}}>${marketNow.toLocaleString()}</div>
                <div style={{fontSize:12,color:C2.faint,marginTop:4}}>Current market price</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{color:C2.yellow,fontWeight:600,fontSize:14,fontFamily:"'JetBrains Mono',monospace"}}>+{msrp>0?Math.round((marketNow-msrp)/msrp*100):0}%</div>
                <div style={{fontSize:11,color:C2.faint}}>vs MSRP ${msrp}</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div style={{background:"#1C1C1C",borderRadius:8,padding:"8px 10px"}}>
                <div style={{fontSize:9,color:C2.faint,letterSpacing:1,fontFamily:"'JetBrains Mono',monospace"}}>MSRP</div>
                <div style={{fontSize:14,fontWeight:600,fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>${msrp<10?msrp.toFixed(2):Math.round(msrp).toLocaleString()}</div>
              </div>
              <div style={{background:"#1C1C1C",borderRadius:8,padding:"8px 10px"}}>
                <div style={{fontSize:9,color:C2.faint,letterSpacing:1,fontFamily:"'JetBrains Mono',monospace"}}>MARKET MULT</div>
                <div style={{fontSize:14,fontWeight:600,fontFamily:"'JetBrains Mono',monospace",color:C2.yellow,marginTop:2}}>{(actualMsrp>0&&marketNow)?(marketNow/actualMsrp).toFixed(1):"-"}x</div>
              </div>
            </div>
            <div style={{fontSize:11,color:C2.faint,marginTop:10,textAlign:"center"}}>Full price history chart coming soon. Hit Refresh for live sold data.</div>
          </div>
        ):(
          <div style={{textAlign:"center",padding:"20px 0",color:C2.faint}}>
            <div style={{fontSize:13,marginBottom:6}}>No price data for this product yet</div>
            <div style={{fontSize:11}}>Switch to ETB or Box for full candlestick charts, or hit Refresh to fetch live prices.</div>
          </div>
        )}
      </div>
    );
  }
  const cv=vals[vals.length-1];const fv=vals[0];
  const pct=fv>0?Math.round((cv-fv)/fv*100):0;
  const gain=msrp>0?Math.round((cv-msrp)/msrp*100):0;
  const lc=pct>=0?C2.green:C2.red;
  return (
    <div style={{background:C2.panel,border:`1px solid ${C2.border}`,borderRadius:12,padding:"14px 16px",marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
        <div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:24,fontWeight:700}}>${cv.toLocaleString()}</div>
          <div style={{color:lc,fontWeight:600,fontSize:13,marginTop:4}}>{pct>=0?"▲":"▼"} {Math.abs(pct)}% since release</div>
        </div>
        <div style={{textAlign:"right",fontSize:11,color:C2.faint}}>
          <div>MSRP ${msrp}</div>
          <div style={{color:C2.yellow,fontWeight:600}}>+{gain}% gain</div>
        </div>
      </div>
      <SimpleLineChart vals={vals} labels={lbls}/>
    </div>
  );
}

// ── BUDGET RECS ───────────────────────────────────────────────────────────────
function BudgetRecs({budget}){
  const C2={panel:"#111111",border:"#2A2A2A",green:"#3DBB50",yellow:"#FFCB05",faint:"#555",dim:"#888"};
  const opts=budget<=75?[
    {icon:"🎯",l:"Buy a raw single",d:`$${budget} doesn't go far in packs. Buy a raw chase card on TCGPlayer instead — better ROI at this budget.`}
  ]:budget<=150?[
    {icon:"🎲",l:"1× Chaos Rising ETB ($58) + save the rest",d:`Rip for fun. Bank the remaining $${budget-58} toward a raw single next purchase.`},
    {icon:"🎯",l:"Buy a PSA 9 single instead",d:`$${budget} gets you a PSA 9 on most older set chase cards. Way better ROI than packs.`},
  ]:budget<=350?[
    {icon:"🎲",l:"1× Chaos Rising box ($235) — rip it",d:`Best rip EV right now. Keep $${budget-235} as stop-loss for a single if nothing hits.`},
    {icon:"⚖️",l:"Phantasmal ETB ($52 hold) + singles",d:`Keep ETB sealed, use remaining $${budget-52} on raw 151 singles.`},
    {icon:"🔒",l:"Start an Evolving Skies ETB fund",d:`Box is $310. Add $${310-budget} more and lock up the most consistent appreciating product in the hobby.`},
  ]:budget<=700?[
    {icon:"📈",l:"Portfolio split: Hold + Rip + Singles",d:`Hold: Evolving Skies ETB ($310). Rip: Chaos Rising box ($235). Singles: $${budget-545} left for raw cards.`},
    {icon:"🔒",l:"Stack Prismatic Evolutions ETBs",d:`${Math.floor(budget/140)}× Prismatic ETBs at $140 each. Umbreon SIR demand + no booster box = keeps climbing.`},
  ]:[
    {icon:"🏛️",l:"Blue-chip portfolio",d:`Evolving Skies ETB ($310) + Crown Zenith ETB ($225) + 2× Chaos Rising boxes ($470) + 151 ETB ($220). Total ~$1,225.`},
    {icon:"🎰",l:"All-in rip session",d:`${Math.floor(budget/235)}× Chaos Rising boxes. Playing for Greninja SIR ($350). High variance — this is gambling money.`},
  ];
  return (
    <div>
      {opts.map((o,i)=>(
        <div key={i} style={{background:C2.panel,border:`1px solid ${C2.border}`,borderRadius:10,padding:"12px 14px",marginBottom:8}}>
          <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>{o.icon} {o.l}</div>
          <div style={{fontSize:12.5,color:C2.dim,lineHeight:1.6}}>{o.d}</div>
        </div>
      ))}
    </div>
  );
}


// ── SHOW TAB — Card Show Survival Tool ───────────────────────────────────────
function ShowTab({DB,PT,VD,CARDS}){
  const [showSet,setShowSet]=React.useState("en_chaos");
  const [showProd,setShowProd]=React.useState("etb");
  const [showPrice,setShowPrice]=React.useState("");
  const [cmpItems,setCmpItems]=React.useState([
    {sid:"en_phantasmal",prod:"etb",price:""},
    {sid:"en_perfect",prod:"etb",price:""},
    {sid:"en_151",prod:"bundle",price:""},
  ]);
  const [mode,setMode]=React.useState("check"); // "check" | "compare" | "odds"

  const C2={bg:"#0A0A0A",panel:"#111111",p2:"#1C1C1C",border:"#2A2A2A",text:"#F0EDE4",
    dim:"#888",faint:"#555",red:"#CC0000",yellow:"#FFCB05",green:"#3DBB50",orange:"#F08030",blue:"#4A5FD6"};

  const showSetObj=DB.find(s=>s.id===showSet)||DB[0];
  const showProdObj=showSetObj.prods.find(p=>p.t===showProd)||showSetObj.prods[0];
  const showPT=showProdObj?PT[showProdObj.t]:null;
  const spVal=parseFloat(showPrice)||0;

  const getVerdict=(msrp,market,asked)=>{
    if(!asked||asked<=0)return null;
    if(msrp&&asked<=msrp*1.05)return{t:"AT MSRP — SOLID BUY",c:C2.green,score:5};
    if(msrp&&asked<=msrp*1.20)return{t:"FAIR PRICE",c:C2.green,score:4};
    if(market&&asked<=market*1.05)return{t:"AT MARKET — ACCEPTABLE",c:C2.yellow,score:3};
    if(market&&asked<=market*1.20)return{t:"SLIGHTLY OVER MARKET",c:C2.orange,score:2};
    return{t:"OVERPRICED — NEGOTIATE",c:C2.red,score:1};
  };

  const showVerdict=getVerdict(showPT?.msrp,showProdObj?.market,spVal);

  const negoScript=(setName,prod,msrp,market,asked)=>{
    if(!asked||!market)return null;
    const over=Math.round(asked-market);
    const pct=Math.round((asked-market)/market*100);
    if(pct<=5)return null;
    return [
      `"TCGPlayer has this at $${market} right now — can you do $${Math.round(market*1.05)}?"`,
      `"eBay sold listings this week averaged $${Math.round(market*0.95)}–$${market}."`,
      over>20?`"If you can't move on price, can you throw in a loose pack?"`:`"I'll do $${Math.round(market)} cash right now."`,
    ];
  };

  const TAB_BTN=(id,lbl)=>(<button key={id} onClick={()=>setMode(id)} style={{flex:1,padding:"8px 4px",fontSize:11.5,fontWeight:600,borderRadius:7,border:`1px solid ${mode===id?C2.yellow:C2.border}`,background:mode===id?C2.p2:"transparent",color:mode===id?C2.yellow:C2.dim}}>{lbl}</button>);

  return (
    <div>
      {/* Mode selector */}
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {TAB_BTN("check","Price Check")}
        {TAB_BTN("compare","Compare 3")}
        {TAB_BTN("odds","Pack Odds")}
      </div>

      {/* ── PRICE CHECK MODE ── */}
      {mode==="check"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
            <div>
              <div className="mono" style={{fontSize:9.5,color:C2.faint,marginBottom:5}}>SET</div>
              <select value={showSet} onChange={e=>{setShowSet(e.target.value);const s=DB.find(x=>x.id===e.target.value);if(s)setShowProd(s.prods[0]?.t||"etb");}} style={{background:C2.p2,border:`1px solid ${C2.border}`,color:C2.text,borderRadius:8,padding:"8px 10px",fontSize:13,width:"100%"}}>
                {DB.filter(s=>s.lang==="en").map(s=><option key={s.id} value={s.id}>{s.n}</option>)}
              </select>
            </div>
            <div>
              <div className="mono" style={{fontSize:9.5,color:C2.faint,marginBottom:5}}>PRODUCT</div>
              <select value={showProd} onChange={e=>setShowProd(e.target.value)} style={{background:C2.p2,border:`1px solid ${C2.border}`,color:C2.text,borderRadius:8,padding:"8px 10px",fontSize:13,width:"100%"}}>
                {showSetObj.prods.map(p=><option key={p.t} value={p.t}>{PT[p.t]?.n||p.t}{p.market?` — $${p.market}`:""}</option>)}
              </select>
            </div>
          </div>

          <input type="text" placeholder="Vendor asking price (e.g. 75)" value={showPrice} onChange={e=>setShowPrice(e.target.value)} style={{background:C2.p2,border:`1px solid ${C2.border}`,color:C2.text,borderRadius:8,padding:"14px",fontSize:24,fontWeight:700,width:"100%",textAlign:"center",marginBottom:10,boxSizing:"border-box"}}/>

          {/* Stats */}
          {showProdObj&&showPT&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:10}}>
              {[{l:"MSRP",v:showPT.msrp?`$${showPT.msrp}`:"—"},{l:"MARKET",v:showProdObj.market?`$${showProdObj.market}`:"—",c:C2.yellow},{l:"SET",v:(VD[showSetObj.lean]||VD.hold).l.replace(/[✅🔒🎯🔜👀🏛️]/g,"").trim(),c:(VD[showSetObj.lean]||VD.hold).c}].map(({l,v,c})=>(
                <div key={l} style={{background:C2.panel,border:`1px solid ${C2.border}`,borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
                  <div className="mono" style={{fontSize:9,color:C2.faint,letterSpacing:1}}>{l}</div>
                  <div className="mono" style={{fontSize:12,fontWeight:600,color:c||C2.text,marginTop:3}}>{v}</div>
                </div>
              ))}
            </div>
          )}

          {/* Verdict */}
          {showVerdict&&(
            <div style={{background:`${showVerdict.c}18`,border:`2px solid ${showVerdict.c}`,borderRadius:12,padding:"14px 16px",textAlign:"center",marginBottom:10}}>
              <div className="dsp" style={{fontSize:20,fontWeight:700,color:showVerdict.c,marginBottom:4}}>{showVerdict.t}</div>
              {showProdObj?.market&&spVal>0&&(
                <div className="mono" style={{fontSize:12,color:C2.dim}}>
                  You are paying {spVal>showProdObj.market?`$${Math.round(spVal-showProdObj.market)} (${Math.round((spVal-showProdObj.market)/showProdObj.market*100)}%) OVER market`:`$${Math.round(showProdObj.market-spVal)} UNDER market`}
                </div>
              )}
              {showPT?.warn&&<div style={{fontSize:12,color:C2.orange,marginTop:6}}>{showPT.warn}</div>}
            </div>
          )}

          {/* Negotiation script */}
          {showVerdict&&showVerdict.score<3&&showProdObj?.market&&spVal>0&&(()=>{
            const lines=negoScript(showSetObj.n,showProd,showPT?.msrp,showProdObj.market,spVal);
            if(!lines)return null;
            return (
              <div style={{background:C2.panel,border:`1px solid ${C2.orange}55`,borderRadius:10,padding:"12px 14px",marginBottom:10}}>
                <div style={{fontWeight:600,fontSize:13,color:C2.orange,marginBottom:8}}>Negotiation lines — show vendor your phone:</div>
                {lines.map((l,i)=>(
                  <div key={i} style={{background:C2.p2,borderRadius:7,padding:"8px 12px",marginBottom:6,fontSize:13,color:C2.text,lineHeight:1.5}}>
                    {l}
                  </div>
                ))}
                <div style={{fontSize:11,color:C2.faint,marginTop:8}}>These prices are live market data from TCGPlayer/eBay sold listings.</div>
              </div>
            );
          })()}

          {/* Red flags */}
          <div style={{background:C2.panel,border:`1px solid ${C2.border}`,borderRadius:10,padding:"12px 14px"}}>
            <div style={{fontWeight:600,marginBottom:8,fontSize:13}}>Red flags at any show:</div>
            {[["🚩","Loose packs in a case","High chance searched. Walk away."],["🔍","ETB seal looks off","Check original shrink wrap and Pokémon sticker."],["🥷","Ripped bundle sold as loose packs","$1.50/pk normal. Over $3/pk for basic sets? Too much."],["💰","Over 2× MSRP?","Sealed hold — don't open it. Buy and sit."],["🎯","Just want one card?","Buy the raw single. Always cheaper than ripping for it."]].map(([ic,t,tip])=>(
              <div key={t} style={{display:"flex",gap:8,marginBottom:7}}>
                <span style={{flexShrink:0}}>{ic}</span>
                <div><div style={{fontSize:12.5,fontWeight:600}}>{t}</div><div style={{fontSize:11.5,color:C2.dim}}>{tip}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── COMPARE 3 MODE ── */}
      {mode==="compare"&&(
        <div>
          <div style={{fontSize:12,color:C2.dim,marginBottom:10}}>Enter 3 products and what the vendor wants — see which is the best deal instantly.</div>
          {cmpItems.map((item,idx)=>{
            const s=DB.find(x=>x.id===item.sid)||DB[0];
            const p=s.prods.find(x=>x.t===item.prod)||s.prods[0];
            const pt=p?PT[p.t]:null;
            const asked=parseFloat(item.price)||0;
            const v=getVerdict(pt?.msrp,p?.market,asked);
            return (
              <div key={idx} style={{background:C2.panel,border:`1px solid ${v?v.c+"55":C2.border}`,borderRadius:10,padding:"10px 12px",marginBottom:8}}>
                <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
                  <select value={item.sid} onChange={e=>{const n=[...cmpItems];n[idx]={...n[idx],sid:e.target.value,prod:"etb"};setCmpItems(n);}} style={{flex:2,minWidth:120,background:C2.p2,border:`1px solid ${C2.border}`,color:C2.text,borderRadius:6,padding:"6px 8px",fontSize:12}}>
                    {DB.filter(s=>s.lang==="en").map(s=><option key={s.id} value={s.id}>{s.n}</option>)}
                  </select>
                  <select value={item.prod} onChange={e=>{const n=[...cmpItems];n[idx]={...n[idx],prod:e.target.value};setCmpItems(n);}} style={{flex:1,minWidth:80,background:C2.p2,border:`1px solid ${C2.border}`,color:C2.text,borderRadius:6,padding:"6px 8px",fontSize:12}}>
                    {s.prods.map(pr=><option key={pr.t} value={pr.t}>{PT[pr.t]?.n||pr.t}</option>)}
                  </select>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <input type="text" placeholder="Asking $" value={item.price} onChange={e=>{const n=[...cmpItems];n[idx]={...n[idx],price:e.target.value};setCmpItems(n);}} style={{flex:1,background:C2.p2,border:`1px solid ${C2.border}`,color:C2.text,borderRadius:6,padding:"8px",fontSize:16,fontWeight:700,textAlign:"center"}}/>
                  <div style={{textAlign:"right",flex:1}}>
                    <div className="mono" style={{fontSize:11,color:C2.faint}}>Market: {p?.market?`$${p.market}`:"—"}</div>
                    <div className="mono" style={{fontSize:11,color:C2.faint}}>MSRP: {pt?.msrp?`$${pt.msrp}`:"—"}</div>
                    {v&&<div style={{fontWeight:700,fontSize:12,color:v.c,marginTop:2}}>{v.t}</div>}
                  </div>
                </div>
              </div>
            );
          })}
          {/* Best deal summary */}
          {(()=>{
            const scored=cmpItems.map((item,idx)=>{
              const s=DB.find(x=>x.id===item.sid)||DB[0];
              const p=s.prods.find(x=>x.t===item.prod)||s.prods[0];
              const pt=p?PT[p.t]:null;
              const asked=parseFloat(item.price)||0;
              const v=getVerdict(pt?.msrp,p?.market,asked);
              return{idx,name:s.n,score:v?.score||0,market:p?.market,asked};
            }).filter(x=>x.asked>0);
            if(scored.length<2)return (<div style={{fontSize:12,color:C2.faint,textAlign:"center",padding:10}}>Enter prices above to compare.</div>);
            const best=scored.reduce((a,b)=>b.score>a.score?b:a);
            return (
              <div style={{background:C2.green+"18",border:`1.5px solid ${C2.green}`,borderRadius:10,padding:"10px 14px",textAlign:"center"}}>
                <div style={{fontWeight:700,color:C2.green,fontSize:14}}>Best deal: Option {best.idx+1} — {best.name}</div>
                {best.market&&best.asked&&<div style={{fontSize:12,color:C2.dim,marginTop:4}}>Asking ${best.asked} vs market ${best.market} ({best.asked<=best.market?"at or below":"${Math.round((best.asked/best.market-1)*100)}% over"} market)</div>}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── PACK ODDS MODE ── */}
      {mode==="odds"&&(
        <div>
          <div style={{fontSize:12,color:C2.dim,marginBottom:12}}>Enter what the vendor is charging per pack. See if the odds are in your favor.</div>
          {[
            {id:"en_chaos",n:"Chaos Rising",chase:"Greninja ex SIR",raw:350,pull:1/400,msrpPk:6.53},
            {id:"en_phantasmal",n:"Phantasmal Flames",chase:"Charizard X SIR",raw:780,pull:1/400,msrpPk:6.53},
            {id:"en_perfect",n:"Perfect Order",chase:"Any SIR",raw:50,pull:1/81,msrpPk:6.53},
            {id:"en_151",n:"151 (no box)",chase:"Charizard ex SIR",raw:400,pull:1/288,msrpPk:22},
            {id:"en_prismatic",n:"Prismatic Evolutions",chase:"Umbreon SIR",raw:1250,pull:1/45,msrpPk:15.6},
          ].map(row=>{
            const avgPks=Math.round(1/row.pull);
            const breakeven=Math.round(row.raw*0.87/avgPks*100)/100;
            const riskLabel=row.msrpPk<breakeven?"RIP EV POSITIVE":"NEGATIVE EV — DON'T RIP";
            const riskColor=row.msrpPk<breakeven?C2.green:C2.red;
            return (
              <div key={row.id} style={{background:C2.panel,border:`1px solid ${C2.border}`,borderRadius:10,padding:"10px 14px",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:13}}>{row.n}</div>
                    <div style={{fontSize:11,color:C2.faint}}>Chase: {row.chase} (${row.raw} raw)</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div className="mono" style={{fontSize:11,color:riskColor,fontWeight:600}}>{riskLabel}</div>
                    <div className="mono" style={{fontSize:10,color:C2.faint}}>Break-even: ${breakeven}/pk</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                  <div style={{background:C2.p2,borderRadius:6,padding:"6px 8px",textAlign:"center"}}>
                    <div className="mono" style={{fontSize:9,color:C2.faint}}>PULL RATE</div>
                    <div className="mono" style={{fontSize:12,fontWeight:600}}>1 in {avgPks.toLocaleString()}</div>
                  </div>
                  <div style={{background:C2.p2,borderRadius:6,padding:"6px 8px",textAlign:"center"}}>
                    <div className="mono" style={{fontSize:9,color:C2.faint}}>AVG COST</div>
                    <div className="mono" style={{fontSize:12,fontWeight:600,color:C2.red}}>${(avgPks*row.msrpPk).toLocaleString()}</div>
                  </div>
                  <div style={{background:C2.p2,borderRadius:6,padding:"6px 8px",textAlign:"center"}}>
                    <div className="mono" style={{fontSize:9,color:C2.faint}}>VERDICT</div>
                    <div className="mono" style={{fontSize:11,fontWeight:600,color:C2.faint}}>Don't rip</div>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{padding:"10px 14px",borderRadius:9,border:`1px solid ${C2.yellow}44`,background:C2.panel,fontSize:12,color:C2.dim,marginTop:4}}>
            Loose packs at a show are almost never worth ripping for EV. Buy singles or sealed for hold value. The exception: Prismatic Evolutions — best pull rate in the modern era.
          </div>
        </div>
      )}
    </div>
  );
}






// ── PRICE BUBBLES (PriceCharting style) ──────────────────────────────────────
function PriceBubbles({livePrices,sid,ep,set}){
  const liveEntry=livePrices?.[sid]?.[ep];
  const curProd=set.prods.find(p=>p.t===ep);
  const dbPrice=curProd?.market||null;
  const platforms=[
    {k:"ebay",  n:"eBay Sold",     sub:"30-day sold avg", col:"#E53935"},
    {k:"tcgp",  n:"TCGPlayer",     sub:"Market price",    col:"#1565C0"},
    {k:"pricech",n:"PriceCharting",sub:"Last sale",       col:"#2E7D32"},
  ];
  const hasAnyLive=liveEntry&&platforms.some(p=>liveEntry[p.k]>0);
  return (
    <div style={{marginBottom:10}}>
      <div style={{display:"flex",gap:6,marginBottom:4}}>
        {platforms.map(pl=>{
          const price=liveEntry?.[pl.k];
          const isLive=price&&price>0;
          return (
            <div key={pl.k} style={{flex:1,background:"#111111",border:`1.5px solid ${isLive?pl.col+"99":"#2A2A2A"}`,borderRadius:10,padding:"8px 10px",textAlign:"center"}}>
              <div style={{fontSize:9,color:pl.col,fontWeight:700,marginBottom:3,letterSpacing:0.5}}>{pl.n}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:17,fontWeight:700,color:isLive?pl.col:"#555"}}>
                {isLive?`$${price}`:dbPrice?`~$${dbPrice}`:"—"}
              </div>
              <div style={{fontSize:8,color:"#555",marginTop:2}}>{isLive?"live":dbPrice?"est. (tap Refresh)":"no data"}</div>
            </div>
          );
        })}
      </div>
      {hasAnyLive&&liveEntry?.avg&&(
        <div style={{textAlign:"center",fontSize:11,color:"#888"}}>
          Avg across platforms: <span style={{color:"#FFCB05",fontWeight:600,fontFamily:"'JetBrains Mono',monospace"}}>${liveEntry.avg}</span>
        </div>
      )}
      {!hasAnyLive&&(
        <div style={{fontSize:10,color:"#555",textAlign:"center"}}>
          Showing database estimates. Hit <span style={{color:"#FFCB05"}}>Refresh</span> in Scout tab for live eBay/TCGPlayer/PriceCharting sold data.
        </div>
      )}
    </div>
  );
}

// ── CANDLESTICK CHART ─────────────────────────────────────────────────────────
function CandleChart({data}){
  if(!data||data.length<2)return null;
  const W=420,CH=160,VH=36,PL=48,PR=8,PTOP=8,PB=18;
  const prices=data.flatMap(d=>[d.h,d.l]);
  const minP=Math.min(...prices),maxP=Math.max(...prices),range=maxP-minP||1;
  const maxV=Math.max(...data.map(d=>d.v||1));
  const cW=Math.max(3,Math.min(14,(W-PL-PR)/data.length*0.6));
  const xPos=i=>PL+0.5*(W-PL-PR)/data.length+(i*(W-PL-PR)/data.length);
  const yP=p=>PTOP+(1-(p-minP)/range)*(CH-PTOP-PB);
  return(
    <svg viewBox={`0 0 ${W} ${CH+VH+PB}`} style={{width:"100%",display:"block"}}>
      {/* Grid lines */}
      {[0,0.25,0.5,0.75,1].map((f,i)=>{
        const p=maxP-f*range;const y=yP(p);
        const lbl=p>=1000?(p/1000).toFixed(1)+"k":String(Math.round(p));
        return (
          <g key={i}>
            <line x1={PL} x2={W-PR} y1={y} y2={y} stroke="#2A2A2A" strokeWidth="0.5" strokeDasharray={f===0||f===1?"":"3,4"}/>
            <text x={PL-4} y={y+4} fontSize="9" fill="#555" textAnchor="end">{"$"+lbl}</text>
          </g>
        );
      })}
      {/* Volume divider */}
      <line x1={PL} x2={W-PR} y1={CH} y2={CH} stroke="#2A2A2A" strokeWidth="0.5"/>
      {/* Candles */}
      {data.map((d,i)=>{
        const x=xPos(i);const up=d.c>=d.o;const col=up?"#3DBB50":"#CC0000";
        const bT=Math.min(yP(d.o),yP(d.c));const bH=Math.max(1,Math.abs(yP(d.c)-yP(d.o)));
        const vH=((d.v||1)/maxV)*VH*0.85;
        return <g key={i}>
          <line x1={x} x2={x} y1={yP(d.h)} y2={yP(d.l)} stroke={col} strokeWidth="1"/>
          <rect x={x-cW/2} y={bT} width={cW} height={bH} fill={col} rx="1"/>
          <rect x={x-cW/2} y={CH+VH-vH} width={cW} height={vH} fill={up?"#3DBB5055":"#CC000055"} rx="1"/>
        </g>;
      })}
      {/* X labels */}
      {data.filter((_,i)=>i===0||i===Math.floor(data.length/2)||i===data.length-1).map((d)=>{
        const i=data.indexOf(d);
        return (<text key={i} x={xPos(i)} y={CH+VH+PB-2} fontSize="9" fill="#555" textAnchor="middle">{d.d}</text>);
      })}
      {/* Current price dashed line */}
      <line x1={PL} x2={W-PR} y1={yP(data[data.length-1].c)} y2={yP(data[data.length-1].c)} stroke={data[data.length-1].c>=data[0].o?"#3DBB50":"#CC0000"} strokeWidth="0.8" strokeDasharray="2,3"/>
    </svg>
  );
}

// ── SIMPLE LINE CHART ─────────────────────────────────────────────────────────
function SimpleLineChart({vals,labels}){
  const W=420,H=110,PL=48,PR=8,PTOP=8,PB=18;
  const min=Math.min(...vals),max=Math.max(...vals),range=max-min||1;
  const cW=W-PL-PR,cH=H-PTOP-PB;
  const pts=vals.map((v,i)=>({x:PL+(i/(vals.length-1))*cW,y:PTOP+(1-(v-min)/range)*cH}));
  const pLine=pts.map((p,i)=>`${i===0?"M":"L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const pFill=pLine+` L${pts[pts.length-1].x},${H-PB} L${PL},${H-PB} Z`;
  const lc=vals[vals.length-1]>=vals[0]?"#3DBB50":"#CC0000";
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",display:"block"}}>
      <defs><linearGradient id="slg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={lc} stopOpacity="0.18"/><stop offset="100%" stopColor={lc} stopOpacity="0.02"/></linearGradient></defs>
      {[0,0.5,1].map((f,i)=>{
        const p=max-f*range;
        const y=PTOP+(f)*cH;
        const lbl=p>=1000?(p/1000).toFixed(1)+"k":String(Math.round(p));
        return (
          <g key={i}>
            <line x1={PL} x2={W-PR} y1={y} y2={y} stroke="#2A2A2A" strokeWidth="0.5"/>
            <text x={PL-4} y={y+4} fontSize="9" fill="#555" textAnchor="end">{"$"+lbl}</text>
          </g>
        );
      })}
      <path d={pFill} fill="url(#slg)"/>
      <path d={pLine} stroke={lc} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=>(i===0||i===pts.length-1)&&<circle key={i} cx={p.x} cy={p.y} r="3.5" fill={lc} stroke="#0A0A0A" strokeWidth="1.5"/>)}
      {labels&&labels.filter((_,i)=>i===0||i===Math.floor(labels.length/2)||i===labels.length-1).map((l,idx)=>{
        const i2=labels.indexOf(l);
        return (<text key={idx} x={pts[i2]?.x||0} y={H-2} fontSize="9" fill="#555" textAnchor="middle">{l}</text>);
      })}
    </svg>
  );
}

// ── SHARED UI ──────────────────────────────────────────────────────────────────
function SB({label,val,color}){
  return(
    <div style={{background:"#111111",border:"1px solid #2A2A2A",borderRadius:8,padding:"9px 12px"}}>
      <div style={{fontSize:10.5,color:"#555"}}>{label}</div>
      <div className="mono" style={{fontSize:14,fontWeight:600,color:color||"#F0EDE4",marginTop:4}}>{val}</div>
    </div>
  );
}


