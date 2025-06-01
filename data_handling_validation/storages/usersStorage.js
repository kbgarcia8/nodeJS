// This class lets us simulate interacting with a database.
class UsersStorage {
  constructor() {
    this.storage = [
      { id: 1, firstName: "Alice", lastName: "Smith", userAge: 28, userBio: "Loves painting and hiking.", userEmail: "alice.smith@example.com" },
      { id: 2, firstName: "Bob", lastName: "Johnson", userAge: 35, userBio: "Avid reader and amateur photographer.", userEmail: "bob.johnson@example.com" },
      { id: 3, firstName: "Charlie", lastName: "Lee", userAge: 22, userBio: "Computer science student and gamer.", userEmail: "charlie.lee@example.com" },
      { id: 4, firstName: "Dana", lastName: "Martinez", userAge: 40, userBio: "Marketing professional and foodie.", userEmail: "dana.martinez@example.com" },
      { id: 5, firstName: "Eli", lastName: "Brown", userAge: 31, userBio: "Music producer and traveler.", userEmail: "eli.brown@example.com" },
      { id: 6, firstName: "Fiona", lastName: "Davis", userAge: 26, userBio: "Yoga instructor and nature lover.", userEmail: "fiona.davis@example.com" },
      { id: 7, firstName: "George", lastName: "Clark", userAge: 45, userBio: "History buff and podcast host.", userEmail: "george.clark@example.com" },
      { id: 8, firstName: "Hannah", lastName: "Garcia", userAge: 29, userBio: "Freelance writer and film critic.", userEmail: "hannah.garcia@example.com" },
      { id: 9, firstName: "Ivan", lastName: "Miller", userAge: 33, userBio: "Software engineer and DIY enthusiast.", userEmail: "ivan.miller@example.com" },
      { id: 10, firstName: "Julia", lastName: "Wilson", userAge: 24, userBio: "Fashion designer and cat lover.", userEmail: "julia.wilson@example.com" },
      { id: 11, firstName: "Kevin", lastName: "Anderson", userAge: 37, userBio: "Entrepreneur and fitness coach.", userEmail: "kevin.anderson@example.com" },
      { id: 12, firstName: "Lena", lastName: "Thomas", userAge: 30, userBio: "Digital artist and coffee fan.", userEmail: "lena.thomas@example.com" },
      { id: 13, firstName: "Mike", lastName: "Moore", userAge: 41, userBio: "Architect and weekend cyclist.", userEmail: "mike.moore@example.com" },
      { id: 14, firstName: "Nora", lastName: "Taylor", userAge: 23, userBio: "College student and dog rescuer.", userEmail: "nora.taylor@example.com" },
      { id: 15, firstName: "Omar", lastName: "Jackson", userAge: 39, userBio: "Civil engineer and bookworm.", userEmail: "omar.jackson@example.com" },
      { id: 16, firstName: "Paula", lastName: "White", userAge: 27, userBio: "Social worker and dancer.", userEmail: "paula.white@example.com" },
      { id: 17, firstName: "Quinn", lastName: "Harris", userAge: 32, userBio: "Chef and adventure seeker.", userEmail: "quinn.harris@example.com" },
      { id: 18, firstName: "Rita", lastName: "Martin", userAge: 36, userBio: "High school teacher and blogger.", userEmail: "rita.martin@example.com" },
      { id: 19, firstName: "Sam", lastName: "Thompson", userAge: 25, userBio: "UI/UX designer and poet.", userEmail: "sam.thompson@example.com" },
      { id: 20, firstName: "Tina", lastName: "Walker", userAge: 38, userBio: "Lawyer and community activist.", userEmail: "tina.walker@example.com" }
    ];
    this.id = 0;
  }

  addUser({ firstName, lastName, userAge, userBio }) {
    const id = this.id;
    this.storage[id] = { id, firstName, lastName, userEmail, userAge, userBio };
    this.id++;
  }

  getUsers() {
    return Object.values(this.storage);
  }

  getUser(id) {
    return this.storage[id];
  }

  updateUser(id, { firstName, lastName }) {
    this.storage[id] = { id, firstName, lastName };
  }

  deleteUser(id) {
    delete this.storage[id];
  }
}
// Rather than exporting the class, we can export an instance of the class by instantiating it.
// This ensures only one instance of this class can exist, also known as the "singleton" pattern.
const usersStorage = new UsersStorage();
export default usersStorage;
