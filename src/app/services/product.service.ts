import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // Mảng chứa danh sách sản phẩm mẫu
  public products: Product[] = [
    { 
      id: 1, 
      title: 'Linen Shirt', 
      price: 49, 
      cat: 'Shirts', 
      img: 'https://th.bing.com/th/id/OIP.45FSceBlhojQFEIv3utYkAHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3', 
      desc: 'Lightweight linen shirt — perfect for summer.' 
    },
    { 
      id: 2, 
      title: 'Classic Tee', 
      price: 19, 
      cat: 'T-Shirts', 
      img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop', 
      desc: 'Soft cotton t-shirt with a relaxed fit.' 
    },
    { 
      id: 3, 
      title: 'Denim Jacket', 
      price: 89, 
      cat: 'Jackets', 
      img: 'img/assets_task_01k5zjz5gze0xaf00smjmrrtdj_1758775483_img_0.webp', 
      desc: 'Timeless denim jacket with contrast stitching.' 
    },
    { 
      id: 4, 
      title: 'Sport Shorts', 
      price: 29, 
      cat: 'Shorts', 
      img: 'https://th.bing.com/th/id/OIP.8TflCd8Tm4FxGm0CPbE0vgHaHa?w=210&h=210&c=7&r=0&o=7&rm=3', 
      desc: 'Breathable shorts for everyday activity.' 
    },
    { 
      id: 5, 
      title: 'Summer Dress', 
      price: 69, 
      cat: 'Dresses', 
      img: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=1200&auto=format&fit=crop', 
      desc: 'Flowy dress made from viscose blend.' 
    },
    { 
      id: 6, 
      title: 'Hooded Sweatshirt', 
      price: 59, 
      cat: 'Sweatshirts', 
      img: 'img/assets_task_01k5zjxr1qfpaahfypmq9tgb5h_1758775432_img_0.webp', 
      desc: 'Cozy hoodie with soft inner lining.' 
    },
    { 
      id: 7, 
      title: 'Chino Pants', 
      price: 54, 
      cat: 'Pants', 
      img: 'https://th.bing.com/th/id/OIP.8mkxqa1lETx5srC9oaWjLgHaKu?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3', 
      desc: 'Smart-casual chinos, straight fit.' 
    },
    { 
      id: 8, 
      title: 'Canvas Sneakers', 
      price: 79, 
      cat: 'Shoes', 
      img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1200&auto=format&fit=crop', 
      desc: 'Everyday sneakers with rubber sole.' 
    }
  ];

  // Trả về toàn bộ danh sách sản phẩm
  getProducts(): Product[] {
    return this.products;
  }

  // Tìm và trả về sản phẩm dựa theo id (nếu không tìm thấy trả về undefined)
  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  // Trả về danh sách các danh mục sản phẩm, có thêm mục "All" ở đầu
  getCategories(): string[] {
    const cats = new Set(this.products.map(p => p.cat)); // Set để loại bỏ trùng lặp
    return ['All', ...cats];
  }

  // Lọc sản phẩm theo danh mục, từ khóa tìm kiếm và kiểu sắp xếp
  filterProducts(category: string, searchTerm: string = '', sortBy: string = 'popular'): Product[] {
    // Lọc sản phẩm theo danh mục và từ khóa
    let filtered = this.products.filter(p => 
      (category === 'All' || p.cat === category) &&
      (p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       p.cat.toLowerCase().includes(searchTerm.toLowerCase()) ||
       p.desc.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Sắp xếp sản phẩm theo giá
    switch (sortBy) {
      case 'asc':   // Tăng dần
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'desc':  // Giảm dần
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    return filtered;
  }
}
