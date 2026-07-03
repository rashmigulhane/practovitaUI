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

## Screens Delivered (12)
1. **Welcome / `/`** — hero image with sage scrim, brand mark, feature pills, Get Started CTA
2. **Onboarding Questionnaire** — 8-step flow (age, sex, height, weight, family history, activity, smoking, BP) with progress bar, number & select inputs, sticky Next
3. **Risk Results** — dual semi-circular gauges (Diabetes/CVD) with score, level pill, key factors list
4. **(tabs) Home** — greeting, wearable sync banner, 2×2 metric grid with sparklines (Steps/HR/Sleep/Kcal), dual risk gauges, quick actions
5. **(tabs) Insights** — horizontal category chip filter (All/CBC/Diabetes/Lipids/Thyroid/Kidney/Vitamins), recent reports carousel, full lab metrics list with reference ranges & status pills, sticky Upload CTA
6. **(tabs) Ask Me** — AI chatbot with greeting, suggestion chips, canned rule-based responses (labs, LDL, workout, diet keywords), typing indicator, sticky composer
7. **(tabs) Profile** — horizontal profile switcher for family, connected device row, health/preferences/account setting groups with toggles
8. **Upload Report** — dropzone → source picker (PDF/gallery/camera) → simulated Temporal-style pipeline timeline (Upload → Extract → Normalize → Match) → success state
9. **Report Detail `/report/[id]`** — summary counts (Normal/Watch/High), "Needs attention" section, normal-range section, sticky "Ask AI" CTA
10. **Recommendations** — Diet/Workout tabbed view; Diet: kcal card + macro pills + 4 meal cards; Workout: weekly progress ring + workout cards
11. **Wearable** — Fitbit device card with battery bar, sync/disconnect actions, live metrics grid, sync toggles, add-another-device list (Apple/Garmin/Oura/Wear OS)
12. **Family Profiles** — selectable member list, add-member card, privacy info box, sticky Continue CTA

## Business Enhancement (UX-level)
- **Family multi-profile is a growth loop**: parents managing elderly parents' reports drives 2–4× user LTV per household — surfaced prominently on the Profile tab and Home avatar switcher.

## Next Actions
- Wire mock data to real backend endpoints (Java/Dropwizard + Temporal per your spec).
- Add auth screens & session state.
- Connect wearable via device-specific SDKs.
- Replace canned "Ask Me" responses with real LangChain4j tool-calling.
