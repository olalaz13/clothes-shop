import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { ToastService } from '../../services/toast.service';

interface Address {
  title?: string;
  fullName?: string;
  phone?: string;
  street?: string;
  city?: string;
  district?: string;
  ward?: string;
  default?: boolean;
}

interface OrderItem {
  id: number;
  name: string;
  image?: string;
}

interface Order {
  id: number;
  date: string;
  status: string;
  items: OrderItem[];
  total: number;
}

interface WishlistItem {
  id: number;
  name: string;
  image?: string;
  price?: number;
}

interface UserModel {
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  addresses?: Address[];
  orders?: Order[];
  wishlist?: WishlistItem[];
  createdAt?: string;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css','../../../../public/css/style.css']
})
export class User implements OnInit {
  // Người dùng hiện tại, khởi tạo mặc định để tránh lỗi khi dùng ngModel
  currentUser: UserModel = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthday: '',
    gender: '',
    addresses: [],
    orders: [],
    wishlist: [],
    createdAt: ''
  };

  // Section hiện tại của trang user (profile, orders, addresses, wishlist, security)
  currentSection: 'profile' | 'orders' | 'addresses' | 'wishlist' | 'security' = 'profile';

  constructor(
    private storage: StorageService,  // Dùng để lưu/truy xuất dữ liệu localStorage
    private toast: ToastService,      // Hiển thị thông báo
    private router: Router             // Điều hướng router
  ) {}

  ngOnInit(): void {
    this.loadUserData();               // Load dữ liệu người dùng khi khởi tạo
  }

  // Tạo một user mặc định nếu chưa có dữ liệu
  private makeDefaultUser(username: string): UserModel {
    return {
      username,
      firstName: 'Nguyễn Văn',
      lastName: 'A',
      email: `${username}@example.com`,
      phone: '+84 123 456 789',
      birthday: '1990-01-01',
      gender: 'male',
      addresses: [],
      orders: [],
      wishlist: [],
      createdAt: new Date().toISOString()
    };
  }

  // Load dữ liệu user từ localStorage
  loadUserData(): void {
    const username = this.storage.getItem('username');
    if (!username) {
      // Nếu chưa đăng nhập → điều hướng sang signin
      this.router.navigate(['/signin']);
      return;
    }

    const userData = this.storage.getObject<UserModel>(`user_${username}`);
    if (userData) {
      this.currentUser = userData;
    } else {
      // Nếu chưa có dữ liệu → tạo mặc định và lưu lại
      this.currentUser = this.makeDefaultUser(username);
      this.saveUserData();
    }
  }

  // Lưu dữ liệu user vào localStorage
  saveUserData(): void {
    if (!this.currentUser) return;
    this.storage.setObject(`user_${this.currentUser.username}`, this.currentUser);
  }

  // Chuyển section hiển thị
  switchSection(section: any): void {
    if (!section) return;
    this.currentSection = section;
  }

  // Lưu thông tin cá nhân
  saveProfile(): void {
    if (!this.currentUser) return;
    this.saveUserData();
    this.toast.show('Thông tin đã được cập nhật thành công!');
  }

  // Thêm địa chỉ mới (hiện tại chưa triển khai)
  addNewAddress(): void {
    this.toast.show('Tính năng thêm địa chỉ mới sẽ được mở');
  }

  // Xóa sản phẩm khỏi wishlist
  removeFromWishlist(itemId: number): void {
    if (!this.currentUser) return;
    this.currentUser.wishlist = (this.currentUser.wishlist || []).filter(i => i.id !== itemId);
    this.saveUserData();
    this.toast.show('Đã xóa sản phẩm khỏi danh sách yêu thích');
  }

  // Đăng xuất
  logout(): void {
    this.storage.removeItem('username');
    this.router.navigate(['/']);
  }

  // Format giá theo VND
  formatPrice(price?: number): string {
    if (price == null) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  // Số lượng đơn hàng
  get ordersCount(): number {
    return this.currentUser?.orders?.length || 0;
  }

  // Số lượng sản phẩm trong wishlist
  get wishlistCount(): number {
    return this.currentUser?.wishlist?.length || 0;
  }
}