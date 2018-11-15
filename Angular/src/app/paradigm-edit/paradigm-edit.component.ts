import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from '../data.service';


@Component({
  selector: 'app-paradigm-edit',
  templateUrl: './paradigm-edit.component.html',
  styleUrls: ['./paradigm-edit.component.scss']
})
export class ParadigmEditComponent implements OnInit {
  objectKeys = Object.keys;
  paradigm_name: string;
  selectedWord: number;
  slots$: Array<string>;
  roots$: Object;
  forms$: Object;
  words: Array<string>;

  constructor(
  	private data: DataService,
  	private route: ActivatedRoute,
  	private location: Location
  	) { }

  ngOnInit() {
  	this.getParadigm();
  	this.getParadigmSlots();
  	this.forms$ = [];
  	this.roots$ = [];
  }

  getParadigmSlots(): void{
  	this.data.getParadigmSlots(this.paradigm_name).subscribe(
  		data => this.slots$ = data["paradigm_slots"]);
  }

  getParadigm(): void{
  	const name = this.route.snapshot.paramMap.get('paradigm_name');
  	this.paradigm_name = name;
  	this.selectedWord=0;
  	this.data.getParadigmRoots(this.paradigm_name).subscribe(
      data => this.roots$ = data["paradigm_roots"]
    );
  }

  getParadigmForms(): void{
  	this.data.getParadigmWords(this.roots$[this.selectedWord]).subscribe(
  		data => this.forms$ = data["word_data"]);
  }

  goBack(): void {
    this.location.back();
  }

  onSelect(word: number): void {
  	this.selectedWord = word;
  	this.getParadigmForms();
  }

  onSelectNew(): void {
	  var x;
	  for (x in this.slots$){
	  	this.forms$[this.slots$[x]]=this.slots$[x];
	  }
  }

  onSave(): void{
  	var slot;
  	var words = [];
  	for(let slot of this.slots$){
  		if (slot !== "root"){
  			words.push(this.forms$[slot])
  		}
  	}
  	this.data.addParadigmWords(this.forms$["root"], words).subscribe();
  	this.data.getParadigmRoots(this.paradigm_name).subscribe(
      	data => this.roots$ = data["paradigm_roots"]);
  }

  //function to delete a given word
  deleteWord(word: number): void{
    if (confirm("Are you sure you want to delete the word: " + this.roots$[word]+ "?")){
      this.data.deleteWord(this.roots$[word]).subscribe();
    }
  }

  //function to delete the current paradigm
  deleteParadigm(): void{
    if (confirm("Are you sure you want to delete the paradigm: "
      + this.paradigm_name +"?")){
      this.data.deleteParadigm(this.paradigm_name).subscribe();
    }
  }

  getHeaderOneWord(){
    return this.data.getParadigmEditHeaderOneWord();
  }
  getHeaderTwoWord(){
    return this.data.getParadigmEditHeaderTwoWord();
  }
  getHeaderThreeWord(){
    return this.data.getParadigmEditHeaderThreeWord();
  }
  getAddRootWord(){
    return this.data.getParadigmEditAddRootWord();
  }
}
