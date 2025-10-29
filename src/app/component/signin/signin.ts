import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { ToastService } from '../../services/toast.service';

// Interface cho thông tin đăng nhập (username và password)
interface UserCredentials {
  username: string;
  password: string;
}

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signin.html',
  styleUrls: ['./signin.css'],
})
export class Signin {
  username = ''; // Biến bind với input username
  password = ''; // Biến bind với input password

  constructor(
    private storage: StorageService, // Service quản lý localStorage
    private toast: ToastService,     // Service hiển thị toast
    private router: Router           // Router để điều hướng trang
  ) {}

  // Hàm đăng nhập
  signIn(): void {
    const user = this.username?.trim();  // Lấy username và loại bỏ khoảng trắng
    const pass = this.password?.trim();  // Lấy password và loại bỏ khoảng trắng

    // Kiểm tra nếu chưa nhập username hoặc password
    if (!user || !pass) {
      this.toast.show('⚠ Please enter username and password.'); // Hiển thị thông báo
      return;
    }

    // Lưu username vào localStorage thông qua StorageService
    this.storage.setItem('username', user);

    // Hiển thị toast chào mừng
    this.toast.show(`✅ Welcome back, ${user}!`);

    // Điều hướng về trang chủ sau một khoảng thời gian ngắn để toast hiển thị
    setTimeout(() => {
      try {
        this.router.navigate(['/']); // Điều hướng bằng Angular Router
      } catch (e) {
        window.location.href = 'index.html'; // Fallback nếu Router không hoạt động
      }
    }, 600); // 600ms để toast kịp xuất hiện
  }
}
