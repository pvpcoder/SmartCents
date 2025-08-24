const skillPaths = [
    {
        id: 'cooking',
        title: 'Cooking Basics',
        emoji: '🍳',
        description: 'Master essential cooking skills for independent living',
        steps: [
            {
                id: 1,
                title: 'Kitchen Safety & Tools',
                description: 'Learn essential kitchen safety rules and basic tools',
                videoUrl: 'https://www.youtube.com/embed/Y7D90UJbCg0',
                checklist: [
                    'Know basic knife safety',
                    'Understand stove and oven safety',
                    'Identify essential kitchen tools',
                    'Learn proper food storage'
                ]
            },
            {
                id: 2,
                title: 'Making a Simple Breakfast',
                description: 'Start your day right with easy breakfast recipes',
                videoUrl: 'https://www.youtube.com/embed/12PmjbAQJUI',
                checklist: [
                    'Make scrambled eggs',
                    'Toast bread properly',
                    'Prepare simple cereal',
                    'Make basic coffee or tea'
                ]
            },
            {
                id: 3,
                title: 'Cooking Pasta or Rice',
                description: 'Master these versatile staples for many meals',
                videoUrl: 'https://www.youtube.com/embed/VkAHKounXOo',
                checklist: [
                    'Boil pasta al dente',
                    'Cook perfect rice',
                    'Make basic sauces',
                    'Season properly'
                ]
            },
            {
                id: 4,
                title: 'Using Oven & Stovetop Safely',
                description: 'Build confidence with major cooking appliances',
                videoUrl: 'https://www.youtube.com/embed/AD-Ks1qHdZ4',
                checklist: [
                    'Preheat oven correctly',
                    'Use different heat levels',
                    'Time your cooking',
                    'Handle hot surfaces safely'
                ]
            },
            {
                id: 5,
                title: 'Preparing a Balanced Meal',
                description: 'Put it all together for nutritious, complete meals',
                videoUrl: 'https://www.youtube.com/embed/81G22t2UHxA',
                checklist: [
                    'Plan a balanced plate',
                    'Cook multiple items together',
                    'Time everything properly',
                    'Present food appealingly'
                ]
            }
        ]
    },
    {
        id: 'home',
        title: 'Home Skills',
        emoji: '🛠️',
        description: 'Essential maintenance and cleaning skills for your home',
        steps: [
            {
                id: 1,
                title: 'Doing Laundry',
                description: 'Sort, wash, and dry clothes like a pro',
                videoUrl: 'https://www.youtube.com/watch?v=y9QalvcOvOA',
                checklist: [
                    'Sort clothes by color and fabric',
                    'Choose correct wash settings',
                    'Use proper amount of detergent',
                    'Fold and store clean clothes'
                ]
            },
            {
                id: 2,
                title: 'Fixing a Flat Bike Tire',
                description: 'Get back on the road with this essential repair skill',
                videoUrl: 'https://www.youtube.com/watch?v=qLO_HO0kEjs',
                checklist: [
                    'Remove the wheel',
                    'Find the puncture',
                    'Apply patch correctly',
                    'Reassemble and test'
                ]
            },
            {
                id: 3,
                title: 'Unclogging Drains',
                description: 'Handle common plumbing issues independently',
                videoUrl: 'https://www.youtube.com/watch?v=WbfKS_6VNY0',
                checklist: [
                    'Try plunging first',
                    'Use drain snake safely',
                    'Know when to use chemicals',
                    'Prevent future clogs'
                ]
            },
            {
                id: 4,
                title: 'Basic Cleaning',
                description: 'Keep your living space clean and organized',
                videoUrl: 'https://www.youtube.com/watch?v=V3lcf-csZxE',
                checklist: [
                    'Clean bathroom thoroughly',
                    'Mop floors effectively',
                    'Wash dishes properly',
                    'Organize living spaces'
                ]
            },
            {
                id: 5,
                title: 'Home Maintenance Basics',
                description: 'Handle simple fixes and know when to call for help',
                videoUrl: 'https://www.youtube.com/watch?v=5w6kmVfFYJU',
                checklist: [
                    'Change lightbulbs safely',
                    'Reset circuit breakers',
                    'Fix loose screws',
                    'Know when to call professionals'
                ]
            }
        ]
    },
    {
        id: 'health',
        title: 'Health & Wellness',
        emoji: '🏃',
        description: 'Build healthy habits for physical and mental wellbeing',
        steps: [
            {
                id: 1,
                title: 'Creating a Workout Routine',
                description: 'Design exercise habits that fit your lifestyle',
                videoUrl: 'http://www.youtube.com/watch?v=Wa4f7f5y7uQ',
                checklist: [
                    'Set realistic fitness goals',
                    'Choose enjoyable activities',
                    'Create a weekly schedule',
                    'Track your progress'
                ]
            },
            {
                id: 2,
                title: 'Understanding Nutrition',
                description: 'Learn about food groups and meal planning',
                videoUrl: 'http://www.youtube.com/watch?v=fR3NxCR9z2U',
                checklist: [
                    'Identify food groups',
                    'Plan balanced meals',
                    'Read nutrition labels',
                    'Prepare healthy snacks'
                ]
            },
            {
                id: 3,
                title: 'Basic First Aid',
                description: 'Handle common injuries and emergencies',
                videoUrl: 'http://www.youtube.com/watch?v=5OKFljZ2GQE',
                checklist: [
                    'Clean and bandage cuts',
                    'Treat minor burns',
                    'Know when to seek help',
                    'Stock a first aid kit'
                ]
            },
            {
                id: 4,
                title: 'Stress Management',
                description: 'Develop healthy coping strategies for daily stress',
                videoUrl: 'http://www.youtube.com/watch?v=qUz93CyNIz0',
                checklist: [
                    'Practice deep breathing',
                    'Try simple meditation',
                    'Identify stress triggers',
                    'Build support networks'
                ]
            },
            {
                id: 5,
                title: 'Setting Health Goals',
                description: 'Create sustainable habits for long-term wellness',
                videoUrl: 'http://www.youtube.com/watch?v=H1bDIREguok0',
                checklist: [
                    'Set SMART health goals',
                    'Track daily habits',
                    'Celebrate small wins',
                    'Adjust goals as needed'
                ]
            }
        ]
    },
    {
        id: 'navigation',
        title: 'Navigation & Travel',
        emoji: '🚍',
        description: 'Navigate confidently through your community and beyond',
        steps: [
            {
                id: 1,
                title: 'Reading Maps',
                description: 'Understand maps and basic navigation principles',
                videoUrl: 'http://www.youtube.com/watch?v=CoVcRxza8nI',
                checklist: [
                    'Read map symbols and legends',
                    'Understand directions (N, S, E, W)',
                    'Calculate distances and time',
                    'Identify landmarks'
                ]
            },
            {
                id: 2,
                title: 'Planning Transit Routes',
                description: 'Use public transportation effectively',
                videoUrl: 'http://www.youtube.com/watch?v=EPrAeylmtw4',
                checklist: [
                    'Read bus and train schedules',
                    'Plan efficient routes',
                    'Allow extra time for transfers',
                    'Have backup plans'
                ]
            },
            {
                id: 3,
                title: 'Using Navigation Apps',
                description: 'Master digital tools for modern navigation',
                videoUrl: 'http://www.youtube.com/watch?v=Z_E3Modm_5U',
                checklist: [
                    'Use Google Maps effectively',
                    'Download offline maps',
                    'Share locations with others',
                    'Find nearby services'
                ]
            },
            {
                id: 4,
                title: 'Buying Tickets & Passes',
                description: 'Navigate ticketing systems with confidence',
                videoUrl: 'http://www.youtube.com/watch?v=IpSMSn0DzgA',
                checklist: [
                    'Use ticket machines',
                    'Buy passes and cards',
                    'Understand fare zones',
                    'Keep tickets safe'
                ]
            },
            {
                id: 5,
                title: 'Independent Navigation',
                description: 'Travel to new places on your own',
                videoUrl: 'http://www.youtube.com/watch?v=ReDxkr_xH7c',
                checklist: [
                    'Research destinations beforehand',
                    'Have emergency contacts ready',
                    'Carry backup navigation methods',
                    'Stay aware of surroundings'
                ]
            }
        ]
    },
    {
        id: 'communication',
        title: 'Communication',
        emoji: '📞',
        description: 'Build confidence in personal and professional communication',
        steps: [
            {
                id: 1,
                title: 'Making Appointments',
                description: 'Schedule appointments with confidence',
                videoUrl: 'http://www.youtube.com/watch?v=G07V0aOmWTI',
                checklist: [
                    'Prepare information beforehand',
                    'Speak clearly and politely',
                    'Confirm appointment details',
                    'Ask about preparation needed'
                ]
            },
            {
                id: 2,
                title: 'Calling Customer Service',
                description: 'Get help and resolve issues over the phone',
                videoUrl: 'http://www.youtube.com/watch?v=sIAu9yflgQ0',
                checklist: [
                    'Have account info ready',
                    'Explain issues clearly',
                    'Take notes during calls',
                    'Ask for confirmation'
                ]
            },
            {
                id: 3,
                title: 'Writing Professional Emails',
                description: 'Communicate effectively in writing',
                videoUrl: 'http://www.youtube.com/watch?v=1XctnF7C74s',
                checklist: [
                    'Use clear subject lines',
                    'Write concise messages',
                    'Use proper email etiquette',
                    'Proofread before sending'
                ]
            },
            {
                id: 4,
                title: 'Social Interactions',
                description: 'Navigate introductions and small talk',
                videoUrl: 'http://www.youtube.com/watch?v=V0Sdgn0_kFM',
                checklist: [
                    'Make eye contact',
                    'Practice active listening',
                    'Ask open-ended questions',
                    'Show genuine interest'
                ]
            },
            {
                id: 5,
                title: 'Handling Conflict',
                description: 'Resolve disagreements respectfully',
                videoUrl: 'http://www.youtube.com/watch?v=jUF9sY4HvxY',
                checklist: [
                    'Stay calm and composed',
                    'Listen to other perspectives',
                    'Find common ground',
                    'Seek win-win solutions'
                ]
            }
        ]
    }
];

