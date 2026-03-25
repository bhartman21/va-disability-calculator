# VA Disability Calculator - Project Status

## Current Application Architecture
The application is built using **Angular 18+ (Standalone Components)** paired with **Tailwind CSS** for styling. State is fully centralized using modern Angular Streams (`signal` and `computed`).

### UI Components
The application has recently completed a massive UI refactoring, migrating from a monolithic `app.html` to focused, elegant standalone components:
- `HeaderComponent`: Top navigation and description.
- `ConditionsListComponent`: Shows the combined ratings, bilatual applications, and the editable UI list of conditions.
- `ConditionFormComponent`: Form input logic for adding new disabilities.
- `InfoSectionComponent`: Contextual breakdown on exactly how bilateral boosts apply.
- `WholePersonFlowComponent`: Compact step-by-step visual representation tracing the VA Math algorithm down from a 100% baseline.
- `FooterComponent`: Static footer text.
- `ReferenceModalComponent`: Dismissible references (38 CFR definitions) accessed directly through the UI.

## Features Currently Implemented
- [x] **"Whole Person Theory" VA Math (38 CFR § 4.25)**: Accurately parses standard ratings and calculates true combined raw and rounded totals.
- [x] **Bilateral Factor Calculation (38 CFR § 4.26)**: Automatically assesses eligible left and right extremity inputs, combines them, strictly adds a 10% bonus, and factors the product into the primary formula properly.
- [x] **Responsive Compact Layout**: The dashboard smoothly scales to mobile sizing utilizing conditional flex-layout logic, and the "Service Connected Conditions" list shrinks to fit into the column constraints gracefully.
- [x] **In-line Editing**: Users can quickly modify name, percentage, or extremity within the main list, and the calculation dynamically reacts.
- [x] **Visual "Math Flow" Algorithm**: A custom dynamic diagram traces exactly how the percentage cascades down from 100%, taking the mystery out of the math for Veterans.
- [x] **Thematic Infrastructure**: Custom CSS variable system for consistent light/dark theme contrast across all components.
- [x] **Diagnostic Code (DC) Integration**: Automated extraction of `Diagnostic Type Code` and `hyph_diagnostic_type_code` (analogous DC) from VABD CSV exports, with support for manual entry and display.
- [x] **Header & Title Refactoring**: Cleaned up accessibility issues, ensured responsiveness of the title, and refactored the "Buy Me A Coffee" link to use theme tokens instead of inline styles.

## Potential Future Features / Backlog
- [ ] **Local Storage Persistence**: Automatically save the User's inputted condition values to `localStorage` so they don't lose their data after refreshing or closing the browser.
- [ ] **Multiple Scenario Testing**: Ability to save an existing combined profile to memory, so the user can freely compare "Current Rating" vs "Proposed Re-Evaluation rating" scenarios.
- [ ] **Strict Amputation Rules (38 CFR § 4.68)**: Adding an elegant warning or cap limit enforcing that a specific extremity’s combined ratings cannot mathematically exceed the amputation rating for that limb.
- [ ] **Share / Export feature**: Allow the final conditions list and rating sheet to easily export to a nicely formatted PDF or a copyable snapshot to bring to a VSO representation.
- [ ] **Disability Amount Scale (10% - 100%)**: Implement a modal or worksheet to display the current compensation rates based on dependency status (Married, Single, Dependents, etc.).
- [ ] **Special Monthly Compensation (SMC) Guides**: Include a comprehensive list of SMC amounts and criteria, potentially using a wizard-style interface to determine eligibility.
