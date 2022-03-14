#!/bin/bash
cd /home/svl-admin-template;

git checkout main;

# 重新下载最新代码
git pull origin main;

# 启动 docker-compose, 与 docker-compose.yml 中的 service 名字保持一致
docker-compose build svl-admin-template;
docker-compose up -d;