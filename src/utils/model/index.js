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

  async findCategoryWithCount(fields) {
    console.log(Object.values(fields).length);
    if (!fields || Object.values(fields).length === 0) {
      const query = `SELECT "category_id_PK",COUNT("category_id_PK"),name,img 
      FROM ${this.name} GROUP BY "category_id_PK";`;
      const response = await this.run(query);
      return response;
    } else {
      const entries = Object.entries(fields);
      const whereClause = `${entries
        .map(([key, value]) => `"${key}"='${value}'`)
        .join(" AND ")}`;

      const query = `SELECT "category_id_PK",COUNT("category_id_PK"),name,img 
      FROM ${this.name} WHERE  ${whereClause};`;
      const response = await this.run(query);
      console.log(response);
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

  async articlesFindOne(id, idField) {
    if (!id) {
      throw new Error("Hey you did not provided id!");
    }
    const query = `SELECT articles."article_id_PK",
    articles."headLine",
    articles."subHead",
    articles.content,
    articles.cover,
    authors.first_name AS author,
    categories.name AS category,
    Count(reviews.article_id) AS total_reviews
    FROM ${this.name} 
    INNER JOIN articles_authors
    ON "article_id_PK"=articles_authors.article_id
    INNER JOIN authors
    ON articles_authors.author_id="author_id_PK"
    INNER JOIN categories 
    ON category_id=categories."category_id_PK"
    INNER JOIN reviews
    ON "article_id_PK" = reviews.article_id 
    WHERE "${idField}"=${parseInt(id, 10)}
    GROUP BY 
    articles."article_id_PK",
    articles."headLine",
    articles."subHead",
    articles.content,
    articles.cover,
    authors.first_name,
    categories.name`;
    let response = await this.run(query);
    if (response.rows == 0) {
      const query = `SELECT * FROM ${this.name} WHERE "${idField}"=${parseInt(
        id,
        10
      )}`;
      response = await this.run(query);
    }
    return response;
  }

  async findOneWithJoin(fields) {
    if (!fields || Object.values(fields).length === 0) {
      const query = `SELECT articles."article_id_PK", articles."headLine",
       articles."subHead", 
       articles.content, 
       authors.first_name AS author, 
       categories.name AS category,
       Count(reviews.article_id) AS total_reviews
      FROM ${this.name} 
      INNER JOIN articles_authors ON "article_id_PK"=articles_authors.article_id 
      INNER JOIN categories ON category_id=categories."category_id_PK" 
      INNER JOIN authors ON articles_authors.author_id="author_id_PK"
      INNER JOIN reviews ON "article_id_PK" = reviews.article_id 
      GROUP BY 
      articles."article_id_PK",
      articles."headLine",
      articles."subHead",
      articles.content,
      articles.cover,
      authors.first_name,
      categories.name`;
      const response = await this.run(query);
      const whereCondition = `${response.rows
        .map((row) => `"article_id_PK"<>${row.article_id_PK}`)
        .join(" AND ")}`;
      const queryWithNoReviews = `SELECT * FROM articles WHERE ${whereCondition}`;
      // console.log(queryWithNoReviews);
      const responseForQueryWithNoReviews = await this.run(queryWithNoReviews);
      // console.log(responseForQueryWithNoReviews.rows);
      const newResponse = responseForQueryWithNoReviews.rows.concat(
        response.rows
      );
      // console.log(newResponse);
      return newResponse;
    } else {
      const entries = Object.entries(fields);
      const whereClause = `${entries
        .map(([key, value]) => `"${key}"LIKE'%${value}%'`)
        .join(" AND ")}`;

      const query = `SELECT articles."article_id_PK", articles."headLine",
      articles."subHead", 
      articles.content, 
      authors.first_name AS author, 
      categories.name AS category,
      Count(reviews.article_id) AS total_reviews
      FROM ${this.name} 
      INNER JOIN articles_authors ON "article_id_PK"=articles_authors.article_id 
      INNER JOIN categories ON category_id=categories."category_id_PK" 
      INNER JOIN authors ON articles_authors.author_id="author_id_PK"
      INNER JOIN reviews ON "article_id_PK" = reviews.article_id 
      GROUP BY 
      articles."article_id_PK",
      articles."headLine",
      articles."subHead",
      articles.content,
      articles.cover,
      authors.first_name,
      categories.name WHERE  ${whereClause};`;
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
