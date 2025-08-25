# docker build -t my-fastapi-app .
# docker image inspect my-fastapi-app --format '{{.Size}}'}}
# docker run -v ./host_sink:/app/sink -p 8003:8003 my-fastapi-app
FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY app ./app
COPY uvicorn_app.sh .

RUN chmod +x uvicorn_app.sh

# Default port - can be overridden by environment variable
ENV PORT=8003

# Expose port
EXPOSE ${PORT}

# Run FastAPI with Uvicorn (use shell script to properly expand environment variables)
CMD ["./uvicorn_app.sh"]
