# FastAPI Request Logger Starter

A simple FastAPI scaffold with auth middleware, logging and handling HTTP requests with files, form data, headers, and cookies.

## Features

- Process JSON, form data, and file uploads
- Log request details (headers, cookies, files, form params)
- Docker support with volume mounting
- Basic health check endpoint

## Getting Started

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start development server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8003
   ```
   Server runs at `http://localhost:8003`

3. **Test the service:**
   ```bash
   python client_test.py
   ```

## Docker Usage

```bash
# Build image
docker build -t my-fastapi-app .

# Run with volume mounting
docker run -v ./host_sink:/app/sink -p 8003:8003 my-fastapi-app
```

## API Endpoints

### `POST /process`
Main endpoint that accepts:
- File uploads (single `file` or multiple `files`)
- Form data (`param1`, `param2`)
- Headers and cookies
- JSON or raw body data

### `GET /health`
Returns `{"status": "ok"}`

### `GET /debug`
Shows configured sink directory

## Project Structure

```
fastapi-logger/
├── app/
│   ├── api/
│   │   └── routes.py          # API routes
│   ├── services/
│   │   └── example_logger.py  # Logging service
│   ├── config.py              # App configuration
│   └── main.py                # FastAPI app
├── host_sink/                 # Log output directory
├── client_test.py             # Test client
├── Dockerfile
├── requirements.txt
└── README.md
```

## Development

- Edit routes in `app/api/routes.py`
- Modify logging in `app/services/example_logger.py`
- Configure settings in `app/config.py`
- All requests are logged to the sink directory
- Use `client_test.py` to test different request types

## Configuration

Set environment variables:
- `PORT`: Server port (default: 8003)