let userProgress = {
    completedSteps: new Set(),
    streak: 0,
    lastActive: null,
    taskPhotos: {}
};

let cameraStream = null;
let currentCamera = 'environment';
let capturedPhoto = null;
let currentTaskKey = null;

function loadProgress() {
    const saved = localStorage.getItem('skillStrideProgress');
    if (saved) {
        const data = JSON.parse(saved);
        userProgress.completedSteps = new Set(data.completedSteps || []);
        userProgress.streak = data.streak || 0;
        userProgress.lastActive = data.lastActive;
        userProgress.taskPhotos = data.taskPhotos || {};
    }
}

function saveProgress() {
    localStorage.setItem('skillStrideProgress', JSON.stringify({
        completedSteps: Array.from(userProgress.completedSteps),
        streak: userProgress.streak,
        lastActive: userProgress.lastActive,
        taskPhotos: userProgress.taskPhotos
    }));
}

function init() {
    loadProgress();
    updateStreak();
    renderSkillPaths();
    updateProgressCounts();
    setupEventListeners();
    setActiveNavigation();
}

function setActiveNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const skillPathLink = document.querySelector('.nav-link[href="skill-tree.html"]');
    if (skillPathLink) {
        skillPathLink.classList.add('active');
    }
}

function updateStreak() {
    const today = new Date().toDateString();
    const lastActive = userProgress.lastActive;
    
    if (!lastActive) {
        userProgress.streak = 0;
    } else if (lastActive === today) {
    } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActive === yesterday.toDateString()) {
        } else {
            userProgress.streak = 0;
        }
    }
    
    document.getElementById('streak-count').textContent = userProgress.streak;
}

