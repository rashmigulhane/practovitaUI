# Practavita — Product Requirements Document (v1 · UI-only)

## Overview
Practavita is a health & wellness mobile app that guides users through a structured health journey — risk assessment, lab report understanding, AI-powered health chat, family profiles, wearable tracking, and personalised diet/workout plans.

**Scope for this iteration: UI DESIGN ONLY** (no backend, mock data throughout).
User will handle backend & integrations independently.

## Design Language
- **Personality**: iOS-Native Clean — calming, elegant, spacious
- **Palette**: Botanical sage (`#5A7D66`), warm sand surface (`#FDFDFC`), terracotta warnings, brick errors — NO blue/purple
- **Typography**: System font stack, tight letter-spacing on display sizes
- **Nav**: 4 bottom tabs — Home, Insights, Ask Me, Profile
- **Visual system**: 8pt spacing grid, 20/12/6px radii, semi-circular SVG gauges for risk, area sparklines for trends, color-coded pills for lab statuses

## Screens Delivered (14)
1. **Welcome / `/`** — hero image, brand mark, feature pills, Get Started CTA
2. **Onboarding Questionnaire** — 8-step flow with progress bar
3. **Risk Results** — dual semi-circular gauges (Diabetes/CVD)
4. **(tabs) Home** — greeting, notif bell, **Wellness Score hero card** with streak & week-strip, wearable banner, 2×2 metric grid, **Today's plan preview**, **"This week's wins" horizontal cards** (Resting HR/Sleep/Steps/Stress deltas), **Coach card** with next session, risk gauges, quick actions, **Ask FAB**
5. **(tabs) Insights** — **Sleep card** (hours, quality, deep/REM/light stages bar) + **Stress card** (score, level, week trend, rest vs active), **AI insight banner**, category chip filter, recent reports carousel, lab metrics list, sticky Upload CTA, **Ask FAB**
6. **(tabs) Plan** — **Day/Week/Month segmented control** with:
   - **Day**: habits checklist, quick stats, Diet/Workout inner tabs, meal check-offs, kcal target with macro pills
   - **Week**: bar chart of 7-day habits+kcal, workout indicators, breakdown stats vs last week
   - **Month**: 30-day heatmap (5 intensity levels), active/perfect/streak stats, monthly wins narrative
7. **(tabs) Profile** — profile switcher, connected devices, **Care team group (Coach + Activity history)**, health/preferences/account groups, Ask FAB
8. **Coach `/coach`** — gradient coach card with rating & message/call actions, upcoming session, day/slot booking picker, Overview/History tabs with session log + notes
9. **History `/history`** — summary strip, category filter chips, day-grouped timeline with color-coded activity icons
10. **Upload Report** — dropzone → sources → Temporal-style pipeline timeline
11. **Report Detail** — summary, needs-attention section, normal section
12. **Wearable** — device card, battery, live metrics, sync toggles, add-device list
13. **Family Profiles** — selectable family members + add
14. **Ask Me `/ask`** — chatbot with suggestions + typing indicator (now FAB-launched)

## Retention Loops Baked In
- **Streak counter** (12-day) on Home hero + Plan tab
- **Weekly wins** with metric deltas ("−4 bpm resting HR") — visible loss aversion when broken
- **Monthly heatmap** — visual satisfaction for consistency; "perfect days" gamification
- **Coach relationship** — high-touch human loop drives 3–5× LTV
- **Habit checkoffs** with haptic feedback for micro-dopamine
- **AI insight banners** in Insights explain the "why" behind changes

## Next Actions
- Wire mock data to real backend endpoints (Java/Dropwizard + Temporal per your spec).
- Add auth screens & session state.
- Connect wearable via device-specific SDKs.
- Replace canned "Ask Me" responses with real LangChain4j tool-calling.
