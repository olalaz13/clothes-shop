import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { StorageService } from '../../services/storage.service';
import { CartPanelService } from '../../services/cart-panel.service';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['../../../../public/css/style.css']
})
export class Navbar implements OnInit, OnDestroy {
  isMobileMenuOpen = false;       // Trạng thái menu mobile
  username: string | null = null; // Username người dùng (nếu đăng nhập)
  cartItemCount = 0;              // Tổng số sản phẩm trong giỏ
  searchTerm: string = '';        // Từ khóa tìm kiếm
  private subs: Subscription[] = []; // Danh sách subscription để hủy khi destroy

  constructor(
    private router: Router,
    private cartService: CartService,
    private storageService: StorageService,
    private cartPanelService: CartPanelService,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    // Lấy username từ localStorage
    this.username = this.storageService.getItem("username");
    this.updateCartCount(); // Cập nhật số lượng sản phẩm trong giỏ

    // Lắng nghe sự thay đổi username (login/logout)
    this.subs.push(
      this.storageService.username$.subscribe(username => {
        this.username = username;
      })
    );

    // Lắng nghe giỏ hàng thay đổi
    this.subs.push(
      this.cartService.cart$.subscribe(() => {
        this.updateCartCount();
      })
    );

    // Tạo DOM cho cart panel ngay từ đầu để openCart() có thể dùng ngay
    this.cartPanelService.initCartPanel();
  }

  ngOnDestroy(): void {
    // Hủy tất cả subscription
    this.subs.forEach(sub => sub.unsubscribe());
  }

  // Cập nhật tổng số sản phẩm trong giỏ
  private updateCartCount(): void {
    this.cartItemCount = this.cartService.getTotalItems();
  }

  // Toggle menu mobile
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Logout
  logout(): void {
    this.storageService.removeItem("username"); // Xóa username khỏi localStorage
    this.username = null;                         // Xóa cache username
    this.router.navigate(['/']);                  // Điều hướng về trang chủ
  }

  // Khi người dùng nhập từ khóa tìm kiếm
  onSearchChange(): void {
    this.searchService.setTerm(this.searchTerm); // Emit term cho các component khác
  }

  // Mở cart panel
  openCart(): void {
    this.cartPanelService.openCartPanel();
  }

  // Kiểm tra login
  get isLoggedIn(): boolean {
    return !!this.username;
  }
}