function updateProgressCounts() {
    const totalSteps = skillPaths.reduce((sum, path) => sum + path.steps.length, 0);
    const completedCount = userProgress.completedSteps.size;
    
    document.getElementById('completed-steps').textContent = completedCount;
    document.getElementById('total-steps').textContent = totalSteps;
}

function renderSkillPaths() {
    const container = document.getElementById('skill-paths');
    container.innerHTML = '';
    
    skillPaths.forEach(path => {
        const pathElement = createSkillPathElement(path);
        container.appendChild(pathElement);
    });
}

function createSkillPathElement(path) {
    const pathElement = document.createElement('div');
    pathElement.className = `skill-path ${path.id}`;
    
    const completedSteps = path.steps.filter(step => 
        userProgress.completedSteps.has(`${path.id}-${step.id}`)
    ).length;
    
    const progressPercentage = (completedSteps / path.steps.length) * 100;
    
    pathElement.innerHTML = `
        <div class="skill-path-header">
            <div class="skill-path-icon">${path.emoji}</div>
            <div>
                <h3 class="skill-path-title">${path.title}</h3>
                <p class="skill-path-description">${path.description}</p>
            </div>
        </div>
        
        <div class="skill-path-progress">
            <span>Progress</span>
            <span>${completedSteps}/${path.steps.length} steps</span>
        </div>
        
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
        </div>
        
        <div class="steps">
            ${path.steps.map(step => createStepElement(path.id, step)).join('')}
        </div>
    `;
    
    return pathElement;
}

