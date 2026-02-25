const users = {
    'missgrand-venezuela': { 
        password: 'missgrandvenezuela', 
        name: 'Casphez Iboje Maskeniye', 
        sbd: '238659', 
        birthday: '15/11/2015', 
        class: 'Hoa hậu Venezuela',    stt1: '1', 
        subject1:'Miss Grand International 2026', 
        round1: 'Vòng loại', 
        time1: '13/2/2025 11:52', 
        examStatus1: 'Đã hoàn thành',
        result1: 'Được vào vòng Chung kết',
         stt2: '2', 
        subject2:'Miss Grand International 2026', 
        round2: 'Vòng Chung kết', 
        time2: '15/2/2025 20:09', 
        examStatus2: 'Đã hoàn thành',
        result2: 'Lọt vào danh sách Top 5 of Miss Grand International 2026',
        isLocked: false,
        // Thông tin chi tiết về việc khóa
        lockInfo: {
            id: "238659",
            reason: "Thường xuyên không hoàn thành công việc",
            startTime: "11:20 20/02/2026",
            duration: "90 ngày"
        },
    },
    'nhattiento2704@gmail.com': {
        password: '123456',
        name: 'Nguyễn Nhật Nam',
        isLocked: true,
        // Thông tin chi tiết về việc khóa
        lockInfo: {
           id: "293049",
            reason: "Thường xuyên không hoàn thành công việc",
            startTime: "11:20 20/02/2026",
            duration: "90 ngày"
        }
    }
};

// --- CODE THÊM MỚI: CẤU HÌNH KHÓA ---
const MAX_ATTEMPTS = 5;
const LOCK_DURATION = 30; // 30 giây

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
        room: user.room,
        stt1: user.stt1,
        subject1: user.subject1,
        time1: user.time1,
        round1: user.round1,
        examStatus1: user.examStatus1,
        result1: user.result1,
        stt2: user.stt2,
        subject2: user.subject2,
        time2: user.time2,
        round2: user.round2,
        examStatus2: user.examStatus2,
        result2: user.result2
    }));
    return { success: true };
}

function logout() {
    clearUserData();
    // Chuyển hướng về trang đăng nhập
    window.location.href = 'index.html';
    // Ngăn người dùng quay lại trang trước
    setTimeout(() => {
        window.history.replaceState(null, '', 'index.html');
    }, 0);
}

function checkLoginState() {
    const currentUser = localStorage.getItem('currentUser');
    const currentPage = window.location.pathname.split('/').pop(); 
    
    if (!currentUser && currentPage !== 'index.html' && currentPage !== '') {
        window.location.href = 'index.html';
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

// --- CODE THÊM MỚI: HÀM KIỂM TRA TRẠNG THÁI KHÓA TẠM THỜI ---
function checkLockStatus() {
    const lockUntil = localStorage.getItem('lockUntil');
    const loginInputs = document.getElementById('loginInputs');
    const alertPlaceholder = document.getElementById('alertPlaceholder');

    if (lockUntil) {
        const currentTime = new Date().getTime();
        const timeLeft = parseInt(lockUntil) - currentTime;

        if (timeLeft > 0) {
            if (loginInputs) loginInputs.style.display = 'none';
            const secondsLeft = Math.ceil(timeLeft / 1000);
            
            // Thông báo căn giữa, không có nút X
            alertPlaceholder.innerHTML = `
                <div class="alert alert-warning d-flex justify-content-center align-items-center text-center fw-bold" role="alert" style="min-height: 50px;">
                    Bạn đã nhập sai quá nhiều lần. Thử lại sau ${secondsLeft} giây
                </div>`;
            
            setTimeout(checkLockStatus, 1000);
            return true;
        } else {
            localStorage.removeItem('lockUntil');
            localStorage.setItem('loginAttempts', '0');
            if (loginInputs) loginInputs.style.display = 'block';
            alertPlaceholder.innerHTML = '';
            return false;
        }
    }
    return false;
}

// --- Logic chạy khi script auth.js được tải ---

// 1. Kiểm tra trạng thái đăng nhập ngay lập tức
checkLoginState();

// 2. Kiểm tra trạng thái khóa ngay lập tức
document.addEventListener('DOMContentLoaded', () => {
    checkLockStatus();
});

// 2. Gắn sự kiện cho form đăng nhập
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const alertPlaceholder = document.getElementById('alertPlaceholder');

    // Hàm tạo Alert động (Giữ nguyên của bạn)
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
            const usernameInput = document.getElementById('username');
            if(usernameInput) usernameInput.focus();
        });
    };

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Nếu đang bị khóa thì không cho xử lý tiếp
            if (checkLockStatus()) return;

            // 1. Hiện hiệu ứng loading
            const loadingOverlay = document.getElementById('loadingOverlay');
            loadingOverlay.style.display = 'flex';

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // 2. Giả lập thời gian chờ loading (1.5 giây)
            setTimeout(() => {
                const result = login(username, password);

                if (result.success) {
                    localStorage.setItem('loginAttempts', '0'); // Reset nếu đúng
                    window.location.href = 'ket-qua-ki-thi.html';
                } else {
                    loadingOverlay.style.display = 'none';

                    if (result.reason === 'LOCKED') {
                        document.getElementById('displayLockID').textContent = result.lockDetails.id;
                        document.getElementById('displayLockReason').textContent = result.lockDetails.reason;
                        document.getElementById('displayLockStart').textContent = result.lockDetails.startTime;
                        document.getElementById('displayLockDuration').textContent = result.lockDetails.duration;

                        const lockModal = new bootstrap.Modal(document.getElementById('lockAccountModal'));
                        lockModal.show();
                        alertPlaceholder.innerHTML = ''; 
                    } else {
                        // --- CODE THÊM MỚI: XỬ LÝ ĐẾM SỐ LẦN SAI ---
                        let attempts = parseInt(localStorage.getItem('loginAttempts') || '0');
                        attempts++;
                        localStorage.setItem('loginAttempts', attempts);

                        if (attempts >= MAX_ATTEMPTS) {
                            const lockTime = new Date().getTime() + (LOCK_DURATION * 1000);
                            localStorage.setItem('lockUntil', lockTime);
                            checkLockStatus();
                        } else {
                            showAlert(`Sai tên đăng nhập hoặc mật khẩu. Bạn còn ${MAX_ATTEMPTS - attempts} lần thử!`, 'danger');
                        }
                    }
                }
            }, 1500); 
        });
    }
});

// Chống chuột phải và phím tắt (Giữ nguyên của bạn)
window.onload = function() {
    document.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    }, false);
    document.addEventListener("keydown", function(e) {
        if (e.ctrlKey && e.shiftKey && e.keyCode == 73) disabledEvent(e);
        if (e.ctrlKey && e.shiftKey && e.keyCode == 74) disabledEvent(e);
        if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) disabledEvent(e);
        if (e.ctrlKey && e.keyCode == 85) disabledEvent(e);
        if (e.keyCode == 123) disabledEvent(e);
    }, false);
    function disabledEvent(e) {
        if (e.stopPropagation) e.stopPropagation();
        else if (window.event) window.event.cancelBubble = true;
        e.preventDefault();
        return false;
    }
};
