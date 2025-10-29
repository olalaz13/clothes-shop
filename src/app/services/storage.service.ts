import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private isBrowser: boolean; // Kiểm tra ứng dụng đang chạy trên trình duyệt hay server
  private usernameChanged = new Subject<string | null>(); // Phát sự kiện khi username thay đổi
  username$ = this.usernameChanged.asObservable(); // Observable để component khác theo dõi username

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId); // Kiểm tra môi trường
  }

  // ===========================
  // Các phương thức thao tác localStorage an toàn
  // ===========================

  // Lấy giá trị theo key từ localStorage
  getItem(key: string): string | null {
    if (this.isBrowser) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn('localStorage không khả dụng:', error);
        return null;
      }
    }
    return null;
  }

  // Lưu giá trị vào localStorage
  setItem(key: string, value: string): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem(key, value);
        // Nếu lưu key "username", phát sự kiện usernameChanged
        if (key === 'username') {
          this.usernameChanged.next(value);
        }
      } catch (error) {
        console.warn('localStorage không khả dụng:', error);
      }
    }
  }

  // Xóa giá trị theo key
  removeItem(key: string): void {
    if (this.isBrowser) {
      try {
        localStorage.removeItem(key);
        // Nếu xóa username → phát sự kiện null
        if (key === 'username') {
          this.usernameChanged.next(null);
        }
      } catch (error) {
        console.warn('localStorage không khả dụng:', error);
      }
    }
  }

  // Xóa toàn bộ dữ liệu trong localStorage
  clear(): void {
    if (this.isBrowser) {
      try {
        localStorage.clear();
      } catch (error) {
        console.warn('localStorage không khả dụng:', error);
      }
    }
  }

  // ===========================
  // Các phương thức lưu/truy xuất object JSON
  // ===========================

  // Lấy object từ localStorage, parse JSON
  getObject<T>(key: string): T | null {
    const item = this.getItem(key);
    if (item) {
      try {
        return JSON.parse(item) as T;
      } catch (error) {
        console.warn(`Lỗi parse JSON cho key "${key}":`, error);
        return null;
      }
    }
    return null;
  }

  // Lưu object vào localStorage, stringify JSON
  setObject(key: string, value: any): void {
    try {
      this.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Lỗi stringify object cho key "${key}":`, error);
    }
  }
}