function createStepElement(pathId, step) {
    const stepId = `${pathId}-${step.id}`;
    const isCompleted = userProgress.completedSteps.has(stepId);
    const isLocked = !isStepUnlocked(pathId, step.id);
    const hasPhoto = userProgress.taskPhotos[stepId];
    
    let statusIcon = step.id;
    let statusText = 'Not started';
    let stepClass = '';
    
    if (isCompleted) {
        statusIcon = '✓';
        statusText = hasPhoto ? 'Completed 📸' : 'Completed';
        stepClass = 'completed';
    } else if (isLocked) {
        statusIcon = '🔒';
        statusText = 'Locked';
        stepClass = 'locked';
    }
    
    return `
        <div class="step ${stepClass}" data-path="${pathId}" data-step="${step.id}">
            <div class="step-icon">${statusIcon}</div>
            <div class="step-content">
                <div class="step-title">${step.title}</div>
                <div class="step-description">${step.description}</div>
            </div>
            <div class="step-status">
                <span>${statusText}</span>
            </div>
        </div>
    `;
}

function isStepUnlocked(pathId, stepId) {
    if (stepId === 1) return true;
    
    const previousStepId = `${pathId}-${stepId - 1}`;
    return userProgress.completedSteps.has(previousStepId);
}

function setupEventListeners() {
    document.addEventListener('click', (e) => {
        const step = e.target.closest('.step');
        if (step && !step.classList.contains('locked')) {
            const pathId = step.dataset.path;
            const stepId = parseInt(step.dataset.step);
            openStepModal(pathId, stepId);
        }
    });
    
    document.getElementById('close-modal').addEventListener('click', closeModal);
    
    document.getElementById('complete-step-btn').addEventListener('click', completeCurrentStep);
    
    document.getElementById('close-camera').addEventListener('click', hideCameraModal);
    document.getElementById('switch-camera-btn').addEventListener('click', switchCamera);
    document.getElementById('capture-btn').addEventListener('click', capturePhoto);
    document.getElementById('save-photo-btn').addEventListener('click', savePhoto);
    document.getElementById('retake-photo-btn').addEventListener('click', retakePhoto);
    document.getElementById('skip-photo-btn').addEventListener('click', () => {
        hideCameraModal();
        setTimeout(() => {
            showCelebration();
        }, 300);
    });
    
    document.getElementById('step-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    });
    
    document.getElementById('camera-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            hideCameraModal();
        }
    });
    
    document.getElementById('celebration').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            hideCelebration();
        }
    });
}

let currentStepPath = null;
let currentStepId = null;

