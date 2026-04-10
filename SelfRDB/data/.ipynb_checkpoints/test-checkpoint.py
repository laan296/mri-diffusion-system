import numpy as np
import nibabel as nib
from PIL import Image
from pathlib import Path
import zipfile
import tempfile

# ============ 主程序 - 简化版 ============
if __name__ == "__main__":
    
    # 设置ZIP文件路径
    zip_path = Path("/mnt/workspace/mri-diffusion-system/SelfRDB/data/BraTS2021_00017.zip")
    output_dir = Path("/mnt/workspace/mri-diffusion-system/SelfRDB/data")
    
    print("开始处理...")
    
    # 创建临时目录
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        
        # 解压ZIP文件
        print(f"正在解压: {zip_path}")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(temp_path)
        
        # 查找T1和T2文件
        t1_files = list(temp_path.rglob("*t1.nii.gz"))
        t2_files = list(temp_path.rglob("*t2.nii.gz"))
        
        # 处理T1
        if t1_files:
            print(f"找到T1文件: {t1_files[0].name}")
            img = nib.load(t1_files[0])
            data = img.get_fdata()
            middle_slice = data.shape[2] // 2
            slice_2d = data[:, :, middle_slice]
            slice_2d = ((slice_2d - slice_2d.min()) / (slice_2d.max() - slice_2d.min() + 1e-8) * 255).astype(np.uint8)
            Image.fromarray(slice_2d).save(output_dir / "t1_middle.jpg")
            print("已保存: t1_middle.jpg")
        
        # 处理T2
        if t2_files:
            print(f"找到T2文件: {t2_files[0].name}")
            img = nib.load(t2_files[0])
            data = img.get_fdata()
            middle_slice = data.shape[2] // 2
            slice_2d = data[:, :, middle_slice]
            slice_2d = ((slice_2d - slice_2d.min()) / (slice_2d.max() - slice_2d.min() + 1e-8) * 255).astype(np.uint8)
            Image.fromarray(slice_2d).save(output_dir / "t2_middle.jpg")
            print("已保存: t2_middle.jpg")
    
    print("\n完成！")
    print(f"输出目录: {output_dir}")
    print("生成文件: t1_middle.jpg, t2_middle.jpg")