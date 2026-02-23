# SLINT Institutional Diagnostic Survey — User Guide

This guide explains how to use the SLINT survey application as a **survey participant** or as an **administrator**.

---

## Table of Contents

1. [Overview](#overview)
2. [For Survey Participants](#for-survey-participants)
3. [For Administrators](#for-administrators)
4. [Access Code](#access-code)
5. [Troubleshooting](#troubleshooting)

---

## Overview

The SLINT Institutional Diagnostic Survey collects member feedback for the 2026–2029 strategic term. The app has two main areas:

- **Public survey** — For members to complete the diagnostic
- **Admin portal** — For authorized staff to view responses and analytics

**Typical URLs** (replace with your server address if different):

- Survey: `http://your-server:3300`
- Admin login: `http://your-server:3300/login`
- Dashboard: `http://your-server:3300/dashboard`
- Responses: `http://your-server:3300/responses`

---

## For Survey Participants

### Step 1: Open the survey

Go to the survey URL (e.g. `http://your-server:3300`).

### Step 2: Enter the access code

You will see an **“Access Code Required”** screen. Enter the access code you received from SLINT and click **Continue**.

- If the code is correct, the survey will load.
- If it is wrong, you will see an error message. Check the code and try again.

### Step 3: Complete the survey

- **Sections** — The survey is split into sections (A, B, C, etc.). Use the section letters at the top to jump between sections.
- **Required fields** — All questions in each section must be answered before you can move to the next section.
- **Basic Information (Section A)** — Enter Full Name, Email, Phone, and Location in the first card.
- **Navigation** — Use **Previous** and **Next Section** to move through the survey.
- **Progress** — The bar and section letters show how far you have progressed.

### Step 4: Submit

- On the last section, click **Submit Response**.
- You will see a confirmation message when the response is saved.
- You can click **Submit Another Response** if you want to submit again.

### Tips for participants

- Complete each section fully before moving on.
- Some questions appear only if you selected certain options earlier (e.g. Student, Government, Corporate).
- For questions with a limit (e.g. “Select up to 3”), you cannot select more than the allowed number.
- Your access remains valid for about 8 hours; you can close the browser and return without re-entering the code.

---

## For Administrators

### Logging in

1. Go to `http://your-server:3300/login`.
2. Enter your admin username and password.
3. Click **Sign In**.
4. You will be taken to the Dashboard.

**Default credentials** (change these in production):

- Username: `admin`
- Password: `SLINT@Secure2026#Admin`

### Dashboard

The Dashboard shows:

- **Summary cards** — Total responses, funding need count, government respondents, unique clusters.
- **Member Profile** — Pie chart of respondent profiles (e.g. Student, Startup, Government).
- **Priority Areas** — Bar chart of areas members want SLINT to prioritize.
- **Ecosystem Constraints** — Bar chart of constraints affecting growth.

### Responses tab

- **Table** — All responses with Name, Email, Location, Cluster, and date.
- **Delete** — Remove a response if needed.
- **Export CSV** — Download all responses as a spreadsheet for analysis.

### Sharing the access code

- Share the survey access code only with people who should complete the survey.
- The default code is: `SLINT-9Kx#2026@Survey$Secure`
- If your team uses a custom code, share that instead.

### Logging out

Click **Logout** in the top-right corner to end your session.

---

## Access Code

- The survey requires an access code before it can be viewed or submitted.
- Participants enter the code once; it remains valid for about 8 hours.
- Admins can share the code with authorized participants.
- The code is configured by the system administrator and can be changed via environment variables.

---

## Troubleshooting

### “Invalid access code”

- Check that you entered the code exactly as provided (including capitals and symbols).
- Ask your admin for the correct code.

### Login returns to the login screen

- Clear cookies for the site and try again.
- Ensure you are using the correct username and password.
- If using HTTP (not HTTPS), the app is configured to work; if it still fails, contact your administrator.

### “Complete all questions before continuing”

- Every question in the current section must be answered.
- Scroll through the section and fill any empty fields.
- Red messages indicate which questions still need answers.

### Cannot submit the survey

- Ensure you have entered a valid access code and the survey has loaded.
- Complete all sections and required fields.
- Check your internet connection and try again.

### Admin: “Not authorized to load responses”

- Your session may have expired. Log in again at `/login`.
- Ensure you are using valid admin credentials.

---

## Quick Reference

| Role        | URL              | Purpose                          |
|------------|------------------|----------------------------------|
| Participant| `/`              | Complete the survey              |
| Admin      | `/login`         | Sign in to admin portal          |
| Admin      | `/dashboard`     | View analytics                   |
| Admin      | `/responses`     | View, delete, and export responses |

---

*SLINT — Sierra Leoneans in Technology · Institutional Diagnostic Survey 2026–2029*
