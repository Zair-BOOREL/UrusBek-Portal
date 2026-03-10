import { useState, useEffect } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:       #080710;
  --bg2:      #0f0d1a;
  --bg3:      #161326;
  --purple:   #5b21b6;
  --pm:       #7c3aed;
  --pl:       #a78bfa;
  --pglow:    rgba(91,33,182,0.16);
  --g1:       #1a1728;
  --g2:       #251f38;
  --g3:       #362e50;
  --text:     #ede9ff;
  --muted:    #7b738f;
  --dim:      #3d3558;
  --accent:   #c4b5fd;
  --green:    #10d9a0;
  --gdim:     rgba(16,217,160,0.10);
  --orange:   #f97316;
  --odim:     rgba(249,115,22,0.10);
  --red:      #f43f5e;
  --rdim:     rgba(244,63,94,0.10);
  --blue:     #38bdf8;
  --bdim:     rgba(56,189,248,0.10);
  --border:   rgba(91,33,182,0.18);
  --border2:  rgba(255,255,255,0.04);
  font-family: 'DM Sans', sans-serif;
}

body { background: var(--bg); color: var(--text); overflow-x: hidden; }

/* scrollbar */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: var(--bg2); }
::-webkit-scrollbar-thumb { background: var(--g3); border-radius: 3px; }

/* layout */
.app { display: flex; min-height: 100vh; position: relative; }

/* noise overlay */
.noise {
  position: fixed; inset: 0; pointer-events: none; z-index: 9999;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  opacity: 0.5;
}

/* sidebar */
.sidebar {
  width: 220px; flex-shrink: 0;
  background: var(--bg2);
  border-right: 1px solid var(--border2);
  display: flex; flex-direction: column;
  position: fixed; inset-block: 0; left: 0;
  z-index: 100; overflow-y: auto;
}

.logo-area { padding: 24px 20px 20px; border-bottom: 1px solid var(--border2); }
.logo { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
.logo span { color: var(--pl); }
.logo-sub { font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--dim); margin-top: 2px; }

.view-toggle {
  margin: 12px 12px 0;
  display: flex; background: var(--g1); border-radius: 8px; padding: 3px;
}
.vt-btn {
  flex: 1; padding: 6px; font-size: 10px; font-weight: 600;
  letter-spacing: 0.5px; text-transform: uppercase;
  border: none; border-radius: 6px; cursor: pointer;
  background: transparent; color: var(--muted);
  transition: all 0.2s; font-family: 'DM Sans', sans-serif;
}
.vt-btn.active { background: var(--purple); color: white; box-shadow: 0 2px 8px rgba(91,33,182,0.4); }

.nav-section {
  padding: 16px 16px 4px;
  font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--dim); font-weight: 500;
}

.nav-item {
  display: flex; align-items: center; gap: 9px;
  padding: 9px 14px; margin: 1px 8px;
  border-radius: 8px; cursor: pointer;
  font-size: 13px; color: var(--muted);
  border: 1px solid transparent;
  transition: all 0.18s; position: relative;
  user-select: none;
}
.nav-item:hover { background: var(--g1); color: var(--text); }
.nav-item.active {
  background: var(--pglow); color: var(--accent);
  border-color: var(--border);
}
.nav-item.active::before {
  content:''; position: absolute; left: -8px; top: 50%; transform: translateY(-50%);
  width: 3px; height: 14px; background: var(--pl); border-radius: 2px;
}
.nav-icon { font-size: 14px; width: 18px; text-align: center; flex-shrink: 0; }
.nav-badge {
  margin-left: auto; font-size: 10px; font-weight: 700;
  background: var(--purple); color: white;
  padding: 1px 6px; border-radius: 10px;
}
.nav-badge.orange { background: var(--orange); }
.nav-badge.red { background: var(--red); }

.sidebar-bottom {
  margin-top: auto; padding: 14px 12px;
  border-top: 1px solid var(--border2);
}
.user-pill {
  display: flex; align-items: center; gap: 9px;
  padding: 9px 10px; background: var(--g1);
  border: 1px solid var(--border2); border-radius: 10px;
}
.user-avatar {
  width: 30px; height: 30px; border-radius: 7px;
  background: linear-gradient(135deg, var(--purple), var(--pm));
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif; font-weight: 700; font-size: 12px; color: white;
  flex-shrink: 0;
}
.user-name { font-size: 12px; font-weight: 500; color: var(--text); }
.user-role { font-size: 10px; color: var(--muted); }

/* main */
.main { margin-left: 220px; flex: 1; padding: 28px 32px; min-height: 100vh; }

/* topbar */
.topbar { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; }
.page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
.page-sub { font-size: 13px; color: var(--muted); margin-top: 3px; }
.topbar-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

/* buttons */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500;
  cursor: pointer; border: none; font-family: 'DM Sans', sans-serif;
  transition: all 0.2s; white-space: nowrap;
}
.btn-primary { background: var(--purple); color: white; }
.btn-primary:hover { background: var(--pm); box-shadow: 0 4px 12px rgba(91,33,182,0.4); }
.btn-ghost { background: var(--g1); color: var(--muted); border: 1px solid var(--border2); }
.btn-ghost:hover { color: var(--text); border-color: var(--border); }
.btn-sm { padding: 5px 11px; font-size: 12px; }

/* cards */
.card {
  background: var(--bg2); border: 1px solid var(--border2);
  border-radius: 12px; padding: 20px;
  position: relative; overflow: hidden;
  transition: border-color 0.2s;
}
.card:hover { border-color: var(--border); }
.card::after {
  content:''; position: absolute; top:0; left:0; right:0; height:1px;
  background: linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent);
}

/* grids */
.g3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 16px; }
.g4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 16px; }
.g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.g21 { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 16px; }
.mb16 { margin-bottom: 16px; }

/* kpi cards */
.kpi { background: var(--bg2); border: 1px solid var(--border2); border-radius: 12px; padding: 18px; transition: all 0.2s; position: relative; overflow: hidden; }
.kpi:hover { border-color: var(--border); transform: translateY(-1px); }
.kpi-label { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; font-weight: 500; }
.kpi-val { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -1px; line-height: 1; margin-bottom: 6px; }
.kpi-delta { font-size: 11px; display: flex; align-items: center; gap: 4px; }
.up { color: var(--green); }
.down { color: var(--red); }
.neutral { color: var(--muted); }
.kpi-icon { position: absolute; right: 16px; top: 16px; font-size: 20px; opacity: 0.35; }
.kpi-bar { margin-top: 10px; height: 3px; background: var(--g2); border-radius: 2px; overflow: hidden; }
.kpi-bar-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--purple), var(--pl)); }

/* section header */
.sh { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.sh-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; }
.sh-action { font-size: 12px; color: var(--pl); cursor: pointer; font-weight: 500; }
.sh-action:hover { opacity: 0.7; }

/* table */
.table { width: 100%; border-collapse: collapse; }
.table th { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--dim); padding: 0 12px 10px; text-align: left; font-weight: 600; border-bottom: 1px solid var(--border2); }
.table td { padding: 11px 12px; font-size: 13px; color: var(--text); border-bottom: 1px solid var(--border2); vertical-align: middle; }
.table tr:last-child td { border-bottom: none; }
.table tr:hover td { background: rgba(255,255,255,0.015); }

/* badges */
.badge { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 20px; font-size: 10px; font-weight: 600; white-space: nowrap; }
.b-green { background: var(--gdim); color: var(--green); border: 1px solid rgba(16,217,160,0.2); }
.b-orange { background: var(--odim); color: var(--orange); border: 1px solid rgba(249,115,22,0.2); }
.b-red { background: var(--rdim); color: var(--red); border: 1px solid rgba(244,63,94,0.2); }
.b-blue { background: var(--bdim); color: var(--blue); border: 1px solid rgba(56,189,248,0.2); }
.b-purple { background: var(--pglow); color: var(--pl); border: 1px solid var(--border); }
.b-grey { background: var(--g1); color: var(--muted); border: 1px solid var(--border2); }

/* pipeline */
.pipeline-board { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; }
.pipeline-col {
  min-width: 178px; max-width: 178px;
  background: var(--bg2); border: 1px solid var(--border2);
  border-radius: 12px; padding: 14px 12px;
  flex-shrink: 0;
}
.pipeline-col-header { margin-bottom: 12px; }
.pipeline-col-title { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; color: var(--text); margin-bottom: 3px; }
.pipeline-col-count { font-size: 10px; color: var(--muted); }
.deal-card {
  background: var(--g1); border: 1px solid var(--border2);
  border-radius: 9px; padding: 11px;
  margin-bottom: 8px; cursor: pointer;
  transition: all 0.15s;
}
.deal-card:hover { border-color: var(--border); transform: translateY(-1px); }
.deal-card:last-child { margin-bottom: 0; }
.deal-name { font-size: 12px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
.deal-company { font-size: 11px; color: var(--muted); margin-bottom: 8px; }
.deal-value { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: var(--green); }
.deal-prob { font-size: 10px; color: var(--muted); margin-top: 2px; }

/* tasks */
.task-row { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--border2); }
.task-row:last-child { border-bottom: none; padding-bottom: 0; }
.task-row:first-child { padding-top: 0; }
.task-check { width: 18px; height: 18px; border-radius: 4px; border: 1.5px solid var(--g3); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; cursor: pointer; }
.task-check.done { background: var(--purple); border-color: var(--purple); color: white; }
.task-text { flex: 1; font-size: 13px; }
.task-text.done { color: var(--dim); text-decoration: line-through; }
.task-meta { display: flex; align-items: center; gap: 6px; }

/* progress bar */
.progress-wrap { background: var(--g1); border-radius: 4px; height: 6px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--purple), var(--pl)); transition: width 0.8s ease; }

/* activity feed */
.activity-row { display: flex; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--border2); }
.activity-row:last-child { border-bottom: none; padding-bottom: 0; }
.activity-row:first-child { padding-top: 0; }
.a-icon { width: 30px; height: 30px; border-radius: 7px; background: var(--g1); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
.a-text { font-size: 12.5px; color: var(--text); line-height: 1.4; }
.a-time { font-size: 10px; color: var(--dim); margin-top: 1px; }

/* onboarding checklist */
.check-group { margin-bottom: 14px; }
.check-group-title { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; font-weight: 500; }
.check-item { display: flex; align-items: center; gap: 9px; padding: 7px 10px; background: var(--g1); border-radius: 7px; border: 1px solid var(--border2); margin-bottom: 5px; cursor: pointer; transition: all 0.15s; }
.check-item:hover { border-color: var(--border); }
.check-item:last-child { margin-bottom: 0; }
.ci-box { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid var(--g3); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 9px; }
.ci-box.done { background: var(--green); border-color: var(--green); color: white; }
.ci-text { font-size: 12.5px; }
.ci-text.done { color: var(--dim); text-decoration: line-through; }

/* funnel bars */
.funnel-row { display: flex; align-items: center; gap: 10px; margin-bottom: 9px; }
.funnel-label { font-size: 12px; color: var(--muted); width: 110px; flex-shrink: 0; }
.funnel-track { flex: 1; height: 26px; background: var(--g1); border-radius: 6px; overflow: hidden; border: 1px solid var(--border2); }
.funnel-fill { height: 100%; display: flex; align-items: center; padding: 0 9px; font-size: 11px; font-weight: 600; color: white; border-radius: 6px; }
.funnel-count { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: var(--text); width: 36px; text-align: right; flex-shrink: 0; }

/* metric row */
.m-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid var(--border2); }
.m-row:last-child { border-bottom: none; }
.m-row:first-child { padding-top: 0; }
.m-label { font-size: 13px; color: var(--muted); }
.m-val { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; }

