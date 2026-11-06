# 03: 首页个人经历、真实专辑黑胶唱片架与真实书库 3D 叠书架 (Experience, VinylShelf & 3D Bookshelf)

**Status:** Done
**Blocked by:** 01-global-shell-dock-and-colophon.md

## Goal

建立强类型的个人配置表 `lib/personal.ts`，并在首页下半屏 1:1 复刻 `cali.so` 的三大个人品味模块：`01 // 经历`（时间轴 + 坐标地图卡）、`03 // 循环播放中`（`VinylShelf` 6 张网易云真实官方专辑封面 + 滑出旋转黑胶 + 跳转网易云单曲页）、`04 // 珍藏书架`（`Bookshelf` 8 本真实原版书籍封面 + CSS 3D 书脊/书页/封面立体翻转 + 跳转正版搜索页）。

## Acceptance Criteria

- [x] `lib/personal.ts` 完整收录 6 张真实音乐唱片数据（坂本龙一《Merry Christmas Mr. Lawrence》、小野《山野煮水》、韩安旭《多幸运》、《解药》、GALA《追梦赤子心》、汪苏泷《就让这大雨全都落下》）与 8 本真实书籍数据（《史蒂夫·乔布斯传》《原则》《思考，快与慢》《价值心法》《纳瓦尔宝典》《富兰克林自传》《穷查理宝典》《刻意练习》）。
- [x] 1:1 复刻 `components/vinyl-shelf.tsx`：桌面端展示唱片脊与选中态黑胶唱盘滑出旋转动画，展示「开心时听 / 学习时听 / 放松时听」心情评注，点击跳转对应网易云音乐官方单曲链接。
- [x] 1:1 复刻 `components/bookshelf.tsx`：桌面端展示 8 本书的立体书脊排列，点击抽出一本书并做 3D 翻转展示 `public/images/books/*.jpg` 真实封面、纸张厚度与阅读评注，点击链接跳转 `https://z-library.sk/s/...`。

## Test Cases

- **Happy path:** 单元测试校验 `lib/personal.ts` 中全部 8 本书籍的 `cover` 路径对应 `public/images/books/` 下的真实存在文件，且 `url` 指向 `z-library.sk`。
- **Happy path:** 单元测试校验 `lib/personal.ts` 中全部 6 张唱片的 `cover` 路径对应 `public/images/records/` 下的真实存在文件，且 `url` 指向 `music.163.com`。
- **Edge case:** 切换不同书籍或黑胶唱片时，上一张选中项平滑归位，新选中项正确更新底部详情卡片文案与外链。

## Out of Scope

- 文章 MDX 解析与文章详情页（在 04 号工单中实现）。
