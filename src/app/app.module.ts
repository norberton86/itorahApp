import { LoginPage } from './../pages/login/login';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {LoginPageModule} from '../pages/login/login.module';
import {ForgotPasswordPageModule} from '../pages/forgot-password/forgot-password.module';
import {SignUpPageModule} from '../pages/sign-up/sign-up.module';
import {NoConnectionPageModule} from '../pages/no-connection/no-connection.module';
import {PlaylistPageModule} from '../pages/playlist/playlist.module';
import {SettingsPageModule} from '../pages/settings/settings.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    LoginPageModule,
    ForgotPasswordPageModule,
    SignUpPageModule,
    NoConnectionPageModule,
    PlaylistPageModule,
    SettingsPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