/* phase stepper */
.phases { display: flex; margin-bottom: 20px; }
.phase { flex: 1; text-align: center; position: relative; }
.phase:not(:last-child)::after { content:''; position: absolute; top: 18px; left: 50%; width: 100%; height: 2px; background: var(--g2); z-index: 0; }
.phase.done:not(:last-child)::after { background: linear-gradient(90deg, var(--purple), var(--pm)); }
.phase.active:not(:last-child)::after { background: linear-gradient(90deg, var(--pm), var(--g2)); }
.phase-dot { width: 36px; height: 36px; border-radius: 50%; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; position: relative; z-index: 1; }
.phase.done .phase-dot { background: var(--purple); border: 2px solid var(--pm); box-shadow: 0 0 12px rgba(91,33,182,0.4); }
.phase.active .phase-dot { background: var(--bg2); border: 2px solid var(--pl); box-shadow: 0 0 16px rgba(167,139,250,0.4); animation: glow 2s infinite; }
.phase.pending .phase-dot { background: var(--g1); border: 2px solid var(--g2); }
@keyframes glow { 0%,100%{box-shadow:0 0 16px rgba(167,139,250,0.4);}50%{box-shadow:0 0 24px rgba(167,139,250,0.7);} }
.phase-name { font-size: 10px; font-family: 'Syne', sans-serif; font-weight: 600; }
.phase.done .phase-name { color: var(--pl); }
.phase.active .phase-name { color: var(--accent); }
.phase.pending .phase-name { color: var(--dim); }

/* bar chart simple */
.bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 100px; }
.bar-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; }
.bar-track { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.bar-fill { width: 100%; border-radius: 5px 5px 0 0; transition: height 0.8s ease; min-height: 4px; }
.bar-label { font-size: 9px; color: var(--dim); }
.bar-val { font-size: 10px; color: var(--muted); }

/* status dot */
.sdot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.sdot.green { background: var(--green); box-shadow: 0 0 6px var(--green); animation: pulse 2s infinite; }
.sdot.orange { background: var(--orange); }
.sdot.red { background: var(--red); }
.sdot.grey { background: var(--muted); }
@keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.4;} }

/* tag */
.tag { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 5px; font-size: 10px; font-weight: 500; }

/* tabs */
.tabs { display: flex; gap: 3px; background: var(--g1); padding: 3px; border-radius: 9px; margin-bottom: 18px; width: fit-content; }
.tab { padding: 6px 14px; font-size: 12px; font-weight: 500; border-radius: 7px; cursor: pointer; color: var(--muted); transition: all 0.2s; }
.tab.active { background: var(--purple); color: white; box-shadow: 0 2px 8px rgba(91,33,182,0.35); }

/* modal overlay */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 200; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
.modal { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 28px; width: 520px; max-width: 95vw; max-height: 85vh; overflow-y: auto; position: relative; }
.modal-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 20px; }
.modal-close { position: absolute; top: 16px; right: 16px; background: var(--g1); border: 1px solid var(--border2); border-radius: 6px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; color: var(--muted); }
.modal-close:hover { color: var(--text); }

/* form */
.form-row { margin-bottom: 14px; }
.form-label { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); margin-bottom: 5px; display: block; }
.form-input {
  width: 100%; padding: 9px 12px; background: var(--g1);
  border: 1px solid var(--border2); border-radius: 8px;
  color: var(--text); font-size: 13px; font-family: 'DM Sans', sans-serif;
  outline: none; transition: border-color 0.2s;
}
.form-input:focus { border-color: var(--purple); }
.form-input option { background: var(--bg2); }
.form-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* divider */
.divider { height: 1px; background: var(--border2); margin: 16px 0; }

/* welcome banner */
.banner {
  background: linear-gradient(135deg, rgba(91,33,182,0.15), rgba(124,58,237,0.06));
  border: 1px solid var(--border);
  border-radius: 12px; padding: 20px 24px;
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px; overflow: hidden; position: relative;
}
.banner::before {
  content:''; position: absolute; right: -40px; top: -40px;
  width: 160px; height: 160px; border-radius: 50%;
  background: radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%);
}
.banner h2 { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 3px; }
.banner p { font-size: 12px; color: var(--muted); }

/* risk card */
.risk-card { background: var(--rdim); border: 1px solid rgba(244,63,94,0.2); border-radius: 9px; padding: 11px 13px; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
.risk-card:last-child { margin-bottom: 0; }

/* client card */
.client-card { background: var(--g1); border: 1px solid var(--border2); border-radius: 10px; padding: 14px; margin-bottom: 10px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 12px; }
.client-card:hover { border-color: var(--border); }
.client-card:last-child { margin-bottom: 0; }
.client-ava { width: 36px; height: 36px; border-radius: 8px; background: linear-gradient(135deg, var(--purple), var(--pm)); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; color: white; flex-shrink: 0; }

/* report card */
.report-card { background: var(--g1); border: 1px solid var(--border2); border-radius: 10px; padding: 14px 16px; margin-bottom: 8px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: all 0.15s; }
.report-card:hover { border-color: var(--border); }
.report-card:last-child { margin-bottom: 0; }
.report-icon { width: 38px; height: 38px; border-radius: 8px; background: var(--pglow); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }

/* kb card */
.kb-card { background: var(--g1); border: 1px solid var(--border2); border-radius: 10px; padding: 14px; margin-bottom: 8px; cursor: pointer; transition: all 0.15s; }
.kb-card:hover { border-color: var(--border); }
.kb-card:last-child { margin-bottom: 0; }
.kb-icon { font-size: 20px; margin-bottom: 6px; }
.kb-title { font-size: 13px; font-weight: 600; margin-bottom: 3px; }
.kb-desc { font-size: 11px; color: var(--muted); line-height: 1.4; }

/* calendar mini */
.cal-week { display: grid; grid-template-columns: repeat(7,1fr); gap: 5px; }
.cal-day-name { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: var(--dim); text-align: center; margin-bottom: 4px; }
.cal-cell { aspect-ratio:1; border-radius: 7px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; font-size: 10px; cursor: pointer; border: 1px solid var(--border2); background: var(--g1); color: var(--dim); transition: all 0.15s; }
.cal-cell.has { background: var(--pglow); border-color: var(--border); color: var(--accent); }
.cal-cell.pub { background: var(--gdim); border-color: rgba(16,217,160,0.2); color: var(--green); }
.cal-cell.today { border-color: var(--pl); }
.cal-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; }

/* doc row */
.doc-row { display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: var(--g1); border: 1px solid var(--border2); border-radius: 8px; margin-bottom: 7px; cursor: pointer; transition: all 0.15s; }
.doc-row:hover { border-color: var(--border); }
.doc-row:last-child { margin-bottom: 0; }
.doc-icon { font-size: 18px; flex-shrink: 0; }
.doc-name { font-size: 13px; font-weight: 500; flex: 1; }
.doc-meta { font-size: 11px; color: var(--muted); }

