#!/bin/bash

# ====== 运行脚本 ======

# 针对当前的cuda 消除运行前的警告
# 8.6对应RTX 30系列显卡(如RTX 3090, 3080等)
export TORCH_CUDA_ARCH_LIST="8.6"

# 配置文件路径
CONFIG="config.yaml"
# 日志名称
EXP_NAME="SelfRDB_fit"
# 数据集路径
DATA_DIR="/mnt/sdb/zhangxiaobo/Sit/data/BraTS2021_SelfRDB"
SOURCE="t1"
TARGET="t2"
# 训练批次的样本数
BS_TRAIN=4
# 验证时每个批次的样本数
BS_VAL=4
# 测试批次的样本数
BS_TEST=8
N_EPOCHS=300
CKPT_PATH="/mnt/sdb/zhangxiaobo/Sit/SelfRDB/logs/brats_t1_t2.ckpt"
DEVICES=0,1,2,3  # 使用第1个GPU

# python main.py fit \
#     --config $CONFIG \
#     --trainer.logger.name $EXP_NAME \
#     --data.dataset_dir $DATA_DIR \
#     --data.source_modality $SOURCE \
#     --data.target_modality $TARGET \
#     --data.train_batch_size $BS_TRAIN \
#     --data.val_batch_size $BS_VAL \
#     --trainer.max_epoch $N_EPOCHS \
#     --trainer.devices=$DEVICES
    # --ckpt_path $CKPT_PATH

python main.py test \
    --config $CONFIG \
    --data.dataset_dir $DATA_DIR \
    --data.source_modality $SOURCE \
    --data.target_modality $TARGET \
    --data.test_batch_size $BS_TEST \
    --model.eval_mask=false \
    --model.eval_subject=false \
    --ckpt_path $CKPT_PATH \
    --trainer.devices [0]