import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'translate-bar',
  templateUrl: './translate-bar.component.html',
  styleUrls: ['./translate-bar.component.scss']
})

export class TranslateBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  setLanguage(){
    angular.module('myApp').run(function (gettextCatalog){
      gettextCatalog.setCurrentLanguage('ga');
    })
  }
}
