import { AfterViewInit, Component, OnDestroy, Renderer2, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrls: ['../../../../public/css/style.css','./contact.css']
})
export class Contact implements AfterViewInit, OnDestroy {
  // Mảng lưu các hàm remove listener để gỡ khi component bị destroy
  private removeListeners: Array<() => void> = [];

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    // Khởi tạo toggle FAQ và xử lý form sau khi DOM đã render xong
    this.initFaqToggle();
    this.initFormHandling();
  }

  ngOnDestroy(): void {
    // Gỡ tất cả listener để tránh memory leak
    this.removeListeners.forEach(fn => fn());
    this.removeListeners = [];
  }

  // Khởi tạo chức năng toggle FAQ
  private initFaqToggle() {
    const faqItems = Array.from(this.document.querySelectorAll('.faq-item')) as HTMLElement[];
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question') as HTMLElement | null;
      const answer = item.querySelector('.faq-answer') as HTMLElement | null;
      if (!question || !answer) return;

      const onClick = () => {
        const isActive = item.classList.contains('active');

        // Đóng tất cả FAQ khác
        faqItems.forEach(faq => {
          faq.classList.remove('active');
          const ans = faq.querySelector('.faq-answer');
          if (ans) ans.classList.remove('active');
        });

        // Nếu FAQ hiện tại chưa active, bật nó
        if (!isActive) {
          item.classList.add('active');
          answer.classList.add('active');
        }
      };

      // Thêm listener click vào question
      this.renderer.listen(question, 'click', onClick);
      // Lưu hàm gỡ listener
      this.removeListeners.push(() => this.renderer.listen(question, 'click', onClick));
    });
  }

  // Khởi tạo xử lý form liên hệ
  private initFormHandling() {
    const contactForm = this.document.getElementById('contactForm') as HTMLFormElement | null;
    const successMessage = this.document.getElementById('successMessage') as HTMLElement | null;
    if (!contactForm) return;

    const submitHandler = (e: Event) => {
      e.preventDefault();

      let isValid = true;

      // Reset trạng thái lỗi
      Array.from(this.document.querySelectorAll('.error-message')).forEach(el => el.classList.remove('show'));
      Array.from(this.document.querySelectorAll('.form-control')).forEach(el => el.classList.remove('error'));

      // Hàm helper lấy input theo id
      const getById = (id: string) => this.document.getElementById(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;

      // Kiểm tra từng trường
      const firstName = getById('firstName') as HTMLInputElement | null;
      if (!firstName || !firstName.value.trim()) {
        this.showError(firstName, 'firstNameError');
        isValid = false;
      }

      const lastName = getById('lastName') as HTMLInputElement | null;
      if (!lastName || !lastName.value.trim()) {
        this.showError(lastName, 'lastNameError');
        isValid = false;
      }

      const email = getById('email') as HTMLInputElement | null;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !email.value.trim() || !emailRegex.test(email.value)) {
        this.showError(email, 'emailError');
        isValid = false;
      }

      const phone = getById('phone') as HTMLInputElement | null;
      const phoneRegex = /^[0-9+\-\s()]{10,}$/;
      if (phone && phone.value.trim() && !phoneRegex.test(phone.value)) {
        this.showError(phone, 'phoneError');
        isValid = false;
      }

      const subject = getById('subject') as HTMLSelectElement | null;
      if (!subject || !subject.value) {
        this.showError(subject, 'subjectError');
        isValid = false;
      }

      const message = getById('message') as HTMLTextAreaElement | null;
      if (!message || !message.value.trim()) {
        this.showError(message, 'messageError');
        isValid = false;
      }

      // Nếu form hợp lệ, hiển thị thông báo thành công
      if (isValid) {
        const submitText = this.document.getElementById('submitText') as HTMLElement | null;
        const submitLoading = this.document.getElementById('submitLoading') as HTMLElement | null;
        if (submitText) this.renderer.setStyle(submitText, 'display', 'none');
        if (submitLoading) this.renderer.setStyle(submitLoading, 'display', 'block');

        setTimeout(() => {
          if (successMessage) successMessage.classList.add('show'); // Hiển thị thông báo thành công
          contactForm.reset(); // Reset form

          if (submitText) this.renderer.setStyle(submitText, 'display', 'block');
          if (submitLoading) this.renderer.setStyle(submitLoading, 'display', 'none');

          // Ẩn thông báo sau 5s
          setTimeout(() => {
            if (successMessage) successMessage.classList.remove('show');
          }, 5000);
        }, 2000);
      }
    };

    // Thêm listener submit form
    this.renderer.listen(contactForm, 'submit', submitHandler);
    this.removeListeners.push(() => this.renderer.listen(contactForm, 'submit', submitHandler));

    // Xử lý validate realtime: bỏ trạng thái lỗi khi người dùng nhập
    const controls = Array.from(this.document.querySelectorAll('.form-control')) as HTMLElement[];
    controls.forEach(ctrl => {
      const inputHandler = () => {
        if (ctrl.classList.contains('error')) {
          ctrl.classList.remove('error');
          const errorId = ctrl.id + 'Error';
          const errEl = this.document.getElementById(errorId);
          if (errEl) errEl.classList.remove('show');
        }
      };
      this.renderer.listen(ctrl, 'input', inputHandler);
      this.removeListeners.push(() => this.renderer.listen(ctrl, 'input', inputHandler));
    });
  }

  // Hàm hiển thị lỗi cho input
  private showError(input: HTMLElement | null, errorId: string) {
    if (input) input.classList.add('error'); // đánh dấu input lỗi
    const err = this.document.getElementById(errorId);
    if (err) err.classList.add('show'); // hiển thị thông báo lỗi
  }
}
