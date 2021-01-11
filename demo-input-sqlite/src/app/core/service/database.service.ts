import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  db: SQLiteObject;
  databaseName: string = 'sentences.db';

  constructor(private sqlite: SQLite, private sqlitePorter: SQLitePorter) { }

  async openDatabase() {
    try {
      this.db = await this.sqlite.create({ name: this.databaseName, location: 'default' });
      await this.createDatabase();
      console.log('openDatabase is started!');
    } catch (error) {
      console.error('openDatabase has something error!!', error);
    }
  }

  async createDatabase() {
    const sqlCreateDatabase = this.getCreateTable();
    const result = await this.sqlitePorter.importSqlToDb(this.db, sqlCreateDatabase);
    return result ? true : false;
  }

  getCreateTable() {
    const sqls = [];
    sqls.push('\
      CREATE TABLE IF NOT EXISTS \
      sentences ( \
        id integer primary key AUTOINCREMENT, \
        article varchar(100), \
        script_order integer, \
        title varchar(100), \
        eng_content varchar(100), \
        kor_content varcahr(100) \
        ); \
    ');
    sqls.push('\
      CREATE TABLE IF NOT EXISTS\
      articles ( \
        articleId integer primary key AUTOINCREMENT, \
        article_title varchar(100), \
        article_img varchar(100) \
        ); \
    ');
    return sqls.join('\n');
  }

  executeSQL(sql: string, params?: any[]) {
    return this.db.executeSql(sql, params);
  }
}
