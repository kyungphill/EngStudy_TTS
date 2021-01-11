import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { SentenceService } from '../shared/sentence.service';
import { Sentence } from '../shared/sentence';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.page.html',
  styleUrls: ['./contact-form.page.scss'],
})
export class ContactFormPage implements OnInit {
  title: string = 'Create New';
  sentence: Sentence;
  articles: string[] = [];

  toggleArticle: boolean = true;
  toggleInputArticle: boolean = false;
  toggleChooseArticle: boolean = false;
  selected_option: string = 'Test';

  constructor(
    private sentenceService: SentenceService,
    private route: ActivatedRoute, 
    private toastCtrl: ToastController) { }

  ngOnInit() {
    this.sentence = new Sentence();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.title = 'Edit content';
      this.loadSentence(parseInt(idParam));
    }
  }
  initCreate() {
    this.toggleArticle = true;
    this.toggleChooseArticle = false;
    this.toggleInputArticle = false;
  }
  onChange($event) {
    console.log($event.detail.value);
    this.sentence.article = $event.detail.value;
    console.log(this.sentence);
  }
  backArticleMenu() {
    this.toggleArticle = true;
    this.toggleChooseArticle = false;
    this.toggleInputArticle = false;
  }
  createNewArticle() {
    this.toggleArticle = false;
    this.toggleInputArticle = true;

    this.loadArticles();// check new article already exist
  }
  chooseArticle() {
    this.toggleArticle = false;
    this.toggleChooseArticle = true;
    this.loadArticles();
  }
  //for select arcticles
  async loadArticles() {
    this.articles = await this.sentenceService.getArticles();
  }

  //Edit mode search by ID
  async loadSentence(id: number) {
    this.sentence = await this.sentenceService.getById(id);
  }

  async onSubmit() {
    try {
      if(this.toggleInputArticle) {
        if(this.articles.indexOf(this.sentence.article) != -1) {
          throw(this.articles + ' already exist!')
        }
      }
      const result = await this.sentenceService.save(this.sentence, this.toggleInputArticle);
      this.sentence.id = result.insertId;

      //PopUp Success Message
      const toast = await this.toastCtrl.create({
        header: 'Completed',
        message: 'New sentence added successfully.',
        color: 'success',
        position: 'bottom',
        duration: 1000
      });

      toast.present();
    } catch (error) {
      //PopUp Error Message
      const toast = await this.toastCtrl.create({
        header: 'Error',
        message: error,
        color: 'danger',
        position: 'bottom',
        duration: 1000
      });

      toast.present();
    }
  }
}
