import { ToastController, AlertController } from '@ionic/angular';
import { SentenceService } from '../shared/sentence.service';
import { Sentence } from '../shared/sentence';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.page.html',
  styleUrls: ['./contact-list.page.scss'],
})
export class ContactListPage implements OnInit {
  sentences: Sentence[] = [];

  articles: string[] = [];

  information: any[];
  automaticClose = false;

  constructor(
    private sentenceService: SentenceService, 
    private toastCtrl: ToastController, 
    private alertCtrl: AlertController,
    ) { 
    }
  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadSentences();
  }
  async loadArticles() {
    this.articles = await this.sentenceService.getArticles();
  }
  async loadSentences() {
    this.sentences = await this.sentenceService.getAll();
  }

  doSerchClear() {
    this.loadSentences();
  }

  async doSerchBarChange($event: any) {
    const value = $event.target.value;
    if (value && value.length >= 2) {
      this.sentences = await this.sentenceService.filter(value);
    }
  }

  async delete(sentence: Sentence) {
    const alert = await this.alertCtrl.create({
      header: 'Delete?',
      message: `delete this article: ${sentence.article}?`,
      buttons: [
        {
          text: 'Cancle',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.executeDelete(sentence);
          }
        }
      ]
    });

    alert.present();
  }

  async executeDelete(sentence: Sentence) {
    try {
      // Removendo do banco de dados
      await this.sentenceService.delete(sentence.id);

      // Remove do array
      const index = this.sentences.indexOf(sentence);
      this.sentences.splice(index, 1);

      const toast = await this.toastCtrl.create({
        header: 'Sucess',
        message: 'deleted sentece sucessfully.',
        color: 'success',
        position: 'bottom',
        duration: 3000
      });

      toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        header: 'Error',
        message: 'Something error occured.',
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });

      toast.present();
    }
  }
}
