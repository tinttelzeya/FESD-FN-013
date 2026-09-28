import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from './user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  registerForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  users: User[] = [];

  // Assignment မှာ ပေးထားတဲ့ Sample Data များကို Mockup အဖြစ် ကြိုတင်သတ်မှတ်ခြင်း
  private initialMockUsers: any[] = [
    { email: 'daranporn@gmail.com', pass: 'yjdf1716', first: 'Sira', last: 'Weerakittana', tel: '0891234567', dob: '2012-05-26' },
    { email: 'boonpoj@gmail.com', pass: 'mmjt9876', first: 'Rosanan', last: 'Suvanabhumiwong', tel: '0641825563', dob: '2011-10-17' },
    { email: 'bodin_thai@gmail.com', pass: 'mmyb4577', first: 'Tankwan', last: 'Srisuk', tel: '0986345661', dob: '2007-04-29' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsersFromSession();
  }

  initForm() {
    this.registerForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      userFirstName: ['', Validators.required],
      userLastName: ['', Validators.required],
      userTel: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      dateOfBirth: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]]
    });
  }

  // Session Storage မှ Data များကို ဖတ်ယူရန် (Browser တွင်သာ အလုပ်လုပ်စေရန် စစ်ဆေးခြင်း)[cite: 1]
  loadUsersFromSession() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const storedUsers = sessionStorage.getItem('registered_users');
      if (storedUsers) {
        const parsed = JSON.parse(storedUsers);
        this.users = parsed.map((u: any) => new User(u.userEmail, u.userPassword, u.userFirstName, u.userLastName, u.userTel, u.dateOfBirth));
      } else {
        this.users = this.initialMockUsers.map(m => new User(m.email, m.pass, m.first, m.last, m.tel, m.dob));
        this.saveUsersToSession();
      }
    } else {
      // Server ဘက်တွင် Run နေပါက Mockup Data သက်သက်ကိုသာ သုံးမည်[cite: 1]
      this.users = this.initialMockUsers.map(m => new User(m.email, m.pass, m.first, m.last, m.tel, m.dob));
    }
  }

  // Session Storage ထဲသို့ သိမ်းဆည်းရန်[cite: 1]
  saveUsersToSession() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem('registered_users', JSON.stringify(this.users));
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValues = this.registerForm.value;

    // HTTP 400: Non-numeric phone check[cite: 1]
    if (!/^\d+$/.test(formValues.userTel)) {
      this.errorMessage = 'HTTP 400: The userTel input contains non-numeric characters.';
      this.successMessage = null;
      return;
    }

    // HTTP 422: Email already registered check[cite: 1]
    const existing = this.users.find(u => u.userEmail === formValues.userEmail);
    if (existing) {
      this.errorMessage = 'HTTP 422: The userEmail is already registered.';
      this.successMessage = null;
      return;
    }

    try {
      const newUser = new User(
        formValues.userEmail,
        formValues.userPassword,
        formValues.userFirstName,
        formValues.userLastName,
        formValues.userTel,
        formValues.dateOfBirth
      );
      
      this.users.push(newUser);
      this.saveUsersToSession();

      this.successMessage = 'HTTP 201: Registration successful!'; // Success Alert[cite: 1]
      this.errorMessage = null;
      this.registerForm.reset();
    } catch (err) {
      this.errorMessage = 'HTTP 500: Server or Script Error.'; // Error Alert[cite: 1]
      this.successMessage = null;
    }
  }

  // Data Concatenation (Full Name) နဲ့ Dynamic Age တွက်ရန်[cite: 1]
  getFullName(user: User): string {
    return `${user.userFirstName} ${user.userLastName}`;
  }

  getUserAge(user: User): number {
    return user.getAge();
  }
}