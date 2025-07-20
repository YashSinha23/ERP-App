# Almed Unified Logs App

A full-stack React + Firebase application for managing production logs and live inventory in a manufacturing environment.  
Supports raw material, sheet forming, cup molding, and printed cups workflows for both operators and managers.

## Features

- **Operator Portal**
  - Log raw material usage and inward entries
  - Sheet forming logs with additives and scrap tracking
  - Cup molding logs with cavity specs and sheet consumption
  - Printed cups logs with cup type and rejection tracking

- **Manager Portal**
  - View, filter, export, and print all logs
  - Live inventory dashboard for all material types
  - Edit cavity specs and manage database
  - Secure login for manager access

- **Inventory Sync**
  - Automatic inventory updates on every log entry
  - Real-time stock tracking for raw materials, sheets, cups, and printed cups

## Tech Stack

- **Frontend:** React, Material UI
- **Backend:** Firebase Firestore
- **Routing:** React Router
- **Date Handling:** Dayjs
- **Export/Print:** XLSX, FileSaver

## Folder Structure

```
src/
  App.jsx, App.css
  firebase/
    firebaseConfig.js
  ManagerApp/
    components/
    pages/
  OperatorApp/
    forms/
    layout/
  pages/
    Login.jsx
    RoleSelector.jsx
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/YashSinha23/ERP-App.git
   cd unified-logs-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Update `src/firebase/firebaseConfig.js` with your Firebase project credentials.

4. **Run the app**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## Usage

- **Operator:**  
  Select your role, fill out the relevant forms, and submit logs. Inventory updates automatically.

- **Manager:**  
  Login with manager credentials, view logs, filter/export/print data, and monitor live inventory.

## Contributing

Pull requests are welcome!  
Please open an issue for major changes or feature requests.