(function() {
    let notificationElement = null;
    let notificationTimer = null;

    function createNotificationElement() {
        const element = document.createElement('div');
        element.id = 'custom-notification';
        element.innerHTML = `
            <div class="icon"></div>
            <div class="message"></div>
            <div class="progress-bar">
                <div class="progress-bar-inner"></div>
            </div>
        `;
        document.body.appendChild(element);
        return element;
    }

    window.showNotification = function({ type = 'info', message = '', duration = 5000 }) {
        if (!notificationElement) {
            notificationElement = createNotificationElement();
        }

        if (notificationTimer) {
            clearTimeout(notificationTimer);
        }

        notificationElement.className = type;
        notificationElement.querySelector('.message').textContent = message;

        const iconMap = {
            success: '✅',
            error: '❌',
            info: 'ⓘ',
            warning: '⚠️'
        };
        notificationElement.querySelector('.icon').textContent = iconMap[type] || 'ℹ';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                notificationElement.classList.add('show');
            });
        });

        notificationTimer = setTimeout(() => {
            notificationElement.classList.remove('show');
        }, duration);
    };
})();
