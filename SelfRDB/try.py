import numpy as np
import os

# 指定您的数据路径
dataset_dir = "/mnt/sdb/zhangxiaobo/Sit/data/BraTS2021_SelfRDB"  # 替换为实际路径
source_modality = "T1"  # 替换为您的源模态
target_modality = "T2"  # 替换为您的目标模态
split = "train"  # 或 "val", "test"

# 检查源模态
source_path = os.path.join(dataset_dir, source_modality, split)
files = os.listdir(source_path)
if files:
    sample_file = os.path.join(source_path, files[0])
    data = np.load(sample_file)
    print(f"源模态 {source_modality} 数据形状: {data.shape}")
    print(f"数据维度: {data.ndim}D")

# 检查目标模态
target_path = os.path.join(dataset_dir, target_modality, split)
files = os.listdir(target_path)
if files:
    sample_file = os.path.join(target_path, files[0])
    data = np.load(sample_file)
    print(f"目标模态 {target_modality} 数据形状: {data.shape}")
    print(f"数据维度: {data.ndim}D")
