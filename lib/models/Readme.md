# 📦 BaseCrud Class for MySQL in Express

A reusable class that provides basic CRUD operations for MySQL using `mysql2/promise`. Easily extendable and perfect for modular, scalable API design.

---

## ✅ Features

- `Create(data)`
- `Read(options)`
  - Supports **filters**, **sorting**, and **foreign key joins**

- `ReadById(id)`
- `Update(id, data)`
- `Delete(id)`
- `Transactions`
    - Supports all of the above functions in one go

---

## 📁 File Location

Create the file:

```
@/lib/models/BaseCrud.js
```

---

## 💡 Example Usage

### 1. Create a model file for users

```js
// models/user.model.js
const BaseCrud = require("./BaseCrud");
const userCrud = new BaseCrud("users");

module.exports = userCrud;
```

---

### 2. Create a user (POST)

```js
await userCrud.create({
  id: "uuid",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "hashedPassword",
  salt: "salt",
  username: "johnny",
  contact: "1234567890",
  avatar: "avatar.png",
});
```

---

### 3. Read all users with filters, sorting, and join

```js
const users = await userCrud.read({
  filters: { "users.contact": "1234567890" },
  sort: { by: "users.createdAt", order: "DESC" },
  join: [
    {
      table: "organisations",
      on: "users.organisationId = organisations.id",
    },
  ],
});
```

---

### 4. Get a user by ID

```js
const user = await userCrud.readById("some-uuid");
```

---

### 5. Update a user

```js
await userCrud.update("some-uuid", {
  email: "new@example.com",
  contact: "9876543210",
});
```

---

### 6. Delete a user

```js
await userCrud.delete("some-uuid");
```

### 7. Use a transaction for using all of the above

```js
await userCrud.transaction(async (conn) => {
  const user = await userCrud.create({ firstName: "Alice" }, conn);
  const order = await orderCrud.create(
    { userId: user.insertId, total: 100 },
    conn
  );
  return { user, order };
});
```

---

## 🔧 Options Reference

| Option       | Type   | Description                        |
| ------------ | ------ | ---------------------------------- |
| `filters`    | Object | Key-value filters for WHERE clause |
| `sort.by`    | String | Column name to sort by             |
| `sort.order` | String | `ASC` or `DESC` (default: `ASC`)   |
| `join`       | Array  | Join definitions: `{ table, on }`  |

---

## 🔒 Notes

- Uses **prepared statements** to prevent SQL injection.
- You can add:

  - Pagination (`LIMIT`, `OFFSET`)
  - Soft deletes (`isDeleted`)
  - Column selection (`SELECT col1, col2` instead of `*`)

---
