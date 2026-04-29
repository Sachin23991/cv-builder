# Unified Resume/CV Backend

A Node.js/Express backend server that manages and serves multiple resume/CV templates from a single unified backend.

## Available Templates

| Template | Type | Port | Description |
|----------|------|------|-------------|
| `impact-cv` | Vite/React | 3002 | Modern React-based CV builder with multiple themes |
| `reactive-resume` | TanStack Start | 3003 | Full-featured resume builder with AI integration |
| `hugo-theme-academic-cv` | Hugo | 3004 | Academic-focused CV template built with Hugo |

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Or run in development mode with auto-reload
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### List All Templates
```bash
GET /api/templates
```

### Get Single Template Info
```bash
GET /api/templates/:id
```

### Start a Template Dev Server
```bash
POST /api/templates/:id/start
```

### Stop a Template Dev Server
```bash
POST /api/templates/:id/stop
```

### Get Status of All Running Servers
```bash
GET /api/status
```

### Stop All Running Servers
```bash
POST /api/stop-all
```

### Health Check
```bash
GET /api/health
```

## Usage Examples

### Using curl

```bash
# List all templates
curl http://localhost:3001/api/templates

# Start impact-cv dev server
curl -X POST http://localhost:3001/api/templates/impact-cv/start

# Check status
curl http://localhost:3001/api/status

# Stop a specific template
curl -X POST http://localhost:3001/api/templates/impact-cv/stop

# Stop all templates
curl -X POST http://localhost:3001/api/stop-all
```

### Using JavaScript/Fetch

```javascript
// List templates
const response = await fetch('http://localhost:3001/api/templates');
const data = await response.json();
console.log(data.templates);

// Start a template
await fetch('http://localhost:3001/api/templates/impact-cv/start', {
  method: 'POST'
});

// Access the template
// Open http://localhost:3002 in your browser
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Unified Backend (Port 3001)                │
│                     Express Server                      │
├─────────────────────────────────────────────────────────┤
│  API Routes:                                            │
│  - /api/templates - List/manage templates               │
│  - /api/status - Server status                          │
│  - /api/health - Health check                           │
└─────────────────────────────────────────────────────────┘
         │              │              │
         ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  impact-cv  │ │reactive-    │ │   hugo-     │
│  (Port 3002)│ │resume       │ │   academic  │
│             │ │(Port 3003)  │ │   (Port 3004)│
└─────────────┘ └─────────────┘ └─────────────┘
```

## Requirements

- Node.js >= 18.0.0
- For Hugo templates: Hugo must be installed separately

## License

MIT
