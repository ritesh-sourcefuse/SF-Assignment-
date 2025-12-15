
enum Roles {
  SUPERADMIN = "SuperAdmin",
  ADMIN = "Admin",
  SUBSCRIBER = "Subscriber"
}


function FormatDate() {
  return function (target: any, key: string) {
    let value = target[key];

    const getter = () => new Date(value).toLocaleString();
    const setter = (newVal: string) => (value = newVal);

    Object.defineProperty(target, key, { get: getter, set: setter });
  };
}

class User {
  @FormatDate()
  createdAt: string = new Date().toISOString();

  constructor(
    public first: string,
    public last: string,
    public email: string,
    public phone: string,
    public role: Roles,
    public address: string,
    public editing: boolean = false
  ) {}
}


class CRUD<T> {
  protected items: T[] = [];

  create(item: T) { this.items.push(item); }
  read(): T[] { return this.items; }
  update(index: number, item: T) { this.items[index] = item; }
  delete(index: number) { this.items.splice(index, 1); }
}


class UserCrud extends CRUD<User> {

  table = document.getElementById("userTable") as HTMLTableElement;
  tbody = this.table.querySelector("tbody") as HTMLTableSectionElement;
  loadBtn = document.getElementById("loadBtn") as HTMLButtonElement;

  isLoaded = false;

  originalItems: User[] = [];

  constructor() {
    super();

    this.loadBtn.addEventListener("click", () => this.handleButton());


    this.create(new User("Ritesh", "Kumar", "ritesh@mail.com", "9876543210", Roles.ADMIN, "HP",));
    this.create(new User("Aman", "Singh", "aman@mail.com", "8765432109", Roles.SUPERADMIN, "Mumbai",));
    this.create(new User("Aniket", "Sharma", "aniket@mail.com", "9988776655", Roles.SUBSCRIBER, "Una",));


   this.originalItems = this.items.map(u => {
  const user = new User(
    u.first,
    u.last,
    u.email,
    u.phone,
    u.role,
    u.address,
   
  );
  user.createdAt = u.createdAt;
  return user;
});

  }


  handleButton() {
    if (!this.isLoaded) {
      this.load();
      this.loadBtn.textContent = "Refresh";
      this.isLoaded = true;
    } else {
      this.refresh();
    }
  }

  load() {
    this.table.style.display = "table";
    this.render();
  }


  refresh() {
  this.items = this.originalItems.map(u => {
    const user = new User(
      u.first,
      u.last,
      u.email,
      u.phone,
      u.role,
      u.address,
        // your manual date
    );
    user.createdAt = u.createdAt;  // restore decorated date
    return user;
  });

  this.render();
}


  edit(i: number) {
    this.items[i].editing = true;
    this.render();
  }

  save(i: number) {
    const row = this.tbody.children[i] as HTMLTableRowElement;
    const inputs = row.querySelectorAll("input");
    const select = row.querySelector("select") as HTMLSelectElement;

    const updated = new User(
      inputs[0].value,
      inputs[1].value,
      inputs[2].value,
      inputs[3].value,
      select.value as Roles,
      inputs[4].value,
      
    );

    updated.createdAt = this.items[i].createdAt; 
    this.update(i, updated);

    this.items[i].editing = false;
    this.render();
  }

  cancel(i: number) {
    this.items[i].editing = false;
    this.render();
  }

  deleteUser(i: number) {
    this.delete(i);
    this.render();
  }

  render() {
    this.tbody.innerHTML = "";

    this.items.forEach((u, i) => {
      const row = document.createElement("tr");

      if (u.editing) {
        row.innerHTML = `
          <td><input value="${u.first}"></td>
          <td><input value="${u.last}"></td>
          <td><input value="${u.email}"></td>
          <td><input value="${u.phone}"></td>

          <td>
            <select>
              <option value="SuperAdmin" ${u.role === Roles.SUPERADMIN ? "selected" : ""}>SuperAdmin</option>
              <option value="Admin" ${u.role === Roles.ADMIN ? "selected" : ""}>Admin</option>
              <option value="Subscriber" ${u.role === Roles.SUBSCRIBER ? "selected" : ""}>Subscriber</option>
            </select>
          </td>

          <td><input value="${u.address}"></td>
          <td>${u.createdAt}</td>

          <td>
            <button onclick="crud.save(${i})">Save</button>
            <button onclick="crud.cancel(${i})">Cancel</button>
          </td>
        `;
      } else {
        row.innerHTML = `
          <td>${u.first}</td>
          <td>${u.last}</td>
          <td>${u.email}</td>
          <td>${u.phone}</td>
          <td>${u.role}</td>
          <td>${u.address}</td>
          <td>${u.createdAt}</td>

          <td>
            <button onclick="crud.edit(${i})">Edit</button>
            <button onclick="crud.deleteUser(${i})">Delete</button>
          </td>
        `;
      }

      this.tbody.appendChild(row);
    });
  }
}

// Global instance
(window as any).crud = new UserCrud();
