# WeTalk - 微信风格桌面即时通讯解决方案

**跨平台/安全通信/高性能架构**

[![Electron Version](https://img.shields.io/badge/Electron-28.0.0-blue)]()
[![WebRTC Support](https://img.shields.io/badge/WebRTC-Stable-green)]()
[![E2EE](https://img.shields.io/badge/Encryption-End--to--End-brightgreen)]()

## 🚀 项目概述
高度还原微信桌面端的现代化IM实现方案，主要特性包括：
- **原生级体验**: 1:1复刻微信的消息气泡、侧边栏导航、毛玻璃效果等视觉交互
- **多协议支持**: 集成TCP+WebSocket双通道通信，自动切换保障消息可达性
- **安全通信**: 基于Signal协议改进的端到端加密(E2EE)体系，支持会话密钥轮换
- **高性能架构**: 采用LevelDB+Redis多级缓存，实测支持万级群聊消息分发
- **全媒体支持**: 文本/表情/文件传输/实时音视频通话（1080P）一体化解决方案

## 🌟 核心功能
| 模块            | 技术实现                                                                 |
|-----------------|--------------------------------------------------------------------------|
| **即时通讯**    | WebSocket长连接+消息队列持久化，支持撤回/已读状态同步                    |
| **文件传输**    | 分片上传+断点续传，P2P直连传输优化                                       |
| **音视频通话**  | WebRTC+SFU架构，支持1080P分辨率/回声消除/降噪                            |
| **消息存储**    | MongoDB分片集群+LevelDB本地缓存，消息检索响应<100ms                      |
| **安全体系**    | 双棘轮算法加密+HMAC消息认证，支持前向保密和后向安全                      |
| **扩展功能**    | 聊天记录迁移/敏感词实时过滤/多设备同步/朋友圈时间线                      |

## 🛠️ 技术架构
```bash
.
├── electron-core      # 主进程(IPC通信/系统集成)
├── react-ui           # 渲染进程(Redux+TailwindCSS)
├── protocol           # 通信协议(Protobuf定义)
├── service-core       # 核心服务(消息路由/会话管理)
├── e2ee-engine        # 加密引擎(WASM优化)
└── media-server       # 媒体服务(SFU+Turn Server)
