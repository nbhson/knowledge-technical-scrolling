document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.getElementById('scrollContainer');
    const content = document.getElementById('content');
    const itemHeight = 30; // Chiều cao của mỗi phần tử
    const totalItems = 1000; // Tổng số phần tử

    // Tạo một mảng các phần tử
    const items = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);

    // Thiết lập chiều cao của content
    content.style.height = `${totalItems * itemHeight}px`;

    // Hàm render các phần tử trong viewport
    function renderItems() {
        const scrollTop = scrollContainer.scrollTop;
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight));
        const endIndex = Math.min(totalItems, startIndex + 24);

        console.log(scrollTop, startIndex, endIndex);
        
        content.innerHTML = '';

        for (let i = startIndex; i < endIndex; i++) {
            const item = document.createElement('div');
            item.className = 'item';
            item.style.top = `${i * itemHeight}px`;
            item.style.height = `${itemHeight}px`;
            item.textContent = items[i];
            content.appendChild(item);
        }
    }

    // Lắng nghe sự kiện cuộn
    scrollContainer.addEventListener('scroll', renderItems);

    // Render các phần tử ban đầu
    renderItems();
});