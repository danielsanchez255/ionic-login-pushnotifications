import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import firebase from 'firebase/app';
//import { isPlatform } from '@ionic/angular';

//Plugins
import { FacebookLoginPlugin, FacebookLogin } from '@capacitor-community/facebook-login';
import { GoogleAuth } from '@reslear/capacitor-google-auth';

//Services
import { FcmService } from '../services/fcm.service';
import { AuthServiceService } from '../services/auth-service.service';

//environment
import { environment } from '../../environments/environment';

//import { Plugins } from '@capacitor/core';
//import "@codetrix-studio/capacitor-google-auth";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  fbLogin: FacebookLoginPlugin;
  facebookUser: any = null;
  token: any = null;
  googleUser: any = null;
  countryJson = environment.countryJson;
  OTP: string = '';
  code: any;
  PhoneNo: any;
  countryCode: any = '+57';
  showOTPInput: boolean = false;
  OTPmessage: string = 'An OTP is sent to your number. You should receive it in 15 s'
  recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  confirmationResult: any;

  constructor(
    private http: HttpClient, 
    private fcmService: FcmService,
    private alertController: AlertController,
    private authService: AuthServiceService) 
  {
    this.setupFbLogin()
    GoogleAuth.init()
  }

  async setupFbLogin() {
    this.fbLogin = FacebookLogin;
  }

  async login() {
    const FACEBOOK_PERMISSIONS = ['email', 'public_profile', 'user_birthday'];
    const result = await this.fbLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    console.log('result: ', result)

    if (result.accessToken && result.accessToken.userId) {
      this.token = result.accessToken;
      this.loadUserData();
      this.fcmService.initPush();
    } else if (result.accessToken && !result.accessToken.userId) {
      this.getCurrentToken();
    } else {
      //login failed
    }
  }

  async googleSignup() {
    const googleUser = await GoogleAuth.signIn();
    this.googleUser = googleUser;
  }

  async getCurrentToken() {
    const result = await this.fbLogin.getCurrentAccessToken();

    if (result.accessToken) {
      this.token = result.accessToken;
      this.loadUserData();
    } else {
      //Not logged in
    }
  }

  async loadUserData() {
    const url = `https://graph.facebook.com/${this.token.userId}?fields=id,name,picture.width(720),birthday,email&access_token=${this.token.token}`;
    this.http.get(url).subscribe(res => {
      this.facebookUser = res;
    });
    
  }

  async logout() {
    await this.fbLogin.logout();
    this.facebookUser = null;
    this.token = null;
  }

  async ionViewDidEnter() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      size: 'invisible',
      callback: (response) => {

      },
      'expired-callback': () => {
      }
    });
  }

  ionViewDidLoad() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      size: 'invisible',
      callback: (response) => {

      },
      'expired-callback': () => {
      }
    });
  }

  countryCodeChange($event) {
    this.countryCode = $event.detail.value;
  }
  // Button event after the nmber is entered and button is clicked
  signinWithPhoneNumber($event) {
    console.log('country', this.recaptchaVerifier);

    if (this.PhoneNo && this.countryCode) {
      this.authService.signInWithPhoneNumber(this.recaptchaVerifier, this.countryCode + this.PhoneNo).then(
        success => {
          this.OtpVerification();
        }
      );
    }
  }
  async showSuccess() {
    const alert = await this.alertController.create({
      header: 'Success',
      buttons: [
        {
          text: 'Ok',
          handler: (res) => {
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  async showFailed() {
    const alert = await this.alertController.create({
      header: 'Wrong Code',
      buttons: [
        {
          text: 'Ok',
          handler: (res) => {
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  async OtpVerification() {
    const alert = await this.alertController.create({
      header: 'Enter OTP',
      backdropDismiss: false,
      inputs: [
        {
          name: 'otp',
          type: 'text',
          placeholder: 'Enter your otp',
        }
      ],
      buttons: [{
        text: 'Enter',
        handler: (res) => {
          this.authService.enterVerificationCode(res.otp).then(
            userData => {
              this.showSuccess();
            }
          ).catch((error) => {
            this.showFailed();
          });
        }
      }]
    });
    await alert.present();
  }

}
