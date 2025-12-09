
enum Roles {
  ADMIN = "Admin",
  USER = "User",
  MANAGER = "Manager"
}

class User {
  constructor(
    public first: string,
    public middle: string,
    public last: string,
    public email: string,
    public phone: string,
    public role: Roles,
    public address: string,
    public editing: boolean = false,
    public backup?: User   
  ) {}
}

interface IUserCrud {
  load(): void;
  refresh(): void;
  edit(index: number): void;
  save(index: number): void;
  cancel(index: number): void;
  delete(index: number): void;
  addUser(newUser: User): void;
}


let userData: User[] = [
  new User("Ritesh", "K", "Kumar", "ritesh@mail.com", "9876543210", Roles.USER, "HP"),
  new User("Aman", "K", "Singh", "aman@mail.com", "8765432109", Roles.MANAGER, "Mumbai"),
  new User("Aniket", "D", "Sharma", "anni123@mail.com", "9988776655", Roles.ADMIN, "UNA")
];


const originalData: User[] = JSON.parse(JSON.stringify(userData));

class UserCrud implements IUserCrud {
  private table = document.getElementById('userTable') as HTMLTableElement;
  private tableBody = document.querySelector("#userTable tbody") as HTMLTableSectionElement;
  private loadBtn = document.getElementById("loadBtn") as HTMLButtonElement;

  constructor() {
    
    this.loadBtn.addEventListener("click", () => {
      if (this.loadBtn.innerText === "Load Data") this.load();
      else this.refresh();
    });

    
    
    const addUserForm = document.getElementById("addUserForm") as HTMLFormElement;
    addUserForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newUser = new User(
        (document.getElementById("first") as HTMLInputElement).value,
        (document.getElementById("middle") as HTMLInputElement).value,
        (document.getElementById("last") as HTMLInputElement).value,
        (document.getElementById("email") as HTMLInputElement).value,
        (document.getElementById("phone") as HTMLInputElement).value,
        (document.getElementById("role") as HTMLSelectElement).value as Roles,
        (document.getElementById("address") as HTMLInputElement).value
      );
      this.addUser(newUser);
      addUserForm.reset();
    });
  }

  load(): void {
  this.renderTable();
  this.table.style.display = "table";
  document.getElementById("addUserForm")!.style.display = "block";  // Show
  this.loadBtn.innerText = "Refresh Table";
}


  refresh(): void {
  userData = JSON.parse(JSON.stringify(originalData));
  this.renderTable();
  document.getElementById("addUserForm")!.style.display = "block";  // keep it visible
}


  
  edit(index: number): void {
  userData[index].backup = JSON.parse(JSON.stringify(userData[index]));  
  userData[index].editing = true;
  this.renderTable();
}



 save(index: number): void {
  const row = this.tableBody.children[index] as HTMLTableRowElement;
  const inputs = row.querySelectorAll("input");
  const select = row.querySelector("select") as HTMLSelectElement;

  userData[index].first = inputs[0].value;
  userData[index].middle = inputs[1].value;
  userData[index].last = inputs[2].value;
  userData[index].email = inputs[3].value;
  userData[index].phone = inputs[4].value;
  userData[index].role = select.value as Roles;         
  userData[index].address = inputs[5].value;             

  userData[index].editing = false;
  userData[index].backup = undefined;
  this.renderTable();
}


  cancel(index: number): void {
  if (userData[index].backup) {
    userData[index] = new User(
      userData[index].backup.first,
      userData[index].backup.middle,
      userData[index].backup.last,
      userData[index].backup.email,
      userData[index].backup.phone,
      userData[index].backup.role,
      userData[index].backup.address
    );
  }

  userData[index].editing = false;
  this.renderTable();
}


  
  delete(index: number): void {
    userData.splice(index, 1);
    this.renderTable();
  }

  
  addUser(newUser: User): void {
    userData.push(newUser);
    this.renderTable();
  }

  private renderTable(): void {
    this.tableBody.innerHTML = "";

    userData.forEach((user, index) => {
      const row = document.createElement("tr");

      if (user.editing) {
        row.innerHTML = `
          <td><input class="edit-input" value="${user.first}"></td>
          <td><input class="edit-input" value="${user.middle}"></td>
          <td><input class="edit-input" value="${user.last}"></td>
          <td><input class="edit-input" value="${user.email}"></td>
          <td><input class="edit-input" value="${user.phone}"></td>
         <td>
  <select>
    <option value="${Roles.ADMIN}" ${user.role === Roles.ADMIN ? "selected" : ""}>Admin</option>
    <option value="${Roles.USER}" ${user.role === Roles.USER ? "selected" : ""}>User</option>
    <option value="${Roles.MANAGER}" ${user.role === Roles.MANAGER ? "selected" : ""}>Manager</option>
  </select>
</td>

          <td><input class="edit-input" value="${user.address}"></td>
          <td>
            <button onclick="crud.save(${index})">Save</button>
            <button onclick="crud.cancel(${index})">Cancel</button>
          </td>
        `;
      } else {
        row.innerHTML = `
          <td>${user.first}</td>
          <td>${user.middle}</td>
          <td>${user.last}</td>
          <td>${user.email}</td>
          <td>${user.phone}</td>
          <td>${user.role}</td>
          <td>${user.address}</td>
          <td>
            <button onclick="crud.edit(${index})">Edit</button>
            <button onclick="crud.delete(${index})">Delete</button>
          </td>
        `;
      }

      this.tableBody.appendChild(row);
    });
  }
}

// Expose instance globally
(window as any).crud = new UserCrud();