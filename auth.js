const users = {
     'casphez9323': { 
        password: 'Casphez1511@', 
        name: 'Casphez Iboje Maskeniye', 
        sbd: '238659', 
        birthday: '15/11/2015', 
        class: 'Biên tập viên', 
        work: 'Tự soạn một bài thuyết trình về bản tin các quốc gia sau đó quay video gửi qua email Giám đốc', 
        status: 'Chưa hoàn thành', 
        expiredate: '8h00 tối, ngày 10/2/2026',
         isLocked: false,
        // Thông tin chi tiết về việc khóa
        lockInfo: {
            id: "LOCK-2025-001",
            reason: "Vi phạm điều khoản sử dụng của VieConnect",
            startTime: "11:20 20/02/2026",
            duration: "Vĩnh viễn"
    },
    'nhattiento2704@gmail.com': {
        password: '123456',
        name: 'Nguyễn Nhật Nam',
        isLocked: true,
        // Thông tin chi tiết về việc khóa
        lockInfo: {
            id: "LOCK-2025-001",
            reason: "Vi phạm điều khoản sử dụng của VieConnect",
            startTime: "11:20 20/02/2026",
            duration: "Vĩnh viễn"
        }
    }
};

function clearUserData() {
    localStorage.removeItem('currentUser');
}

function login(username, password) {
    clearUserData(); 
    const user = users[username];

    if (!user || user.password !== password) {
        return { success: false, reason: 'WRONG_AUTH' };
    }

    if (user.isLocked) {
        // Trả về thêm thông tin khóa để hiển thị lên Modal
        return { success: false, reason: 'LOCKED', lockDetails: user.lockInfo };
    }

    localStorage.setItem('currentUser', JSON.stringify({ 
        username: username, 
            name: user.name, 
            sbd: user.sbd,
            birthday: user.birthday,
            class: user.class,
            school: user.school,
            work: user.work,
            status: user.status,
            expiredate: user.expiredate,
        
     }));
    return { success: true };
}

function logout() {
    clearUserData();
    // Chuyển hướng về trang đăng nhập
    window.location.href = 'login.html';
    // Ngăn người dùng quay lại trang trước
    setTimeout(() => {
        window.history.replaceState(null, '', 'login.html');
    }, 0);
}

function checkLoginState() {
    const currentUser = localStorage.getItem('currentUser');
    const currentPage = window.location.pathname.split('/').pop(); 
    
    if (!currentUser && currentPage !== 'login.html') {
        window.location.href = 'login.html';
    }
}

// Hàm cập nhật giao diện dashboard
function updateDashboardUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const welcomeMessageEl = document.getElementById('welcomeMessage');
        const examRoomNavItemEl = document.getElementById('examRoomNavItem');

        if (welcomeMessageEl) {
            welcomeMessageEl.textContent = `Xin chào, ${currentUser.name}!`;
        }
        
        if (examRoomNavItemEl) {
            examRoomNavItemEl.style.display = 'block';
        }
    }
}

// --- Logic chạy khi script auth.js được tải ---

// 1. Kiểm tra trạng thái đăng nhập ngay lập tức
checkLoginState();

// 2. Gắn sự kiện cho form đăng nhập (chỉ chạy nếu đang ở trang index.html)
if (window.location.pathname.endsWith('/login.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');

            if (!login(username, password)) {
                errorMessage.textContent = 'Sai tên đăng nhập hoặc mật khẩu.';
                errorMessage.style.display = 'block';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const alertPlaceholder = document.getElementById('alertPlaceholder');

    // Hàm tạo Alert động
    const showAlert = (message, type) => {
        // Xóa Alert cũ nếu đang hiển thị để tránh chồng chất
        alertPlaceholder.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible fade show" role="alert" id="activeAlert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');

        alertPlaceholder.append(wrapper);

        // Lấy phần tử alert vừa tạo
        const alertInstance = document.getElementById('activeAlert');

        // SỰ KIỆN: Khi Alert bị đóng hoàn toàn
        alertInstance.addEventListener('closed.bs.alert', () => {
            const usernameInput = document.getElementById('username');
            // Đưa focus về ô nhập tên đăng nhập để người dùng nhập lại ngay
            usernameInput.focus();
        });
    };

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const result = login(username, password);

            if (result.success) {
                window.location.href = 'dashboard.html';
            } else {
                if (result.reason === 'LOCKED') {
                    // Hiển thị Modal nếu tài khoản bị khóa
                    document.getElementById('displayLockID').textContent = result.lockDetails.id;
                    document.getElementById('displayLockReason').textContent = result.lockDetails.reason;
                    document.getElementById('displayLockStart').textContent = result.lockDetails.startTime;
                    document.getElementById('displayLockDuration').textContent = result.lockDetails.duration;

                    const lockModal = new bootstrap.Modal(document.getElementById('lockAccountModal'));
                    lockModal.show();
                    alertPlaceholder.innerHTML = ''; // Xóa alert nếu có
                } else {
                    // Hiển thị Alert nếu sai mật khẩu/tên đăng nhập
                    showAlert('Sai tên đăng nhập hoặc mật khẩu. Vui lòng kiểm tra lại!', 'danger');
                }
            }
        });
    }
});;


