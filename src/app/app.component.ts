import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {FormControl} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Moment} from 'moment';
import {MatDatepicker} from '@angular/material/datepicker';
import { Chart } from 'angular-highcharts';
const moment =  _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [

    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class AppComponent {

  constructor(private http: HttpClient) { }
  title = 'material-kisaan';
  place = 'UK';
  metrics='Tmax';
  response={};
  monthFrom=0;
  monthTo=0;
  yearFrom=0;
  yearTo=0;
  seriesData=[];
  chart={};
  seriesDatas=[]
  url="https://s3.eu-west-2.amazonaws.com/interview-question-data/metoffice/"+this.metrics+"-"+this.place+".json";


  
  
  ngOnInit() {
 
   
    };

    
    placeChange(value){
      
      this.place=value;
      this.newUrl(this.place,this.metrics)
    }

    metricsChange(value){
    
      this.metrics=value
      this.newUrl(this.place,this.metrics)
    }

    getConfigData(){
      return this.http.get(this.url);
    }

    
//making the url for s3 to get the data
    newUrl(place, metrics){
      this.url="https://s3.eu-west-2.amazonaws.com/interview-question-data/metoffice/"+metrics+"-"+place+".json";
   
//getting data from url
     this.getConfigData().subscribe((res)=>{
      
        this.response=res
    });
  }


  date1 = new FormControl(moment());
  date2 = new FormControl(moment());
//year handler for datefrom picker
  chosenYearHandler1(normalizedYear: Moment) {
    const ctrlValue = this.date1.value;
    ctrlValue.year(normalizedYear.year());
    this.date1.setValue(ctrlValue);
    this.yearFrom=this.date1.value._d.getFullYear()
  }
//month handler for dateFrom picker
  chosenMonthHandler1(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date2.value;
    ctrlValue.month(normlizedMonth.month());
   
    this.date2.setValue(ctrlValue);
    datepicker.close();
    
    this.monthFrom=this.date2.value._d.getMonth()+1;
  }


  //Year handler for dateTo picker
  chosenYearHandler2(normalizedYear: Moment) {
    const ctrlValue = this.date2.value;
    ctrlValue.year(normalizedYear.year());
    this.date2.setValue(ctrlValue);
    this.yearTo=this.date2.value._d.getFullYear()
  }

  //Month handler for dateTo picker
  chosenMonthHandler2(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date2.value;
    ctrlValue.month(normlizedMonth.month());
   
    this.date2.setValue(ctrlValue);
    datepicker.close();
    
    this.monthTo=this.date2.value._d.getMonth()+1;


    

   // 
    for(var i in this.response){
      var dateFrom;
      this.seriesData=[]
      if(this.response[i].year>=this.yearFrom && this.response[i].year<=this.yearTo){
       //if the response is equal to selected from date 
        if(this.response[i].year== this.yearFrom){
          if(this.response[i].month>=this.monthFrom){
            if(this.response[i].month<10){
              dateFrom= "0"+this.response[i].month+'/'+'01/'+this.response[i].year+" 00:00"
           //preparing the date to pass in highcharts
            }
            else{
             dateFrom= this.response[i].month+'/'+'01/'+this.response[i].year+" 00:00"

            }
           
            this.seriesData.push((moment(dateFrom, "MM/DD/YYYY HH:mm").valueOf()),this.response[i].value)
            this.seriesDatas.push(this.seriesData)
          }
        }

//if the response is greater than selected from date and less than selected to date
        else if(this.response[i].year>this.yearFrom){
          if(this.response[i].month<10){
            dateFrom= "0"+this.response[i].month+'/'+'01/'+this.response[i].year+" 00:00"
         
          }
          else{
           dateFrom= this.response[i].month+'/'+'01/'+this.response[i].year+" 00:00"

          }
         
          
          this.seriesData.push((moment(dateFrom, "MM/DD/YYYY HH:mm").valueOf()),this.response[i].value)
          this.seriesDatas.push(this.seriesData)
        }

        
//if the response is equal to selected to date
        else if(this.response[i].year==this.yearTo){
          if(this.response[i].month<=this.monthTo){
            if(this.response[i].month<10){
              dateFrom= "0"+this.response[i].month+'/'+'01/'+this.response[i].year+" 00:00"
           
            }
            else{
             dateFrom= this.response[i].month+'/'+'01/'+this.response[i].year+" 00:00"

            }
            this.seriesData.push((moment(dateFrom, "MM/DD/YYYY HH:mm").valueOf()),this.response[i].value)
            this.seriesDatas.push(this.seriesData)
          }
        }
        
        
      }
     
      
      
    }
 //highcharts configuration  
    this.chart = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Linechart'
      },
      credits: {
        enabled: false
      },
      yAxis: [{
        title: {
            text: this.metrics
        }
    }],
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          
          month: "%b '%y",
          year: "%Y"
        }
      },
      series: [
        {
          name: this.place,
          data: this.seriesDatas
        }
      ]
    });
  }


  


 
    
    

}
