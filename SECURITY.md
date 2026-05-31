# Security Policy

The Fire Alert team takes the security of this project seriously. Because Fire Alert is used to report real emergencies, we appreciate responsible disclosure of any vulnerability.

## Supported versions

This project is in active development. Security fixes are applied to the latest `main` branch and the current deployed release. There are no long-term-support older versions.

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Instead, report them privately by email:

📧 **musbimusbi7@gmail.com**

To help us triage quickly, please include as much of the following as you can:

- A description of the vulnerability and its potential impact.
- Steps to reproduce (proof-of-concept, requests, or screenshots).
- The affected page, component, or file (e.g. a `src/` path) if known.
- Any suggested fix or mitigation.

If you prefer, you may also use GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability) on the repository's **Security** tab.

## What to expect

- **Acknowledgement** of your report as soon as we are able.
- We will investigate, keep you informed of progress, and let you know once a fix is released.
- Please give us a reasonable amount of time to address the issue before any public disclosure.
- With your permission, we are happy to credit you for the discovery once the issue is resolved.

## Scope notes for this repository

This is the **frontend** (React + Vite SPA). Some classes of issue belong to the separate backend service:

- **This repo:** XSS, exposure of secrets in client code or the bundle, unsafe handling of tokens in the browser, dependency vulnerabilities in frontend packages, insecure client-side redirects.
- **Backend repo (`fire_alert_backend`):** authentication/authorization flaws, JWT handling, server-side data exposure, injection. If your finding is clearly server-side, please note that in your report — we'll route it appropriately.

> Reminder: the authentication token is stored in the browser's `localStorage`. Reports about token storage trade-offs are welcome, but please frame them with realistic impact.

Thank you for helping keep Fire Alert and its users safe. 🔒
