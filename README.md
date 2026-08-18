# Smart Email Assistant

An AI-powered email reply generator that uses **Google Gemini** to create contextual email responses based on the selected tone.

The project consists of three parts:

* **Spring Boot Backend** — Handles requests and communicates with the Google Gemini API to generate email replies.
* **React Frontend** — A separate testing interface used to enter email content, select a tone, and generate responses.
* **Chrome Extension** — Integrates an **AI Reply** button directly into Gmail for generating replies from the email content.

## Tech Stack

* **Backend:** Java, Spring Boot, Maven, WebClient
* **Frontend:** React, Vite, Axios
* **Extension:** JavaScript, Chrome Extension API, Manifest V3
* **AI:** Google Gemini API

## Features

* Generate AI-powered email replies
* Choose between **Professional, Casual, and Friendly** tones
* Test reply generation through the React interface
* Generate replies directly from Gmail using the Chrome Extension
* Keep the Gemini API key on the backend instead of exposing it in the extension

## Architecture

                    ┌──────────────────────┐
                    │        Gmail         │
                    │                      │
                    │  Email + AI Reply    │
                    └──────────┬───────────┘
                               │
                               │ Email content
                               ▼
                    ┌──────────────────────┐
                    │  Chrome Extension    │
                    │                      │
                    │  Reads email content │
                    └──────────┬───────────┘
                               │
                               │ HTTP Request
                               │ email content
                               ▼
                    ┌──────────────────────┐
                    │   Spring Boot API    │
                    │                      │
                    │ Builds prompt        │
                    │ "Reply professionally│
                    │  to this email..."   │
                    └──────────┬───────────┘
                               │
                               │ API Request
                               ▼
                    ┌──────────────────────┐
                    │    Google Gemini     │
                    │                      │
                    │  Generates reply     │
                    └──────────┬───────────┘
                               │
                               │ Generated reply
                               ▼
                    ┌──────────────────────┐
                    │   Spring Boot API    │
                    └──────────┬───────────┘
                               │
                               │ Response
                               ▼
                    ┌──────────────────────┐
                    │  Chrome Extension    │
                    │                      │
                    │ Displays reply       │
                    └──────────────────────┘


       ┌──────────────────────────────────────────┐
       │              React Frontend              │
       │                                          │
       │  Email Content → Tone → Generate Reply   │
       │                                          │
       │  Separate testing/demo interface        │
       └──────────────────────┬───────────────────┘
                              │
                              │ HTTP Request
                              ▼
                       Spring Boot API
                       

## Project Structure

```text
smart-email-assistant/
│
├── email-writer-extension/   # Gmail Chrome Extension
├── email-writer-react/       # Testing & reply generation UI
├── email-writer-springboot/  # Spring Boot backend
└── README.md
```

## Setup

### Backend

```bash
cd email-writer-springboot
mvn spring-boot:run
```

Configure your Gemini credentials as environment variables:

```text
GEMINI_URL=your_gemini_api_url
GEMINI_KEY=your_gemini_api_key
```

### React Frontend

```bash
cd email-writer-react
npm install
npm run dev
```

The React application provides a separate interface for **testing the AI email generation functionality**.

### Chrome Extension

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `email-writer-extension` folder
5. Open Gmail and use the **AI Reply** button

> **Note:** The Gemini API key is kept on the Spring Boot backend and is not exposed in the Chrome Extension.
