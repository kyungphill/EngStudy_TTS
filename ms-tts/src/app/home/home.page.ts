import { Component, OnInit} from '@angular/core';
declare var SpeechConfig: any;
declare var SpeechSynthesizer: any;
declare var ResultReason: any;
declare var SpeechSDK: any;
import * as fs from 'fs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  title: string = "i'm happy."

  constructor(

  ) {}

  ngOnInit () {
    
  }
  xmlToString(filePath) {
    const xml = fs.readFileSync(filePath, "utf8");
    return xml;
}
  synthesizeSpeech() {

    const subscriptionKey = "182e216784204433a58f17f57a19aa76";
    const serviceRegion = "koreacentral"; // e.g., "westus"
    const authorizationToken = "https://koreacentral.api.cognitive.microsoft.com/sts/v1.0/issuetoken";
  // speechConfig = SpeechConfig.fromAuthorizationToken(authorizationToken, serviceRegion);
    let speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

    let synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
    console.log("hi");
    const ssml = this.xmlToString("./ssml.xml");
    console.log("hi");

    synthesizer.speakSsmlAsync(
      ssml,
      result => {
          if (result.errorDetails) {
              console.error(result.errorDetails);
          } else {
              console.log(JSON.stringify(result));
          }

          synthesizer.close();
      },
      error => {
          console.log(error);
          synthesizer.close();
      });
}
  //   synthesizer.speakTextAsync(this.title,
  //         function (result) {
  //       if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
  //         console.log("synthesis finished.");
  //       } else {
  //         console.error("Speech synthesis canceled, " + result.errorDetails +
  //             "\nDid you update the subscription info?");
  //       }
  //       synthesizer.close();
  //       synthesizer = undefined;
  //     },
  //         function (err) {
  //       console.trace("err - " + err);
  //       synthesizer.close();
  //       synthesizer = undefined;
  //     });
  //   }
  }