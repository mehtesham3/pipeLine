# ✨ AI Content Pipeline

A scalable, asynchronous, real-time blog post and article generator built with Node.js, Express, BullMQ (Redis-backed queues), Prisma (PostgreSQL), Socket.io (WebSocket), and multi-provider AI integrations.

---

## 🚀 About the AI Content Pipeline

The **AI Content Pipeline** is designed to handle high-throughput, asynchronous content generation tasks without blocking the server. When a user requests a blog post or article, the task is immediately offloaded to a background job queue. The user is returned a tracking ID and can monitor the exact state of generation, database storage, and email dispatch in real-time.

### Key Features
* **Asynchronous Offloading**: Server routes never block on heavy AI compute or mail operations.
* **Multi-Provider AI Support**: Seamlessly swap between top AI model providers:
  - **Google Gemini** (Default)
  - **Nvidia AI**
  - **Groq**
  - **HuggingFace**
* **Real-time Live Progress tracking** via **Socket.io**.
* **Robust background queues** powered by **BullMQ** & **Redis** with automated retries and task separation.
* **PostgreSQL Database Storage** powered by **Prisma ORM**.
* **Modern aesthetic dashboard** serving static files locally.
* **BullMQ Admin Dashboard**: Built-in real-time task monitoring at `/admin/queues`.
* **Structured Logging & Diagnostics**: Multi-transport server/job execution logs powered by **Winston**.

---

## 📸 Visual Preview & Screenshots

Here is a visual walk-through of the **AI Content Pipeline** in action:

<table align="center" width="100%">
  <tr>
    <td align="center" width="50%">
      <b>🖥️ Modern Aesthetic Dashboard</b>
      <br/>
      <i>The interactive client UI where users submit generation requests and track status.</i>
      <br/><br/>
      <img src="images/frontend-ui.png" alt="Frontend UI Dashboard" width="100%" style="border-radius: 8px; border: 1px solid #e1e4e8; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
    </td>
    <td align="center" width="50%">
      <b>✨ Generated Content Display</b>
      <br/>
      <i>Real-time streaming completes, rendering the beautiful fully generated blog post.</i>
      <br/><br/>
      <img src="images/Generated-Content.png" alt="Generated Content View" width="100%" style="border-radius: 8px; border: 1px solid #e1e4e8; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <b>📊 BullMQ Job & Queue Monitor</b>
      <br/>
      <i>Admin interface for tracking active, delayed, completed, and failed tasks.</i>
      <br/><br/>
      <img src="images/bullDashboard.png" alt="BullMQ Monitoring Dashboard" width="100%" style="border-radius: 8px; border: 1px solid #e1e4e8; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
    </td>
    <td align="center" width="50%">
      <b>📄 Clean Structured API Response</b>
      <br/>
      <i>Instant 202 Accepted response containing the tracking UUID.</i>
      <br/><br/>
      <img src="images/OutputResponse.png" alt="Output API Response" width="100%" style="border-radius: 8px; border: 1px solid #e1e4e8; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
    </td>
  </tr>
</table>

<p align="center">
  <b>📟 Server Execution & Event Logging</b>
  <br/>
  <i>Detailed multi-transport logging via Winston showing server initiation and job flows.</i>
  <br/><br/>
  <img src="images/logs.png" alt="Server Execution Logs" width="85%" style="border-radius: 8px; border: 1px solid #e1e4e8; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
</p>

---

## 🏛️ Systems Architecture

The system is designed following a decoupled **Producer-Consumer / Event-Driven Architecture**.

