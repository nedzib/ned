import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from 'src/app/services/lang.service';
import {links} from '../../../core/locales/exLinks'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  paramText:any;
  externals:any;
  age:any;

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
    this.paramText = this.lService.paramText;
    this.externals = links;
    this.age = new Date().getFullYear()-this.paramText.home.columna2.año
  }

  external(web: string){
    window.open(web, '_blank');
  }

  redirect(action: string): void {
    if (action == 'portfolio'){
      this.router.navigate(['/portfolio']);
    }
    if (action == 'about'){
      this.router.navigate(['/about']);
    }
    if (action == 'contact'){
      this.router.navigate(['/contact']);
    }
    if (action == 'home'){
      this.router.navigate(['/']);
    }
  }

  setText(text:any){
    this.paramText = text
  }

}
