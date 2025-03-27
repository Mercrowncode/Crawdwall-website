document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const copyBtn = document.getElementById('copyLink');
    const whatsappLink = document.getElementById('whatsappLink');
    const initialResponse = document.getElementById('initialResponse');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const initialPreview = document.getElementById('initialPreview');
    const thankYouPreview = document.getElementById('thankYouPreview');

    // Copy Link Functionality
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(whatsappLink.value);
            showCopyConfirmation(copyBtn);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    });

    const showCopyConfirmation = (button) => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
    };

    // Variable Insertion
    const toolbarButtons = document.querySelectorAll('.toolbar-btn');
    toolbarButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const variable = btn.dataset.variable;
            const targetTextarea = btn.closest('.message-editor').querySelector('textarea');
            insertAtCursor(targetTextarea, `[${variable}]`);
            updatePreview(targetTextarea);
        });
    });

    const insertAtCursor = (textarea, text) => {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        const before = textarea.value.substring(0, startPos);
        const after = textarea.value.substring(endPos);
        
        textarea.value = before + text + after;
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = startPos + text.length;
    };

    // Live Preview
    const updatePreview = (textarea) => {
        const previewDiv = textarea.closest('.message-editor')
            .querySelector('.preview-message');
        let previewText = textarea.value;

        // Replace variables with sample values
        const sampleData = {
            'event-name': 'Tech Conference 2024',
            'ticket-link': 'https://wa.me/1234567890',
            'event-date': 'March 15, 2024',
            'ticket-price': '₦5,000',
            'buyer-name': 'John',
            'ticket-qty': '2'
        };

        Object.entries(sampleData).forEach(([key, value]) => {
            const regex = new RegExp(`\\[${key}\\]`, 'g');
            previewText = previewText.replace(regex, value);
        });

        previewDiv.textContent = previewText;
    };

    // Initialize previews
    const initializePreviews = () => {
        updatePreview(initialResponse);
        updatePreview(thankYouMessage);
    };

    // Live preview updates
    initialResponse.addEventListener('input', () => updatePreview(initialResponse));
    thankYouMessage.addEventListener('input', () => updatePreview(thankYouMessage));

    // Download QR Code
    const downloadQRBtn = document.querySelector('.download-qr');
    downloadQRBtn.addEventListener('click', () => {
        const qrImage = document.querySelector('.qr-code img');
        const link = document.createElement('a');
        link.download = 'whatsapp-qr.png';
        link.href = qrImage.src;
        link.click();
    });

    // Save Settings
    const saveBtn = document.querySelector('.save-btn');
    saveBtn.addEventListener('click', () => {
        const settings = {
            whatsappLink: whatsappLink.value,
            initialResponse: initialResponse.value,
            thankYouMessage: thankYouMessage.value
        };

        localStorage.setItem('whatsappSettings', JSON.stringify(settings));
        showSaveConfirmation();
    });

    const showSaveConfirmation = () => {
        const toast = document.createElement('div');
        toast.className = 'save-confirmation';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Settings saved successfully!</span>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    // Load saved settings
    const loadSavedSettings = () => {
        const saved = localStorage.getItem('whatsappSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            whatsappLink.value = settings.whatsappLink;
            initialResponse.value = settings.initialResponse;
            thankYouMessage.value = settings.thankYouMessage;
            initializePreviews();
        }
    };

    // Initialize
    loadSavedSettings();
    initializePreviews();
});