# SelfRDB Deployment Guide (Ubuntu 22.04 + T4)

This guide matches the server profile:

- 1 x NVIDIA Tesla T4 (16GB)
- 8 vCPU / 32GiB RAM
- Ubuntu 22.04 Server

## 1) Prepare Server And Network

Open these security-group ports:

- `22/tcp` (SSH, source limited to your own IP)
- `5000/tcp` (Flask API, source limited to your own IP or frontend server)
- `5173/tcp` (only if you use Vite preview in public network)

## 2) Install Base Packages

```bash
sudo apt update
sudo apt install -y git wget curl build-essential \
  libgl1 libglib2.0-0 libsm6 libxext6 libxrender1 ffmpeg
```

## 3) Install Miniconda (if missing)

```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh
bash ~/miniconda.sh -b -p $HOME/miniconda3
echo 'export PATH="$HOME/miniconda3/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
conda init bash
source ~/.bashrc
```

## 4) Clone Project

```bash
git clone <YOUR_REPO_URL> mri-diffusion-system
cd mri-diffusion-system
```

If the code is already uploaded by SCP/Git, just `cd` into project root.

## 5) Create Conda Environment

```bash
conda config --set channel_priority flexible
conda env create -f SelfRDB/requirements.yaml
conda activate selfrdb
```

If solve fails due old package matrix, rebuild with classic solver:

```bash
conda env create -f SelfRDB/requirements.yaml --solver=classic
```

## 6) Verify GPU Runtime

```bash
nvidia-smi
python -c "import torch;print('cuda_available=', torch.cuda.is_available());print('device=', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'cpu')"
```

Expected: `cuda_available=True` and GPU name includes `Tesla T4`.

## 7) Start Backend (Flask + SelfRDB)

Use environment variables to avoid hard-coding:

```bash
export SELFRDB_CONFIG=$PWD/SelfRDB/config.yaml
export SELFRDB_CHECKPOINT=$PWD/brats_t1_t2/brats_t1_t2.ckpt
export FLASK_HOST=0.0.0.0
export FLASK_PORT=5000
export FLASK_DEBUG=0
python BackEnd/app.py
```

Health check in another shell:

```bash
curl http://127.0.0.1:5000/api/health
```

## 8) Start Frontend (Optional)

Install Node.js 20+ first (recommended: nvm).

```bash
cd FrontEnd/mri-diffusion-system
npm install
#curl ifconfig.me
echo "VITE_API_BASE_URL=http://<YOUR_EIP>:5000" > .env.production
npm run build
npm run preview -- --host 0.0.0.0 --port 5173
#http://8.148.186.164:5173
```

Open: `http://<YOUR_EIP>:5173`

## 9) Recommended Production Process Management

For long-running services, use `tmux` or `systemd`:

- Backend command: `python BackEnd/app.py`
- Frontend preview command: `npm run preview -- --host 0.0.0.0 --port 5173`

If you have Nginx, prefer serving `dist/` by Nginx and reverse-proxy `/api` to `127.0.0.1:5000`.
