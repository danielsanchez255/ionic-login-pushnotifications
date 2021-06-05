import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders,  } from '@angular/common/http';

//Plugins
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';


@Injectable({
  providedIn: 'root'
})
export class FcmService {

  pushRegistrationToken = null;

  constructor(private router: Router, public http: HttpClient) { }

  initPush() {
    
    this.registerPush();
    
  }

  public registerPush() {

   /*  PushNotifications.requestPermissions().then( result => {
      if (result.receive) {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
      } else {
          // Show some error
      }
    }); */

    PushNotifications.addListener(
      'registration',
      (token: Token) => {
        this.pushRegistrationToken = token.value;
        console.log('My token: ' + token.value);
      }
    );
 
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });
 
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );
 
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        if (data.detailsId) {
          this.router.navigateByUrl(`/home/${data.detailsId}`);
        }
      }
    );
  }

  async pushMessageSender() {
    var registrationToken = this.pushRegistrationToken;

    let headers = new HttpHeaders({
      'Authorization': 'key=AAAApgT_-u4:APA91bFGBnfizxlHXpBDolO54Ruj5FhtKT9fzUTyxg2MPnfrKY_sMoaiNqFG-z8g4chA1Tj-KFmWjWCCg3310vTjp80uPl8nvhBgHr4Q1tXE7LI9PWmnFSTZ1l2-U5l6d0VxVHaeOVqW',
      'Content-Type' : 'application/json'
    });

    let options = {
        headers: headers
    }

    let message = {
      "notification": {
        "title": "Push notification", 
        "body": "This is a notification from your cell"
       },
       "to" : registrationToken
    }
    
    this.http.post('https://fcm.googleapis.com/fcm/send', message, options)
        .subscribe(data => {
            console.log(JSON.stringify(data));
    }, error => {
      console.log(JSON.stringify(error));
    });
      
  }
}
