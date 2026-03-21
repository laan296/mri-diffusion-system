import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import uuid

app = Flask(__name__)
# 允许跨域请求（React 默认 5173, Flask 默认 5000）
CORS(app)

# 配置路径
UPLOAD_FOLDER = 'static/uploads'
RESULT_FOLDER = 'static/results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

# 加载 YOLO 模型（初次运行会自动下载 yolov8n.pt）
model = YOLO('yolov8n.pt') 

@app.route('/api/generate', methods=['POST'])
def generate_mri():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    file = request.files['image']
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    
    # 1. 保存原始文件
    input_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(input_path)
    
    # 2. 调用 YOLO 进行推理 (模拟医疗影像转化)
    # 这里 YOLO 会在图片上画框，以此替代复杂的扩散模型生成
    results = model(input_path)
    
    # 3. 保存检测后的图片
    result_path = os.path.join(RESULT_FOLDER, unique_filename)
    # results[0].plot() 返回的是 numpy 数组 (BGR)
    res_img = results[0].plot() 
    cv2.imwrite(result_path, res_img)
    
    # 4. 返回结果图片的 URL
    # 注意：这里返回的是相对前端可以访问的路径
    return jsonify({
        "success": True,
        "result_url": f"http://127.0.0.1:5000/static/results/{unique_filename}",
        "message": "Detection completed as a placeholder for Diffusion"
    })

# 配置静态文件访问，让前端能看到图片
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True, port=5000)