import { ToastController, AlertController } from '@ionic/angular';
import { SentenceService } from '../shared/sentence.service';
import { Sentence } from '../shared/sentence';
import { Component, OnInit } from '@angular/core';

import { Camera } from '@ionic-native/camera/ngx';

import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

// declare var SpeechConfig: any;
// declare var SpeechSynthesizer: any;
// declare var ResultReason: any;
declare var SpeechSDK: any;

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.page.html',
  styleUrls: ['./article-list.page.scss'],
})
export class ArticleListPage implements OnInit {
  articles: string[] = [];
  selectedSentences: Sentence[] = [];

  information: any[];
  automaticClose = false;

  imgURL: string ='';

  ttsText: any="";

  toggleCards: boolean = true;
  chosenArticle: string = '';
  constructor(
    private sentenceService: SentenceService, 
    private toastCtrl: ToastController, 
    private alertCtrl: AlertController,

    private camera: Camera,

    public tts: TextToSpeech,
    ) {}
  ngOnInit() {
  }
  onSentence(sentence: Sentence) {
    console.log(sentence.title);
    const subscriptionKey = "182e216784204433a58f17f57a19aa76";
    const serviceRegion = "koreacentral"; // e.g., "westus"
    const authorizationToken = "https://koreacentral.api.cognitive.microsoft.com/sts/v1.0/issuetoken";
  // speechConfig = SpeechConfig.fromAuthorizationToken(authorizationToken, serviceRegion);
    let speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    // console.log(SpeechSDK.AgentConfig());

    let synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
    synthesizer.speakTextAsync(sentence.title,
        function (result) {
        if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          console.log("synthesis finished.");
        } else {
          console.error("Speech synthesis canceled, " + result.errorDetails +
              "\nDid you update the subscription info?");
        }
        synthesizer.close();
        synthesizer = undefined;
        console.log("Success"+sentence.title);
      },
        function (err) {
          console.trace("err - " + err);
          synthesizer.close();
          synthesizer = undefined;
      });
  }
  //camera
  // getCamera() {
  //   this.camera.getPicture({
  //     sourceType: this.camera.PictureSourceType.CAMERA,
  //     destinationType: this.camera.DestinationType.FILE_URI
  //   }).then( (res) => {
  //     this.imgURL = res;
  //   }).catch(e => {
  //     console.log(e);
  //   })
  // }
  getGallery() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then( (res) => {
      this.imgURL = 'data:image/jpeg;base64,' + res;
    }).catch(e => {
      console.log(e);
    })
  }
    //
  openArticle(article){
    this.toggleCards = false;
    this.chosenArticle = article;
    this.loadSelectedScripts(article);

    console.log(article);
  }
  showArticles() {
    this.toggleCards = true;
  }
  //load from db
  async loadSelectedScripts(article: string) {
    this.selectedSentences = await this.sentenceService.getSelectedScripts(article);
  }
  ionViewWillEnter() {
    this.loadArticles();
  }
  async loadArticles() {
    this.articles = await this.sentenceService.getArticles();
  }
  //delete from db
  async deleteArticle(article: string) {
    const alert = await this.alertCtrl.create({
      header: 'Delete?',
      message: `delete this article: ${article}?`,
      buttons: [
        {
          text: 'Cancle',
          role: 'cancle'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.executeDeleteArticle(article);
          }
        }
      ]
    });
    alert.present();
  }

  async executeDeleteArticle(article: string) {
    try {
      await this.sentenceService.deleteArticle(article);
      const index = this.articles.indexOf(article);
      this.articles.splice(index, 1);
      const toast = await this.toastCtrl.create({
        header: 'Sucess',
        message: 'deleted article sucessfully.',
        color: 'success',
        position: 'bottom',
        duration: 1000
      });
      toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        header: 'Error',
        message: 'Something error occured.',
        color: 'danger',
        position: 'bottom',
        duration: 1000
      });
      toast.present();
    }
  }

  //delete sentence
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
      const index = this.selectedSentences.indexOf(sentence);
      this.selectedSentences.splice(index, 1);

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