// Cấu hình các hằng số
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME_MS = 30000; // 30 giây

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    const usernameInput = document.getElementById('username');

    // --- CÁC HÀM TIỆN ÍCH ---

    const showAlert = (message, type) => {
        alertPlaceholder.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible fade show" role="alert" id="activeAlert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');
        alertPlaceholder.append(wrapper);

        const alertInstance = document.getElementById('activeAlert');
        alertInstance.addEventListener('closed.bs.alert', () => {
            if (!localStorage.getItem('lockoutEnd')) usernameInput.focus();
        });
    };

    // Hàm thực thi việc khóa giao diện
    const executeLockout = (remainingTimeMs) => {
        // Ẩn các thành phần đăng nhập
        const formElements = loginForm.querySelectorAll('.mb-3, button, .text');
        formElements.forEach(el => el.style.visibility = 'hidden');

        let timeLeft = Math.ceil(remainingTimeMs / 1000);

        const updateMessage = () => {
            alertPlaceholder.innerHTML = `
                <div class="alert alert-warning text-center fw-bold" role="alert">
                    Nhập sai quá nhiều lần, khóa trong <span id="countdown">${timeLeft}</span> giây
                </div>`;
        };

        updateMessage();

        const timer = setInterval(() => {
            timeLeft--;
            const countdownEl = document.getElementById('countdown');
            if (countdownEl) countdownEl.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timer);
                // Mở khóa
                localStorage.removeItem('lockoutEnd');
                localStorage.setItem('failedAttempts', '0');
                formElements.forEach(el => el.style.visibility = 'visible');
                alertPlaceholder.innerHTML = '';
                showAlert('Bạn đã có thể thử lại.', 'success');
            }
        }, 1000);
    };

    // --- KIỂM TRA TRẠNG THÁI KHI LOAD TRANG ---

    const checkCurrentLockout = () => {
        const lockoutEnd = localStorage.getItem('lockoutEnd');
        if (lockoutEnd) {
            const remaining = parseInt(lockoutEnd) - Date.now();
            if (remaining > 0) {
                executeLockout(remaining);
            } else {
                // Đã hết thời gian khóa khi đang offline
                localStorage.removeItem('lockoutEnd');
                localStorage.setItem('failedAttempts', '0');
            }
        }
    };

    checkCurrentLockout();

    // --- XỬ LÝ SỰ KIỆN SUBMIT ---

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Nếu đang bị khóa (vừa nhấn submit vừa có lockout trong localStorage)
            if (localStorage.getItem('lockoutEnd')) return;

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const result = login(username, password);

            if (result.success) {
                localStorage.setItem('failedAttempts', '0');
                window.location.href = 'dashboard.html';
            } else {
                if (result.reason === 'LOCKED') {
                    // Xử lý Modal tài khoản bị khóa vĩnh viễn
                    document.getElementById('displayLockID').textContent = result.lockDetails.id;
                    document.getElementById('displayLockReason').textContent = result.lockDetails.reason;
                    document.getElementById('displayLockStart').textContent = result.lockDetails.startTime;
                    document.getElementById('displayLockDuration').textContent = result.lockDetails.duration;

                    const lockModal = new bootstrap.Modal(document.getElementById('lockAccountModal'));
                    lockModal.show();
                    alertPlaceholder.innerHTML = '';
                } else {
                    // Sai mật khẩu: Tăng số lần thử trong localStorage
                    let attempts = parseInt(localStorage.getItem('failedAttempts') || '0');
                    attempts++;
                    localStorage.setItem('failedAttempts', attempts.toString());

                    if (attempts >= MAX_ATTEMPTS) {
                        const unlockTime = Date.now() + LOCKOUT_TIME_MS;
                        localStorage.setItem('lockoutEnd', unlockTime.toString());
                        executeLockout(LOCKOUT_TIME_MS);
                    } else {
                        showAlert(`Sai thông tin. Bạn còn ${MAX_ATTEMPTS - attempts} lần thử trước khi bị tạm khóa.`, 'danger');
                    }
                }
            }
        });
    }
});