function openStepModal(pathId, stepId) {
    const path = skillPaths.find(p => p.id === pathId);
    const step = path.steps.find(s => s.id === stepId);
    
    currentStepPath = pathId;
    currentStepId = stepId;
    
    const stepKey = `${pathId}-${stepId}`;
    const isCompleted = userProgress.completedSteps.has(stepKey);
    const hasPhoto = userProgress.taskPhotos[stepKey];
    
    // Update modal content
    document.getElementById('modal-title').textContent = `${path.emoji} ${step.title}`;
    document.getElementById('step-description').textContent = step.description;
    
    // Video container (placeholder for now)
    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
      const ytId = extractYouTubeID(step.videoUrl);
      if (ytId) {
        // show a clickable thumbnail that will be replaced by an iframe when clicked
        videoContainer.innerHTML = `
          <div class="video-thumb" data-video-id="${ytId}" style="position:relative;cursor:pointer;">
            <img src="https://img.youtube.com/vi/${ytId}/hqdefault.jpg" alt="Video thumbnail" style="width:100%;border-radius:8px;display:block;">
            <div class="video-play-btn" aria-hidden="true" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.6);border-radius:50%;width:64px;height:64px;display:flex;align-items:center;justify-content:center;font-size:28px;color:#fff;">►</div>
          </div>
        `;
        const thumb = videoContainer.querySelector('.video-thumb');
        thumb.addEventListener('click', () => {
          const iframe = document.createElement('iframe');
          iframe.src = getEmbedUrlFromId(ytId);
          iframe.width = '100%';
          iframe.height = '360';
          iframe.frameBorder = '0';
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
          iframe.allowFullscreen = true;
          videoContainer.innerHTML = '';
          videoContainer.appendChild(iframe);
        }, { once: true });
      } else {
        videoContainer.innerHTML = `<div class="video-placeholder">📹 Video: ${step.videoUrl || 'N/A'}</div>`;
      }
    }
    
    // Checklist
    const checklistContainer = document.getElementById('step-checklist');
    let checklistHTML = `
        <h4>Learning Checklist:</h4>
        ${step.checklist.map(item => `
            <div class="checklist-item">
                <span>•</span>
                <span>${item}</span>
            </div>
        `).join('')}
    `;
    
    // Add photo section if task is completed
    if (isCompleted && hasPhoto) {
        checklistHTML += `
            <div class="completed-photo-section">
                <h4>📸 Your Achievement Photo:</h4>
                <div class="achievement-photo">
                    <img src="${hasPhoto.photo}" alt="Task completion photo" style="width:100%;border-radius:8px;max-height:200px;object-fit:cover;">
                    <div class="photo-timestamp">Completed on ${new Date(hasPhoto.timestamp).toLocaleDateString()}</div>
                </div>
            </div>
        `;
    }
    
    checklistContainer.innerHTML = checklistHTML;
    
    // Update complete button
    const completeBtn = document.getElementById('complete-step-btn');
    if (isCompleted) {
        completeBtn.textContent = 'Completed ✓';
        completeBtn.disabled = true;
        completeBtn.style.opacity = '0.6';
    } else {
        completeBtn.textContent = 'Mark as Complete';
        completeBtn.disabled = false;
        completeBtn.style.opacity = '1';
    }
    
    // Show modal
    document.getElementById('step-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    document.getElementById('step-modal').classList.remove('active');
    document.body.style.overflow = '';
    currentStepPath = null;
    currentStepId = null;
}

// Complete current step
function completeCurrentStep() {
    if (!currentStepPath || !currentStepId) return;
    
    const stepKey = `${currentStepPath}-${currentStepId}`;
    
    if (!userProgress.completedSteps.has(stepKey)) {
        userProgress.completedSteps.add(stepKey);
        
        // Update streak
        const today = new Date().toDateString();
        if (userProgress.lastActive !== today) {
            userProgress.streak++;
            userProgress.lastActive = today;
        }
        
        saveProgress();
        updateProgressCounts();
        updateStreak();
        
        // Re-render the skill paths to update UI
        renderSkillPaths();
        
        // Close modal first
        closeModal();
        
        // Set current task key for photo capture
        currentTaskKey = stepKey;
        
        // Show camera modal after a short delay
        setTimeout(() => {
            showCameraModal();
        }, 300);
    }
}

