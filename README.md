1.start-convert-server.bat 启用mediamtx转码服务器
2.gen-rtsp.bat 将当前路径下的test.mp4生成rtsp流 rtsp://localhost:8554/mystream

z-main.bat 综合上面两个



// 项目中直接使用（不需要生成测试的rtsp流）
   双击 start-convert-server.bat 启用mediamtx转码服务器 部署时也只需要（mediamtx_v1.9.0_windows_amd64 文件夹）
   然后直接使用 kt-rtsp-player.vue 组件


这里没有提交  ffmpeg(https://ffmpeg.org/)、mediamtx.exe(https://github.com/bluenviron/mediamtx/releases/tag/v1.9.0)
需要自行下载
