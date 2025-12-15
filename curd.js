var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Roles;
(function (Roles) {
    Roles["SUPERADMIN"] = "SuperAdmin";
    Roles["ADMIN"] = "Admin";
    Roles["SUBSCRIBER"] = "Subscriber";
})(Roles || (Roles = {}));
function FormatDate() {
    return function (target, key) {
        let value = target[key];
        const getter = () => new Date(value).toLocaleString();
        const setter = (newVal) => (value = newVal);
        Object.defineProperty(target, key, { get: getter, set: setter });
    };
}
class User {
    constructor(first, last, email, phone, role, address, 
    // public created:string=new Date().toISOString(),
    editing = false) {
        this.first = first;
        this.last = last;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.address = address;
        this.editing = editing;
        this.createdAt = new Date().toISOString();
    }
}
__decorate([
    FormatDate(),
    __metadata("design:type", String)
], User.prototype, "createdAt", void 0);
class CRUD {
    constructor() {
        this.items = [];
    }
    create(item) { this.items.push(item); }
    read() { return this.items; }
    update(index, item) { this.items[index] = item; }
    delete(index) { this.items.splice(index, 1); }
}
class UserCrud extends CRUD {
    constructor() {
        super();
        this.table = document.getElementById("userTable");
        this.tbody = this.table.querySelector("tbody");
        this.loadBtn = document.getElementById("loadBtn");
        this.isLoaded = false;
        this.originalItems = [];
        this.loadBtn.addEventListener("click", () => this.handleButton());
        this.create(new User("Ritesh", "Kumar", "ritesh@mail.com", "9876543210", Roles.ADMIN, "HP"));
        this.create(new User("Aman", "Singh", "aman@mail.com", "8765432109", Roles.SUPERADMIN, "Mumbai"));
        this.create(new User("Aniket", "Sharma", "aniket@mail.com", "9988776655", Roles.SUBSCRIBER, "Una"));
        this.originalItems = this.items.map(u => {
            const user = new User(u.first, u.last, u.email, u.phone, u.role, u.address);
            user.createdAt = u.createdAt;
            return user;
        });
    }
    handleButton() {
        if (!this.isLoaded) {
            this.load();
            this.loadBtn.textContent = "Refresh";
            this.isLoaded = true;
        }
        else {
            this.refresh();
        }
    }
    load() {
        this.table.style.display = "table";
        this.render();
    }
    refresh() {
        this.items = this.originalItems.map(u => {
            const user = new User(u.first, u.last, u.email, u.phone, u.role, u.address);
            user.createdAt = u.createdAt; // restore decorated date
            return user;
        });
        this.render();
    }
    edit(i) {
        this.items[i].editing = true;
        this.render();
    }
    save(i) {
        const row = this.tbody.children[i];
        const inputs = row.querySelectorAll("input");
        const select = row.querySelector("select");
        const updated = new User(inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value, select.value, inputs[4].value);
        updated.createdAt = this.items[i].createdAt;
        this.update(i, updated);
        this.items[i].editing = false;
        this.render();
    }
    cancel(i) {
        this.items[i].editing = false;
        this.render();
    }
    deleteUser(i) {
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
            }
            else {
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
window.crud = new UserCrud();
