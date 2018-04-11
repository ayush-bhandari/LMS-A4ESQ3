import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public imgLogoUrl = 'assets/lims.png';
  public footerLogoUrl = 'assets/hm.png';

  ngOnInit() {


  }
}