// Show celebration
function showCelebration() {
    document.getElementById('celebration').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Hide celebration
function hideCelebration() {
    document.getElementById('celebration').classList.remove('active');
    document.body.style.overflow = '';
}

// Helper: extract YouTube ID and build embed URL
function extractYouTubeID(url) {
  if (!url) return null;
  // matches watch?v=, /embed/ and youtu.be short links
  const m = url.match(/(?:v=|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,11})/);
  return m ? m[1] : null;
}
function getEmbedUrlFromId(id) {
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?rel=0&autoplay=1`;
}

// Show camera modal
function showCameraModal() {
    document.getElementById('camera-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Check if task already has a photo
    if (currentTaskKey && userProgress.taskPhotos[currentTaskKey]) {
        showExistingPhoto();
    } else {
        startCamera();
    }
}

// Show existing photo for completed task
function showExistingPhoto() {
    const photoData = userProgress.taskPhotos[currentTaskKey];
    const preview = document.getElementById('camera-preview');
    const placeholder = document.getElementById('camera-placeholder');
    
    if (photoData && photoData.photo) {
        // Show existing photo
        preview.innerHTML = `
            <div class="photo-preview">
                <img src="${photoData.photo}" alt="Existing task photo">
                <div class="photo-overlay">Photo from ${new Date(photoData.timestamp).toLocaleDateString()}</div>
            </div>
        `;
        
        // Show retake and save options
        document.getElementById('capture-btn').style.display = 'none';
        document.getElementById('save-photo-btn').style.display = 'inline-flex';
        document.getElementById('retake-photo-btn').style.display = 'inline-flex';
        
        // Update save button text
        document.getElementById('save-photo-btn').textContent = 'Update Photo';
    }
}

// Hide camera modal
function hideCameraModal() {
    document.getElementById('camera-modal').classList.remove('active');
    document.body.style.overflow = '';
    stopCamera();
    resetCameraState();
}

// Start camera
async function startCamera() {
    try {
        const constraints = {
            video: {
                facingMode: currentCamera,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };
        
        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = document.getElementById('camera-video');
        const placeholder = document.getElementById('camera-placeholder');
        
        if (video && placeholder) {
            video.srcObject = cameraStream;
            
            // Hide placeholder and show video
            placeholder.style.display = 'none';
            video.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        showCameraError();
    }
}

// Stop camera
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
}

// Reset camera state
function resetCameraState() {
    capturedPhoto = null;
    currentTaskKey = null;
    
    // Reset UI
    const preview = document.getElementById('camera-preview');
    const placeholder = document.getElementById('camera-placeholder');
    const video = document.getElementById('camera-video');
    
    // Clear any existing photo preview
    preview.innerHTML = `
        <video id="camera-video" autoplay playsinline></video>
        <canvas id="camera-canvas" style="display: none;"></canvas>
        <div class="camera-placeholder" id="camera-placeholder">
            <i class="bi bi-camera"></i>
            <p>Camera will activate here</p>
        </div>
    `;
    
    // Reset button states
    document.getElementById('capture-btn').style.display = 'inline-flex';
    document.getElementById('save-photo-btn').style.display = 'none';
    document.getElementById('retake-photo-btn').style.display = 'none';
}

// Show camera error
function showCameraError() {
    const placeholder = document.getElementById('camera-placeholder');
    placeholder.innerHTML = `
        <i class="bi bi-exclamation-triangle" style="color: #ef4444;"></i>
        <p>Camera access denied</p>
        <small>Please allow camera access to take photos</small>
    `;
}

// Capture photo
function capturePhoto() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const preview = document.getElementById('camera-preview');
    
    if (!video || !canvas || !preview) {
        console.error('Camera elements not found');
        return;
    }
    
    // Set canvas dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    // Convert to data URL
    capturedPhoto = canvas.toDataURL('image/jpeg', 0.8);
    
    // Show photo preview
    preview.innerHTML = `
        <div class="photo-preview">
            <img src="${capturedPhoto}" alt="Captured photo">
            <div class="photo-overlay">Photo captured!</div>
        </div>
    `;
    
    // Update button states
    document.getElementById('capture-btn').style.display = 'none';
    document.getElementById('save-photo-btn').style.display = 'inline-flex';
    document.getElementById('retake-photo-btn').style.display = 'inline-flex';
}

// Save photo
function savePhoto() {
    if (capturedPhoto && currentTaskKey) {
        // Store photo in user progress
        userProgress.taskPhotos[currentTaskKey] = {
            photo: capturedPhoto,
            timestamp: new Date().toISOString(),
            taskId: currentTaskKey
        };
        
        saveProgress();
        
        // Hide camera modal
        hideCameraModal();
        
        // Show celebration after photo is saved
        setTimeout(() => {
            showCelebration();
        }, 300);
    }
}

// Switch camera
async function switchCamera() {
    currentCamera = currentCamera === 'environment' ? 'user' : 'environment';
    stopCamera();
    await startCamera();
}

// Retake photo
function retakePhoto() {
    // Clear the existing photo
    capturedPhoto = null;
    
    // Reset UI to camera mode
    const preview = document.getElementById('camera-preview');
    preview.innerHTML = `
        <video id="camera-video" autoplay playsinline></video>
        <canvas id="camera-canvas" style="display: none;"></canvas>
        <div class="camera-placeholder" id="camera-placeholder">
            <i class="bi bi-camera"></i>
            <p>Camera will activate here</p>
        </div>
    `;
    
    // Reset button states
    document.getElementById('capture-btn').style.display = 'inline-flex';
    document.getElementById('save-photo-btn').style.display = 'none';
    document.getElementById('retake-photo-btn').style.display = 'none';
    
    // Reset save button text
    document.getElementById('save-photo-btn').textContent = 'Save Photo';
    
    // Start camera
    startCamera();
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);