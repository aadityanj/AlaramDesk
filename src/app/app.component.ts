import { Component, NgModule } from '@angular/core';


@Component({
  selector: 'my-app',
 templateUrl: "app/home/home.html"
})



export class AppComponent { 
	
	name = 'Angular';
  label:string;
  datetime:string;
  meridian:string;
  sound:string;
  savedlist:any[] = [];
    constructor(){
       this.fetchlocalstorage();
       this.triggeralaram();
       setInterval(() => {
       	this.triggeralaram();
        }, 1000);	
    }


 public fetchlocalstorage(){
   try{
      if(localStorage.getItem("alaram") != "0") this.savedlist = JSON.parse(localStorage.getItem("alaram"));
   }catch(Exception){
     console.log(Exception)
   }  
 }


 public clearall(){
   localStorage.setItem("alaram","0");
   this.savedlist = [];
 }

 public maketwodigits(n:number){
 	return n > 9 ?  n : ( "0" + n );
 }

 public convertoindiantime(n:number){
    return n > 12 ? (n - 12) :  n; 
 } 


 public  triggeralaram(){
   try{
     	let datas = this.savedlist;
     	let now = new Date();
        let currentdate = this.maketwodigits(now.getDate()) +'-'+this.maketwodigits(now.getMonth() + 1) + '-'+now.getFullYear();
        let datetime = currentdate + ' ' + this.maketwodigits(this.convertoindiantime(now.getHours())) + ':' + this.maketwodigits(now.getMinutes()); 
        let meridian = now.getHours() > 12 ? "pm":"am";
     	for(let i = 0; i < datas.length;i++){
         console.log(datetime + " " + datas[i].datetime)
     		if( (meridian == datas[i].meridian) && (datetime == datas[i].datetime )){
     			alert("wakeup");
     		}
     	}
    }catch(Exception){
      //console.log(Exception);
    } 
  }

  public submit(){
    if(!this.savedlist) this.savedlist = [];
  	this.savedlist.push({"label":this.label,"datetime":String(this.datetime),"meridian":this.meridian,"sound":this.sound});
  	localStorage.setItem("alaram",JSON.stringify(this.savedlist));
  	console.log(localStorage.getItem("alaram"));
  }
}
