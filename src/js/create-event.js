document.addEventListener('DOMContentLoaded', () => {
    // Form state management
    let currentStep = 1;
    const totalSteps = 4;
    let formData = JSON.parse(localStorage.getItem('eventFormData')) || {};

    // Elements
    const steps = document.querySelectorAll('.step');
    const progressBar = document.querySelector('.progress');
    const forms = document.querySelectorAll('.step-form');
    
    // Auto-save functionality
    const autoSave = (formId) => {
        const form = document.getElementById(formId);
        const formInputs = form.querySelectorAll('input, select, textarea');
        
        formInputs.forEach(input => {
            input.addEventListener('change', () => {
                const formValues = {};
                formInputs.forEach(input => {
                    formValues[input.id] = input.value;
                });
                formData[formId] = formValues;
                localStorage.setItem('eventFormData', JSON.stringify(formData));
            });
        });
    };

    // Load saved data
    const loadSavedData = (formId) => {
        if (formData[formId]) {
            const form = document.getElementById(formId);
            Object.keys(formData[formId]).forEach(key => {
                const input = form.querySelector(`#${key}`);
                if (input) input.value = formData[formId][key];
            });
        }
    };

    // Update progress
    const updateProgress = (step) => {
        const progress = ((step - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progress}%`;
        
        steps.forEach((stepEl, index) => {
            if (index + 1 === step) {
                stepEl.classList.add('active');
            } else if (index + 1 < step) {
                stepEl.classList.add('completed');
            } else {
                stepEl.classList.remove('active', 'completed');
            }
        });
    };

    // Handle file upload
    const initializeFileUpload = () => {
        const uploadArea = document.querySelector('.upload-area');
        const fileInput = document.getElementById('eventBanner');

        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length) {
                fileInput.files = files;
                handleFileSelect(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                handleFileSelect(e.target.files[0]);
            }
        });
    };

    const handleFileSelect = (file) => {
        const uploadArea = document.querySelector('.upload-area');
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadArea.innerHTML = `
                    <img src="${e.target.result}" alt="Preview" style="max-height: 200px;">
                    <p>${file.name}</p>
                `;
            };
            reader.readAsDataURL(file);
        }
    };

    // Initialize Google Maps
    const initializeMap = () => {
        const locationInput = document.getElementById('eventLocation');
        const mapElement = document.getElementById('map');

        if (window.google && mapElement) {
            const map = new google.maps.Map(mapElement, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8
            });

            const autocomplete = new google.maps.places.Autocomplete(locationInput);
            autocomplete.bindTo('bounds', map);

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.geometry) {
                    map.setCenter(place.geometry.location);
                    map.setZoom(15);

                    new google.maps.Marker({
                        map,
                        position: place.geometry.location
                    });
                }
            });
        }
    };

    // Toggle buttons functionality
    const initializeToggles = () => {
        const toggleButtons = document.querySelectorAll('.toggle-btn');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                btn.parentElement.querySelectorAll('.toggle-btn').forEach(b => {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
            });
        });
    };

    // Form validation
    const validateForm = (formId) => {
        const form = document.getElementById(formId);
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    };

    // Initialize event handlers
    const initializeEventHandlers = () => {
        // Next step buttons
        document.querySelectorAll('.next-step').forEach(btn => {
            btn.addEventListener('click', () => {
                const currentForm = `step${currentStep}Form`;
                if (validateForm(currentForm)) {
                    currentStep++;
                    updateProgress(currentStep);
                    // Show next form
                }
            });
        });

        // Previous step buttons
        document.querySelectorAll('.prev-step').forEach(btn => {
            btn.addEventListener('click', () => {
                currentStep--;
                updateProgress(currentStep);
                // Show previous form
            });
        });

        // Save draft
        document.querySelector('.secondary-btn').addEventListener('click', () => {
            // Save current form state
            const formId = `step${currentStep}Form`;
            autoSave(formId);
            // Show success message
            alert('Draft saved successfully!');
        });

        // Preview button
        document.querySelector('.preview-btn')?.addEventListener('click', () => {
            // Implement preview functionality
        });

        // Publish button
        document.querySelector('.publish-btn')?.addEventListener('click', () => {
            // Implement publish functionality
        });
    };

    // Initialize everything
    const initialize = () => {
        loadSavedData('eventDetailsForm');
        initializeFileUpload();
        initializeMap();
        initializeToggles();
        initializeEventHandlers();
        updateProgress(currentStep);
    };

    initialize();
});