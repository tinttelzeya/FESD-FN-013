import { User } from './user.model';

describe('User Model - getAge() Unit Tests', () => {
  const fixedCurrentDate = new Date('2026-05-20');

  // TC-01: Birthday has passed this year
  it('TC-01: Birthday has passed this year', () => {
    const user = new User('test@gmail.com', 'pass1234', 'John', 'Doe', '0812345678', '1990-01-01');
    expect(user.getAge(fixedCurrentDate)).toBe(36);
  });

  // TC-02: Today is the birthday
  it('TC-02: Today is the birthday', () => {
    const user = new User('test@gmail.com', 'pass1234', 'John', 'Doe', '0812345678', '1990-05-20');
    expect(user.getAge(fixedCurrentDate)).toBe(36);
  });

  // TC-03: Birthday has not yet arrived
  it('TC-03: Birthday has not yet arrived', () => {
    const user = new User('test@gmail.com', 'pass1234', 'John', 'Doe', '0812345678', '1990-12-31');
    expect(user.getAge(fixedCurrentDate)).toBe(35);
  });

  // TC-04: Newborn (Born today)
  it('TC-04: Newborn (Born today)', () => {
    const user = new User('test@gmail.com', 'pass1234', 'John', 'Doe', '0812345678', '2026-05-20');
    expect(user.getAge(fixedCurrentDate)).toBe(0);
  });

  // TC-05: Leap Year Birthday
  it('TC-05: Leap Year Birthday', () => {
    const user = new User('test@gmail.com', 'pass1234', 'John', 'Doe', '0812345678', '2000-02-29');
    expect(user.getAge(fixedCurrentDate)).toBe(26);
  });

  // TC-06: Future Date (Invalid)
  it('TC-06: Future Date (Invalid)', () => {
    const user = new User('test@gmail.com', 'pass1234', 'John', 'Doe', '0812345678', '2027-01-01');
    expect(() => user.getAge(fixedCurrentDate)).toThrowError();
  });

  // TC-07: Incorrect Date Format
  it('TC-07: Incorrect Date Format', () => {
    const user = new User('test@gmail.com', 'pass1234', 'John', 'Doe', '0812345678', 'invalid-date' as any);
    expect(() => user.getAge(fixedCurrentDate)).toThrowError();
  });

  // TC-08: Null or Undefined Value
  it('TC-08: Null or Undefined Value', () => {
    const user = new User('test@gmail.com', 'pass1234', 'John', 'Doe', '0812345678', null);
    expect(() => user.getAge(fixedCurrentDate)).toThrowError();
  });

  // TC-09: Maximum Lifespan (Edge)
  it('TC-09: Maximum Lifespan (Edge)', () => {
    const user = new User('test@gmail.com', 'pass1234', 'John', 'Doe', '0812345678', '1900-01-01');
    expect(user.getAge(fixedCurrentDate)).toBe(126);
  });

  // TC-10: Monthly Boundary
  it('TC-10: Monthly Boundary', () => {
    const user = new User('test@gmail.com', 'pass1234', 'John', 'Doe', '0812345678', '1990-05-21');
    expect(user.getAge(fixedCurrentDate)).toBe(35);
  });
});