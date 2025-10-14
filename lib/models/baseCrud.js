import { db } from "../db.js";

export default class BaseCrud {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // Create a single record
  async create(data, conn = db) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);

      const placeholders = keys.map(() => "?").join(", ");
      const sql = `INSERT INTO ${this.tableName} (${keys.join(
        ", "
      )}) VALUES (${placeholders})`;

      await conn.query(sql, values);
      const result = await this.readById(data?.id, conn);
      return result;
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  }

  // Bulk insert multiple records
  async bulkInsert(records, conn = db) {
    try {
      if (!Array.isArray(records) || records.length === 0) {
        throw new Error("bulkInsert expects a non-empty array");
      }

      const keys = Object.keys(records[0]);
      const placeholders = `(${keys.map(() => "?").join(", ")})`;
      const sql = `INSERT INTO ${this.tableName} (${keys.join(
        ", "
      )}) VALUES ${records.map(() => placeholders).join(", ")}`;
      const values = records.flatMap(Object.values);

      const [result] = await conn.query(sql, values);
      return result;
    } catch (error) {
      console.error("Error in bulkInsert:", error);
      throw error;
    }
  }

  // Read with optional filters, sorting, and join
  async read(options = {}, conn = db) {
    try {
      const { filters = {}, sort = {}, join = [] } = options;

      // Step 1: Start building the SELECT query
      let sql = `SELECT ${this.tableName}.*`;

      // Step 2: If joins are present, dynamically alias columns
      if (join.length > 0) {
        for (const j of join) {
          const [columns] = await conn.query(`SHOW COLUMNS FROM ${j.table}`);
          columns.forEach((col) => {
            sql += `, ${j.table}.${col.Field} AS ${j.table}__${col.Field}`;
          });
        }
      }

      // Step 3: FROM base table
      sql += ` FROM ${this.tableName}`;

      // Step 4: Add JOINs if specified
      if (join.length > 0) {
        for (const j of join) {
          if (typeof j.on === "string") {
            sql += ` LEFT JOIN ${j.table} ON ${this.tableName}.${j.on} = ${j.table}.id`;
          } else if (typeof j.on === "object") {
            const { local, foreign } = j.on;
            sql += ` LEFT JOIN ${j.table} ON ${this.tableName}.${local} = ${j.table}.${foreign}`;
          }
        }
      }

      // Step 5: WHERE clauses
      const params = [];
      const whereClauses = Object.entries(filters)
        .map(([key]) => `${this.tableName}.${key} = ?`)
        .join(" AND ");

      if (whereClauses) {
        sql += ` WHERE ${whereClauses}`;
        Object.values(filters).forEach((v) => params.push(v));
      }

      // Step 6: ORDER BY
      if (sort.by) {
        sql += ` ORDER BY ${sort.by} ${
          sort.order?.toUpperCase() === "DESC" ? "DESC" : "ASC"
        }`;
      }

      // Step 7: Run query
      const [rows] = await conn.query(sql, params);

      // Step 8: Nest joined tables if any
      if (join.length > 0) {
        return rows.map((row) => {
          const base = {};
          const nested = {};

          for (const key in row) {
            const [table, col] = key.includes("__")
              ? key.split("__")
              : [null, key];

            if (table && col) {
              if (!nested[table]) nested[table] = {};
              nested[table][col] = row[key];
            } else {
              base[key] = row[key];
            }
          }

          for (const tableName in nested) {
            base[tableName] = nested[tableName];
          }

          return base;
        });
      } else {
        // No joins → return rows as-is
        return rows;
      }
    } catch (error) {
      console.error("Error in read:", error);
      throw error;
    }
  }

  // Read by id
  async readById(id, conn = db) {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`;
      const [rows] = await conn.query(sql, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error in readById:", error);
      throw error;
    }
  }

  // Update by id
  async update(id, data, conn = db) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);

      const setString = keys.map((key) => `${key} = ?`).join(", ");
      const sql = `UPDATE ${this.tableName} SET ${setString} WHERE id = ?`;

      await conn.query(sql, [...values, id]);
      const result = await this.readById(id, conn);
      return result;
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  }

  // Delete by id
  async delete(id, conn = db) {
    try {
      const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
      const [result] = await conn.query(sql, [id]);
      return result;
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  }

  // Run multiple queries inside a transaction
  async transaction(operationsFn) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const result = await operationsFn(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      console.error("Transaction error:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}
