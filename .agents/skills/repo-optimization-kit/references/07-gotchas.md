# 07 · 踩坑合集（按出现频率排序）

> 这些坑都真实发生过。遇到症状直接查表，不要重新试错。

## 认证与权限

| 症状 | 根因 | 解法 |
|---|---|---|
| `403 Resource not accessible by integration`（改名/改描述/topics） | GitHub App user token（`ghu_`）无 `Administration: write` | 交给用户网页操作；不要反复重试 |
| `createRepository` 403 | 同上，App 无建仓权 | 用户网页建仓：`github.com/new?name=...&description=...` |
| 新仓库 push 403 | App 安装范围不含新仓库 | Settings → Installations → Repository access → All repos |
| `could not read Username for 'https://github.com'` | 凭证 helper 未配置 | `gh auth setup-git`，或 `git push https://x-access-token:$TOKEN@github.com/{o}/{r}.git` |
| `Invalid username or token` | 重新授权导致旧 token 失效 | Device Flow 重新授权 |
| 网页 2FA 卡死 | 无验证器 | 让用户在本机浏览器完成 Device Flow |

Device Flow 标准端点（**注意不是 `/oauth/access_token`**）：

```bash
curl -s -X POST https://github.com/login/device/code -H "Accept: application/json" \
  -d "client_id={ID}&scope=repo"
# 用户打开 verification_uri 输入 user_code
curl -s -X POST https://github.com/login/oauth/access_token -H "Accept: application/json" \
  -d "client_id={ID}&device_code={CODE}&grant_type=urn:ietf:params:oauth:grant-type:device_code"
```

## 改名 / 迁移

- GitHub 改名后 **301 保留**：`github.com/old`、`raw.githubusercontent.com/old/...` 都还能用
- **但像素里的旧名字不会跳转**：README 配图、宣传片片尾、社交预览图必须重做
- badge 指向旧仓库时，改名初期建议先推送再验证，或者等等再发（中间会短暂 404）
- 本地目录名不必跟仓库名一致；一致了脚本里的绝对路径要一起改

## GitHub 渲染

| 症状 | 原因 |
|---|---|
| 目录点了跳错位置 | emoji 标题的锚点会去掉 emoji 并留一个前导 `-` |
| 图片裂开 | 用了绝对路径或大小写不一致（Linux 区分大小写） |
| 表格错位 | 单元格里有 `|` 未转义 |
| `<details>` 里代码块不渲染 | 空行不足；`<details>` 与内容之间要留空行 |
| README 里的 HTML 被吞 | GitHub 会过滤 `style`、`script`、部分 `class` |

## CI

- `ruff check .` 全量会把风格问题也报出来 → 统一用 `--select F,E9`
- CI 里跑完整业务流程会超时 → 只跑零成本/秒级路径
- `pytest` 报 "no tests ran"：仓库里根本没有测试，返回码仍是 0，但没有任何保障
- 未使用的 import（`F401`）是最常见的红色 CI 原因——本地先跑一遍

## Shell / 环境

- **zsh 不对未加引号变量分词**：`$cmd="scan --help"` 会变成一个参数，用 `bash -c` 包裹
- `zsh: no matches found: *.sh`：glob 没匹配到文件，加 `setopt null_glob` 或用 `find`
- 沙箱里 `python -m pkg` 报模块不存在：cwd 不在仓库根目录
- 无头 Chrome 必须带 `--no-sandbox --disable-gpu --hide-scrollbars`；否则截图空白或尺寸不对

## 视觉资产

- GIF 超 1 MB：先降 fps，再降色板，最后降尺寸
- 中文变方块：宿主机无 CJK 字体，`fc-list | grep -i cjk` 确认
- PNG 糊：没有 `--force-device-scale-factor=2`
- 社交预览图改完不生效：GitHub 有 CDN 缓存，换文件名或等几分钟

## 视频

- 时长 30.1 而不是 30.0：编码器补齐；`-t 30.000` 硬截断
- 响度不达标：`loudnorm=I=-14:TP=-1.5:LRA=5`
- 片尾地址错：改名后必须重渲染，抽帧核对
- 字幕/文字在手机上太小：导出后缩到 390px 宽自查

## 内容合规

- **`.gitignore` 本身会被推送**：里面写具体目标域名 = 变相泄露客户身份
  - 公开 `.gitignore` 只写泛化规则（`evidence*/`、`*.log`、`.env`）
  - 具体文件名放 `.git/info/exclude`（纯本地，永不推送）
- 案例必须脱敏：站点代号、删除联系方式、数字可保留
- 演示内容必须真实：编造的终端输出比没有演示更糟
- 提交前扫密钥：`git diff --cached | grep -inE "sk-[A-Za-z0-9]{16,}|gh[pousr]_|AKIA"`

## 依赖与发布

- 本地缺依赖导致 `python -m pkg` 直接 ImportError（CI 装了但本地没装）
- 打包漏文件：`MANIFEST.in` 需要显式包含 `data/`、`examples/`、模板
- 版本两处维护：`pyproject` 用 `dynamic`，只留 `__version__`
