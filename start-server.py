#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简单的HTTP服务器，用于本地开发测试
解决CORS问题，支持FBX文件加载
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import unquote

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加CORS头
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        
        # 为FBX文件设置正确的MIME类型
        if self.path.endswith('.fbx'):
            self.send_header('Content-Type', 'application/octet-stream')
        elif self.path.endswith('.fbm'):
            self.send_header('Content-Type', 'application/octet-stream')
        
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        # 自定义日志格式
        print(f"[{self.log_date_time_string()}] {format % args}")

def main():
    PORT = 8000
    
    # 确保在正确的目录中运行
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    print(f"启动HTTP服务器...")
    print(f"端口: {PORT}")
    print(f"目录: {os.getcwd()}")
    print(f"访问地址: http://localhost:{PORT}")
    print(f"产品页面: http://localhost:{PORT}/product.html")
    print(f"测试页面: http://localhost:{PORT}/test-3d-model.html")
    print("按 Ctrl+C 停止服务器")
    print("-" * 50)
    
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")
    except OSError as e:
        if e.errno == 10048:  # Windows: Address already in use
            print(f"错误: 端口 {PORT} 已被占用")
            print("请尝试关闭其他使用该端口的程序，或修改端口号")
        else:
            print(f"错误: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
