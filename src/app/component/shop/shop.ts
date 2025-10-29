import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { SearchService } from '../../services/search.service';
import { Product } from '../../models/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './shop.html',
  styleUrls: ['../../../../public/css/style.css']
})
export class Shop implements OnInit, OnDestroy {
  products: Product[] = [];               // Danh sách tất cả sản phẩm
  filteredProducts: Product[] = [];       // Danh sách sản phẩm sau khi lọc
  categories: string[] = [];              // Danh sách danh mục
  activeCategory: string = 'All';         // Danh mục đang chọn
  searchTerm: string = '';                // Từ khóa tìm kiếm
  sortBy: string = 'popular';             // Kiểu sắp xếp
  selectedProduct: Product | null = null; // Sản phẩm đang xem nhanh (quick view)
  private searchSub?: Subscription;       // Subscription cho global search
  // Trạng thái giao diện
  isSidebarOpen = false;                  // Sidebar bộ lọc
  viewMode: 'grid' | 'list' = 'grid';     // Chế độ hiển thị sản phẩm
  priceMin?: number | null = null;        // Giá min lọc
  priceMax?: number | null = null;        // Giá max lọc

  constructor(
    private productService: ProductService, // Service quản lý sản phẩm
    private cartService: CartService,       // Service giỏ hàng
    private toastService: ToastService,     // Service toast
    private searchService: SearchService    // Service tìm kiếm global
  ) {}

  ngOnInit(): void {
    this.products = this.productService.getProducts(); // Load tất cả sản phẩm
    this.categories = this.productService.getCategories(); // Load danh mục
    this.filterProducts(); // Lọc sản phẩm theo mặc định

    // Lắng nghe thay đổi từ thanh tìm kiếm global
    this.searchSub = this.searchService.getTerm().subscribe(term => {
      this.searchTerm = term;
      this.filterProducts();
    });
  }

  ngOnDestroy(): void {
    // Hủy subscription khi component bị hủy
    this.searchSub?.unsubscribe();
  }

  filterProducts(): void {
    // Lọc cơ bản theo danh mục, từ khóa và sắp xếp
    let base = this.productService.filterProducts(
      this.activeCategory,
      this.searchTerm,
      this.sortBy
    );

    // Lọc theo khoảng giá nếu người dùng nhập
    const min = (this.priceMin != null && !isNaN(Number(this.priceMin))) ? Number(this.priceMin) : -Infinity;
    const max = (this.priceMax != null && !isNaN(Number(this.priceMax))) ? Number(this.priceMax) : Infinity;

    this.filteredProducts = base.filter(p => p.price >= min && p.price <= max);
  }

  // Khi thay đổi danh mục
  onCategoryChange(category: string): void {
    this.activeCategory = category;
    this.filterProducts();
    // Nếu màn hình nhỏ (mobile), đóng sidebar sau khi chọn
    if (window.innerWidth <= 1000) {
      this.closeSidebar();
    }
  }

  // Khi thay đổi kiểu sắp xếp
  onSortChange(): void {
    this.filterProducts();
  }

  // Mở quick view
  quickView(product: Product): void {
    this.selectedProduct = product;
  }

  // Đóng modal quick view
  closeModal(): void {
    this.selectedProduct = null;
  }

  // Thêm sản phẩm vào giỏ
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.toastService.show(`Added <b>${product.title}</b> to cart!`);
  }

  // Toggle sidebar bộ lọc
  toggleFilters(): void {
    if (this.isSidebarOpen) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  openSidebar(): void {
    this.isSidebarOpen = true;
    document.body.style.overflow = 'hidden'; // Chặn scroll khi mở sidebar
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
    document.body.style.overflow = ''; // Mở lại scroll
  }

  // Áp dụng lọc theo giá
  onApplyPrice(): void {
    if (this.priceMin === null || this.priceMin === undefined || this.priceMin === 0) this.priceMin = this.priceMin ?? undefined;
    if (this.priceMax === null || this.priceMax === undefined) this.priceMax = this.priceMax ?? undefined;
    this.filterProducts();
    if (window.innerWidth <= 1000) this.closeSidebar();
  }

  // Chuyển chế độ xem dạng lưới
  setViewGrid(): void {
    this.viewMode = 'grid';
  }

  // Chuyển chế độ xem dạng danh sách
  setViewList(): void {
    this.viewMode = 'list';
  }

  // Lấy tổng số sản phẩm sau khi lọc
  getProductCount(): number {
    return this.filteredProducts.length;
  }
}
