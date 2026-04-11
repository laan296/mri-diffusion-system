# MRI DIFFUSION SYSTEM 部署指南

本项目为“基于扩散模型的多模态脑 MRI 生成系统”，采用前后端分离的架构设计，整体由前端可视化界面、后端推理服务和核心模型模块组成。其中，后端基于 Flask 搭建 SelfRDB 模型推理服务，主要负责请求处理、数据预处理、模型调用与结果返回；前端基于 React 与 Vite 构建可视化交互界面，主要实现图像上传、结果展示、对比查看与下载等功能。系统以前端作为用户入口，以后端作为服务支撑，以 SelfRDB 扩散模型作为算法核心，形成了“图像输入—智能生成—结果展示”的完整闭环，可用于脑 MRI 跨模态生成任务的演示与应用。

项目目录结构如下：

```text
mri-diffusion-system/
├─ BackEnd/                      # Flask 后端
├─ FrontEnd/mri-diffusion-system # React 前端
├─ SelfRDB/                      # SelfRDB 模型代码
├─ brats_t1_t2/                  # 示例 checkpoint
└─ scripts/start_backend.sh      # Linux 启动脚本
```

参考服务器配置：

- 1 × NVIDIA A10 GPU
- 8 vCPU / 30 GiB 内存
- Ubuntu 22.04
- PyTorch 2.9.1 + Python 3.11 + CUDA 12.4
- 100 GiB 系统盘

## 1）准备服务器与网络

请在安全组中开放以下端口：

- **22/tcp**：SSH 登录，来源建议限制为你自己的 IP
- **5000/tcp**：Flask API 接口，来源建议限制为你自己的 IP 或前端服务器
- **5173/tcp**：仅当你需要通过公网使用 Vite 预览前端时开放

若使用 NAT 网关对外暴露服务，还需为上述每个端口分别创建 DNAT 规则，将公网端口映射到服务器实例的内网 IP 及对应端口。

## 2) 安装基础软件包

```bash
sudo apt update
sudo apt install -y git wget curl build-essential \
  libgl1 libglib2.0-0 libsm6 libxext6 libxrender1 ffmpeg
```

## 3) 安装 Miniconda（如果未安装）

```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh
bash ~/miniconda.sh -b -p $HOME/miniconda3
echo 'export PATH="$HOME/miniconda3/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
conda init bash
source ~/.bashrc
```

## 4) 克隆项目代码

```bash
git clone git@github.com:laan296/mri-diffusion-system.git mri-diffusion-system
cd mri-diffusion-system
```

## 5) 创建 Conda 环境

```bash
conda config --set channel_priority flexible
conda env create -f SelfRDB/requirements.yaml
conda activate selfrdb
```

如果由于旧版本依赖矩阵导致环境解析失败，可改用经典求解器重新创建：

```bash
conda env create -f SelfRDB/requirements.yaml --solver=classic
```

## 6) 验证 GPU 运行环境

```bash
nvidia-smi
python -c "import torch;print('cuda_available=', torch.cuda.is_available());print('device=', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'cpu')"
```

预期结果：

- `cuda_available=True`
- GPU 名称中包含服务器 GPU 型号 如 `Tesla T4`

## 7) 启动后端（Flask + SelfRDB）

建议使用环境变量，避免在代码中硬编码路径：

```bash
export SELFRDB_CONFIG=$PWD/SelfRDB/config.yaml
export SELFRDB_CHECKPOINT=$PWD/brats_t1_t2/brats_t1_t2.ckpt
export FLASK_HOST=0.0.0.0
export FLASK_PORT=5000
export FLASK_DEBUG=0
python BackEnd/app.py
```

在另一个终端中执行健康检查：

```bash
curl http://127.0.0.1:5000/api/health
```

## 8) 启动前端

请先安装 Node.js 20+，推荐使用 nvm。

```bash
cd FrontEnd/mri-diffusion-system
npm install
echo "VITE_API_BASE_URL=http://<YOUR_EIP>:5000" > .env.production
npm run build
npm run preview -- --host 0.0.0.0 --port 5173
```

获取服务器公网 IP 请在终端运行：

```bash
curl ifconfig.me
```

浏览器访问： `http://<YOUR_EIP>:5173`

## 9) 推荐的生产环境进程管理方式

对于需要长期运行的服务，建议使用 tmux 或 systemd 进行进程管理：

- 后端启动命令：`python BackEnd/app.py`
- 前端预览命令：`npm run preview -- --host 0.0.0.0 --port 5173`

如果服务器已安装 Nginx，更推荐由 Nginx 直接托管前端 `dist/` 目录，并将 `/api` 反向代理到 `127.0.0.1:5000`。
