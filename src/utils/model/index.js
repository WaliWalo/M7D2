const db = require("../db");

class Model {
  constructor(name) {
    this.name = name;
  }
  async run(query) {
    try {
      const response = await db.query(query);
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findById(id, idField) {
    if (!id) {
      throw new Error("Hey you did not provided id!");
    }
    const query = `SELECT * FROM ${this.name} WHERE "${idField}"=${parseInt(
      id,
      10
    )}`;
    const response = await this.run(query);
    return response;
  }

  async findByIdAndDelete(id, idField) {
    if (!id) {
      throw new Error("Hey you did not provided id!");
    }
    const query = `DELETE  FROM ${this.name} WHERE "${idField}"=${parseInt(
      id,
      10
    )}`;
    const response = await this.run(query);
    return response;
  }

  async findByIdAndUpdate(id, fields, idField) {
    if (!id) {
      throw new Error("Hey you did not provided id!");
    }
    const entries = Object.entries(fields); // [['name','Luis'],['lastname','Ordonez']] => name='Luis' ,

    const query = `UPDATE ${this.name} SET ${entries
      .map(([column, value]) => `"${column}"='${value}'`)
      .join(",")} WHERE "${idField}"=${parseInt(id)};`;
    console.log(query);
    const response = await this.run(query);
    console.log(response);
    return response;
  }

  async findOne(fields) {
    // {name:'Luis',lastname:'Ordonez'} => 'name'="'Diego'" AND 'lastname'="'Banovaz'"
    if (!fields || Object.values(fields).length === 0) {
      const query = `SELECT * FROM ${this.name}`;
      const response = await this.run(query);
      return response;
    } else {
      const entries = Object.entries(fields);
      const whereClause = `${entries
        .map(([key, value]) => `"${key}"='${value}'`)
        .join(" AND ")}`;

      const query = `SELECT * FROM ${this.name} WHERE  ${whereClause};`;
      const response = await this.run(query);
      return response;
    }
  }

  async findReview() {
    const query = `SELECT reviews.text, authors.first_name AS author FROM ${this.name} 
      INNER JOIN authors ON author_id=authors."author_id_PK"`;
    console.log(query);
    const response = await this.run(query);
    return response;
  }

  async findOneWithJoin(fields) {
    if (!fields || Object.values(fields).length === 0) {
      const query = `SELECT articles."headLine", articles."subHead", articles.content, categories.name AS category 
      FROM ${this.name} INNER JOIN categories ON category_id=categories."category_id_PK"`;
      const response = await this.run(query);
      return response;
    } else {
      const entries = Object.entries(fields);
      const whereClause = `${entries
        .map(([key, value]) => `"${key}"='${value}'`)
        .join(" AND ")}`;

      const query = `SELECT articles."headLine", articles."subHead", articles.content, categories.name AS category 
      FROM ${this.name} INNER JOIN categories ON category_id=categories."category_id_PK" WHERE  ${whereClause};`;
      const response = await this.run(query);
      return response;
    }
  }

  async save(fields) {
    if (!fields || Object.values(fields).length === 0) {
      throw new Error("How can I create without values?");
    }
    const columns = Object.keys(fields);
    const values = Object.values(fields);
    const query = `INSERT INTO  ${this.name} (${columns
      .map((column) => `"${column}"`)
      .join(",")}) VALUES (${values.map((v) => `'${v}'`).join(",")});`;
    const response = await this.run(query);
    return response;
  }

  async saveWithId(fields, articleId) {
    if (!fields || Object.values(fields).length === 0) {
      throw new Error("How can I create without values?");
    }
    const columns = Object.keys(fields);
    columns.push("article_id");
    const values = Object.values(fields);
    values.push(articleId);
    const query = `INSERT INTO  ${this.name} (${columns
      .map((column) => `"${column}"`)
      .join(",")}) VALUES (${values.map((v) => `'${v}'`).join(",")});`;
    const response = await this.run(query);
    return response;
  }

  async saveWithJoinTable(fields, tableName, authorId, idField) {
    if (
      !authorId ||
      !tableName ||
      !fields ||
      Object.values(fields).length === 0
    ) {
      throw new Error("How can I create without values?");
    } else {
      const columns = Object.keys(fields);
      const values = Object.values(fields);
      const query = `INSERT INTO  ${this.name} (${columns
        .map((column) => `"${column}"`)
        .join(",")}) VALUES (${values
        .map((v) => `'${v}'`)
        .join(",")}) RETURNING "${idField}";`;
      const response = await this.run(query);
      const articleId = response.rows[0].article_id_PK;
      const joinQuery = `INSERT INTO ${tableName} (article_id, author_id) VALUES (${articleId}, ${authorId.authorId})`;
      console.log(joinQuery);
      await this.run(joinQuery);
      return response;
    }
  }
}

module.exports = Model;
