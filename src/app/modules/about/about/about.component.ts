import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from 'src/app/services/lang.service';
import {es} from '../../../core/locales/es'
import {links} from '../../../core/locales/exLinks'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

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
    this.paramText = this.lService.paramText;
    this.externals = links;
  }

  external(web: string){
    window.open(web, '_blank');
  }

  color(index:any){
    return index%2==0
  }

  divide5(index:any){
    return index%5==0
  }

}
