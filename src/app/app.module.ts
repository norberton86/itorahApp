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
import { LoginProvider } from '../providers/login/login';

import { HttpModule } from '@angular/http';
import { Network } from '@ionic-native/network';
import { SettingsProvider } from '../providers/settings/settings';

import { LocalNotifications } from '@ionic-native/local-notifications';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import { Toast } from '@ionic-native/toast';

import { NativeAudio } from '@ionic-native/native-audio';
import { Media, MediaObject } from '@ionic-native/media';


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
    SettingsPageModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage
  ],
  providers: [
    FileTransfer,Toast,NativeAudio,Media,
    File,
    LocalNotifications,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginProvider,
    Network,
    SettingsProvider
  ]
})
export class AppModule {}
