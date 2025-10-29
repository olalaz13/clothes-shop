import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from './storage.service';
import { Product, CartItem } from '../models/product.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: CartItem[] = [];       // Danh sách sản phẩm trong giỏ hàng
  private favorites: string[] = [];    // Danh sách sản phẩm yêu thích
  private isBrowser: boolean;          // Kiểm tra đang chạy trên trình duyệt hay không
  private cartChanged = new Subject<void>(); // Dùng để phát tín hiệu khi giỏ hàng thay đổi
  cart$ = this.cartChanged.asObservable();   // Observable cho phép component khác theo dõi thay đổi

  constructor(
    private storageService: StorageService,      
    @Inject(PLATFORM_ID) private platformId: any 
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId); 
    this.loadCart(); // Khi service khởi tạo, tải giỏ hàng từ storage

    // Theo dõi sự thay đổi của username (đăng nhập hoặc đăng xuất)
    this.storageService.username$.subscribe(username => {
      if (!username) {
        // Nếu người dùng đăng xuất, xóa giỏ hàng hiện tại
        this.cart = [];
        this.cartChanged.next();
      } else {
        // Nếu đăng nhập, tải lại giỏ hàng tương ứng người dùng
        this.loadCart();
      }
    });
  }

  // Lấy danh sách sản phẩm trong giỏ hàng (trả về bản sao)
  getCart(): CartItem[] {
    return [...this.cart];
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(product: Product): void {
    const found = this.cart.find(item => item.id === product.id);
    if (found) {
      found.qty++; // Nếu đã tồn tại thì tăng số lượng
    } else {
      // Nếu chưa có thì thêm mới
      this.cart.push({ 
        id: product.id, 
        title: product.title, 
        price: product.price, 
        qty: 1 
      });
    }
    this.saveCart(); // Lưu lại giỏ hàng sau khi thêm
  }

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart(id: number): void {
    this.cart = this.cart.filter(item => item.id !== id);
    this.saveCart();
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateQuantity(id: number, newQty: number): void {
    if (newQty < 1) {
      this.removeFromCart(id);
      return;
    }
    
    const item = this.cart.find(i => i.id === id);
    if (item) {
      item.qty = newQty;
      this.saveCart();
    }
  }

  // Lấy tổng số lượng sản phẩm (tổng qty)
  getTotalItems(): number {
    return this.cart.reduce((sum, item) => sum + item.qty, 0);
  }

  // Tính tổng tiền trong giỏ hàng
  getSubtotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.qty * item.price), 0);
  }

  // Xóa toàn bộ giỏ hàng
  clearCart(): void {
    this.cart = [];
    this.saveCart();
  }

  // Thêm hoặc xóa sản phẩm khỏi danh sách yêu thích
  toggleFavorite(title: string): boolean {
    const index = this.favorites.indexOf(title);
    if (index > -1) {
      this.favorites.splice(index, 1);
      return false; 
    } else {
      this.favorites.push(title);
      return true; 
    }
  }

  // Kiểm tra sản phẩm có nằm trong danh sách yêu thích hay không
  isFavorite(title: string): boolean {
    return this.favorites.includes(title);
  }

  // Tải giỏ hàng từ localStorage dựa theo username
  private loadCart(): void {
    if (!this.isBrowser) return;
    
    const user = this.storageService.getItem("username");
    if (!user) {
      this.cart = [];
      return;
    }
    
    const cartData = this.storageService.getObject<CartItem[]>(`cart_${user}`);
    this.cart = cartData || [];
    this.cartChanged.next();
  }

  // Lưu giỏ hàng hiện tại vào localStorage theo username
  saveCart(): void {
    if (!this.isBrowser) return;
    
    const user = this.storageService.getItem("username");
    if (!user) return;
    
    this.storageService.setObject(`cart_${user}`, this.cart);
    this.cartChanged.next();
  }

  // Lấy số lượng của một sản phẩm cụ thể trong giỏ hàng
  getCartItemCount(productId: number): number {
    const item = this.cart.find(item => item.id === productId);
    return item ? item.qty : 0;
  }

}