### Architecture Workflow Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Client as Frontend Client
    participant Server as Express Server (Producer)
    participant Redis as Redis (BullMQ Broker)
    participant AIWorker as AI Worker (Consumer)
    participant EmailWorker as Email Worker (Consumer)
    participant DB as PostgreSQL (Prisma)
    participant Provider as AI Provider (Gemini/Nvidia/Groq)

    Client->>Server: POST /generate (Prompt & Email)
    Server-->>Client: Returns 202 Accepted + requestId
    Server->>Redis: Enqueues AI Job (aiSendQueue)
    Client->>Server: Socket.io connects & joins room `job:${requestId}`
    
    activate AIWorker
    Redis->>AIWorker: Decodes Job & executes
    AIWorker->>Server: Socket.io Emit: "Generating content..." (25%)
    AIWorker->>Provider: Requests text generation
    Provider-->>AIWorker: Generated Markdown/Text Content
    AIWorker->>Server: Socket.io Emit: "Saving to database..." (50%)
    AIWorker->>DB: Prisma.blogPost.create(...)
    AIWorker->>Redis: Enqueues Email Job (emailSendQueue)
    deactivate AIWorker

    activate EmailWorker
    Redis->>EmailWorker: Decodes Job & executes
    EmailWorker->>Server: Socket.io Emit: "Sending email..." (75%)
    EmailWorker->>Server: Socket.io Emit: "Email sent successfully" (100%)
    deactivate EmailWorker
    
    Server-->>Client: WebSocket real-time progress stream updates UI
```

### Components Breakdown
1. **Producer (Express Server)**: Validates input, provisions a unique UUID `requestId`, enqueues tasks, and exposes historical endpoints (`/seeAll`, `/content/:requestId`).
2. **Broker (Redis)**: Acts as the state repository for tasks and handles synchronization between BullMQ Producers and Workers.
3. **Consumers (BullMQ Workers)**:
   - **AI Worker**: Connects to the configured AI API, handles timeouts/retries, generates article text, saves records to PostgreSQL, and automatically triggers the email queue.
   - **Email Worker**: Handles email dispatch workflow with simulated failure handling and logging.
4. **WebSocket Server**: Binds custom rooms dynamically by `requestId` to stream progress bars in real-time to active browsers.

---

## ⚙️ Environment Variables (`.env`)

To start the server, you need to configure your environment variables. Create a `.env` file in the root directory by copying `.demo.env`:

```bash
cp .demo.env .env
```

### Configurations to Add

| Environment Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| **`DATABASE_URL`** | The connection string for your PostgreSQL database. | `postgresql://user:password@localhost:5432/pipeline` |
| **`AI_PROVIDER`** | Selected default AI provider (`google`, `nvidia`, `groq`, `huggingface`). | `google` |
| **`DEFAULT_API_KEY`** | Google Gemini API key. | *Your Google API Key* |
| **`DEAULT_MODEL`** | Selected Google Gemini model. | `gemini-3.5-flash` |
| **`NVIDIA_KEY`** | Nvidia NIM API key (optional). | *Your Nvidia API Key* |
| **`NVIDIA_MODEL`** | Selected Nvidia model. | `nvidia/nemotron-mini-4b-instruct` |
| **`GROQ_KEY`** | Groq developer API key (optional). | *Your Groq API Key* |
| **`GROQ_MODEL`** | Selected Groq model. | `llama-3.3-70b-versatile` |
| **`HFACE_KEY`** | HuggingFace Access Token (optional). | *Your HuggingFace API Key* |
| **`HFACE_MODEL`** | Selected HuggingFace inference model. | `meta-llama/Llama-3.1-8B-Instruct` |
| **`AI_TIMEOUT`** | Maximum milliseconds allowed for the AI service request. | `30000` |
| **`AI_RETRIES`** | Maximum automated attempts for failed worker tasks. | `3` |

---

## 📦 Project Setup

Follow these steps to set up, install, and run the project locally.

### 📋 Prerequisites
* **Node.js** (v18.x or above recommended)
* **PostgreSQL** (Active instance)
* **Redis** (Active instance for BullMQ backend)

### 🛠️ Installation Steps

0. **Clone the project**
```bash
git clone https://github.com/mehtesham3/pipeLine.git
cd pipeLine
```

1. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   * Create a `.env` file and populate it with your database URL and selected AI API Keys as shown in the section above.

4. **Initialize Database with Prisma**:
   Generate the client and push the schema directly to your Postgres database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Application**:
   Since the Express app and background worker processes are unified, you can launch the entire ecosystem in one terminal:
   ```bash
   node index.js
   ```

6. **Verify Server is Running**:
   Open your browser and visit:
   - **Dashboard UI**: [http://localhost:4000](http://localhost:4000)
   - **BullMQ Admin Monitor**: [http://localhost:4000/admin/queues](http://localhost:4000/admin/queues)
   - **Health Check Endpoint**: [http://localhost:4000/status](http://localhost:4000/status)

---