# Technical Scrolling — Hiệu ứng cuộn trang web

## Tổng quan

Folder này chứa demo các kỹ thuật scrolling tạo trải nghiệm tương tác cho web.

## Các kỹ thuật

| Kỹ thuật | Mô tả | Code |
|-----------|--------|------|
| Scrollytelling | Nội dung kích hoạt theo vị trí cuộn | `1_scrollytelling-demo/` |
| Parallax Stacking | Hiệu ứng chiều sâu khi cuộn | `2_parallax-stacking/` |
| Scroll Jacking | Chặn cuộn tự nhiên, điều khiển bằng JS | `3_scroll-jacking/` ⚠️ |
| Curtain Effect | Parallax theo chiều ngang | `4_curtain-effect/` |
| Virtual Scrolling | Render chỉ item hiển thị, hiệu năng cao | `5_virtual-scrolling/` |

## ⚠️ Scroll Jacking — Anti-pattern 2025+

`wheel` + `preventDefault()` để chặn cuộn tự nhiên **đã là anti-pattern**. Tác hại:
- Phá accessibility (người dùng mất kiểm soát cuộn)
- Không tương thích touchpad gestures
- Xung đột với trình đọc màn hình
- WCAG 2.1 SC 2.1.2 (No Keyboard Trap - ok) nhưng gây frustration nặng cho người dùng

**Thay thế bằng:**

### CSS `scroll-driven animations` (2023-2025+)
Không cần JS, chạy off-main-thread, hiệu năng cao. Browser support 2026: **Chrome 115+, Firefox 123+, Safari 26+** (87% toàn cầu).

```css
/* Reveal animation khi element vào viewport */
@keyframes slide {
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.el {
  animation: slide linear both;
  animation-timeline: view();
}

/* Scroll progress bar */
@keyframes expand {
  from { width: 0; }
  to { width: 100%; }
}
.progress {
  animation: expand linear both;
  animation-timeline: scroll();
}

/* Ưu tiên reduced motion */
@media (prefers-reduced-motion: reduce) {
  .el { animation: none; }
}
```

### `IntersectionObserver` cho entrance effects
Nhẹ, chạy off-main-thread, callback chỉ fire khi element thực sự visible.

```javascript
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    io.unobserve(e.target); // reveal một lần, ngừng observe
  });
}, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));
```

### CSS `content-visibility` cho long lists
Browser native, tự động skip render off-screen.

```css
/* CSS content-visibility — tự động skip render off-screen */
.list-item { content-visibility: auto; contain-intrinsic-size: 0 80px; }
```

### 2026 Preview: CSS Scroll-Triggered Animations
Chrome 145+ hỗ trợ `animation-trigger` và `timeline-trigger` — animation thời gian-không-đổi nhưng được trigger bởi scroll position. Tương tự IntersectionObserver nhưng thuần CSS.

## Virtual Scrolling — Thư viện đề xuất 2026

| Thư viện | Đặc điểm |
|-----------|-----------|
| **TanStack Virtual** | Framework-agnostic, ~6KB, hỗ trợ dynamic heights, 14.7M downloads/week |
| **react-virtualized** | React, ổn định |
| **vue-virtual-scroller** | Vue 3, nhiều features |
| **CSS content-visibility** | CSS thuần, browser native, tốt cho long lists |

```tsx
// TanStack Virtual - React example
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: 10000,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 35,
});
// Render only visible items — 60fps với 100k items
```

## Checklist khi dùng scroll animations

- [ ] Animation hoàn thành trong viewport, không cần scroll position chính xác
- [ ] Nội dung visible mặc định (không ẩn bằng CSS nếu JS fail)
- [ ] `@media (prefers-reduced-motion: reduce)` được hỗ trợ
- [ ] Chỉ animate `transform` và `opacity` (compositor-only, off main thread)
- [ ] IntersectionObserver: `unobserve()` sau khi reveal để tránh memory leak
- [ ] Tránh Scroll Jacking — user phải giữ quyền kiểm soát cuộn

## Refs
- https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline
- https://tanstack.com/virtual
- https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility
- https://caniuse.com/wf-scroll-driven-animations
- https://web-platform-dx.github.io/web-features-explorer/features/scroll-driven-animations/
- https://www.w3.org/WAI/WCAG22/quickref/ (WCAG 2.2)
