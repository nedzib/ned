import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from 'src/app/services/lang.service';
import {es} from '../../locales/es'
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  paramText:any;
  hideDropdown = true;

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
  }

  onClick(action: string): void {
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

  toggle(){
    this.hideDropdown = !this.hideDropdown 
  }

  close(){
    this.hideDropdown = true
  }

}
