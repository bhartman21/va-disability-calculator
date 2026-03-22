<div align="center">
<img width="1200" height="475" alt="VA Disability Calculator Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# VA Disability Calculator

A professional, high-performance tool designed for veterans and advocates to calculate VA disability ratings accurately. This application implements the complex "Whole Person Theory" and "Bilateral Factor" logic as-prescribed by the Department of Veterans Affairs.

📖 **Check out [PROJECT_STATUS.md](PROJECT_STATUS.md) for the current feature breakdown, architectural details, and our development backlog.**

## 🚀 Features

- **VA Math Precision**: Implements combined rating logic according to [38 CFR § 4.25](https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.25).
- **Bilateral Factor Support**: Automatically detects and applies the 10% bilateral boost for conditions affecting paired extremities (arms/legs) per [38 CFR § 4.26](https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.26).
- **Modern Component Architecture**: Built with Angular 18+ (Standalone Components and Signals) and Tailwind CSS for a fluid, responsive, state-driven experience.
- **Interactive Management**: Easily add, edit, or remove service-connected conditions with an elegant inline-editing UI.
- **"Math Flow" Algorithm**: A custom visual diagram traces exactly how the percentage cascades down step-by-step from 100%.

## 🛠️ Tech Stack

- **Frontend**: [Angular](https://angular.dev/) (Standalone Components, Signals)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [FontAwesome](https://fontawesome.com/)

## ⚙️ Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [npm](https://www.npmjs.com/)

### Setup Instructions

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/va-disability-calculator.git
    cd va-disability-calculator
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:4200`.

## ⚖️ Disclaimer

This calculator is for informational purposes only. Official VA disability ratings and compensation are determined solely by the Department of Veterans Affairs. This tool does not account for Special Monthly Compensation (SMC), unemployability (TDIU), or other complex legal scenarios.

---
*Created with focus on clarity, accuracy, and ease of use for the Veteran community.*
