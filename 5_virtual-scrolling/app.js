document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.getElementById('scrollContainer');
    const content = document.getElementById('content');
    const itemHeight = 30; // Chiều cao của mỗi phần tử
    const totalItems = 1000; // Tổng số phần tử
    const overscan = 4; // Render thêm phần để tránh "giật" khi cuộn nhanh
    const visibleCount = 24;

    // Tạo một mảng các phần tử
    const items = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);

    // Thiết lập chiều cao của content (spacer tạo đúng chiều cao tổng)
    content.style.height = `${totalItems * itemHeight}px`;

    // Tối đa 1 lần render mỗi frame — tránh render dư thừa khi scroll event bắn liên tục
    let ticking = false;
    function renderItems() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrollTop = scrollContainer.scrollTop;
            const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
            const endIndex = Math.min(totalItems, startIndex + visibleCount + overscan * 2);

            content.innerHTML = '';

            for (let i = startIndex; i < endIndex; i++) {
                const item = document.createElement('div');
                item.className = 'item';
                item.style.top = `${i * itemHeight}px`;
                item.style.height = `${itemHeight}px`;
                item.textContent = items[i];
                content.appendChild(item);
            }
            ticking = false;
        });
    }

    // passive: true — báo cho browser biết không gọi preventDefault, scroll mượt hơn
    scrollContainer.addEventListener('scroll', renderItems, { passive: true });

    // Render các phần tử ban đầu
    renderItems();
});
