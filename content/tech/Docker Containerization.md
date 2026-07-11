---
title: Docker Containerization
date: 2024-04-02
tags: [docker, devops, containers, deployment]
aliases: [docker, 容器化]
---

# Docker Containerization

> [!abstract] What is Docker?
> Docker is a platform for developing, shipping, and running applications in containers. Containers are lightweight, standalone, and executable packages that include everything needed to run a piece of software.

## Why Containers?

> [!important] Key Benefits
> 1. **Consistency** — "It works on my machine" is no longer an excuse
> 2. **Isolation** — Each container has its own filesystem and dependencies
> 3. **Portability** — Run anywhere Docker is installed
> 4. **Scalability** — Easy to spin up multiple instances

## Basic Commands

```bash
# Pull an image
docker pull nginx:latest

# Run a container
docker run -d -p 8080:80 --name webserver nginx

# List running containers
docker ps

# View logs
docker logs webserver

# Stop and remove
docker stop webserver && docker rm webserver
```

## Dockerfile Example

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
```

> [!warning] Security Note
> Always use specific image tags (e.g., `node:18-alpine`) instead of `latest` in production. This ensures reproducible builds. See [[Web Development Basics]] for more on production best practices.

## Docker Compose

For multi-container applications, Docker Compose is essential:

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
  
  redis:
    image: redis:alpine
```

## Container vs VM

| Aspect | Container | Virtual Machine |
|--------|-----------|-----------------|
| Size | MBs | GBs |
| Startup | Seconds | Minutes |
| Isolation | Process-level | Hardware-level |
| OS | Shared kernel | Full OS |
| Performance | Near-native | Overhead |

> [!tip] Best Practice
> Use `.dockerignore` to exclude unnecessary files from your build context, similar to `.gitignore` for [[Git Version Control]].

## Real-world Usage

> [!example] My Setup
> I use Docker for:
> - [[Quartz Blog Setup]] — Local development environment
> - [[Smart Home Automation]] — Running home services
> - [[Machine Learning Intro]] — GPU-enabled ML containers

---

*Tags: #docker #devops #containers #deployment*
