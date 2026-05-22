FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

# Set work directory
WORKDIR /app

# Install system dependencies (including netcat for health checks)
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project
COPY . /app/

# Copy entrypoint script
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

# Create necessary directories
RUN mkdir -p /app/logs

# Expose port
EXPOSE 8000

# Set entrypoint
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Default command (can be overridden in docker-compose)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
