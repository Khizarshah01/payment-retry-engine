# Payment Retry Simulation Web App
This project simulates a reliable retry mechanism for processing payment-like requests in a distributed system. It is built as a web interface to visualize and understand how retry logic, failures, and success rates are handled gracefully over an unreliable network.

##  Demo
![Screenshot_03-Jun_23-21-39_27311](https://github.com/user-attachments/assets/4a38bdf7-4789-4b22-8945-94e81e4911b7)

## Features

- Simulates a payment request system with retry logic.
- Choose between different network reliability profiles (e.g., Good, Flaky, Unstable).
- View real-time logs of each request, retry, and response.
- Dashboard shows success, failure, and total attempt statistics.
- Interactive and beginner-friendly UI to understand backend retry systems.

## How It Works

1. Frontend: User clicks “Request Payment.”
2. Client: Sends the request to an processRequest function that randomly succeeds or fails (based on selected network type).
3. Retry Logic: If it fails, the client/server retries after a short delay using exponential backoff (or linear delay).
4. Success/Failure: Logs and statistics are updated on UI.


## Diagram Flow of functionality 
![Untitled-2025-06-03-2330](https://github.com/user-attachments/assets/a1aafafa-4231-471f-8276-11319521f360)
