# 使用官方的 Node.js 镜像作为基础镜像
FROM node:22-alpine

# 设置工作目录
WORKDIR /app

# 安装 libc6-compat 和 Python
RUN apk add --no-cache libc6-compat python3 make g++

# 复制 package.json 和 pnpm-lock.yaml 到工作目录
COPY package.json ./
COPY pnpm-lock.yaml ./

# 安装依赖
RUN npm install -g pnpm@9.12.3
RUN pnpm install

# 复制项目文件到工作目录
COPY . .

# 构建项目
RUN pnpm run build

# 暴露应用运行的端口
EXPOSE 3000

# 启动应用
CMD ["pnpm", "run", "start"]