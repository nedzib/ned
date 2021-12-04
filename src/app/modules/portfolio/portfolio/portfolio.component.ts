import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from 'src/app/services/lang.service';
import {es} from '../../../core/locales/es'
import {links} from '../../../core/locales/exLinks'

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

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

  direction(index:any){
    return index%2==0
  }

}
