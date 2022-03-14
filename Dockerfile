# 生产发布(production)
FROM nginx:stable-alpine as production-stage

# 将构建后的内容复制到 web 容器中的 html 目录，这里采用的 web 容器是 Nginx
COPY dist/ /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 相当于暴露镜像的某个端口。
# 这里暴露一些服务端口，以便在宿主机去运行这个镜像的时候可以将其映射到宿主机上的端口
EXPOSE 8082

# 运行 nginx。
# CMD 用于执行脚本。相当于镜像运行起来之后，它就会执行CMD后的命令。命令通过数组的方式拼接起来。
CMD ["nginx", "-g", "daemon off;"]