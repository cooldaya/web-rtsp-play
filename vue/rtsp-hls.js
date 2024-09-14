const server_url = window.trans_rtsp_server || "http://localhost";
const api_server = `${server_url}:9997`; // rtsp转流服务地址
const stream_server = `${server_url}:8888`; // 转流服务结果地址

const reqs = {
  getOnePath: async (streamId) => {
    return await fetch(`${api_server}/v3/paths/get/${streamId}`);
  },
  setOnePath: async (streamId, source, toh264 = false) => {
    // 当需要转h264时，需要服务端支持ffmpeg转码环境，并通过8554端口发送到 mediamtx管理
    const payload = toh264
      ? {
          runOnInit: `
            ffmpeg -rtsp_transport tcp -i ${source} \
            -c:v libx264 -b:v 1024k -preset ultrafast \
            -bf 0 \
            -f rtsp rtsp://localhost:8554/${streamId}`,
          runOnReadRestart: true,
        }
      : { source };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const res = await fetch(
      `${api_server}/v3/config/paths/add/${streamId}`,
      requestOptions
    );
    return res;
  },
  delOnePath: async (streamId) => {
    fetch(`${api_server}/v3/config/paths/delete/${streamId}`);
  },
};

/**
 *
 * @param {*} str 字符串
 * @returns 生成的哈希值
 */
function hashCode(str) {
  // 使用URL的哈希值生成唯一ID
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

/**
 *
 * @param {*} rtsp_url rtsp地址
 * @returns 返回一个唯一的 streamId
 */
function getUUID(rtsp_url) {
  // 根据url生成 streamId
  return Math.abs(hashCode(rtsp_url)).toString(36);
}

const timers = [];
// rtsp->hls 确认发起了转流，返回地址

export async function startRtspToHls(rtsp_url, toh264 = false) {
  const streamId = getUUID(rtsp_url);
  if (timers[streamId]) {
    clearTimeout(timers[streamId]);
  }
  const res = await reqs.getOnePath(streamId);
  if (!res.ok) {
    await reqs.setOnePath(streamId, rtsp_url, toh264);
  }
  return {
    iframe: `${stream_server}/${streamId}`,
    hls: `${stream_server}/${streamId}/index.m3u8`,
  };
}
