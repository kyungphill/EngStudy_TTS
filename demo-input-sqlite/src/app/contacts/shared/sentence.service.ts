import { Sentence } from './sentence';
import { DatabaseService } from '../../core/service/database.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SentenceService {

  constructor(private db: DatabaseService) { }

  save(sentence: Sentence, createNewArticle: boolean) {
    if (sentence.id > 0) {
      //Edit existed sentence
      return this.update(sentence);
    } else {
      //Insert New Sentence
      if(createNewArticle)
        this.insertNewArticle(sentence);
      return this.insert(sentence);
    }
  }
  private insertNewArticle(sentence) {
    const sql = 'insert into articles (\
      article_title \
      ) values (?)';
    const data = [sentence.article];
    return this.db.executeSQL(sql, data);
  }
  private insert(sentence: Sentence) {
    const sql = 'insert into sentences (\
      article, \
      script_order, \
      title, \
      eng_content, \
      kor_content \
      ) values (?, ?, ?, ?, ?)';
    const data = [
      sentence.article,
      sentence.script_order,
      sentence.title,
      sentence.eng_content,
      sentence.kor_content
    ];

    return this.db.executeSQL(sql, data);
  }
//TODO: update 부분 수정해야
  private update(sentence: Sentence) {
    const sql = 'update sentences set article = ? where id = ?';
    const data = [sentence.article, sentence.id];

    return this.db.executeSQL(sql, data);
  }

  delete(id: number) {
    const sql = 'delete from sentences where id = ?';
    const data = [id];

    return this.db.executeSQL(sql, data);
  }

  deleteArticle(article: string) {
    const sql = 'delete from articles where article_title = ?';
    const data = [article];
    //Todo: 해당 article의 script 도 모두 지우기!!
    return this.db.executeSQL(sql, data);
  }

  async getById(id: number) {
    const sql = 'select * from sentences where id = ?';
    const data = [id];
    const result = await this.db.executeSQL(sql, data);
    const rows = result.rows;
    const sentence = new Sentence();
    if (rows && rows.length > 0) {
      const item = rows.item(0);
      sentence.id = item.id;
      sentence.article = item.article;
      sentence.script_order = item.script_order;      
      sentence.title = item.title;
      sentence.eng_content = item.eng_content;
      sentence.kor_content = item.kor_content;
    }
    return sentence;
  }

  async getAll() {
    const sql = 'select * from sentences';
    const result = await this.db.executeSQL(sql);
    const sentences = this.fillSentences(result.rows);
    return sentences;
  }

  async getArticles() {
    const sql = 'select * from articles';
    const result = await this.db.executeSQL(sql);
    const articles = this.fillArticles(result.rows);
    return articles;
  }

  async getSelectedScripts(selectedArticle: string) {
    const sql = 'select * from sentences where article like? order by script_order asc';
    const data = [`%${selectedArticle}`];
    const result = await this.db.executeSQL(sql, data);
    const sentences = this.fillSentences(result.rows);
    return sentences
  }

  private fillArticles(rows: any) {
    const articles: string[] = [];
    for(let i = 0; i < rows.length; i++) {
      const article: string =  rows.item(i).article_title;
      articles.push(article);
    }
    return articles;
  }
  async filter(text: string) {
    const sql = 'select * from sentences where title like?';
    const data = [`%${text}%`];
    const result = await this.db.executeSQL(sql, data);
    const sentences = this.fillSentences(result.rows);
    return sentences;
  }

  private fillSentences(rows: any) {
    const sentences: Sentence[] = [];

    for (let i = 0; i < rows.length; i++) {
      const item = rows.item(i);
      const sentence = new Sentence();
      sentence.id = item.id;
      sentence.article = item.article;
      sentence.title = item.title;
      sentence.script_order = item.script_order;
      sentence.eng_content = item.eng_content;
      sentence.kor_content = item.kor_content;
      sentences.push(sentence);
    }

    return sentences;
  }
}
