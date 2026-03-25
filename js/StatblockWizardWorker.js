if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
            console.log('Service worker already registered:', registration);
        } else {
            navigator.serviceWorker.register('js/service-worker.js')
                .then((registration) => {
                    console.log('Service worker registration succeeded:', registration);
                })
                .catch((error) => {
                    console.error('Service worker registration failed:', error);
                });
        }
    });
} else {
    console.error('Service workers are not supported.');
}