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
  sound:boolean=false;
  everyday:boolean=false;
  notify:boolean=false;
  message:string;
  flagforsound:boolean=true;
  isinalert:number;
  savedlist:any[] = [];
   
    
    constructor(){
       this.fetchlocalstorage();
       this.triggeralarm();
       setInterval(() => {
       	this.triggeralarm();
        }, 1000);	
    }


 public fetchlocalstorage(){
   try{
      if(localStorage.getItem("alarm") != "0"){
        this.savedlist = JSON.parse(localStorage.getItem("alarm"));
      }
      else localStorage.setItem("alarm","0");
     
     if(localStorage.getItem("notification")){
            this.notify = true;
            let i = localStorage.getItem("notification");
            this.message = this.savedlist[i].label;
            localStorage.setItem("notification",String(i));
            if(this.savedlist[i].sound) this.playpause(1);
     } 



   }catch(Exception){
     console.log(Exception)
   }  
 }

 public playpause(flag:number){
    try{ 
        if(flag == 1 ) {
           if(this.flagforsound){
               var audio = new Audio();
               audio.src = "app/tones/tone.mp3";
               audio.load();
               audio.play();
               setTimeout(function() {
                audio.pause();
              }, 3000);
          }
       }else{
           audio.pause(); 
       }
   }catch(Exception){
     console.log(Exception);
   }
 }

 public clearall(){
   localStorage.setItem("alarm","0");
   this.savedlist = [];
 }

 public maketwodigits(n:number){
 	return n > 9 ?  n : ( "0" + n );
 }

 public convertoindiantime(n:number){
   if(n == 0) return 12;
    return n > 12 ? (n - 12) :  n; 
 }



 public  triggeralarm(){

   try{
     	let datas = this.savedlist;
     	let now = new Date();
        let currentdate = this.maketwodigits(now.getDate()) +'-'+this.maketwodigits(now.getMonth() + 1) + '-'+now.getFullYear();
        let time =  this.maketwodigits(this.convertoindiantime(now.getHours())) + ':' + this.maketwodigits(now.getMinutes()); 
        let datetime = currentdate + ' ' + time;
        let meridian = now.getHours() > 12 ? "pm":"am";
     	for(let i = 0; i < datas.length;i++){
         let basetime = datas[i].datetime.split(' ');
       //  console.log(datetime + " " + datas[i].datetime + " " + meridian + " " + datas[i].meridian);
     		if(( datas[i].everyday && (basetime[1] == time) && (meridian == datas[i].meridian) )  ||  ( (meridian == datas[i].meridian) && (datetime == datas[i].datetime ) ) ){
            if(this.isinalert != i){
                this.notify = true;
                this.isinalert = i;
                this.message = datas[i].label;
                localStorage.setItem("notification",String(i));
                if(datas[i].sound){ 
                  this.playpause(1);
                  this.flagforsound = false;
                }
     		    }
         }
     	}
    }catch(Exception){
      //console.log(Exception);
    } 
  }

  public submit(){
    if(!this.savedlist) this.savedlist = [];
  	this.savedlist.push({"label":this.label,"datetime":String(this.datetime),"meridian":this.meridian,"sound":this.sound,"everyday":this.everyday});
  	localStorage.setItem("alarm",JSON.stringify(this.savedlist));
  	console.log(localStorage.getItem("alarm"));
    this.reset();
  }

  public reset(){
    this.datetime = "";
    this.label= "";
    this.meridian = "";
    this.everyday = false;
    this.sound = false;
  }

  public remove(i:number){
     this.savedlist.splice(i, 1);
     localStorage.setItem("alarm",JSON.stringify(this.savedlist));
  }

  public close(){
    this.playpause(0);
    this.notify = false;
    setTimeout(function() {
       this.isinalert = "";
    }, 60000);
    localStorage.setItem("notification","");
  }

}
