// Enum for roles
var Roles;
(function (Roles) {
    Roles["ADMIN"] = "Admin";
    Roles["USER"] = "User";
    Roles["MANAGER"] = "Manager";
})(Roles || (Roles = {}));
// User model class
var User = /** @class */ (function () {
    function User(first, middle, last, email, phone, role, address, editing, backup) {
        if (editing === void 0) { editing = false; }
        this.first = first;
        this.middle = middle;
        this.last = last;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.address = address;
        this.editing = editing;
        this.backup = backup;
    }
    return User;
}());
// Initial user data
var userData = [
    new User("Ritesh", "K", "Kumar", "ritesh@mail.com", "9876543210", Roles.USER, "HP"),
    new User("Aman", "K", "Singh", "aman@mail.com", "8765432109", Roles.MANAGER, "Mumbai"),
    new User("Aniket", "D", "Sharma", "anni123@mail.com", "9988776655", Roles.ADMIN, "UNA")
];
// Keep a copy for refresh
var originalData = JSON.parse(JSON.stringify(userData));
var UserCrud = /** @class */ (function () {
    function UserCrud() {
        var _this = this;
        this.table = document.getElementById('userTable');
        this.tableBody = document.querySelector("#userTable tbody");
        this.loadBtn = document.getElementById("loadBtn");
        // Load/Refresh button
        this.loadBtn.addEventListener("click", function () {
            if (_this.loadBtn.innerText === "Load Data")
                _this.load();
            else
                _this.refresh();
        });
        // Add user form
        var addUserForm = document.getElementById("addUserForm");
        addUserForm.addEventListener("submit", function (e) {
            e.preventDefault();
            var newUser = new User(document.getElementById("first").value, document.getElementById("middle").value, document.getElementById("last").value, document.getElementById("email").value, document.getElementById("phone").value, document.getElementById("role").value, document.getElementById("address").value);
            _this.addUser(newUser);
            addUserForm.reset();
        });
    }
    UserCrud.prototype.load = function () {
        this.renderTable();
        this.table.style.display = "table";
        document.getElementById("addUserForm").style.display = "block"; // ✅ Show form
        this.loadBtn.innerText = "Refresh Table";
    };
    UserCrud.prototype.refresh = function () {
        userData = JSON.parse(JSON.stringify(originalData));
        this.renderTable();
        document.getElementById("addUserForm").style.display = "block"; // keep it visible
    };
    // Edit row
    UserCrud.prototype.edit = function (index) {
        userData[index].backup = JSON.parse(JSON.stringify(userData[index]));
        userData[index].editing = true;
        this.renderTable();
    };
    UserCrud.prototype.save = function (index) {
        var row = this.tableBody.children[index];
        var inputs = row.querySelectorAll("input");
        var select = row.querySelector("select");
        userData[index].first = inputs[0].value;
        userData[index].middle = inputs[1].value;
        userData[index].last = inputs[2].value;
        userData[index].email = inputs[3].value;
        userData[index].phone = inputs[4].value;
        userData[index].role = select.value;
        userData[index].address = inputs[5].value;
        userData[index].editing = false;
        userData[index].backup = undefined;
        this.renderTable();
    };
    UserCrud.prototype.cancel = function (index) {
        if (userData[index].backup) {
            userData[index] = new User(userData[index].backup.first, userData[index].backup.middle, userData[index].backup.last, userData[index].backup.email, userData[index].backup.phone, userData[index].backup.role, userData[index].backup.address);
        }
        userData[index].editing = false;
        this.renderTable();
    };
    // Delete row
    UserCrud.prototype.delete = function (index) {
        userData.splice(index, 1);
        this.renderTable();
    };
    // Add new user
    UserCrud.prototype.addUser = function (newUser) {
        userData.push(newUser);
        this.renderTable();
    };
    // Render table
    UserCrud.prototype.renderTable = function () {
        var _this = this;
        this.tableBody.innerHTML = "";
        userData.forEach(function (user, index) {
            var row = document.createElement("tr");
            if (user.editing) {
                row.innerHTML = "\n          <td><input class=\"edit-input\" value=\"".concat(user.first, "\"></td>\n          <td><input class=\"edit-input\" value=\"").concat(user.middle, "\"></td>\n          <td><input class=\"edit-input\" value=\"").concat(user.last, "\"></td>\n          <td><input class=\"edit-input\" value=\"").concat(user.email, "\"></td>\n          <td><input class=\"edit-input\" value=\"").concat(user.phone, "\"></td>\n         <td>\n  <select>\n    <option value=\"").concat(Roles.ADMIN, "\" ").concat(user.role === Roles.ADMIN ? "selected" : "", ">Admin</option>\n    <option value=\"").concat(Roles.USER, "\" ").concat(user.role === Roles.USER ? "selected" : "", ">User</option>\n    <option value=\"").concat(Roles.MANAGER, "\" ").concat(user.role === Roles.MANAGER ? "selected" : "", ">Manager</option>\n  </select>\n</td>\n\n          <td><input class=\"edit-input\" value=\"").concat(user.address, "\"></td>\n          <td>\n            <button onclick=\"crud.save(").concat(index, ")\">Save</button>\n            <button onclick=\"crud.cancel(").concat(index, ")\">Cancel</button>\n          </td>\n        ");
            }
            else {
                row.innerHTML = "\n          <td>".concat(user.first, "</td>\n          <td>").concat(user.middle, "</td>\n          <td>").concat(user.last, "</td>\n          <td>").concat(user.email, "</td>\n          <td>").concat(user.phone, "</td>\n          <td>").concat(user.role, "</td>\n          <td>").concat(user.address, "</td>\n          <td>\n            <button onclick=\"crud.edit(").concat(index, ")\">Edit</button>\n            <button onclick=\"crud.delete(").concat(index, ")\">Delete</button>\n          </td>\n        ");
            }
            _this.tableBody.appendChild(row);
        });
    };
    return UserCrud;
}());
// Expose instance globally
window.crud = new UserCrud();
