export class User {
  constructor(
    public userEmail: string = '',
    public userPassword: string = '',
    public userFirstName: string = '',
    public userLastName: string = '',
    public userTel: string = '',
    public dateOfBirth: string | Date | null | undefined = null
  ) {}

  getAge(currentDate: Date = new Date()): number {
    if (this.dateOfBirth === null || this.dateOfBirth === undefined) {
      throw new Error('Error / Exception: Null or Undefined Value');
    }

    const dob = new Date(this.dateOfBirth);
    if (isNaN(dob.getTime())) {
      throw new Error('Error / Exception: Invalid Date Format');
    }

    if (dob > currentDate) {
      throw new Error('Error / Exception: Future Date (Invalid)');
    }

    let age = currentDate.getFullYear() - dob.getFullYear();
    const monthDiff = currentDate.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  }
}