/* request card */
.req-card { background: var(--g1); border: 1px solid var(--border2); border-radius: 10px; padding: 13px; margin-bottom: 8px; transition: all 0.15s; cursor: pointer; }
.req-card:hover { border-color: var(--border); }
.req-card:last-child { margin-bottom: 0; }
.req-title { font-size: 13px; font-weight: 600; margin-bottom: 3px; }
.req-desc { font-size: 12px; color: var(--muted); margin-bottom: 8px; line-height: 1.4; }
.req-footer { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

/* responsive */
@media(max-width:900px) {
  .sidebar { width: 200px; }
  .main { margin-left: 200px; padding: 20px; }
  .g3,.g4 { grid-template-columns: repeat(2,1fr); }
  .g21 { grid-template-columns: 1fr; }
}
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const INIT_DATA = {
  clients: [
    { id:1, name:"Sandra González", company:"SG Brand", email:"••••••••••@gmail.com", phone:"+52 55 ···· ····", service:"Plan Crecimiento", fee:4000, start:"2025-02-01", contract:6, am:"Sofía R.", status:"active", priority:"high", nicho:"Marca personal" },
    { id:2, name:"Alfredo Pereira", company:"AP Consulting", email:"••••••••••@gmail.com", phone:"+52 55 ···· ····", service:"Plan Crecimiento", fee:4000, start:"2025-02-15", contract:6, am:"Carlos M.", status:"active", priority:"medium", nicho:"Consultoría B2B" },
    { id:3, name:"Alfredo Rodríguez", company:"AR Academy", email:"••••••••••@gmail.com", phone:"+52 55 ···· ····", service:"Plan Crecimiento", fee:4000, start:"2025-03-01", contract:6, am:"Sofía R.", status:"active", priority:"medium", nicho:"Infoproductos" },
  ],
  leads: [
    { id:1, name:"Fernanda López", company:"FL Ventures", nicho:"Finanzas personales", size:"micro", problem:"Sin consistencia en redes", service:"Plan Crecimiento", budget:5000, value:5500, prob:80, followup:"2025-03-10", origin:"Instagram DM", stage:"Propuesta enviada" },
    { id:2, name:"Javier Morales", company:"Morales Media", nicho:"Fotografía B2B", size:"pequeña", problem:"Sin diferenciador", service:"Plan Autoridad", budget:4000, value:4200, prob:60, followup:"2025-03-12", origin:"Referido", stage:"Discovery call" },
    { id:3, name:"Daniela Cruz", company:"Cruz Consulting", nicho:"RR.HH.", size:"mediana", problem:"Contenido sin estrategia", service:"Plan Escalado", budget:8000, value:7800, prob:45, followup:"2025-03-15", origin:"LinkedIn", stage:"Lead calificado" },
    { id:4, name:"Tomás Vargas", company:"Vargas Tech", nicho:"SaaS B2B", size:"mediana", problem:"Embudo roto", service:"Plan Crecimiento", budget:5500, value:5500, prob:90, followup:"2025-03-08", origin:"Instagram Reel", stage:"Negociación" },
    { id:5, name:"Camila Ríos", company:"Ríos Brand", nicho:"Marca personal", size:"micro", problem:"Sin posicionamiento", service:"Plan Autoridad", budget:3500, value:4200, prob:30, followup:"2025-03-20", origin:"Google Ads", stage:"Lead nuevo" },
    { id:6, name:"Héctor Jiménez", company:"HJ Escuela", nicho:"Educación online", size:"pequeña", problem:"Bajo engagement", service:"Plan Crecimiento", budget:5000, value:5500, prob:70, followup:"2025-03-11", origin:"Instagram DM", stage:"Contactado" },
  ],
  tasks: [
    { id:1, task:"Guión Reel — semana 2 Sandra", project:"Contenido SG", client:"Sandra González", owner:"Sofía R.", priority:"high", sprint:"S10", deadline:"2025-03-07", status:"en progreso" },
    { id:2, task:"Carrusel diferenciador de marca Sandra", project:"Contenido SG", client:"Sandra González", owner:"Sofía R.", priority:"high", sprint:"S10", deadline:"2025-03-07", status:"revisión" },
    { id:3, task:"Audit perfil Instagram Alfredo P.", project:"Estrategia AP", client:"Alfredo Pereira", owner:"Carlos M.", priority:"medium", sprint:"S10", deadline:"2025-03-10", status:"por hacer" },
    { id:4, task:"Diseñar lead magnet PDF Alfredo P.", project:"Embudo AP", client:"Alfredo Pereira", owner:"Sofía R.", priority:"high", sprint:"S10", deadline:"2025-03-12", status:"backlog" },
    { id:5, task:"Análisis de competencia Alfredo R.", project:"Estrategia AR", client:"Alfredo Rodríguez", owner:"Carlos M.", priority:"high", sprint:"S10", deadline:"2025-03-09", status:"vencida" },
    { id:6, task:"Copy bio optimizada Sandra", project:"Marca SG", client:"Sandra González", owner:"Sofía R.", priority:"medium", sprint:"S10", deadline:"2025-03-14", status:"por hacer" },
    { id:7, task:"Métricas febrero Alfredo R.", project:"Métricas AR", client:"Alfredo Rodríguez", owner:"Carlos M.", priority:"low", sprint:"S10", deadline:"2025-03-08", status:"terminado" },
    { id:8, task:"Reunión de seguimiento Alfredo P.", project:"Estrategia AP", client:"Alfredo Pereira", owner:"Carlos M.", priority:"medium", sprint:"S10", deadline:"2025-03-11", status:"por hacer" },
  ],
  requests: [
    { id:1, client:"Sandra González", title:"Cambio de paleta visual en plantillas", desc:"La cliente solicita ajustar los colores de fondo en las plantillas de Stories para que coincidan con su nueva foto de perfil.", priority:"medium", status:"en proceso", owner:"Sofía R.", deadline:"2025-03-10" },
    { id:2, client:"Alfredo Rodríguez", title:"Urgente: reel publicado tiene error de texto", desc:"El Reel del martes tiene un error tipográfico en el texto de pantalla. Solicita corrección y re-publicación.", priority:"high", status:"recibido", owner:"Sofía R.", deadline:"2025-03-07" },
    { id:3, client:"Alfredo Pereira", title:"Agregar enlace de Calendly en Stories", desc:"Quiere configurar el sticker de link en sus Stories de esta semana apuntando a su agenda.", priority:"low", status:"entregado", owner:"Carlos M.", deadline:"2025-03-06" },
    { id:4, client:"Sandra González", title:"Reporte de febrero aún no recibido", desc:"La cliente no recibió el reporte mensual de febrero. Revisar si fue enviado y reenviar.", priority:"medium", status:"cerrado", owner:"Carlos M.", deadline:"2025-03-05" },
  ],
  metrics: [
    { id:1, client:"Sandra González", period:"Feb 2025", traffic:4820, leads:42, cpl:131, convRate:4.7, posts:18, views:28400, engagement:4.7, growth:287, sales:2, roi:180 },
    { id:2, client:"Alfredo Pereira", period:"Feb 2025", traffic:3100, leads:28, cpl:110, convRate:3.9, posts:15, views:19800, engagement:3.2, growth:198, sales:1, roi:120 },
    { id:3, client:"Alfredo Rodríguez", period:"Feb 2025", traffic:6200, leads:61, cpl:101, convRate:5.1, posts:22, views:41000, engagement:5.8, growth:420, sales:4, roi:310 },
  ],
  onboarding: {
    1: { admin:[true,true,false], access:[true,false,false,false], strategy:[true,true,false] },
    2: { admin:[true,true,true], access:[true,true,true,true], strategy:[true,true,true] },
    3: { admin:[true,false,false], access:[false,false,false,false], strategy:[false,false,false] },
  },
  reports: [
    { id:1, client:"Sandra González", period:"Febrero 2025", summary:"Mes de lanzamiento exitoso. Engagement superior al benchmark.", metrics:"Alcance +18%, Engagement 4.7%", results:"2 clientes cerrados desde IG", learnings:"Reels educativos generan 3x más guardados", next:"Iniciar fase de embudo y lead magnet" },
    { id:2, client:"Alfredo Pereira", period:"Febrero 2025", summary:"Crecimiento moderado con buena retención de audiencia.", metrics:"Seguidores +198, Alcance +12%", results:"1 cliente cerrado, 3 llamadas agendadas", learnings:"Carruseles superan reels en esta audiencia", next:"Probar formato de video largo en Story" },
    { id:3, client:"Alfredo Rodríguez", period:"Febrero 2025", summary:"Mejor mes desde el inicio del servicio. Viral en nicho.", metrics:"Views +41K, Engagement 5.8%", results:"4 ventas directas atribuidas a IG", learnings:"Contenido de prueba social genera conversiones directas", next:"Escalar inversión en ads con creativo orgánico" },
  ],
  docs: [
    { id:1, client:"Sandra González", name:"Estrategia de Marca + ICP", type:"PDF", date:"Feb 24", category:"estrategia" },
    { id:2, client:"Sandra González", name:"Guión Reel #1", type:"Doc", date:"Feb 28", category:"guión" },
    { id:3, client:"Sandra González", name:"Guía Visual Instagram", type:"PDF", date:"Mar 3", category:"marca" },
    { id:4, client:"Alfredo Pereira", name:"Estrategia de Contenido Q1", type:"PDF", date:"Feb 5", category:"estrategia" },
    { id:5, client:"Alfredo Rodríguez", name:"Auditoría Instagram Inicial", type:"PDF", date:"Mar 2", category:"auditoría" },
    { id:6, client:"Alfredo Rodríguez", name:"Brand Guidelines", type:"PDF", date:"Mar 5", category:"marca" },
  ],
  kb: [
    { id:1, title:"SOP — Onboarding de Nuevo Cliente", desc:"Proceso paso a paso para incorporar clientes: contratos, accesos, formulario estratégico y primera sesión.", icon:"📋", category:"proceso" },
    { id:2, title:"Framework de Contenido UrusBek", desc:"El sistema de 3 pilares para construir presencia consistente en Instagram B2B.", icon:"🗺️", category:"framework" },
    { id:3, title:"Script de Venta — Discovery Call", desc:"Guión completo para la llamada de diagnóstico. Incluye objeciones comunes y cierres.", icon:"📞", category:"ventas" },
    { id:4, title:"Plantilla de Reporte Mensual", desc:"Estructura estándar para los reportes de cliente. Variables y formato aprobado.", icon:"📊", category:"plantilla" },
    { id:5, title:"Checklist de Publicación IG", desc:"Verificación de calidad antes de publicar: copy, hashtags, CTA, horario óptimo.", icon:"✅", category:"proceso" },
    { id:6, title:"Guía de Hooks para Reels B2B", desc:"Lista de 30 hooks comprobados para abrir Reels dirigidos a audiencias B2B.", icon:"🎣", category:"contenido" },
  ],
};

const PIPELINE_STAGES = ["Lead nuevo","Lead calificado","Contactado","Discovery call","Propuesta enviada","Negociación","Ganado","Perdido"];
const TASK_STATUSES = ["backlog","por hacer","en progreso","revisión","terminado","vencida"];
const PRIORITY_COLORS = { high:"b-red", medium:"b-orange", low:"b-grey" };
const TASK_STATUS_COLORS = { backlog:"b-grey", "por hacer":"b-blue", "en progreso":"b-purple", revisión:"b-orange", terminado:"b-green", vencida:"b-red" };
const REQUEST_STATUS_COLORS = { recibido:"b-blue", "en proceso":"b-orange", entregado:"b-green", cerrado:"b-grey" };

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function initials(name) { return name.split(" ").slice(0,2).map(n=>n[0]).join(""); }
function fmt(n) { return n >= 1000 ? "$"+(n/1000).toFixed(1)+"K" : "$"+n; }
function Badge({ cls, children }) { return <span className={`badge ${cls}`}>{children}</span>; }
function Divider() { return <div className="divider" />; }
function SH({ title, action, onAction }) {
  return <div className="sh"><div className="sh-title">{title}</div>{action && <div className="sh-action" onClick={onAction}>{action}</div>}</div>;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("agency"); // agency | client
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState(INIT_DATA);
  const [modal, setModal] = useState(null);
  const [selectedClient, setSelectedClient] = useState(1);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const agencyNav = [
    { section:"Principal", items:[
      { id:"dashboard", icon:"⬡", label:"Dashboard" },
      { id:"pipeline", icon:"▽", label:"Pipeline CRM", badge: data.leads.filter(l=>l.stage!=="Ganado"&&l.stage!=="Perdido").length },
      { id:"clients", icon:"◈", label:"Clientes", badge: data.clients.length },
    ]},
    { section:"Operaciones", items:[
      { id:"onboarding", icon:"🚀", label:"Onboarding" },
      { id:"projects", icon:"◇", label:"Proyectos" },
      { id:"tasks", icon:"✦", label:"Tareas", badge: data.tasks.filter(t=>t.status==="vencida").length, badgeCls:"red" },
      { id:"requests", icon:"◌", label:"Requests", badge: data.requests.filter(r=>r.status==="recibido").length, badgeCls:"orange" },
    ]},
    { section:"Resultados", items:[
      { id:"metrics", icon:"◉", label:"Métricas" },
      { id:"reports", icon:"▢", label:"Reportes" },
      { id:"docs", icon:"📁", label:"Documentos" },
      { id:"kb", icon:"📚", label:"Base de Conocimiento" },
    ]},
  ];

  const clientNav = [
    { section:"Mi Servicio", items:[
      { id:"cl-dashboard", icon:"⬡", label:"Resumen" },
      { id:"cl-tasks", icon:"✦", label:"Tareas & Avances" },
      { id:"cl-content", icon:"◈", label:"Contenido" },
    ]},
    { section:"Estrategia", items:[
      { id:"cl-brand", icon:"◇", label:"Marca & Diferenciador" },
      { id:"cl-funnel", icon:"▽", label:"Embudo" },
      { id:"cl-metrics", icon:"◉", label:"Métricas Instagram" },
    ]},
    { section:"Recursos", items:[
      { id:"cl-revenue", icon:"💰", label:"Ingresos" },
      { id:"cl-docs", icon:"📁", label:"Documentos" },
      { id:"cl-requests", icon:"◌", label:"Solicitudes" },
    ]},
  ];

  const activeNav = view === "agency" ? agencyNav : clientNav;
  const client = data.clients.find(c=>c.id===selectedClient) || data.clients[0];

  return (
    <div className="app">
      <div className="noise" />
      <style>{`
        .pipeline-board::-webkit-scrollbar{height:4px;}
      `}</style>

      {/* SIDEBAR */}
      <nav className="sidebar">
        <div className="logo-area">
          <div className="logo">Urus<span>Bek</span></div>
          <div className="logo-sub">CRM Agencia</div>
        </div>

        <div className="view-toggle">
          <button className={`vt-btn ${view==="agency"?"active":""}`} onClick={()=>{setView("agency");setPage("dashboard");}}>Agencia</button>
          <button className={`vt-btn ${view==="client"?"active":""}`} onClick={()=>{setView("client");setPage("cl-dashboard");}}>Cliente</button>
        </div>

        {activeNav.map(group => (
          <div key={group.section}>
            <div className="nav-section">{group.section}</div>
            {group.items.map(item => (
              <div key={item.id} className={`nav-item ${page===item.id?"active":""}`} onClick={()=>setPage(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.badge > 0 && <span className={`nav-badge ${item.badgeCls||""}`}>{item.badge}</span>}
              </div>
            ))}
          </div>
        ))}

        <div className="sidebar-bottom">
          {view==="agency" ? (
            <div className="user-pill">
              <div className="user-avatar">UB</div>
              <div>
                <div className="user-name">UrusBek</div>
                <div className="user-role">Admin · Agencia</div>
              </div>
            </div>
          ) : (
            <div className="user-pill">
              <div className="user-avatar">{initials(client.name)}</div>
              <div>
                <div className="user-name">{client.name}</div>
                <div className="user-role">{client.service}</div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* MAIN */}
      <main className="main">
        {view==="agency" && page==="dashboard"   && <PageDashboard data={data} setPage={setPage} />}
        {view==="agency" && page==="pipeline"    && <PagePipeline data={data} setData={setData} modal={modal} setModal={setModal} />}
        {view==="agency" && page==="clients"     && <PageClients data={data} setData={setData} setSelectedClient={setSelectedClient} setView={setView} setPage={setPage} />}
        {view==="agency" && page==="onboarding"  && <PageOnboarding data={data} setData={setData} />}
        {view==="agency" && page==="projects"    && <PageProjects data={data} />}
        {view==="agency" && page==="tasks"       && <PageTasks data={data} setData={setData} />}
        {view==="agency" && page==="requests"    && <PageRequests data={data} setData={setData} />}
        {view==="agency" && page==="metrics"     && <PageMetrics data={data} />}
        {view==="agency" && page==="reports"     && <PageReports data={data} />}
        {view==="agency" && page==="docs"        && <PageDocs data={data} />}
        {view==="agency" && page==="kb"          && <PageKB data={data} />}

        {view==="client" && <ClientView page={page} client={client} data={data} />}
      </main>
    </div>
  );
}

// ─── PAGE: DASHBOARD ──────────────────────────────────────────────────────────
function PageDashboard({ data, setPage }) {
  const mrr = data.clients.reduce((s,c)=>s+c.fee,0);
  const activeClients = data.clients.filter(c=>c.status==="active").length;
  const riskClients = data.clients.filter(c=>c.status==="risk").length;
  const openLeads = data.leads.filter(l=>l.stage!=="Ganado"&&l.stage!=="Perdido");
  const projRevenue = openLeads.reduce((s,l)=>s+(l.value*(l.prob/100)),0);
  const overdueT = data.tasks.filter(t=>t.status==="vencida").length;
  const activeT = data.tasks.filter(t=>t.status==="en progreso").length;
  const months = ["Oct","Nov","Dic","Ene","Feb","Mar"];
  const revenues = [6000,7000,8000,9000,10000,12000];
  const maxR = Math.max(...revenues);

  return (
    <>
      <div className="topbar">
        <div>
          <div className="page-title">Dashboard Central</div>
          <div className="page-sub">Centro de control · UrusBek Agency</div>
        </div>
        <div className="topbar-actions">
          <div className="btn btn-ghost btn-sm">📅 Semana 10 · Mar 2025</div>
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--green)",background:"var(--gdim)",border:"1px solid rgba(16,217,160,0.2)",padding:"6px 12px",borderRadius:20}}>
            <span className="sdot green" />&nbsp;Operaciones activas
          </div>
        </div>
      </div>

      {/* VENTAS */}
      <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--dim)",marginBottom:8,fontWeight:600}}>VENTAS</div>
      <div className="g4" style={{marginBottom:20}}>
        <div className="kpi">
          <div className="kpi-icon">🎯</div>
          <div className="kpi-label">Leads Activos</div>
          <div className="kpi-val">{openLeads.length}</div>
          <div className="kpi-delta up">↑ 2 nuevos esta semana</div>
          <div className="kpi-bar"><div className="kpi-bar-fill" style={{width:"60%"}} /></div>
        </div>
        <div className="kpi">
          <div className="kpi-icon">💼</div>
          <div className="kpi-label">En Negociación</div>
          <div className="kpi-val">{data.leads.filter(l=>l.stage==="Negociación").length}</div>
          <div className="kpi-delta neutral">→ Mismo que semana anterior</div>
          <div className="kpi-bar"><div className="kpi-bar-fill" style={{width:"30%"}} /></div>
        </div>
        <div className="kpi">
          <div className="kpi-icon">📈</div>
          <div className="kpi-label">Revenue Proyectado</div>
          <div className="kpi-val" style={{fontSize:20}}>{fmt(Math.round(projRevenue))}</div>
          <div className="kpi-delta up">↑ Pipeline ponderado</div>
          <div className="kpi-bar"><div className="kpi-bar-fill" style={{width:"55%"}} /></div>
        </div>
        <div className="kpi">
          <div className="kpi-icon">💰</div>
          <div className="kpi-label">MRR</div>
          <div className="kpi-val" style={{fontSize:20}}>{fmt(mrr)}</div>
          <div className="kpi-delta up">↑ +$2K vs feb</div>
          <div className="kpi-bar"><div className="kpi-bar-fill" style={{width:"74%"}} /></div>
        </div>
      </div>

      <div className="g21">
        <div>
          {/* CLIENTES */}
          <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--dim)",marginBottom:8,fontWeight:600}}>CLIENTES</div>
          <div className="g3" style={{marginBottom:16}}>
            <div className="kpi">
              <div className="kpi-icon">👥</div>
              <div className="kpi-label">Clientes Activos</div>
              <div className="kpi-val">{activeClients}</div>
              <div className="kpi-delta up">↑ +1 este mes</div>
            </div>
            <div className="kpi">
              <div className="kpi-icon">💳</div>
              <div className="kpi-label">MRR Total</div>
              <div className="kpi-val" style={{fontSize:20}}>{fmt(mrr)}</div>
              <div className="kpi-delta up">↑ +$3.2K</div>
            </div>
            <div className="kpi" style={{border:"1px solid rgba(244,63,94,0.2)",background:"var(--rdim)"}}>
              <div className="kpi-icon">⚠️</div>
              <div className="kpi-label">En Riesgo</div>
              <div className="kpi-val" style={{color:"var(--red)"}}>{riskClients}</div>
              <div className="kpi-delta down">↓ Requiere atención</div>
            </div>
          </div>

          {/* OPERACIONES */}
          <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--dim)",marginBottom:8,fontWeight:600}}>OPERACIONES</div>
          <div className="g3" style={{marginBottom:16}}>
            <div className="kpi" style={{border:overdueT?"1px solid rgba(244,63,94,0.2)":undefined}}>
              <div className="kpi-icon">⏰</div>
              <div className="kpi-label">Tareas Vencidas</div>
              <div className="kpi-val" style={{color:overdueT?"var(--red)":undefined}}>{overdueT}</div>
              <div className="kpi-delta down">↓ Urgente</div>
            </div>
            <div className="kpi">
              <div className="kpi-icon">⚡</div>
              <div className="kpi-label">En Progreso</div>
              <div className="kpi-val">{activeT}</div>
              <div className="kpi-delta neutral">→ Sprint 10</div>
            </div>
            <div className="kpi">
              <div className="kpi-icon">📬</div>
              <div className="kpi-label">Requests Abiertos</div>
              <div className="kpi-val">{data.requests.filter(r=>r.status!=="cerrado").length}</div>
              <div className="kpi-delta neutral">→ 1 urgente</div>
            </div>
          </div>

          {/* PERFORMANCE */}
          <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--dim)",marginBottom:8,fontWeight:600}}>PERFORMANCE</div>
          <div className="card">
            <SH title="Ingresos — Últimos 6 Meses" />
            <div className="bar-chart">
              {revenues.map((v,i) => (
                <div className="bar-item" key={i}>
                  <div className="bar-val" style={{fontSize:9,color:i===5?"var(--accent)":"var(--dim)"}}>${(v/1000).toFixed(0)}K</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{height:`${(v/maxR)*100}%`, background: i===5?"linear-gradient(180deg,var(--pm),var(--pl))":"linear-gradient(180deg,var(--purple),var(--pm))", opacity: 0.5+(i*0.08), boxShadow: i===5?"0 0 12px rgba(124,58,237,0.4)":undefined}} />
                  </div>
                  <div className="bar-label" style={{color:i===5?"var(--accent)":undefined}}>{months[i]}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:10,paddingTop:10,borderTop:"1px solid var(--border2)"}}>
              <span style={{fontSize:11,color:"var(--muted)"}}>Crecimiento trimestral</span>
              <span style={{fontSize:13,fontWeight:700,color:"var(--green)"}}>+33.3%</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* RISK CLIENTS */}
          <div className="card mb16">
            <SH title="⚠️ Clientes en Riesgo" />
            {data.clients.filter(c=>c.status==="risk").map(c=>(
              <div className="risk-card" key={c.id}>
                <div className="user-avatar" style={{width:30,height:30,fontSize:11}}>{initials(c.name)}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600}}>{c.name}</div>
                  <div style={{fontSize:11,color:"var(--muted)"}}>Sin respuesta · 5 días</div>
                </div>
                <Badge cls="b-red">Riesgo</Badge>
              </div>
            ))}
            {data.clients.filter(c=>c.status==="risk").length === 0 && (
              <div style={{fontSize:13,color:"var(--muted)",textAlign:"center",padding:"8px 0"}}>Sin clientes en riesgo</div>
            )}
          </div>

          {/* RECENT ACTIVITY */}
          <div className="card mb16">
            <SH title="Actividad Reciente" />
            {[
              {icon:"📝",text:"Guión Reel semana 2 — Marcos enviado",time:"Hoy 10:42am"},
              {icon:"✅",text:"Tarea métricas Feb AF Digital completada",time:"Ayer 4:15pm"},
              {icon:"🚀",text:"Ricardo Soto incorporado al servicio",time:"Mar 1, 9:00am"},
              {icon:"💼",text:"Tomás Vargas avanzó a Negociación",time:"Mar 5, 2:30pm"},
              {icon:"📊",text:"Reporte Feb 2025 — Marcos enviado",time:"Feb 28, 11am"},
            ].map((a,i)=>(
              <div className="activity-row" key={i}>
                <div className="a-icon">{a.icon}</div>
                <div>
                  <div className="a-text">{a.text}</div>
                  <div className="a-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* NEXT TASKS */}
          <div className="card">
            <SH title="Tareas Urgentes" />
            {data.tasks.filter(t=>t.status==="vencida"||t.priority==="high").slice(0,4).map(t=>(
              <div className="task-row" key={t.id}>
                <div className={`task-check ${t.status==="terminado"?"done":""}`}>{t.status==="terminado"?"✓":""}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:500}}>{t.task}</div>
                  <div style={{fontSize:10,color:"var(--muted)"}}>{t.client} · {t.deadline}</div>
                </div>
                <Badge cls={t.status==="vencida"?"b-red":"b-orange"}>{t.status==="vencida"?"Vencida":"Alta"}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── PAGE: PIPELINE ───────────────────────────────────────────────────────────
function PagePipeline({ data, setData }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({name:"",company:"",nicho:"",size:"micro",problem:"",service:"Plan Crecimiento",budget:0,value:0,prob:50,followup:"",origin:"Instagram DM",stage:"Lead nuevo"});

  const byStage = (stage) => data.leads.filter(l=>l.stage===stage);
  const stageColors = {"Lead nuevo":"var(--blue)","Lead calificado":"var(--accent)","Contactado":"var(--pl)","Discovery call":"var(--orange)","Propuesta enviada":"var(--orange)","Negociación":"var(--green)","Ganado":"var(--green)","Perdido":"var(--red)"};

  const addLead = () => {
    setData(d=>({...d, leads:[...d.leads, {...form, id:Date.now()}]}));
    setShowModal(false);
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="page-title">Pipeline CRM</div>
          <div className="page-sub">Gestión de prospectos y oportunidades de venta</div>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ Nuevo Lead</button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="g4" style={{marginBottom:20}}>
        {[
          {label:"Leads Totales",val:data.leads.length,icon:"🎯"},
          {label:"Revenue Proyectado",val:fmt(Math.round(data.leads.reduce((s,l)=>s+(l.value*(l.prob/100)),0))),icon:"💰"},
          {label:"Cerrados este mes",val:data.leads.filter(l=>l.stage==="Ganado").length,icon:"🏆"},
          {label:"Tasa de Cierre",val:`${Math.round((data.leads.filter(l=>l.stage==="Ganado").length/data.leads.length)*100)}%`,icon:"📊"},
        ].map((k,i)=>(
          <div className="kpi" key={i}>
            <div className="kpi-icon">{k.icon}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-val" style={{fontSize:22}}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* BOARD */}
      <div className="pipeline-board">
        {PIPELINE_STAGES.map(stage=>(
          <div className="pipeline-col" key={stage}>
            <div className="pipeline-col-header">
              <div className="pipeline-col-title" style={{color:stageColors[stage]||"var(--text)"}}>{stage}</div>
              <div className="pipeline-col-count">{byStage(stage).length} leads · {fmt(byStage(stage).reduce((s,l)=>s+l.value,0))}</div>
            </div>
            {byStage(stage).map(lead=>(
              <div className="deal-card" key={lead.id}>
                <div className="deal-name">{lead.name}</div>
                <div className="deal-company">{lead.company} · {lead.nicho}</div>
                <div className="deal-value">{fmt(lead.value)}</div>
                <div className="deal-prob">{lead.prob}% prob · {lead.followup}</div>
                <div style={{marginTop:6,display:"flex",gap:4,flexWrap:"wrap"}}>
                  <Badge cls="b-grey">{lead.origin}</Badge>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-close" onClick={()=>setShowModal(false)}>✕</div>
            <div className="modal-title">Nuevo Lead</div>
            <div className="form-grid2">
              <div className="form-row"><label className="form-label">Nombre</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
              <div className="form-row"><label className="form-label">Empresa</label><input className="form-input" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} /></div>
              <div className="form-row"><label className="form-label">Nicho</label><input className="form-input" value={form.nicho} onChange={e=>setForm({...form,nicho:e.target.value})} /></div>
              <div className="form-row"><label className="form-label">Origen</label>
                <select className="form-input" value={form.origin} onChange={e=>setForm({...form,origin:e.target.value})}>
                  {["Instagram DM","Instagram Reel","Referido","LinkedIn","Google Ads"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-row"><label className="form-label">Servicio</label>
                <select className="form-input" value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>
                  {["Plan Crecimiento","Plan Autoridad","Plan Escalado"].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-row"><label className="form-label">Valor del Deal</label><input className="form-input" type="number" value={form.value} onChange={e=>setForm({...form,value:+e.target.value})} /></div>
              <div className="form-row"><label className="form-label">Probabilidad %</label><input className="form-input" type="number" min={0} max={100} value={form.prob} onChange={e=>setForm({...form,prob:+e.target.value})} /></div>
              <div className="form-row"><label className="form-label">Seguimiento</label><input className="form-input" type="date" value={form.followup} onChange={e=>setForm({...form,followup:e.target.value})} /></div>
            </div>
            <div className="form-row"><label className="form-label">Problema Principal</label><input className="form-input" value={form.problem} onChange={e=>setForm({...form,problem:e.target.value})} /></div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:18}}>
              <button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={addLead}>Agregar Lead</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── PAGE: CLIENTS ────────────────────────────────────────────────────────────
function PageClients({ data, setData, setSelectedClient, setView, setPage }) {
  const mrr = data.clients.reduce((s,c)=>s+c.fee,0);
  const statusColor = {active:"b-green",risk:"b-red",churned:"b-grey"};
  const statusLabel = {active:"Activo",risk:"En Riesgo",churned:"Perdido"};

  return (
    <>
      <div className="topbar">
        <div><div className="page-title">Clientes</div><div className="page-sub">Base de datos central de clientes activos</div></div>
        <div className="topbar-actions">
          <div className="btn btn-ghost btn-sm">MRR Total: <strong style={{color:"var(--green)",marginLeft:4}}>{fmt(mrr)}</strong></div>
        </div>
      </div>

      <div className="g4" style={{marginBottom:20}}>
        {[
          {label:"Clientes Activos",val:data.clients.filter(c=>c.status==="active").length,icon:"✅"},
          {label:"MRR",val:fmt(mrr),icon:"💰"},
          {label:"Ticket Promedio",val:fmt(Math.round(mrr/data.clients.length)),icon:"📊"},
          {label:"En Riesgo",val:data.clients.filter(c=>c.status==="risk").length,icon:"⚠️"},
        ].map((k,i)=>(
          <div className="kpi" key={i}>
            <div className="kpi-icon">{k.icon}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-val" style={{fontSize:22}}>{k.val}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <SH title="Todos los Clientes" />
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th><th>Servicio</th><th>Fee</th><th>Inicio</th><th>AM</th><th>Estado</th><th>Portal</th>
            </tr>
          </thead>
          <tbody>
            {data.clients.map(c=>(
              <tr key={c.id}>
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div className="user-avatar" style={{width:30,height:30,fontSize:11}}>{initials(c.name)}</div>
                    <div>
                      <div style={{fontWeight:500,fontSize:13}}>{c.name}</div>
                      <div style={{fontSize:11,color:"var(--muted)"}}>{c.company} · {c.nicho}</div>
                    </div>
                  </div>
                </td>
                <td><Badge cls="b-purple">{c.service}</Badge></td>
                <td><span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"var(--green)"}}>{fmt(c.fee)}</span><span style={{fontSize:10,color:"var(--muted)"}}>/mes</span></td>
                <td style={{fontSize:12,color:"var(--muted)"}}>{c.start}</td>
                <td style={{fontSize:12}}>{c.am}</td>
                <td><Badge cls={statusColor[c.status]}>{statusLabel[c.status]}</Badge></td>
                <td>
                  <button className="btn btn-ghost btn-sm" onClick={()=>{setSelectedClient(c.id);setView("client");setPage("cl-dashboard");}}>
                    Ver Portal →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── PAGE: ONBOARDING ─────────────────────────────────────────────────────────
function PageOnboarding({ data, setData }) {
  const [sel, setSel] = useState(data.clients[0].id);
  const ob = data.onboarding[sel] || {admin:[false,false,false],access:[false,false,false,false],strategy:[false,false,false]};

  const toggle = (group, idx) => {
    setData(d=>({...d, onboarding:{...d.onboarding, [sel]:{...ob, [group]:ob[group].map((v,i)=>i===idx?!v:v)}}}));
  };

  const total = [...ob.admin,...ob.access,...ob.strategy];
  const done = total.filter(Boolean).length;
  const pct = Math.round((done/total.length)*100);

  const adminItems = ["Contrato firmado","Factura enviada","Pago recibido"];
  const accessItems = ["Redes sociales","Cuentas publicitarias","Analytics","Google Drive"];
  const strategyItems = ["Formulario estratégico completado","Análisis de competencia","Auditoría inicial"];

  return (
    <>
      <div className="topbar">
        <div><div className="page-title">Onboarding</div><div className="page-sub">Sistema de incorporación de nuevos clientes</div></div>
      </div>

      <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
        {data.clients.map(c=>(
          <button key={c.id} className={`btn ${sel===c.id?"btn-primary":"btn-ghost"}`} onClick={()=>setSel(c.id)}>
            {initials(c.name)} {c.name.split(" ")[0]}
          </button>
        ))}
      </div>

      <div className="g21">
        <div>
          <div className="card mb16">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700}}>{data.clients.find(c=>c.id===sel)?.name}</div>
                <div style={{fontSize:12,color:"var(--muted)"}}>{data.clients.find(c=>c.id===sel)?.service}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:pct===100?"var(--green)":"var(--accent)"}}>{pct}%</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>{done}/{total.length} completados</div>
              </div>
            </div>
            <div className="progress-wrap"><div className="progress-fill" style={{width:`${pct}%`}} /></div>
          </div>

          <div className="card mb16">
            <div className="check-group">
              <div className="check-group-title">🏢 Administrativo</div>
              {adminItems.map((item,i)=>(
                <div className="check-item" key={i} onClick={()=>toggle("admin",i)}>
                  <div className={`ci-box ${ob.admin[i]?"done":""}`}>{ob.admin[i]?"✓":""}</div>
                  <div className={`ci-text ${ob.admin[i]?"done":""}`}>{item}</div>
                </div>
              ))}
            </div>
            <Divider />
            <div className="check-group">
              <div className="check-group-title">🔑 Accesos</div>
              {accessItems.map((item,i)=>(
                <div className="check-item" key={i} onClick={()=>toggle("access",i)}>
                  <div className={`ci-box ${ob.access[i]?"done":""}`}>{ob.access[i]?"✓":""}</div>
                  <div className={`ci-text ${ob.access[i]?"done":""}`}>{item}</div>
                </div>
              ))}
            </div>
            <Divider />
            <div className="check-group" style={{marginBottom:0}}>
              <div className="check-group-title">🎯 Estrategia</div>
              {strategyItems.map((item,i)=>(
                <div className="check-item" key={i} onClick={()=>toggle("strategy",i)}>
                  <div className={`ci-box ${ob.strategy[i]?"done":""}`}>{ob.strategy[i]?"✓":""}</div>
                  <div className={`ci-text ${ob.strategy[i]?"done":""}`}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <SH title="Estado de Onboardings" />
            {data.clients.map(c=>{
              const ob2 = data.onboarding[c.id]||{admin:[],access:[],strategy:[]};
              const all2 = [...(ob2.admin||[]),...(ob2.access||[]),...(ob2.strategy||[])];
              const d2 = all2.filter(Boolean).length;
              const p2 = all2.length ? Math.round((d2/all2.length)*100) : 0;
              return (
                <div key={c.id} style={{marginBottom:12,cursor:"pointer"}} onClick={()=>setSel(c.id)}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <div style={{fontSize:13,fontWeight:500}}>{c.name}</div>
                    <div style={{fontSize:12,color:p2===100?"var(--green)":"var(--muted)"}}>{p2}%</div>
                  </div>
                  <div className="progress-wrap"><div className="progress-fill" style={{width:`${p2}%`,background:p2===100?"var(--green)":undefined}} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── PAGE: PROJECTS ───────────────────────────────────────────────────────────
function PageProjects({ data }) {
  const projects = [
    {id:1,client:"Marcos Gutiérrez",name:"Estrategia de Contenido",type:"Contenido",owner:"Sofía R.",phase:"Producción",deadline:"2025-04-01",progress:65},
    {id:2,client:"Marcos Gutiérrez",name:"Embudo Instagram",type:"Embudo",owner:"Sofía R.",phase:"Estrategia",deadline:"2025-04-15",progress:30},
    {id:3,client:"Laura Benítez",name:"Posicionamiento de Marca",type:"Marca",owner:"Carlos M.",phase:"Implementación",deadline:"2025-03-30",progress:78},
    {id:4,client:"Ricardo Soto",name:"Estrategia de Contenido",type:"Contenido",owner:"Sofía R.",phase:"Investigación",deadline:"2025-03-20",progress:20},
    {id:5,client:"Ricardo Soto",name:"Embudo de Ventas",type:"Embudo",owner:"Carlos M.",phase:"Estrategia",deadline:"2025-04-10",progress:45},
    {id:6,client:"Ana Flores",name:"Optimización Instagram",type:"Contenido",owner:"Carlos M.",phase:"Optimización",deadline:"2025-03-25",progress:90},
  ];

  const phases = ["Investigación","Estrategia","Producción","Implementación","Optimización"];
  const phaseColors = {"Investigación":"b-blue","Estrategia":"b-purple","Producción":"b-orange","Implementación":"b-green","Optimización":"b-green"};

  return (
    <>
      <div className="topbar">
        <div><div className="page-title">Proyectos</div><div className="page-sub">Todos los proyectos activos por cliente</div></div>
        <div className="topbar-actions">
          <div className="btn btn-ghost btn-sm">{projects.length} proyectos activos</div>
        </div>
      </div>

      <div className="g4" style={{marginBottom:20}}>
        {phases.map(p=>(
          <div className="kpi" key={p}>
            <div className="kpi-label">{p}</div>
            <div className="kpi-val" style={{fontSize:24}}>{projects.filter(pr=>pr.phase===p).length}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <SH title="Proyectos Activos" />
        <table className="table">
          <thead><tr><th>Proyecto</th><th>Cliente</th><th>Tipo</th><th>Responsable</th><th>Fase</th><th>Progreso</th><th>Deadline</th></tr></thead>
          <tbody>
            {projects.map(p=>(
              <tr key={p.id}>
                <td style={{fontWeight:500}}>{p.name}</td>
                <td style={{fontSize:12,color:"var(--muted)"}}>{p.client}</td>
                <td><Badge cls="b-purple">{p.type}</Badge></td>
                <td style={{fontSize:12}}>{p.owner}</td>
                <td><Badge cls={phaseColors[p.phase]}>{p.phase}</Badge></td>
                <td style={{width:120}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div className="progress-wrap" style={{flex:1}}><div className="progress-fill" style={{width:`${p.progress}%`}} /></div>
                    <span style={{fontSize:11,color:"var(--muted)",width:28}}>{p.progress}%</span>
                  </div>
                </td>
                <td style={{fontSize:12,color:"var(--muted)"}}>{p.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── PAGE: TASKS ──────────────────────────────────────────────────────────────
function PageTasks({ data, setData }) {
  const [filter, setFilter] = useState("todas");

  const toggleTask = (id) => {
    setData(d=>({...d, tasks:d.tasks.map(t=>t.id===id?{...t,status:t.status==="terminado"?"por hacer":"terminado"}:t)}));
  };

  const filtered = filter==="todas" ? data.tasks : data.tasks.filter(t=>t.status===filter);

  return (
    <>
      <div className="topbar">
        <div><div className="page-title">Tareas</div><div className="page-sub">Todas las tareas de la agencia · Sprint 10</div></div>
        <div className="topbar-actions">
          <Badge cls="b-red">{data.tasks.filter(t=>t.status==="vencida").length} vencidas</Badge>
          <Badge cls="b-orange">{data.tasks.filter(t=>t.status==="en progreso").length} en progreso</Badge>
        </div>
      </div>

      <div className="tabs">
        {["todas",...TASK_STATUSES].map(s=>(
          <div key={s} className={`tab ${filter===s?"active":""}`} onClick={()=>setFilter(s)}>{s.charAt(0).toUpperCase()+s.slice(1)}</div>
        ))}
      </div>

      <div className="card">
        <table className="table">
          <thead><tr><th>✓</th><th>Tarea</th><th>Cliente</th><th>Responsable</th><th>Prioridad</th><th>Estado</th><th>Deadline</th></tr></thead>
          <tbody>
            {filtered.map(t=>(
              <tr key={t.id}>
                <td style={{width:30}}>
                  <div className={`task-check ${t.status==="terminado"?"done":""}`} onClick={()=>toggleTask(t.id)} style={{cursor:"pointer"}}>{t.status==="terminado"?"✓":""}</div>
                </td>
                <td>
                  <div style={{fontSize:13,fontWeight:500,textDecoration:t.status==="terminado"?"line-through":undefined,color:t.status==="terminado"?"var(--dim)":undefined}}>{t.task}</div>
                  <div style={{fontSize:11,color:"var(--muted)"}}>{t.project}</div>
                </td>
                <td style={{fontSize:12,color:"var(--muted)"}}>{t.client}</td>
                <td style={{fontSize:12}}>{t.owner}</td>
                <td><Badge cls={PRIORITY_COLORS[t.priority]}>{t.priority}</Badge></td>
                <td><Badge cls={TASK_STATUS_COLORS[t.status]}>{t.status}</Badge></td>
                <td style={{fontSize:12,color:t.status==="vencida"?"var(--red)":"var(--muted)"}}>{t.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── PAGE: REQUESTS ───────────────────────────────────────────────────────────
function PageRequests({ data, setData }) {
  const updateStatus = (id, status) => {
    setData(d=>({...d, requests:d.requests.map(r=>r.id===id?{...r,status}:r)}));
  };

  const next = {recibido:"en proceso","en proceso":"entregado",entregado:"cerrado"};

  return (
    <>
      <div className="topbar">
        <div><div className="page-title">Requests del Cliente</div><div className="page-sub">Sistema centralizado de solicitudes — sin caos en mensajes</div></div>
        <div className="topbar-actions">
          <Badge cls="b-orange">{data.requests.filter(r=>r.status==="recibido").length} nuevos</Badge>
        </div>
      </div>

      <div className="g4" style={{marginBottom:20}}>
        {["recibido","en proceso","entregado","cerrado"].map(s=>(
          <div className="kpi" key={s}>
            <div className="kpi-label">{s.charAt(0).toUpperCase()+s.slice(1)}</div>
            <div className="kpi-val" style={{fontSize:24}}>{data.requests.filter(r=>r.status===s).length}</div>
          </div>
        ))}
      </div>

      <div className="g2">
        {["recibido","en proceso","entregado","cerrado"].slice(0,2).map(status=>(
          <div key={status}>
            <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--dim)",marginBottom:8,fontWeight:600}}>{status.toUpperCase()}</div>
            {data.requests.filter(r=>r.status===status).map(r=>(
              <div className="req-card" key={r.id}>
                <div className="req-title">{r.title}</div>
                <div className="req-desc">{r.desc}</div>
                <div className="req-footer">
                  <Badge cls={REQUEST_STATUS_COLORS[r.status]}>{r.status}</Badge>
                  <Badge cls={PRIORITY_COLORS[r.priority]}>{r.priority}</Badge>
                  <span style={{fontSize:11,color:"var(--muted)"}}>{r.client}</span>
                  <span style={{fontSize:11,color:"var(--muted)",marginLeft:"auto"}}>{r.deadline}</span>
                  {next[r.status] && (
                    <button className="btn btn-ghost btn-sm" onClick={()=>updateStatus(r.id,next[r.status])}>
                      → {next[r.status]}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="g2">
        {["entregado","cerrado"].map(status=>(
          <div key={status}>
            <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--dim)",marginBottom:8,fontWeight:600}}>{status.toUpperCase()}</div>
            {data.requests.filter(r=>r.status===status).map(r=>(
              <div className="req-card" key={r.id} style={{opacity:0.7}}>
                <div className="req-title">{r.title}</div>
                <div className="req-footer">
                  <Badge cls={REQUEST_STATUS_COLORS[r.status]}>{r.status}</Badge>
                  <span style={{fontSize:11,color:"var(--muted)"}}>{r.client}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

// ─── PAGE: METRICS ────────────────────────────────────────────────────────────
function PageMetrics({ data }) {
  const [sel, setSel] = useState(data.clients[0].name);
  const m = data.metrics.find(x=>x.client===sel) || data.metrics[0];

  return (
    <>
      <div className="topbar">
        <div><div className="page-title">Métricas & Resultados</div><div className="page-sub">Indicadores clave por cliente y periodo</div></div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {data.clients.map(c=>(
          <button key={c.id} className={`btn ${sel===c.name?"btn-primary":"btn-ghost"}`} onClick={()=>setSel(c.name)}>{c.name.split(" ")[0]}</button>
        ))}
      </div>

      <div style={{marginBottom:8,fontSize:12,color:"var(--muted)"}}>Periodo: {m.period} · Cliente: {m.client}</div>

      <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--dim)",marginBottom:8,fontWeight:600}}>MARKETING</div>
      <div className="g4" style={{marginBottom:20}}>
        {[
          {label:"Tráfico (visitas perfil)",val:m.traffic.toLocaleString(),icon:"📡"},
          {label:"Leads generados",val:m.leads,icon:"🎯"},
          {label:"CPL (costo por lead)",val:`$${m.cpl}`,icon:"💸"},
          {label:"Conversion Rate",val:`${m.convRate}%`,icon:"📈"},
        ].map((k,i)=><div className="kpi" key={i}><div className="kpi-icon">{k.icon}</div><div className="kpi-label">{k.label}</div><div className="kpi-val" style={{fontSize:22}}>{k.val}</div></div>)}
      </div>

      <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--dim)",marginBottom:8,fontWeight:600}}>CONTENIDO</div>
      <div className="g4" style={{marginBottom:20}}>
        {[
          {label:"Publicaciones",val:m.posts,icon:"📝"},
          {label:"Views totales",val:m.views.toLocaleString(),icon:"👁️"},
          {label:"Engagement Rate",val:`${m.engagement}%`,icon:"❤️"},
          {label:"Nuevos seguidores",val:`+${m.growth}`,icon:"👥"},
        ].map((k,i)=><div className="kpi" key={i}><div className="kpi-icon">{k.icon}</div><div className="kpi-label">{k.label}</div><div className="kpi-val" style={{fontSize:22}}>{k.val}</div></div>)}
      </div>

      <div style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--dim)",marginBottom:8,fontWeight:600}}>NEGOCIO</div>
      <div className="g4" style={{marginBottom:20}}>
        {[
          {label:"Ventas atribuidas",val:m.sales,icon:"🏆"},
          {label:"ROI estimado",val:`${m.roi}%`,icon:"📊"},
          {label:"Calls agendadas",val:Math.round(m.leads/5),icon:"📞"},
          {label:"Clics en bio",val:Math.round(m.traffic*0.05),icon:"🔗"},
        ].map((k,i)=><div className="kpi" key={i}><div className="kpi-icon">{k.icon}</div><div className="kpi-label">{k.label}</div><div className="kpi-val" style={{fontSize:22}}>{k.val}</div></div>)}
      </div>

      {/* COMPARISON TABLE */}
      <div className="card">
        <SH title="Comparativa entre Clientes — Feb 2025" />
        <table className="table">
          <thead><tr><th>Cliente</th><th>Views</th><th>Leads</th><th>Engagement</th><th>Nuevos segs.</th><th>Ventas</th><th>ROI</th></tr></thead>
          <tbody>
            {data.metrics.map(m2=>(
              <tr key={m2.id}>
                <td style={{fontWeight:500}}>{m2.client.split(" ")[0]}</td>
                <td>{m2.views.toLocaleString()}</td>
                <td>{m2.leads}</td>
                <td><span style={{color:m2.engagement>4?"var(--green)":"var(--orange)"}}>{m2.engagement}%</span></td>
                <td style={{color:"var(--green)"}}>+{m2.growth}</td>
                <td>{m2.sales}</td>
                <td><span style={{color:"var(--green)",fontWeight:700}}>{m2.roi}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── PAGE: REPORTS ────────────────────────────────────────────────────────────
function PageReports({ data }) {
  const [sel, setSel] = useState(null);

  if(sel) {
    const r = data.reports.find(x=>x.id===sel);
    return (
      <>
        <div className="topbar">
          <div><div className="page-title">{r.period}</div><div className="page-sub">Reporte mensual · {r.client}</div></div>
          <div className="topbar-actions">
            <button className="btn btn-ghost" onClick={()=>setSel(null)}>← Volver</button>
          </div>
        </div>
        {[
          {title:"📋 Resumen Ejecutivo",content:r.summary},
          {title:"📊 Métricas Clave",content:r.metrics},
          {title:"🏆 Resultados",content:r.results},
          {title:"💡 Aprendizajes",content:r.learnings},
          {title:"🚀 Próximos Pasos",content:r.next},
        ].map((s,i)=>(
          <div className="card mb16" key={i}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,marginBottom:10}}>{s.title}</div>
            <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.6}}>{s.content}</div>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      <div className="topbar">
        <div><div className="page-title">Reportes</div><div className="page-sub">Historial de reportes mensuales por cliente</div></div>
      </div>
      {data.reports.map(r=>(
        <div className="report-card" key={r.id} onClick={()=>setSel(r.id)}>
          <div className="report-icon">📊</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:14}}>{r.period} — {r.client}</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:3}}>{r.summary}</div>
          </div>
          <Badge cls="b-green">Ver reporte →</Badge>
        </div>
      ))}
    </>
  );
}

// ─── PAGE: DOCS ───────────────────────────────────────────────────────────────
function PageDocs({ data }) {
  const [filter, setFilter] = useState("Todos");
  const clients = ["Todos",...data.clients.map(c=>c.name)];
  const docIcon = {PDF:"📄",Doc:"📝",Figma:"🎨",Canva:"🖼️",Sheet:"📊"};
  const filtered = filter==="Todos" ? data.docs : data.docs.filter(d=>d.client===filter);

  return (
    <>
      <div className="topbar">
        <div><div className="page-title">Documentos</div><div className="page-sub">Centro de archivos y entregables por cliente</div></div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
        {clients.map(c=>(
          <button key={c} className={`btn ${filter===c?"btn-primary":"btn-ghost"} btn-sm`} onClick={()=>setFilter(c)}>{c.split(" ")[0]}</button>
        ))}
      </div>
      {filtered.map(d=>(
        <div className="doc-row" key={d.id}>
          <div className="doc-icon">{docIcon[d.type]||"📄"}</div>
          <div style={{flex:1}}>
            <div className="doc-name">{d.name}</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>{d.client} · {d.date}</div>
          </div>
          <Badge cls="b-grey">{d.type}</Badge>
          <Badge cls="b-purple">{d.category}</Badge>
          <button className="btn btn-ghost btn-sm">↓ Abrir</button>
        </div>
      ))}
    </>
  );
}

// ─── PAGE: KNOWLEDGE BASE ─────────────────────────────────────────────────────
function PageKB({ data }) {
  const cats = ["Todos","proceso","framework","ventas","plantilla","contenido"];
  const [filter, setFilter] = useState("Todos");
  const filtered = filter==="Todos" ? data.kb : data.kb.filter(k=>k.category===filter);

  return (
    <>
      <div className="topbar">
        <div><div className="page-title">Base de Conocimiento</div><div className="page-sub">SOPs, frameworks, scripts y plantillas de la agencia</div></div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm">+ Agregar</button>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
        {cats.map(c=>(
          <button key={c} className={`btn ${filter===c?"btn-primary":"btn-ghost"} btn-sm`} onClick={()=>setFilter(c)}>{c.charAt(0).toUpperCase()+c.slice(1)}</button>
        ))}
      </div>
      <div className="g2">
        {filtered.map(k=>(
          <div className="kb-card" key={k.id}>
            <div className="kb-icon">{k.icon}</div>
            <div className="kb-title">{k.title}</div>
            <div className="kb-desc">{k.desc}</div>
            <div style={{marginTop:10,display:"flex",gap:6,alignItems:"center"}}>
              <Badge cls="b-purple">{k.category}</Badge>
              <span style={{fontSize:12,color:"var(--pl)",marginLeft:"auto",cursor:"pointer"}}>Ver →</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── CLIENT VIEW ──────────────────────────────────────────────────────────────
function ClientView({ page, client, data }) {
  const m = data.metrics.find(x=>x.client===client.name) || data.metrics[0];
  const ob = data.onboarding[client.id] || {admin:[],access:[],strategy:[]};
  const all = [...(ob.admin||[]),...(ob.access||[]),...(ob.strategy||[])];
  const progress = all.length ? Math.round((all.filter(Boolean).length/all.length)*100) : 0;
  const clientTasks = data.tasks.filter(t=>t.client===client.name);
  const clientDocs = data.docs.filter(d=>d.client===client.name);
  const clientRequests = data.requests.filter(r=>r.client===client.name);

  if(page==="cl-dashboard") return <ClientDashboard client={client} m={m} progress={progress} clientTasks={clientTasks} />;
  if(page==="cl-tasks") return <ClientTasks client={client} tasks={clientTasks} />;
  if(page==="cl-content") return <ClientContent client={client} />;
  if(page==="cl-brand") return <ClientBrand client={client} />;
  if(page==="cl-funnel") return <ClientFunnel client={client} m={m} />;
  if(page==="cl-metrics") return <ClientMetrics client={client} m={m} />;
  if(page==="cl-revenue") return <ClientRevenue client={client} />;
  if(page==="cl-docs") return <ClientDocs client={client} docs={clientDocs} />;
  if(page==="cl-requests") return <ClientRequests client={client} requests={clientRequests} />;
  return null;
}

function ClientDashboard({ client, m, progress, clientTasks }) {
  const phases = [{s:"done",n:"Diagnóstico"},{s:"done",n:"Estrategia"},{s:"active",n:"Contenido"},{s:"pending",n:"Embudo"},{s:"pending",n:"Escalado"}];
  const done = clientTasks.filter(t=>t.status==="terminado").length;

  return (
    <>
      <div className="topbar">
        <div><div className="page-title">Bienvenido, {client.name.split(" ")[0]} 👋</div><div className="page-sub">Sigue el avance de tu servicio en tiempo real.</div></div>
        <div className="topbar-actions">
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--green)",background:"var(--gdim)",border:"1px solid rgba(16,217,160,0.2)",padding:"6px 12px",borderRadius:20}}>
            <span className="sdot green" />&nbsp;Servicio Activo
          </div>
        </div>
      </div>

      <div className="banner">
        <div><h2>Estás en Fase 3: Construcción de Contenido</h2><p>Tu estrategia de marca está lista. Esta semana enfocamos en los primeros 3 pilares de contenido.</p></div>
        <div style={{fontSize:11,color:"var(--accent)",background:"var(--pglow)",border:"1px solid var(--border)",padding:"8px 16px",borderRadius:8,cursor:"pointer",whiteSpace:"nowrap",position:"relative",zIndex:1}}>Ver tareas activas →</div>
      </div>

      <div className="card mb16">
        <SH title="Fases del Servicio" />
        <div className="phases">
          {phases.map(p=>(
            <div key={p.n} className={`phase ${p.s}`}>
              <div className="phase-dot">{p.s==="done"?"✓":p.s==="active"?"◈":"◇"}</div>
              <div className="phase-name">{p.n}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="g3" style={{marginBottom:16}}>
        <div className="kpi"><div className="kpi-icon">👥</div><div className="kpi-label">Seguidores</div><div className="kpi-val">{(3842).toLocaleString()}</div><div className="kpi-delta up">↑ +{m.growth} este mes</div><div className="kpi-bar"><div className="kpi-bar-fill" style={{width:"62%"}} /></div></div>
        <div className="kpi"><div className="kpi-icon">📈</div><div className="kpi-label">Alcance Promedio</div><div className="kpi-val">{(1204).toLocaleString()}</div><div className="kpi-delta up">↑ +18% vs mes anterior</div><div className="kpi-bar"><div className="kpi-bar-fill" style={{width:"48%"}} /></div></div>
        <div className="kpi"><div className="kpi-icon">✦</div><div className="kpi-label">Tareas Completadas</div><div className="kpi-val">{done}/{clientTasks.length}</div><div className="kpi-delta up">↑ Buen ritmo</div><div className="kpi-bar"><div className="kpi-bar-fill" style={{width:`${clientTasks.length?Math.round(done/clientTasks.length*100):0}%`}} /></div></div>
      </div>

      <div className="g2">
        <div className="card">
          <SH title="Tareas Activas" />
          {clientTasks.slice(0,5).map(t=>(
            <div className="task-row" key={t.id}>
              <div className={`task-check ${t.status==="terminado"?"done":""}`}>{t.status==="terminado"?"✓":""}</div>
              <div className={`task-text ${t.status==="terminado"?"done":""}`}>{t.task}</div>
              <Badge cls={TASK_STATUS_COLORS[t.status]}>{t.status}</Badge>
            </div>
          ))}
        </div>
        <div>
          <div className="card mb16">
            <SH title="Progreso General" />
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <div style={{position:"relative",width:70,height:70,flexShrink:0}}>
                <svg width="70" height="70" viewBox="0 0 70 70" style={{transform:"rotate(-90deg)"}}>
                  <circle cx="35" cy="35" r="28" fill="none" stroke="var(--g2)" strokeWidth="6"/>
                  <circle cx="35" cy="35" r="28" fill="none" stroke="url(#rg)" strokeWidth="6" strokeLinecap="round" strokeDasharray="176" strokeDashoffset={176-(176*progress/100)}/>
                  <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#5b21b6"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient></defs>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800}}>{progress}%</div>
                </div>
              </div>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,marginBottom:4}}>Onboarding completado</div>
                <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.5}}>Tu cuenta está siendo configurada correctamente.</div>
              </div>
            </div>
          </div>
          <div className="card">
            <SH title="Últimas Acciones" />
            {[
              {icon:"📝",text:"Guión de Reel enviado para revisión",time:"Hoy 10:42am"},
              {icon:"✅",text:"Análisis de competidores completado",time:"Ayer"},
              {icon:"📊",text:"Métricas de febrero registradas",time:"Mar 5"},
            ].map((a,i)=>(
              <div className="activity-row" key={i}>
                <div className="a-icon">{a.icon}</div>
                <div><div className="a-text">{a.text}</div><div className="a-time">{a.time}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ClientTasks({ client, tasks }) {
  const done = tasks.filter(t=>t.status==="terminado");
  const pending = tasks.filter(t=>t.status!=="terminado");
  return (
    <>
      <div className="topbar"><div><div className="page-title">Tareas & Avances</div><div className="page-sub">Seguimiento de todas las acciones de tu servicio</div></div></div>
      <div className="g2">
        <div className="card">
          <SH title={`✅ Completadas (${done.length})`} />
          {done.map(t=><div className="task-row" key={t.id}><div className="task-check done">✓</div><div className="task-text done">{t.task}</div><Badge cls="b-grey">{t.deadline}</Badge></div>)}
          {done.length===0 && <div style={{fontSize:13,color:"var(--muted)"}}>Sin tareas completadas aún</div>}
        </div>
        <div className="card">
          <SH title={`⏳ Pendientes (${pending.length})`} />
          {pending.map(t=><div className="task-row" key={t.id}><div className="task-check" /><div className="task-text">{t.task}</div><Badge cls={TASK_STATUS_COLORS[t.status]}>{t.status}</Badge></div>)}
          {pending.length===0 && <div style={{fontSize:13,color:"var(--green)"}}>¡Todo al día! 🎉</div>}
        </div>
      </div>
    </>
  );
}

function ClientContent({ client }) {
  const week = [
    {day:"Lun",label:"Reel",cls:"pub"},
    {day:"Mar",label:"Story",cls:"pub"},
    {day:"Mié",label:"Carr.",cls:"has today"},
    {day:"Jue",label:"Story",cls:"has"},
    {day:"Vie",label:"Reel",cls:"has"},
    {day:"Sáb",label:"",cls:""},
    {day:"Dom",label:"",cls:""},
  ];
  return (
    <>
      <div className="topbar"><div><div className="page-title">Contenido</div><div className="page-sub">Calendario editorial y estado de piezas</div></div></div>
      <div className="card mb16">
        <SH title="Calendario — Semana 10" />
        <div style={{marginBottom:8,display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6}}>
          {week.map(d=><div key={d.day} className="cal-day-name">{d.day}</div>)}
        </div>
        <div className="cal-week">
          {week.map(d=>(
            <div key={d.day} className={`cal-cell ${d.cls}`} style={{height:60,fontSize:10}}>
              {d.label && <><span>{d.label}</span><div className="cal-dot"/></>}
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <SH title="Piezas de la Semana" />
        {[
          {name:"Reel — Error #1 de infoproductores",type:"Reel",status:"Publicado",cls:"b-green"},
          {name:"Story — Encuesta diferenciador",type:"Story",status:"Publicado",cls:"b-green"},
          {name:"Carrusel — Cómo diferenciarte",type:"Carrusel",status:"En revisión",cls:"b-orange"},
          {name:"Story — Tip de la semana",type:"Story",status:"Programado",cls:"b-purple"},
          {name:"Reel — 3 señales sin posicionamiento",type:"Reel",status:"Guión listo",cls:"b-blue"},
        ].map((p,i)=>(
          <div className="task-row" key={i}>
            <div className="task-text">{p.name}</div>
            <Badge cls="b-purple">{p.type}</Badge>
            <Badge cls={p.cls}>{p.status}</Badge>
          </div>
        ))}
      </div>
    </>
  );
}

function ClientBrand({ client }) {
  const pillars = [
    {icon:"🎯",name:"Diferenciador Clave",desc:"Metodología única para escalar infoproductos B2B",status:"Definido",cls:"b-green"},
    {icon:"👤",name:"Perfil de Cliente Ideal",desc:"Consultores y coaches B2B, 30-50 años, ticket alto",status:"Definido",cls:"b-green"},
    {icon:"🗣️",name:"Voz y Tono de Marca",desc:"Autoridad directa + cercanía estratégica",status:"Definido",cls:"b-green"},
    {icon:"📐",name:"Identidad Visual IG",desc:"Paleta + tipografía + plantillas",status:"En proceso",cls:"b-orange"},
    {icon:"💡",name:"Propuesta de Valor",desc:"Headline y bio con gancho al ICP",status:"En proceso",cls:"b-orange"},
  ];
  return (
    <>
      <div className="topbar"><div><div className="page-title">Marca & Diferenciador</div><div className="page-sub">Estructura estratégica de tu marca personal</div></div></div>
      <div className="g2">
        <div className="card">
          <SH title="Pilares de Marca" />
          {pillars.map((p,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px",background:"var(--g1)",border:"1px solid var(--border2)",borderRadius:9,marginBottom:7}}>
              <div style={{width:34,height:34,background:"var(--pglow)",border:"1px solid var(--border)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{p.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600}}>{p.name}</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>{p.desc}</div>
              </div>
              <Badge cls={p.cls}>{p.status}</Badge>
            </div>
          ))}
        </div>
        <div>
          <div className="card mb16">
            <SH title="Pilares de Contenido" />
            {[
              {icon:"📚",n:"Educación",d:"Frameworks, errores, insights B2B",cls:"b-green"},
              {icon:"🏆",n:"Autoridad",d:"Casos de éxito, prueba social",cls:"b-orange"},
              {icon:"🤝",n:"Conexión",d:"Behind the scenes, proceso",cls:"b-grey"},
            ].map((p,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 0",borderBottom:i<2?"1px solid var(--border2)":undefined}}>
                <span style={{fontSize:18}}>{p.icon}</span>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>Pilar {i+1} — {p.n}</div><div style={{fontSize:11,color:"var(--muted)"}}>{p.d}</div></div>
                <Badge cls={p.cls}>{i===0?"Activo":i===1?"En proceso":"Próximo"}</Badge>
              </div>
            ))}
          </div>
          <div className="card">
            <SH title="Posicionamiento" />
            <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.7,background:"var(--g1)",padding:"13px",borderRadius:9,border:"1px solid var(--border2)",fontStyle:"italic"}}>
              "Ayudo a infoproductores y marcas personales B2B a pasar de vender sin consistencia a construir un sistema de contenido que atrae clientes de alto valor, semana a semana."
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ClientFunnel({ client, m }) {
  const stages = [
    {label:"Contenido IG",fill:"linear-gradient(90deg,#5b21b6,#7c3aed)",pct:100,val:"∞"},
    {label:"Seguidores",fill:"linear-gradient(90deg,#7c3aed,#a78bfa)",pct:90,val:"3.8K"},
    {label:"Leads (Bio)",fill:"linear-gradient(90deg,#a78bfa,#10d9a0)",pct:55,val:m.leads},
    {label:"Llamadas",fill:"linear-gradient(90deg,#10d9a0,#34d399)",pct:25,val:Math.round(m.leads/5)},
    {label:"Clientes",fill:"linear-gradient(90deg,#f97316,#fbbf24)",pct:12,val:m.sales},
  ];
  return (
    <>
      <div className="topbar"><div><div className="page-title">Embudo Personalizado</div><div className="page-sub">Tu sistema de captación y conversión desde Instagram</div></div></div>
      <div className="g21">
        <div className="card">
          <SH title="Flujo del Embudo" />
          {stages.map((s,i)=>(
            <div className="funnel-row" key={i}>
              <div className="funnel-label">{s.label}</div>
              <div className="funnel-track"><div className="funnel-fill" style={{width:`${s.pct}%`,background:s.fill}}>{s.label}</div></div>
              <div className="funnel-count">{s.val}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="card mb16">
            <SH title="Etapas" />
            {[
              {icon:"📱",n:"Contenido Orgánico",d:"Reels y carruseles de valor",cls:"b-green",s:"Activo"},
              {icon:"🎁",n:"Lead Magnet",d:"PDF gratuito en bio",cls:"b-orange",s:"En diseño"},
              {icon:"📞",n:"Llamada Diagnóstico",d:"Agenda desde DMs",cls:"b-grey",s:"Próximo"},
            ].map((e,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 0",borderBottom:i<2?"1px solid var(--border2)":undefined}}>
                <div style={{width:32,height:32,background:"var(--g1)",border:"1px solid var(--border2)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{e.icon}</div>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{e.n}</div><div style={{fontSize:11,color:"var(--muted)"}}>{e.d}</div></div>
                <Badge cls={e.cls}>{e.s}</Badge>
              </div>
            ))}
          </div>
          <div className="card">
            <SH title="Conversión del Mes" />
            {[["Visitas al perfil",m.traffic.toLocaleString()],["Clics en bio",Math.round(m.traffic*0.05)],["Leads",m.leads],["Llamadas",Math.round(m.leads/5)],["Clientes cerrados",m.sales]].map(([l,v],i)=>(
              <div className="m-row" key={i}><div className="m-label">{l}</div><div className="m-val" style={{fontSize:14,color:i===4?"var(--green)":undefined}}>{v}</div></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ClientMetrics({ client, m }) {
  return (
    <>
      <div className="topbar"><div><div className="page-title">Métricas Instagram</div><div className="page-sub">{m.period} · Indicadores clave de tu cuenta</div></div></div>
      <div className="g3" style={{marginBottom:16}}>
        {[
          {l:"Seguidores",v:"3,842",d:"↑ +"+m.growth,icon:"👥"},
          {l:"Alcance promedio",v:"1,204",d:"↑ +18%",icon:"📡"},
          {l:"Engagement Rate",v:`${m.engagement}%`,d:"↑ +0.9%",icon:"❤️"},
          {l:"Reproducc. Reels",v:m.views.toLocaleString(),d:"↑ este mes",icon:"▶️"},
          {l:"Guardados / post",v:"147",d:"↑ +47%",icon:"🔖"},
          {l:"Clics en bio",v:Math.round(m.traffic*0.05).toString(),d:"↑ creciendo",icon:"🔗"},
        ].map((k,i)=>(
          <div className="kpi" key={i}>
            <div className="kpi-icon">{k.icon}</div>
            <div className="kpi-label">{k.l}</div>
            <div className="kpi-val" style={{fontSize:22}}>{k.v}</div>
            <div className="kpi-delta up">{k.d}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <SH title="Top Contenidos del Mes" />
        {[
          {name:`Reel: "El error #1 de infoproductores"`,date:"Feb 12",val:"18.4K",label:"reproducciones"},
          {name:`Carrusel: "Cómo diferenciarte en IG"`,date:"Feb 19",val:"3,210",label:"alcance"},
          {name:`Reel: "3 tipos de clientes B2B"`,date:"Feb 26",val:"9,800",label:"reproducciones"},
        ].map((p,i)=>(
          <div className="m-row" key={i}>
            <div><div style={{fontSize:13,fontWeight:500}}>{p.name}</div><div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Publicado {p.date}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700}}>{p.val}</div><div style={{fontSize:10,color:"var(--green)"}}>{p.label}</div></div>
          </div>
        ))}
      </div>
    </>
  );
}

function ClientRevenue({ client }) {
  const months = ["Oct","Nov","Dic","Ene","Feb","Mar"];
  const vals = [6000,7000,8000,9000,10000,12000];
  const max = Math.max(...vals);
  const transactions = [
    {name:"Plan Crecimiento — pago mensual",date:"Mar 1",amount:client.fee,status:"Recibido",cls:"b-green"},
    {name:"Plan Crecimiento — próximo pago",date:"Abr 1",amount:client.fee,status:"Pendiente",cls:"b-orange"},
  ];

  return (
    <>
      <div className="topbar"><div><div className="page-title">Ingresos</div><div className="page-sub">Historial de pagos y estado de facturación</div></div></div>
      <div className="g3" style={{marginBottom:16}}>
        <div className="kpi"><div className="kpi-icon">💰</div><div className="kpi-label">Fee Mensual</div><div className="kpi-val" style={{fontSize:22}}>{fmt(client.fee)}</div><div className="kpi-delta up">↑ Activo</div></div>
        <div className="kpi"><div className="kpi-icon">📅</div><div className="kpi-label">Contrato</div><div className="kpi-val" style={{fontSize:22}}>{client.contract} meses</div><div className="kpi-delta neutral">→ Desde {client.start}</div></div>
        <div className="kpi"><div className="kpi-icon">🧾</div><div className="kpi-label">Total Invertido</div><div className="kpi-val" style={{fontSize:22}}>{fmt(client.fee*3)}</div><div className="kpi-delta up">↑ 3 meses</div></div>
      </div>
      <div className="g2">
        <div className="card">
          <SH title="Historial de Pagos" />
          {transactions.map((t,i)=>(
            <div className="m-row" key={i}>
              <div><div style={{fontSize:13,fontWeight:500}}>{t.name}</div><div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{t.date}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:"var(--green)"}}>{fmt(t.amount)}</div><Badge cls={t.cls}>{t.status}</Badge></div>
            </div>
          ))}
        </div>
        <div className="card">
          <SH title="Ingresos Agencia — Últimos 6 Meses" />
          <div className="bar-chart" style={{height:90}}>
            {vals.map((v,i)=>(
              <div className="bar-item" key={i}>
                <div className="bar-val" style={{fontSize:9,color:i===5?"var(--accent)":"var(--dim)"}}>${(v/1000).toFixed(0)}K</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{height:`${(v/max)*100}%`,background:i===5?"linear-gradient(180deg,var(--pm),var(--pl))":"linear-gradient(180deg,var(--purple),var(--pm))",opacity:0.5+(i*0.08)}} />
                </div>
                <div className="bar-label" style={{color:i===5?"var(--accent)":undefined}}>{months[i]}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:10,padding:"10px",background:"var(--gdim)",border:"1px solid rgba(16,217,160,0.15)",borderRadius:9,fontSize:12,color:"var(--green)",lineHeight:1.5}}>
            📈 MRR total de la agencia: <strong>$12,000</strong> — 3 clientes activos en Plan Crecimiento.
          </div>
        </div>
      </div>
    </>
  );
}

function ClientDocs({ client, docs }) {
  const docIcon = {PDF:"📄",Doc:"📝",Figma:"🎨",Canva:"🖼️"};
  return (
    <>
      <div className="topbar"><div><div className="page-title">Documentos</div><div className="page-sub">Todos tus entregables y recursos del servicio</div></div></div>
      {docs.length === 0 && <div className="card"><div style={{fontSize:13,color:"var(--muted)",textAlign:"center",padding:"20px 0"}}>Aún no hay documentos para este cliente.</div></div>}
      {docs.map(d=>(
        <div className="doc-row" key={d.id}>
          <div className="doc-icon">{docIcon[d.type]||"📄"}</div>
          <div style={{flex:1}}><div className="doc-name">{d.name}</div><div className="doc-meta">{d.date}</div></div>
          <Badge cls="b-grey">{d.type}</Badge>
          <Badge cls="b-purple">{d.category}</Badge>
          <button className="btn btn-ghost btn-sm">↓ Abrir</button>
        </div>
      ))}
    </>
  );
}

function ClientRequests({ client, requests }) {
  return (
    <>
      <div className="topbar"><div><div className="page-title">Solicitudes</div><div className="page-sub">Envía y da seguimiento a tus peticiones</div></div>
        <div className="topbar-actions"><button className="btn btn-primary btn-sm">+ Nueva Solicitud</button></div>
      </div>
      {requests.length === 0 && <div className="card"><div style={{fontSize:13,color:"var(--muted)",textAlign:"center",padding:"20px 0"}}>Sin solicitudes activas.</div></div>}
      {requests.map(r=>(
        <div className="req-card" key={r.id}>
          <div className="req-title">{r.title}</div>
          <div className="req-desc">{r.desc}</div>
          <div className="req-footer">
            <Badge cls={REQUEST_STATUS_COLORS[r.status]}>{r.status}</Badge>
            <Badge cls={PRIORITY_COLORS[r.priority]}>{r.priority}</Badge>
            <span style={{fontSize:11,color:"var(--muted)",marginLeft:"auto"}}>📅 {r.deadline}</span>
          </div>
        </div>
      ))}
    </>
  );
}
