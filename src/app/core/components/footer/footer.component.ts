import { Component, OnInit } from '@angular/core';
import { LangService } from 'src/app/services/lang.service';
import {es} from '../../locales/es'
import {en} from '../../locales/en'
import {links} from '../../locales/exLinks'
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  paramText:any;
  externals:any;

  constructor(
    public router: Router,
    public lService: LangService,
  ) {
    this.paramText = lService.paramText;
    lService.langChange.subscribe((value) => {
      this.paramText = value
    });
  }

  ngOnInit(): void {
    if (this.lService.getLang() == "en"){
      this.paramText = en;
    } else {
      this.paramText = es;
    }
    this.externals = links;
  }

  external(web: string){
    window.open(web, '_blank');
  }

  changeLang(lang: string){
    this.lService.change(lang);
  }

}
