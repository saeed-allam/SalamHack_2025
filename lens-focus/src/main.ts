import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment';


if (!environment['firebase']) {
  console.error("Firebase config not found! Make sure it's defined in environment.ts.");
} else {
  initializeApp(environment['firebase']); // ✅ Initialize Firebase
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
