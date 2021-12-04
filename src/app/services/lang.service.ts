import { Injectable } from '@angular/core';
import {es} from '../core/locales/es'
import {en} from '../core/locales/en'
import {links} from '../core/locales/exLinks'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LangService {

  currentLang = "en";
  paramText = en;
  langChange: Subject<any> = new Subject<any>();

  constructor() {
    this.langChange.subscribe((value) => {
      this.paramText = value
  });
  }

  change(lang: string){
    if (lang == "en"){
      this.langChange.next(en);
    } else {
      this.langChange.next(es);
    }
    console.log(this.paramText);
  }

  getLang(){
    return this.currentLang;
  }

}
