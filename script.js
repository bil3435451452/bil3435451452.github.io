  // Мобильное меню
  document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.innerHTML = nav.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Закрытие мобильного меню после клика
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
    
    // Параллакс эффект для героя
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        const hero = document.querySelector('.hero ');
        if (hero) {
            hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const indicators = document.querySelectorAll('.indicator');
    const autoToggle = document.getElementById('auto-toggle');
    const autoStatus = document.querySelector('.auto-status');
    
    let slideWidth = slides[0].offsetWidth + 30; // width + margin
    let currentIndex = 0;
    let slideCount = slides.length;
    let autoSlideInterval;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    const swipeThreshold = 50; // Порог для определения свайпа
    
    // Инициализация слайдера
    function initSlider() {
        slideWidth = slides[0].offsetWidth + 30;
        track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
        updateIndicators();
    }
    
    // Обновление индикаторов
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Переход к слайду
    function goToSlide(index, animate = true) {
        if (index < 0) index = slideCount - 1;
        if (index >= slideCount) index = 0;
        
        currentIndex = index;
        
        if (animate) {
            track.style.transition = 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
        } else {
            track.style.transition = 'none';
        }
        
        track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
        updateIndicators();
    }
    
    // Следующий слайд
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // Предыдущий слайд
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Автоматическое переключение
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 5000);
        autoStatus.textContent = "Вкл";
        autoStatus.classList.add('auto-active');
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
        autoStatus.textContent = "Выкл";
        autoStatus.classList.remove('auto-active');
    }
    
    // Обработчики событий для кнопок
    nextBtn.addEventListener('click', () => {
        nextSlide();
        if (autoToggle.checked) {
            stopAutoSlide();
            setTimeout(startAutoSlide, 10000);
        }
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        if (autoToggle.checked) {
            stopAutoSlide();
            setTimeout(startAutoSlide, 10000);
        }
    });
    
    autoToggle.addEventListener('change', () => {
        if (autoToggle.checked) {
            startAutoSlide();
        } else {
            stopAutoSlide();
        }
    });
    
    // Клики по индикаторам
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            if (autoToggle.checked) {
                stopAutoSlide();
                setTimeout(startAutoSlide, 10000);
            }
        });
    });
    
    // Ресайз окна
    window.addEventListener('resize', initSlider);
    
    // ===================== Свайп для мобильных =====================
    // Начало касания
    track.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        currentX = startX;
        track.classList.add('grabbing');
        
        // Останавливаем автопрокрутку при ручном управлении
        if (autoToggle.checked) stopAutoSlide();
    });
    
    // Движение пальцем
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        
        // Если пользователь пытается скроллить вертикально, отменяем свайп
        if (Math.abs(diff) < 10) return;
        
        e.preventDefault(); // Предотвращаем скролл страницы
        
        // Вычисляем смещение с учетом инерции
        const offset = -currentIndex * slideWidth + diff;
        track.style.transform = `translateX(${offset}px)`;
        track.style.transition = 'none';
    });
    
    // Завершение касания
    track.addEventListener('touchend', () => {
        if (!isDragging) return;
        
        isDragging = false;
        track.classList.remove('grabbing');
        
        const diff = currentX - startX;
        
        // Определяем, был ли свайп
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Свайп вправо - предыдущий слайд
                prevSlide();
            } else {
                // Свайп влево - следующий слайд
                nextSlide();
            }
        } else {
            // Возвращаемся к текущему слайду
            goToSlide(currentIndex);
        }
        
        // Возобновляем автопрокрутку, если она была включена
        if (autoToggle.checked) {
            setTimeout(startAutoSlide, 10000);
        }
    });
    
    // Также добавим обработчики для мыши, чтобы можно было тестировать на ПК
    track.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        currentX = startX;
        track.classList.add('grabbing');
        
        if (autoToggle.checked) stopAutoSlide();
    });
    
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        currentX = e.clientX;
        const diff = currentX - startX;
        
        if (Math.abs(diff) < 10) return;
        
        const offset = -currentIndex * slideWidth + diff;
        track.style.transform = `translateX(${offset}px)`;
        track.style.transition = 'none';
    });
    
    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        
        isDragging = false;
        track.classList.remove('grabbing');
        
        const diff = currentX - startX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            goToSlide(currentIndex);
        }
        
        if (autoToggle.checked) {
            setTimeout(startAutoSlide, 10000);
        }
    });
    
    // Запуск слайдера
    initSlider();
    startAutoSlide();
});