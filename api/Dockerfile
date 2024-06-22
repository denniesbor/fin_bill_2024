# Stage 1: Build
FROM python:3.12-slim as builder

WORKDIR /api

# Install build dependencies and GDAL for PostGIS support
RUN apt-get update && \
    apt-get install -y build-essential libpq-dev gdal-bin libgdal-dev --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Stage 2: Final
FROM python:3.12-slim

WORKDIR /api

# Install runtime dependencies for GDAL
RUN apt-get update && \
    apt-get install -y gdal-bin libgdal-dev --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Copy only necessary files from builder stage
COPY --from=builder /root/.local /root/.local
COPY . .

# Ensure the PATH includes the user's local pip installations
ENV PATH=/root/.local/bin:$PATH

# Set environment variables for GDAL
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal
ENV GDAL_LIBRARY_PATH=/usr/lib/libgdal.so

# Create media directory
RUN mkdir -p /api/media

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "myapi.wsgi:application"]
