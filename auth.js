// 1. Dữ liệu người dùng mẫu
const users = {
    'casphez9323': { 
        password: 'Casphez1511@', 
        name: 'Casphez Iboje Maskeniye', 
        sbd: '238659', 
        birthday: '15/11/2015', 
        class: 'Biên tập viên', 
        work: 'Tự soạn một bài thuyết trình về bản tin các quốc gia sau đó quay video gửi qua email Giám đốc', 
        status: 'Chưa hoàn thành', 
        expiredate: '8h00 tối, ngày 10/2/2026'
    },
};

// 2. Các hàm xử lý cốt lõi
const AuthApp = {
    // Lưu thông tin vào LocalStorage
    login: function(username, password) {
        const user = users[username];
        if (user && user.password === password) {
            localStorage.setItem('currentUser', JSON.stringify({ username, ...user }));
            return true;
        }
        return false;
    },

    // Xóa thông tin và đăng xuất
    logout: function() {
        localStorage.removeItem('currentUser');
        window.location.replace('index.html'); // Dùng replace để không thể bấm "Back" quay lại
    },

    // Kiểm tra quyền truy cập (Chặn người dùng chưa đăng nhập)
    checkAuth: function() {
        const user = localStorage.getItem('currentUser');
        const isLoginPage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
        
        if (!user && !isLoginPage) {
            window.location.replace('index.html');
        }
    },

    // Cập nhật giao diện nếu có dữ liệu
    initUI: function() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            const welcomeMsg = document.getElementById('welcomeMessage');
            if (welcomeMsg) welcomeMsg.textContent = `Xin chào, ${user.name}!`;
            
            // Có thể đổ thêm dữ liệu công việc vào đây nếu cần
            const workTask = document.getElementById('workTask');
            if (workTask) workTask.textContent = user.work;
        }
    }
};

// 3. Lắng nghe sự kiện khi trang đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra bảo mật ngay lập tức
    AuthApp.checkAuth();
    AuthApp.initUI();

    // Xử lý Form Đăng nhập
    const loginForm = document.getElementById('authLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const userVal = document.getElementById('username').value;
            const passVal = document.getElementById('password').value;
            const errorDiv = document.getElementById('errorMessage');

            if (AuthApp.login(userVal, passVal)) {
                window.location.href = 'cong-viec-duoc-giao.html';
            } else {
                errorDiv.textContent = 'Sai tài khoản hoặc mật khẩu!';
                errorDiv.style.display = 'block';
            }
        });
    }

    // Xử lý Nút Đăng xuất bằng ID "logoutButton"
    const logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Bạn có chắc muốn đăng xuất không?')) {
                AuthApp.logout();
            }
        });
    }
});
// // Dữ liệu người dùng mẫu
// const users = {
//     'casphez9323': { password: 'Casphez1511@', name: 'Casphez Iboje Maskeniye', sbd: '238659', birthday: '15/11/2015', class: 'Biên tập viên', work:'Tự soạn một bài thuyết trình về bản tin các quốc gia sau đó quay video gửi qua email Giám đốc', status:'Chưa hoàn thành', expiredate:'8h00 tối, ngày 10/2/2026'}, 
// };

// // Hàm xóa sạch mọi dữ liệu người dùng khỏi localStorage
// function clearUserData() {
//     localStorage.removeItem('currentUser');
//     // Nếu bạn có lưu thêm các dữ liệu khác sau này (ví dụ: 'userSettings'), hãy xóa ở đây
//     // localStorage.removeItem('userSettings'); 
// }

// // Hàm đăng nhập
// function login(username, password) {
//     // NGAY LẬP TỨC xóa dữ liệu người dùng cũ trước khi xử lý đăng nhập mới
//     clearUserData(); 
    
//     const user = users[username];
//     if (user && user.password === password) {
//         // Lưu thông tin người dùng MỚI vào localStorage
//         localStorage.setItem('currentUser', JSON.stringify({ 
//             username: username, 
//             name: user.name, 
//             sbd: user.sbd,
//             birthday: user.birthday,
//             class: user.class,
//             work: user.work,
//             status: user.status,
//             expiredate: user.expiredate,
            
//         }));
//         // Chuyển hướng đến dashboard
//         window.location.href = 'cong-viec-duoc-giao.html';
//         return true;
//     }
//     return false;
// }

// // Hàm đăng xuất (chỉ cần gọi lại hàm xóa dữ liệu)
// function logout() {
//     clearUserData();
//     // Chuyển hướng về trang đăng nhập
//     window.location.href = 'index.html';
//     // Ngăn người dùng quay lại trang trước
//     setTimeout(() => {
//         window.history.replaceState(null, '', 'index.html');
//     }, 0);
// }

// // Hàm kiểm tra trạng thái đăng nhập trên các trang yêu cầu bảo mật
// function checkLoginState() {
//     const currentUser = localStorage.getItem('currentUser');
//     const currentPage = window.location.pathname.split('/').pop(); 
    
//     if (!currentUser && currentPage !== 'index.html') {
//         window.location.href = 'index.html';
//     }
// }

// // Hàm cập nhật giao diện dashboard
// function updateDashboardUI() {
//     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     if (currentUser) {
//         const welcomeMessageEl = document.getElementById('welcomeMessage');
//         const examRoomNavItemEl = document.getElementById('examRoomNavItem');

//         if (welcomeMessageEl) {
//             welcomeMessageEl.textContent = `Xin chào, ${currentUser.name}!`;
//         }
        
//         if (examRoomNavItemEl) {
//             examRoomNavItemEl.style.display = 'block';
//         }
//     }
// }

// // --- Logic chạy khi script auth.js được tải ---

// // 1. Kiểm tra trạng thái đăng nhập ngay lập tức
// checkLoginState();

// // 2. Gắn sự kiện cho form đăng nhập (chỉ chạy nếu đang ở trang index.html)
// if (window.location.pathname.endsWith('/index.html')) {
//     document.addEventListener('DOMContentLoaded', () => {
//         document.getElementById('loginForm').addEventListener('submit', function(e) {
//             e.preventDefault();
//             const username = document.getElementById('username').value;
//             const password = document.getElementById('password').value;
//             const errorMessage = document.getElementById('errorMessage');

//             if (!login(username, password)) {
//                 errorMessage.textContent = 'Sai tên đăng nhập hoặc mật khẩu.';
//                 errorMessage.style.display = 'block';
//             }
//         });
//     });
// }
