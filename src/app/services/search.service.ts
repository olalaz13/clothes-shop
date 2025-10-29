import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // BehaviorSubject lưu trữ giá trị từ khóa tìm kiếm hiện tại.
  // Khi có component mới subscribe, nó sẽ nhận được giá trị gần nhất ngay lập tức.
  private term$ = new BehaviorSubject<string>('');

  // Cập nhật từ khóa tìm kiếm (khi người dùng nhập vào ô search)
  setTerm(term: string): void {
    // Nếu giá trị null hoặc undefined thì gán chuỗi rỗng
    this.term$.next(term || '');
  }

  // Trả về Observable cho phép các component khác theo dõi sự thay đổi của từ khóa tìm kiếm
  getTerm(): Observable<string> {
    return this.term$.asObservable();
  }
}
