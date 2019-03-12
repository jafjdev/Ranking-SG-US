import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AppComponent } from './app.component';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { HttpClientModule } from '@angular/common/http';

import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from './../environments/environment';

import { rootRoutes } from './app.routes';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, 
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    HttpClientModule,
    RouterModule.forRoot(rootRoutes, {
      // enableTracing :true, // For debugging
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabled',
      useHash: false
    }),
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    TransferHttpCacheModule
  ],
  bootstrap: [ AppComponent ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: `${environment.BASE_URL}`
    }
  ]
})
export class AppModule {}
